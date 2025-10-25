const express = require("express");
const { body, param, query } = require("express-validator");
const ctrl = require("../controllers/items.controller");
const { validate } = require("../middlewares/validate");

const router = express.Router();

// Validators
const idParam = param("id")
  .isLength({ min: 1, max: 20 })
  .withMessage("Invalid Item_ID");

const createValidators = [
  body("Item_ID").optional().isLength({ min: 1, max: 20 }),
  body("Item_Name").isLength({ min: 1, max: 42 }),
  body("Item_MarketName").isLength({ min: 1, max: 256 }),
  body("Item_ImageLink").isString().isLength({ min: 1 }),
  body("Item_SKU").isLength({ min: 1, max: 21 }),
  body("Item_UPC")
    .isLength({ min: 1, max: 12 })
    .matches(/^[0-9A-Za-z-]+$/),
];

const updateValidators = [
  idParam,
  body("Item_Name").optional().isLength({ min: 1, max: 42 }),
  body("Item_MarketName").optional().isLength({ min: 1, max: 256 }),
  body("Item_ImageLink").optional().isString().isLength({ min: 1 }),
  body("Item_SKU").optional().isLength({ min: 1, max: 21 }),
  body("Item_UPC")
    .optional()
    .isLength({ min: 1, max: 12 })
    .matches(/^[0-9A-Za-z-]+$/),
];

const listValidators = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("search").optional().isString(),
];

// Routes
router.post("/", createValidators, validate, ctrl.create);
router.get("/", listValidators, validate, ctrl.list);
router.get("/:id", idParam, validate, ctrl.getById);
router.put("/:id", updateValidators, validate, ctrl.update); // full or partial update
router.patch("/:id", updateValidators, validate, ctrl.update); // alias for partial
router.delete("/:id", idParam, validate, ctrl.remove);

module.exports = router;
