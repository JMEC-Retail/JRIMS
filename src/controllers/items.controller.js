/* HTTP Layer */

const { generateItemId } = require("../utils/item_id");
const service = require("../services/items.service");

async function create(req, res, next) {
  try {
    const {
      Item_ID,
      Item_Name,
      Item_MarketName,
      Item_ImageLink,
      Item_SKU,
      Item_UPC,
    } = req.body;
    const payload = {
      Item_ID: Item_ID || generateItemId(),
      Item_Name,
      Item_MarketName,
      Item_ImageLink,
      Item_SKU,
      Item_UPC,
    };

    const created = await service.createItem(payload);
    res.status(201).location(`/api/items/${created.Item_ID}`).json(created);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const item = await service.getItem(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Math.min(Number(req.query.limit || 20), 100);
    const search = (req.query.search || "").toString();
    const result = await service.listItems({ page, limit, search });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const updated = await service.updateItem(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteItem(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getById, list, update, remove };
