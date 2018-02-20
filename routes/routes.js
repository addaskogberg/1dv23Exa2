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
    // let users = await User.find({username}).exec()

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
  res.render('layouts/createsnippet', {snippet: undefined, user: req.session.user})
})
.post(async(req, res, next) => {
  try {
    let snippet = new Snippet({
      snippet: req.body.snippet
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

// update snippet

router.route('/updatesnippet/:id')
.get(async (req, res) => {
  Snippet.findOne({ _id: req.params.id }, function (err, snippet) {
    if (err) throw err
    res.render('layouts/updatesnippet', { snippet: snippet.snippet, id: snippet._id })
  })
})

 .post(async(req, res, next) => {
   try {
     console.log(req.body.dbid)
     Snippet.deleteOne({ _id: req.body.dbid }, function (err) {
       if (err) throw err
     })
     let snippet = new Snippet({
       snippet: req.body.snippet
     })

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

// delete snippet here
router.route('/deletesnippet/:id')
.get((req, res) => {
  Snippet.deleteOne({ _id: req.params.id }, function (err) {
    if (err) throw err
    req.session.flash = {type: 'success', text: 'Your snippet was deleted'}
    res.redirect('/')
  })
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

function encrypt (password) {
  return password + 'my5@lt'
}

// Exports.
module.exports = router
