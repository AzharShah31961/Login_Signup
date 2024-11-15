const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const UserAccount = require("./Models/UserAccounts"); // Ensure this model exists

dotenv.config(); // Load environment variables

// Initialize Express app
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET_KEY,
});

// Connect to MongoDB
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Configure multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

// Route to handle form submission and image upload
app.post("/upload", upload.single("UserImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const newUser = new UserAccount({
      userName: req.body.UserName,
      userEmail: req.body.UserEmail,
      userPassword: req.body.UserPassword,
      userImage: req.file.path, // Image URL from Cloudinary
      userStatus: req.body.selectedOption,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      imageUrl: req.file.path,
    });
  } catch (error) {
    console.error("Error in upload route:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

const {
  createRoles,
  getRoles,
  deleteRole,
  updateRole,
} = require("./Controllers/RolesController");

// Route define karna ke url per kiya chale to kiya aaya
app.route("/").get(getRoles).post(createRoles);
app.route("/role/:id").delete(deleteRole).put(updateRole);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
