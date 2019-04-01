const classModel = require("./model");

const createClass = async ({ name, sem, schedule }) => {
  try {
    const classx = await classModel.create({ name, sem, schedule });
    return classx;
  } catch (error) {
    return error;
  }
};

const getAllClass = async () => {
  try {
    const classes = await classModel.find().populate({
      path: "sem",
      select: { createdAt: 0, updatedAt: 0, _id: 0 }
    });
    return classes;
  } catch (error) {
    return error;
  }
};

const getOneClass = async id => {
  try {
    const classx = await classModel.findById(id);
    return classx;
  } catch (error) {
    return error;
  }
};

const addStudent = async (idClass, idStudent) => {
  try {
    const added = await classModel.update(
      { _id: idClass },
      { $push: { member: idStudent } }
    );
  } catch (error) {
    return error;
  }
};

module.exports = {
  createClass,
  getAllClass,
  getOneClass,
  addStudent
};
