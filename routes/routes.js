const router = require('express').Router()
const Snippet = require('../models/snippet')

console.log('i routes.js')
// router.get('/', (req, res) => res.render('layouts/form'))
// router.get('/', (req, res) => res.render('layouts/form'))

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
.get(async (req, res) => {
  try {
    const snippet = await Snippet.find({}).exec()
    res.render('layouts/login', { snippet })
  } catch (error) {
    res.render('layouts/login', {
      flash: { type: 'danger', text: error.message }
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

// Exports.
module.exports = router
