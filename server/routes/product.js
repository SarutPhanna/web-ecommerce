const express = require("express");
const router = express.Router();
const {
  create,
  list,
  update,
  remove,
  listby,
  searchFilters,
  read,
  createImages,
  removeImage,
} = require("../controllers/product");
const { authCheck, adminCheck } = require("../middleware/authCheck");

router.post("/product", authCheck, adminCheck, create);
router.get("/products/:count", authCheck, list);
router.get("/product/:id", authCheck, read);
router.put("/product/:id", authCheck, adminCheck, update);
router.delete("/product/:id", authCheck, adminCheck, remove);
router.post("/productby", authCheck, listby);
router.post("/search/filters", authCheck, searchFilters);

router.post("/images", authCheck, adminCheck, createImages);
router.post("/removeimages", authCheck, adminCheck, removeImage);

module.exports = router;
