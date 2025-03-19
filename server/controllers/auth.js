const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// API Register
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Step 1 Validate
    // Check email
    if (!email) {
      // If there is no email end line
      return res.status(400).json({ message: "Email is required!" });
    }
    // Check password
    if (!password) {
      //If there is no password end line
      return res.status(400).json({ message: "Password is required!" });
    }

    // Step 2 check Email in DB
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    if (user) {
      return res.status(400).json({ message: "Email is already exits!" });
    }

    //Step 3 Hash Password
    const hashPassword = await bcrypt.hash(password, 10);

    // Step 4 Save register
    await prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
      },
    });

    res.send("Register Success!");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Register Error" });
  }
};

// API Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1 check Email
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user || !user.enabled) {
      return res.status(400).json({ message: "User not found!" });
    }

    // Step 2 check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password Invalid!" });
    }

    // Step 3 Create Payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Step 4 Generate Token
    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          return res.status(500).json({ message: "Server is Error!" });
        }
        res.json({ payload, token });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login Error" });
  }
};

// API Current User And Admin
exports.currentUser = async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: req.user.email },
      select: { id: true, email: true, name: true, role: true },
    });
    res.send({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Current-User Error" });
  }
};
