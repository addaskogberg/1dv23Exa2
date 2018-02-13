
var express = require('express')

var app = express()
app.set('port', process.env.PORT || 3000)

 // set upp handlebars view engine
var handlebars = require('express3-handlebars')
  .create({ defaultLayout: 'main' })
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

app.get('/', function (req, res) {
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

app.listen(app.get('port'), function () {
  console.log('Express started on http://localhost:' + app.get('port') + ' ; press ctrl-c to terminate')
})
