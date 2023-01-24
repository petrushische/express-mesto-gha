const userSchema = require('../models/user');

module.exports.getUsers = (req, res) => {
  userSchema.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUsersId = (req, res) => {
  userSchema.findById(req.params.userId)
    .then((user) => { res.status(200).send(user); })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userSchema.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};
