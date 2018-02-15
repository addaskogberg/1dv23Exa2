
var express = require('express')
const bodyParser = require('body-parser')

var app = express()
app.set('port', process.env.PORT || 3000)

const mongoose = require('./config/mongoose.js')
// Connect to the database.
mongoose.run().catch(error => {
  console.error(error)
  process.exit(1)
})

 // set upp handlebars view engine
const handlebars = require('express-handlebars')
// var handlebars = require('express-handlebars')
/*   .create({ defaultLayout: 'main' })
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars') */
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.get('/', function (req, res) {
  res.render('layouts/home')
})
app.get('/skitbil', function (req, res) {
  res.render('layouts/home')
})
app.get('/form', function (req, res) {
  res.render('layouts/form')
})

// 404 page
app.use(function (req, res, next) {
  res.status(404)
  res.render('error/404')
})
// 400 page
app.use(function (req, res, next) {
  res.status(400)
  res.render('error/400')
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500)
  res.render('error/500')
})

// body-Parser
app.use(bodyParser.urlencoded({extended: true}))

// initiating routs
console.log('i app.js')
app.use('/layouts', require('./routes/routes.js'))
app.use((req, res, next) => res.status(404).render('404'))

/* app.use((req, res, next) => {
  const error = new Error('not found')
  error.status = 404
  next(error)
}) */

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + ' ; press ctrl-c to terminate')
})
