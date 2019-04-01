const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scheduleModel = new Schema(
  {
    nameOfSubject: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    sessions: {
      type: Map,
      of: String
    },
    score: {
      type: Map,
      of: String
    }
  },
  {
    _id: false
  }
);

const classModel = new Schema(
  {
    name: { type: String, required: true },
    member: [{ type: Schema.Types.ObjectId, ref: "user" }],
    sem: { type: Schema.Types.ObjectId, ref: "sem" },
    schedule: [scheduleModel]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("class", classModel);
