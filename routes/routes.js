const router = require('express').Router()
const Snippet = require('../models/snippet')

console.log('i routes.js')
// router.get('/', (req, res) => res.render('layouts/form'))
// router.get('/', (req, res) => res.render('layouts/form'))

/* Finds all snippets in db and returns them */
router.route('/')
.get(async (req, res) => {
  try {
    const snippet = await Snippet.find({}).exec()
    res.render('snippet/index', { snippet })
  } catch (error) {
    res.render('snippet/index', {
      flash: { type: 'danger', text: error.message },
      snippet: []
    })
  }
})

/* Creates and saves a snippet in db */
/* TODO: Write create method */

// Exports.
module.exports = router
