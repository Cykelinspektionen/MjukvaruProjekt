const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

function addUserPost(req, res, callback) {
  const user = new userModel.User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phone_number: req.body.phone_number,
  });

  user.save((err) => {
    if (err) {
      callback(err);
    } else {
      callback('Success in adding user via POST!');
    }
  });
}

function authenticate(req, res, next) {
  userModel.User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (err || userInfo.password === null) {
      next(err);
    } else if (bcrypt.compareSync(req.body.password, userInfo.password)) {
      const token = jwt.sign({ id: userInfo.id }, req.app.get('secretKey'), { expiresIn: '1h' });

      const userInfoNoPassword = {
        game_score: userInfo.game_score,
        _id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        phone_number: userInfo.phone_number,
        create_time: userInfo.create_time,
      };

      res.json({ status: 'success', message: 'user found!!!', data: { user: userInfoNoPassword, token } });
    } else {
      res.json({ status: 'error', message: 'Invalid email/password!!!', data: null });
    }
  }).select('+password');
}

function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), (err, decoded) => {
    if (err) {
      res.json({ status: 'error', message: err.message, data: null });
    } else {
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
}

module.exports = {
  authenticate,
  validateUser,
  addUserPost,
};
