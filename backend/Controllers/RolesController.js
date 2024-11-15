// Model

const { UserRoles } = require("../Models/UserRoles");

// Method : post
// Api : http://localhost:5000/
// Role Add honge yaha per

async function createRoles(req, res) {
  // Yaha per Body se value aye gi
  const { Role_name, Status } = req.body;

  // Role pehle se ha ya nahi ha
  const exist_role = await UserRoles.find({
    Role_name: Role_name.toLowerCase(),
  });
  // role name keliye Regex ka istemal kiya ha
  const roleName_checker = /^[A-Za-z]+$/;

  // Agar Role name koi nymber ya special character ho to else chale ga
  if (roleName_checker.test(Role_name)) {
    // Agar user exist karta ha to already exist likha aye ga
    if (exist_role.length > 0)
      return res.send({ error: "Already Role Added " });
    const newRole = await UserRoles.create({
      Role_name: Role_name.toLowerCase(),
      Status: Status,
    });

    return res.status(201).send({ Data: req.body });
  } else {
    return res.send({ error: "Name Me sirf Alphabet likhein" });
  }
}

// Method : get
// Api : http://localhost:5000/role
// yaha sare role show honge

async function getRoles(req, res) {
  const data = await UserRoles.find();
  return res.status(200).send({ data: data });
}

// Method : Delete
// Api : http://localhost:5000/role:id
// koi bhi aik Data delte kar sakte

async function deleteRole(req, res) {
  try {
    // is code se url me jo name aaraha ha wo mongo db ke name match hoga
    const findrolename = await UserRoles.find({
      Role_name: req.params.id.toLowerCase(),
    });

    // Is code me database me agar role nahi ho to error dega
    if (findrolename.length <= 0)
      return res.send({ error: " Role Is not defined" });

    // ye code delete ki functionalty keliye ha

    const deleteRole = await UserRoles.deleteOne({ Role_name: req.params.id });

    // Agar status 200 ata ha to message print hoga delete ka
    return res.status(200).send({ message: "Role deleted successfully" });
  } catch (error) {
    console.log(error);
  }
}

// Method : Update
// Api : http://localhost:5000/role:id
// kisi Bhi aik data ko update ka sakte ha

async function updateRole(req, res) {
  //url me jo id ha abhi is waqt
  const userRoleid = req.params.id;

  // purane data to check karna ke record ha bhi ya nahi ha

  const role_old_data = await UserRoles.findOne({
    Role_name: userRoleid.toLowerCase(),
  });

  //Conole me dekhne keliye ke kiya name aaraha ha ?

  console.log(role_old_data.Role_name);

  // Insert karna naya data
  const { Role_name, Status } = req.body;

  // Naye Object ko Update karna

  const Updatedata = await UserRoles.updateOne(
    {
      "Role_name": role_old_data.Role_name,
    },
    {
      $set: {
        Status
      },
    }
  );

  return res.send({ message: "Role Updated Succesfully" });
}

module.exports = { createRoles, getRoles, deleteRole, updateRole };
