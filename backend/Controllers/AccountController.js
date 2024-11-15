const { UserAccount } = require("../Models/UserAccounts");
const upload = require("../Middleware/UploadImage");
const UserAccounts = require("../Models/UserAccounts");

async function createAccount(req, res) {
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
    console.log(req.body); // This will contain your form data
    console.log(req.file);
    await newUser.save();

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      imageUrl: req.file.path,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

// Method : get
// Api : http://localhost:5000/role
// yaha sare role show honge

async function getAccounts(req, res) {
  const data = await UserAccounts.find();
  return res.status(200).send({ data: data });
}


// Method : Delete
// Api : http://localhost:5000/user/:id
// koi bhi aik Data delte kar sakte

async function deleteUser(req, res) {
  try {
    // is code se url me jo name aaraha ha wo mongo db ke name match hoga
    const finduseremail = await UserAccounts.find({
      userEmail: req.params.id.toLowerCase(),
    });

    // Is code me database me agar role nahi ho to error dega
    if (finduseremail.length <= 0)
      return res.send({ error: " Email Is not defined" });

    // ye code delete ki functionalty keliye ha

    const deleteRole = await UserAccounts.deleteOne({
      userEmail: req.params.id,
    });

    // Agar status 200 ata ha to message print hoga delete ka
    return res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
  }
}
module.exports = { createAccount, getAccounts, deleteUser };
