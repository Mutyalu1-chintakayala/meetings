const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  department: String,
  date: String,
  typeofmeeting: String,
  agenda: String,
  attendees: String,
  decision: String
});

module.exports = mongoose.model('Note', noteSchema);


// const mongoose = require('mongoose');

// const noteSchema = new mongoose.Schema({
//   department: String,
//   date: Date,
//   typeofmeeting: String,
//   agenda: String,
//   attendees: String,
//   decision: String,
//   circularDocument: {
//     filename: String,
//     contentType: String,
//     data: Buffer,
//   },
//   decisionDocument: {
//     filename: String,
//     contentType: String,
//     data: Buffer,
//   }
// });

// module.exports = mongoose.model('Note', noteSchema);
