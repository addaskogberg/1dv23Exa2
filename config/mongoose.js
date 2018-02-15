
 const mongoose = require('mongoose')

 const CONNECTION_STRING = 'mongodb://admin:Bitching1@ds229008.mlab.com:29008/addaskogberg'

 module.exports.run = async () => {
  // Get Mongoose to use the global promise library.
   mongoose.Promise = global.Promise

  // Bind connection to events (to get notifications).
   mongoose.connection.on('connected', () => console.log('Mongoose connection is open.'))
   mongoose.connection.on('error', err => console.error(`Mongoose connection error has occured: ${err}`))
   mongoose.connection.on('disconnected', () => console.log('Mongoose connection is disconnected.'))

  // If the Node process ends, close the Mongoose connection.
   process.on('SIGINT', () => {
     mongoose.connection.close(() => {
       console.log('Mongoose connection is disconnected due to application termination.')
       process.exit(0)
     })
   })

  // Connect to the server.
   return mongoose.connect(CONNECTION_STRING)
 }
