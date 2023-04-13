//API TOKEN CHECK
const checkToken = (req, res, next) => {
  const api_key = req.headers["api-key"];
  if (api_key === process.env.API_KEY) {
    next();
  } else {
    res.status(401).send({ message: "Unauthorized - Invalid API Key!" });
  }
};

export default checkToken;
