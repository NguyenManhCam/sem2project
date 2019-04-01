const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectModel = new Schema({
  name: { type: String, required: true },
  lessions: { type: Number, required: true },
  description: { type: String, required: true }
}, {
  _id: false
});

const semModel = new Schema(
  {
    numOfSem: { type: Number, unique: true, required: true },
    subjects: [subjectModel],
    description: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('sem', semModel);
