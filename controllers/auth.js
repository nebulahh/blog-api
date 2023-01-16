const bcrypt = require('bcryptjs');
const expressAsync = require('express-async-handler');
const Author = require('../models/author');
const jwt = require('jsonwebtoken');

exports.postSignup = expressAsync(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Fill all fields');
  }

  const userExist = await Author.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('User already exist');
  }

  // hash
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const author = await Author.create({
    name,
    email,
    password: hashedPassword,
  });

  if (author) {
    res.status(201).json({
      _id: author.id,
      name: author.name,
      email: author.email,
      token: generate_token(author._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

exports.postLogin = expressAsync(async (req, res) => {
  const { email, password } = req.body;

  const author = await Author.findOne({ email });

  if (author && (await bcrypt.compare(password, author.password))) {
    const refreshToken = generate_refresh_token(author._id);

    author.refreshToken = refreshToken;
    await author.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      email: author.email,
      token: generate_token(author._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

const generate_token = (id) => {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: '30m' });
};

const generate_refresh_token = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_SECRET, {
    expiresIn: '1h',
  });
};

exports.logout = expressAsync(async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundAuthor = await Author.findOne({ refreshToken }).exec();
  if (!foundAuthor) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundAuthor.refreshToken = '';
  const result = await foundAuthor.save();

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
  res.sendStatus(204);
  res.json({
    message: 'no content',
  });
});
