const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const itemsRoutes = require("./routes/items.routes");
const vendorsRoutes = require("./routes/vendors.routes");
const { errorHandler } = require("./middlewares/error");
const { notFound } = require("./middlewares/notFound");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/items", itemsRoutes);
app.use('/api/vendors', vendorsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
