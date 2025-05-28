import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.store_it_session;

    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!verifiedUser)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, Not have data" });

    req.user = verifiedUser;
    next();
  } catch (error) {
    res
      .status(403)
      .json({ success: false, message: "Token expired or invalid" });
  }
};

export default authenticateToken;
