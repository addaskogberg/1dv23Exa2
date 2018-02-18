const router = require('express').Router()
const Snippet = require('../models/snippet')
const User = require('../models/user')

/* Finds all snippets in db and returns them */
router.route('/')
.get(async (req, res) => {
  try {
    const snippets = await Snippet.find({}).exec()
    res.render('layouts/home', { snippets })
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
    res.render('layouts/login')
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
        res.render('layouts/login', { formusername })
      } else {
        res.render('layouts/login', { formusername: 'Something went wrong!' })
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

/**
 * create and save a snippet in mongodb
*/
router.route('/createsnippet')
.get(async (req, res) => {
  res.render('layouts/createsnippet', {snippet: undefined})
})
.post(async(req, res, next) => {
  try {
    let snippet = new Snippet({
      snippet: req.body.snippet
    })
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
