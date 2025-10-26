const repo = require("../repositories/vendors.repo");

const createHttpError = (status, message, publicMessage) => {
  const err = new Error(message || publicMessage);
  err.status = status;
  err.publicMessage = publicMessage || message;
  return err;
};

async function createVendor(payload) {
  try {
    return await repo.create(payload);
  } catch (e) {
    if (e && e.code === "ER_DUP_ENTRY") {
      const publicMessage = /uq_vendor_abvr/i.test(e.message || "")
        ? "Vendor abbreviation already exists"
        : "Vendor with the same ID already exists";
      throw createHttpError(409, e.message, publicMessage);
    }
    throw e;
  }
}

async function getVendor(id) {
  const vendor = await repo.findById(id);
  if (!vendor) throw createHttpError(404, "Not Found", "Vendor not found");
  return vendor;
}

async function listVendors(q) {
  return await repo.list(q);
}

async function updateVendor(id, fields) {
  const changed = await repo.update(id, fields);
  if (!changed) {
    const existing = await repo.findById(id);
    if (!existing) throw createHttpError(404, "Not Found", "Vendor not found");
  }
  return await repo.findById(id);
}

async function deleteVendor(id) {
  const removed = await repo.remove(id);
  if (!removed) throw createHttpError(404, "Not Found", "Vendor not found");
}

module.exports = {
  createVendor,
  getVendor,
  listVendors,
  updateVendor,
  deleteVendor,
};
