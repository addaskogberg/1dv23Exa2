const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create a schema, with customized error messages.
const snippetSchema = new Schema({
  snippet: String
})

// Create a model using the schema.
const Snippet = mongoose.model('Snippet', snippetSchema)

// Export the model.
module.exports = Snippet
