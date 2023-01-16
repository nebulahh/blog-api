const Author = require('../models/author');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundAuthor = await Author.findOne({
    refreshToken: refreshToken,
  }).exec();

  if (!foundAuthor) return res.json(403, { message: 'forbidden' }); //Forbidden
  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err || foundAuthor.name !== decoded.name) return res.sendStatus(403);

    const email = Object.values(foundAuthor.email);
    const id = Object.values(foundAuthor._id);
    const token = jwt.sign(
      {
        id,
      },
      process.env.SECRET,
      { expiresIn: '15s' }
    );
    res.json({ email, token });
  });
};

module.exports = { handleRefreshToken };
