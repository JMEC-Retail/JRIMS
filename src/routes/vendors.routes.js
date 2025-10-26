const express = require("express");
const { body, param, query } = require("express-validator");
const ctrl = require("../controllers/vendors.controller");
const { validate } = require("../middlewares/validate");

const router = express.Router();

const idParam = param("id")
  .isLength({ min: 1, max: 10 })
  .withMessage("Invalid Vendor_ID");

const createValidators = [
  body("Vendor_ID").optional().isLength({ min: 1, max: 10 }),
  body("Vendor_Name").isLength({ min: 1, max: 128 }),
  body("Vendor_Location").optional().isLength({ min: 0, max: 64 }),
  body("Vendor__ABVR")
    .isLength({ min: 3, max: 3 })
    .matches(/^[A-Z]{3}$/),
];

const updateValidators = [
  idParam,
  body("Vendor_Name").optional().isLength({ min: 1, max: 128 }),
  body("Vendor_Location").optional().isLength({ min: 0, max: 64 }),
  body("Vendor__ABVR")
    .optional()
    .isLength({ min: 3, max: 3 })
    .matches(/^[A-Z]{3}$/),
];

const listValidators = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("search").optional().isString(),
  query("location").optional().isString(),
];

router.post("/", createValidators, validate, ctrl.create);
router.get("/", listValidators, validate, ctrl.list);
router.get("/:id", idParam, validate, ctrl.getById);
router.put("/:id", updateValidators, validate, ctrl.update);
router.patch("/:id", updateValidators, validate, ctrl.update);
router.delete("/:id", idParam, validate, ctrl.remove);

module.exports = router;
