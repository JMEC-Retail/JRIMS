const repo = require("../repositories/items.repo");
const createHttpError = (status, message, publicMessage) => {
  const err = new Error(message || publicMessage);
  err.status = status;
  err.publicMessage = publicMessage || message;
  return err;
};

async function createItem(payload) {
  try {
    return await repo.create(payload);
  } catch (e) {
    if (e && e.code === "ER_DUP_ENTRY") {
      throw createHttpError(
        409,
        e.message,
        "Item with the same SKU or UPC already exists"
      );
    }
    throw e;
  }
}

async function getItem(id) {
  const item = await repo.findById(id);
  if (!item) throw createHttpError(404, "Not Found", "Item not found");
  return item;
}

async function listItems(q) {
  return await repo.list(q);
}

async function updateItem(id, fields) {
  const changed = await repo.update(id, fields);
  if (!changed) {
    // Nothing updated OR item not found
    const existing = await repo.findById(id);
    if (!existing) throw createHttpError(404, "Not Found", "Item not found");
  }
  return await repo.findById(id);
}

async function deleteItem(id) {
  const removed = await repo.remove(id);
  if (!removed) throw createHttpError(404, "Not Found", "Item not found");
}

module.exports = { createItem, getItem, listItems, updateItem, deleteItem };
