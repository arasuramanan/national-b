require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const db = require("./db/connect");
const errorHandler = require("./middleware/error.middleware");

// Routes
const employeeRoutes = require("./routes/employees.routes");
const authRoutes = require("./routes/auth.routes");
const detailsRoutes = require("./routes/details.routes");
const auditTrailRoutes = require("./routes/auditTrail.routes");
const exportRoutes = require("./routes/export.routes");

const app = express();

// Connect Database
db();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// HTTP Request Logger
app.use(morgan("dev"));

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to MyOrg!");
});

// API Routes
app.use("/api", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", detailsRoutes);
app.use("/api", auditTrailRoutes);
app.use("/api/export", exportRoutes);

// Global Error Handler (Must be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});