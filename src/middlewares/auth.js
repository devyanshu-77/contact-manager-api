import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
function auth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized authentication token is missing",
      });
      return;
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ success: false, message: "Invalid token" });
        return;
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  } catch (err) {
    console.log("Auth middleware Error: ", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export default auth;
