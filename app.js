
const express = require('express')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const mongoose = require('./config/mongoose.js')
const session = require('express-session')

const app = express()
app.set('port', process.env.PORT || 3000)

// Connect to the database.
mongoose.run().catch(error => {
  console.error(error)
  process.exit(1)
})

// set upp handlebars and view engine
app.engine('handlebars', handlebars({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// Parse application encoding
app.use(bodyParser.urlencoded({ extended: true }))

// Setup session store with the given options.
const sessionOptions = {
  name: 'name of keyboard cat', // Don't use default session cookie name.
  secret: 'keyboard cat', // Change it!!! The secret is used to hash the session with HMAC.
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

app.use(session(sessionOptions))

// Flash messages - survives only a round trip.
app.use((req, res, next) => {
  res.locals.flash = req.session.flash
  delete req.session.flash
  next()
})

// Define routes
app.use('/', require('./routes/routes.js'))

/*
app.get('/', function (req, res) {
  res.render('layouts/home')
})
app.get('/form', function (req, res) {
  res.render('layouts/form')
})
*/

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
// app.use('/layouts', require('./routes/routes.js'))
app.use((req, res, next) => res.status(404).render('404'))

/* app.use((req, res, next) => {
  const error = new Error('not found')
  error.status = 404
  next(error)
}) */

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + ' ; press ctrl-c to terminate')
})
