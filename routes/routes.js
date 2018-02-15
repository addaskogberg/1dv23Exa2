const router = require('express').Router()

console.log('i routes.js')
router.get('/', (req, res) => res.render('layouts/form'))
// router.get('/', (req, res) => res.render('layouts/form'))

// Exports.
module.exports = router
