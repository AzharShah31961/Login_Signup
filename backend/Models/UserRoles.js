// mongoose ko use karne keliye mongoose ko variable me save ki ha
const mongoose = require("mongoose");

// Yaha per Model Create Horaha ha
const role_model = mongoose.Schema({
  Role_name: { type: String, required: [true, "Role Must be Entered"] },
  Status: { type: String, required: [true, "Enter Status"] },
});

// yaha modela ki value ko variable me likha ha
const UserRoles = mongoose.model("UserRoles", role_model);

// is line se Export horaha ha model
module.exports = { UserRoles };
