
var express = require('express')

var app = express()

// set upp handlebars view engine
var handlebars = require('express3-handlebars')
  .create({defaultLayout:'main' })
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')


app.set('port', process.env.PORT || 3000)

app.get('/', function(req, res){
  res.render('home')
})
app.get('/form', function(req, res){
  res.render('form')
})

// 404 page
app.use(function(err, req, res, next){
  res.status(404)
  res.send('404 - not found')
})
// 400 page
app.use(function(err, req, res, next){
  res.status(400)
  res.send('400 - not found')
})

app.use(function(err, req, res, next){
  console.error(err.stack)
  res.status(500)
  res.send('500 - server error')
})

app.listen(app.get('port'), function(){
  console.lognp('Express started on http://localhost:' + app.get('port')+ ' ; press ctrl-c to terminate')
})