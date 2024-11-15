const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { upload } = require("./Middleware/UploadImage");

// Controllers import
const {
  createRoles,
  getRoles,
  deleteRole,
  updateRole,
} = require("./Controllers/RolesController");
const {
  createAccount,
  getAccounts,
  deleteUser,
} = require("./Controllers/AccountController");

// Express app initialization
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load environment variables
require("dotenv").config();

// Connect to the database
const { connectionDB } = require("./Config/Database");

// Route definitions
app.route("/").get(getRoles).post(createRoles);
app.route("/role/:id").delete(deleteRole).put(updateRole);
app.post("/createaccount", upload.single("userImage"), createAccount);
app.route("/viewAccount").get(getAccounts);
app.route("/user/:id").delete(deleteUser);

// Start the server and connect to the database
app.listen(process.env.PORT, function () {
  console.log(`Server is running at ${process.env.PORT}`);
  connectionDB();
});
