/**
 * routes for snippets
 * @author Adda Skogberg
 * @version 1.0
 */
const router = require('express').Router()
const Snippet = require('../models/snippet')
const User = require('../models/user')

/* Finds all snippets in db and returns them */
router.route('/')
.get(async (req, res) => {
  try {
    const snippets = await Snippet.find({}).exec()
    res.render('layouts/home', { snippets, user: req.session.user })
  } catch (error) {
    res.render('layouts/home', {
      flash: { type: 'danger', text: error.message },
      snippets: []
    })
  }
})

// login user
router.route('/login')
.get((req, res) => {
  try {
    res.render('layouts/login', {user: req.session.user})
  } catch (error) {
    res.render('layouts/login', {
      flash: { type: 'danger', text: error.message }
    })
  }
})
.post(async(req, res, next) => {
  try {
    let formusername = req.body.username
    let formpassword = encrypt(req.body.password)
    User.findOne({ username: formusername }, function (err, user) {
      if (err) throw err

      // test matching password
      if (user.comparePassword(formpassword)) {
        // Save to session
        req.session.user = formusername
        res.render('layouts/login', { user: req.session.user })
      } else {
        res.render('layouts/login', {
          flash: { type: 'danger', text: 'Something went wrong signing in' }
        })
      }
    })
  } catch (error) {
    return res.render('layouts/login', {
      validationErrors: [error.message] || [error.errors.snippet.message],
      username: req.body.username,
      password: req.body.password
    })
  }
})

// logout the user
router.route('/logout')
.get(async (req, res) => {
  try {
    delete req.session.user
    res.render('layouts/home', {
      flash: { type: 'success', text: 'Successfully logged out' }
    })
  } catch (error) {
    res.render('layouts/home', {
      flash: { type: 'danger', text: error.message }
    })
  }
})

/**
 * create and save a snippet in mongodb
*/
router.route('/createsnippet')
.get(async (req, res) => {
  if (req.session.user) {
    res.render('layouts/createsnippet', {snippet: undefined, user: req.session.user})
  } else {
    req.session.flash = {type: 'danger', text: 'you need to login to create snippet'}
    res.redirect('/login')
  }
})
.post(async(req, res, next) => {
  try {
    let snippet = new Snippet({
      snippet: req.body.snippet,
      user: req.session.user
    })
    console.log(req.body.snippet)
    await snippet.save()
    req.session.flash = {type: 'success', text: 'Your snippet is saved'}
    res.redirect('.')
  } catch (error) {
    return res.render('layouts/createsnippet', {
      validationErrors: [error.message] || [error.errors.snippet.message],
      snippet: req.body.snippet
    })
  }
})

// view snippet
router.route('/viewsnippet/:id')
.get(async (req, res) => {
  const snippet = await Snippet.findOne({ _id: req.params.id })
  if (req.session.user === snippet.user) {
    res.render('layouts/viewsnippet', { snippet: snippet.snippet, id: snippet._id, user: req.session.user })
  } else {
    res.render('layouts/viewsnippet', { snippet: snippet.snippet, id: snippet._id })
  }
})

// update snippet
router.route('/updatesnippet/:id')
.get(async (req, res) => {
  const snippet = await Snippet.findOne({ _id: req.params.id })
  if (req.session.user === snippet.user) {
    res.render('layouts/updatesnippet', { snippet: snippet.snippet, id: snippet._id, user: req.session.user })
  } else {
    res.render('error/403')
  }
})
 .post(async(req, res, next) => {
   try {
     const snippet = await Snippet.findOne({ _id: req.body.dbid })
     snippet.snippet = req.body.snippet
     await snippet.save()
     req.session.flash = {type: 'success', text: 'Your snippet was updated'}
     res.redirect('/')
   } catch (error) {
     return res.render('layouts/updatesnippet', {
       validationErrors: [error.message] || [error.errors.snippet.message],
       snippet: req.body.snippet
     })
   }
 })

// delete snippet
router.route('/deletesnippet/:id')
.get(async(req, res) => {
  const snippet = await Snippet.findOne({ _id: req.params.id })
  if (req.session.user === snippet.user) {
    Snippet.deleteOne({ _id: req.params.id }, function (err) {
      if (err) throw err
      req.session.flash = {type: 'success', text: 'Your snippet was deleted'}
      res.redirect('/')
    })
  } else {
    res.render('error/403')
  }
})

// create user
router.route('/user')
.get(async (req, res) => {
  try {
    res.render('layouts/user')
  } catch (error) {
    res.render('layouts/user', {
      flash: { type: 'danger', text: error.message }
    })
  }
})
.post(async(req, res, next) => {
  try {
    let user = new User({
      username: req.body.username,
      password: encrypt(req.body.password)
    })
    await user.save()
    req.session.flash = {type: 'success', text: 'Your account has been created'}
    res.redirect('.')
  } catch (error) {
    return res.render('layouts/user', {
      validationErrors: [error.message] || [error.errors.snippet.message],
      username: req.body.username,
      password: req.body.password
    })
  }
})

// encrypt and add salt to password
function encrypt (password) {
  password = password + 'my5@lt'
  password = hashCode(password)
  return String(password)
}

function hashCode (str) {
  let len = str.length
  let hash = 0
  for (let i = 1; i <= len; i++) {
    let char = str.charCodeAt((i - 1))
    hash += char * Math.pow(31, (len - i))
    hash = hash & hash // javascript limitation to force to 32 bits
  }

  return hash
}

// Exports.
module.exports = router
