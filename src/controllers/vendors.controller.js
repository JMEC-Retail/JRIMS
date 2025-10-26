const { generateVendorId } = require("../utils/vendor_id");
const service = require("../services/vendors.service");

async function create(req, res, next) {
  try {
    const { Vendor_ID, Vendor_Name, Vendor_Location, Vendor__ABVR } = req.body;
    const payload = {
      Vendor_ID: Vendor_ID || generateVendorId(),
      Vendor_Name,
      Vendor_Location: Vendor_Location ?? null,
      Vendor__ABVR: (Vendor__ABVR || "").toUpperCase(),
    };

    const created = await service.createVendor(payload);
    res.status(201).location(`/api/vendors/${created.Vendor_ID}`).json(created);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const vendor = await service.getVendor(req.params.id);
    res.json(vendor);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Math.min(Number(req.query.limit || 20), 100);
    const search = (req.query.search || "").toString();
    const location = (req.query.location || "").toString();
    const result = await service.listVendors({ page, limit, search, location });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const fields = { ...req.body };
    if (fields.Vendor__ABVR)
      fields.Vendor__ABVR = fields.Vendor__ABVR.toUpperCase();
    const updated = await service.updateVendor(req.params.id, fields);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await service.deleteVendor(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getById, list, update, remove };
