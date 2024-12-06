const apiKey = process.env.API_KEY;

exports.verifyKey = (req, res, next) => {
  const providedKey = req.headers['x-api-key'];
  if (providedKey !== apiKey) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};