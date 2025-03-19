const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

// check user
exports.authCheck = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
      return res.status(400).json({ message: "Token is Require!!!" });
    }
    const token = headerToken.split(" ")[1];
    const decode = jwt.verify(token, process.env.SECRET);
    req.user = decode;

    // check user in db
    const user = await prisma.user.findFirst({
      where: {
        email: req.user.email,
      },
    });

    // check user enabled ?
    if (!user.enabled) {
      return res.status(400).json({ message: "This account cannot access!!!" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Token Invalid" });
    console.log(error);
  }
};

// check admin
exports.adminCheck = async (req, res, next) => {
  try {
    const { email } = req.user;
    const adminUser = await prisma.user.findFirst({
      where: { email: email },
    });
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Acess Denied: Admin Only!!!" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Admin access denied!!!" });
  }
};
