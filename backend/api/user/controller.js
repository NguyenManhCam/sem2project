const userModel = require("./model");
const classController = require('../class/controller');

const createUser = async ({
  username,
  password,
  email,
  phone,
  birthday,
  role,
  idClass
}) => {
  try {
    const classx = await classController.getOneClass(idClass);
    const process = classx.schedule;
    const user = await userModel.create({
      username,
      password,
      email,
      phone,
      birthday,
      role,
      process
    });
    await classController.addStudent(idClass, user._id);
    return user;
  } catch (error) {
    return error;
  }
};

const getAllUsers = async () => {
  try {
    const users = await userModel.find().select({ process: 0, password: 0 });
    return users;
  } catch (error) {
    return error;
  }
};

const getOneUser = async id => {
  try {
    const user = await userModel.findById(id);
    return user;
  } catch (error) {
    return error;
  }
};

const deleteAll = async () => {
  try {
    const deleted = await userModel.remove();
    return deleted;
  } catch (error) {
    return error;
  }
};

const getUserForAuth = username =>
  new Promise((resolve, reject) => {
    userModel
      .findOne({ username })
      .select("username password _id")
      .then(user => resolve(user))
      .catch(err => reject(err));
  });

module.exports = { createUser, getAllUsers, getOneUser, deleteAll, getUserForAuth };
