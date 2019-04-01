const semModel = require("./model");

const createSem = async ({ numOfSem, subjects, description }) => {
  try {
    if (numOfSem < 1 || numOfSem > 4) {
      throw "error"
    }
    const sem = await semModel.create({ numOfSem, subjects, description });
    return sem;
  } catch (error) {
    return error;
  }
};

const getAllSem = async () => {
  try {
    const sems = await semModel.find();
    return sems;
  } catch (error) {
    return error;
  }
};

const getOneSem = async numOfSem => {
  try {
    const sem = await semModel.findOne({ numOfSem });
    return sem;
  } catch (error) {
    return error;
  }
};

const deleteAll = async () => {
  try {
    const deleted = await semModel.remove();
    return deleted;
  } catch (error) {
    return error;
  }
};

module.exports = {
  createSem,
  getAllSem,
  getOneSem,
  deleteAll
};
