const { pool } = require("../config/db");

const COLUMNS = ["Vendor_ID", "Vendor_Name", "Vendor_Location", "Vendor__ABVR"];

function rowToVendor(row) {
  return {
    Vendor_ID: row.Vendor_ID,
    Vendor_Name: row.Vendor_Name,
    Vendor_Location: row.Vendor_Location,
    Vendor__ABVR: row.Vendor__ABVR,
  };
}

async function create(vendor) {
  const sql = `INSERT INTO Vendors (${COLUMNS.join(",")}) VALUES (?, ?, ?, ?)`;
  const params = [
    vendor.Vendor_ID,
    vendor.Vendor_Name,
    vendor.Vendor_Location ?? null,
    vendor.Vendor__ABVR,
  ];
  const [result] = await pool.execute(sql, params);
  return { ...vendor, _insertId: result.insertId ?? null };
}

async function findById(id) {
  const [rows] = await pool.execute(
    "SELECT * FROM Vendors WHERE Vendor_ID = ? LIMIT 1",
    [id]
  );
  return rows[0] ? rowToVendor(rows[0]) : null;
}

async function list({ page = 1, limit = 20, search = "", location = "" } = {}) {
  const offset = (page - 1) * limit;

  const filters = [];
  const params = [];

  if (search) {
    // search by name LIKE and exact match for ID or ABVR
    filters.push("(Vendor_Name LIKE ? OR Vendor_ID = ? OR Vendor__ABVR = ?)");
    params.push(`%${search}%`, search, search.toUpperCase());
  }

  if (location) {
    filters.push("(Vendor_Location = ?)");
    params.push(location);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const [rows] = await pool.execute(
    `SELECT * FROM Vendors ${where} ORDER BY Vendor_Name ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM Vendors ${where}`,
    params
  );

  return {
    page,
    limit,
    total,
    vendors: rows.map(rowToVendor),
  };
}

async function update(id, fields) {
  const allowed = ["Vendor_Name", "Vendor_Location", "Vendor__ABVR"];
  const sets = [];
  const params = [];

  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      sets.push(`${key} = ?`);
      params.push(fields[key]);
    }
  }

  if (!sets.length) return 0; // nothing to update

  params.push(id);
  const sql = `UPDATE Vendors SET ${sets.join(", ")} WHERE Vendor_ID = ?`;
  const [result] = await pool.execute(sql, params);
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.execute(
    "DELETE FROM Vendors WHERE Vendor_ID = ?",
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  create,
  findById,
  list,
  update,
  remove,
};
