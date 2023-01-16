const jwt = require('jsonwebtoken');
const expressAsync = require('express-async-handler');
const Author = require('../models/author');

const protect = expressAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.SECRET);

      req.user = await Author.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401, { message: 'Not Authorized' });
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401, { message: 'not authorized' });
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
