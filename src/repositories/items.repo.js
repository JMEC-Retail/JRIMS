/* Data Access Layer */

const {
  TABLE_ITEMS: TABLE,
  COLUMNS_ITEMS: COLUMNS,
} = require("../config/constants");

const { pool } = require("../config/db");

function rowToItem(row) {
  return {
    Item_ID: row.Item_ID,
    Item_Name: row.Item_Name,
    Item_MarketName: row.Item_MarketName,
    Item_ImageLink: row.Item_ImageLink,
    Item_SKU: row.Item_SKU,
    Item_UPC: row.Item_UPC,
  };
}

async function create(item) {
  const sql = `INSERT INTO items (${COLUMNS.join(
    ","
  )}) VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [
    item.Item_ID,
    item.Item_Name,
    item.Item_MarketName,
    item.Item_ImageLink,
    item.Item_SKU,
    item.Item_UPC,
  ];
  const [result] = await pool.execute(sql, params);
  return { ...item, _insertId: result.insertId ?? null };
}

async function findById(id) {
  const [rows] = await pool.execute(
    "SELECT * FROM items WHERE Item_ID = ? LIMIT 1",
    [id]
  );
  return rows[0] ? rowToItem(rows[0]) : null;
}

async function list({ page = 1, limit = 20, search = "" } = {}) {
  const offset = (page - 1) * limit;

  const filters = [];
  const params = [];

  if (search) {
    // Search by name/market name (LIKE) and exact matches for SKU/UPC
    filters.push(
      "(Item_Name LIKE ? OR Item_MarketName LIKE ? OR Item_SKU = ? OR Item_UPC = ?)"
    );
    params.push(`%${search}%`, `%${search}%`, search, search);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const [rows] = await pool.execute(
    `SELECT * FROM items ${where} ORDER BY Item_Name ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM items ${where}`,
    params
  );

  return {
    page,
    limit,
    total,
    items: rows.map(rowToItem),
  };
}

async function update(id, fields) {
  const allowed = [
    "Item_Name",
    "Item_MarketName",
    "Item_ImageLink",
    "Item_SKU",
    "Item_UPC",
  ];
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
  const sql = `UPDATE items SET ${sets.join(", ")} WHERE Item_ID = ?`;
  const [result] = await pool.execute(sql, params);
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.execute("DELETE FROM items WHERE Item_ID = ?", [
    id,
  ]);
  return result.affectedRows;
}

module.exports = {
  create,
  findById,
  list,
  update,
  remove,
};
