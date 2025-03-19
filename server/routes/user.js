const express = require("express");
const router = express.Router();
const {
  listUser,
  changeStatus,
  changeRole,
  postUserCart,
  getUserCart,
  deleteUserCart,
  userAddress,
  postUserOrder,
  getUserOrder,
} = require("../controllers/user");
const { authCheck, adminCheck } = require("../middleware/authCheck");

// for admin
router.get("/users", authCheck, adminCheck, listUser);
router.post("/change-status", authCheck, adminCheck, changeStatus);
router.post("/change-role", authCheck, adminCheck, changeRole);

// for user
router.post("/user/cart", authCheck, postUserCart); // add cart
router.get("/user/cart", authCheck, getUserCart); // get data cart
router.delete("/user/cart", authCheck, deleteUserCart); // detele cart

router.post("/user/address", authCheck, userAddress); // save address

router.post("/user/order", authCheck, postUserOrder); // save order
router.get("/user/order", authCheck, getUserOrder); // get data order

module.exports = router;
