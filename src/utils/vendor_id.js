const { customAlphabet } = require("nanoid");

// 10-char uppercase + digits for Vendor_ID
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10);

function generateVendorId() {
  return nanoid();
}

module.exports = { generateVendorId };
