import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewPage = () => {
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false); // For controlling modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // For storing selected user data
  const [updatedUser, setUpdatedUser] = useState({
    userName: "",
    userEmail: "",
    userRole: "",
    userImage: null, // For storing the updated image
  });

  const [roles, setRoles] = useState([]); // For storing roles

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/viewAccount");
        setUserData(response.data.data); // Assuming the response has a 'data' array
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/");
        console.log("Roles API response:", response.data); // Log the response for debugging

        if (response.data.data && Array.isArray(response.data.data)) {
          setRoles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
    fetchData();
  }, []);

  // Handle delete user
  const handleDelete = async (userEmail) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/user/${userEmail}`
      );

      if (response.status === 200) {
        alert("User deleted successfully");
        // Remove the deleted user from the state
        setUserData(userData.filter((user) => user.userEmail !== userEmail));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete the user");
    }
  };

  // Open modal for update
  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setUpdatedUser({
      userName: user.userName,
      userEmail: user.userEmail,
      userRole: user.userStatus,
      userImage: user.userImage, // Set existing image
    });
    setShowModal(true);
  };

  // Handle form input changes in modal
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  // Handle image upload change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedUser({
        ...updatedUser,
        userImage: URL.createObjectURL(file), // Preview image
      });
    }
  };

  // Handle update form submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userName", updatedUser.userName);
    formData.append("userEmail", updatedUser.userEmail);
    formData.append("userRole", updatedUser.userRole);

    // Append image file to FormData
    if (updatedUser.userImage instanceof File) {
      formData.append("userImage", updatedUser.userImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/user/${selectedUser.userEmail}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        alert("User updated successfully");
        // Update the user data in the state
        setUserData(
          userData.map((user) =>
            user.userEmail === selectedUser.userEmail
              ? { ...user, ...updatedUser }
              : user
          )
        );
        setShowModal(false); // Close the modal after successful update
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update the user");
    }
  };

  return (
    <div className="container mt-5">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">UserImage</th>
            <th scope="col">UserRole</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {userData.length > 0 ? (
            userData.map((user, index) => (
              <tr key={user.id}>
                <th scope="row">{index + 1}</th>
                <td>{user.userName}</td>
                <td>{user.userEmail}</td>
                <td>
                  <img
                    src={user.userImage}
                    alt={user.userName}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{user.userStatus}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm mr-3"
                    onClick={() => handleDelete(user.userEmail)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-warning btn-sm ml-3"
                    onClick={() => handleUpdateClick(user)} // Open update modal
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No users available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Updating User */}
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          aria-labelledby="updateModalLabel"
          style={{ display: "block" }}
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="updateModalLabel">
                  Update User
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowModal(false)} // Close modal
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="userName"
                      value={updatedUser.userName}
                      onChange={handleUpdateChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="userEmail"
                      value={updatedUser.userEmail}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      name="userRole"
                      value={updatedUser.userRole}
                      onChange={handleUpdateChange}
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.Role_name}>
                          {role.Role_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Profile Image</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {updatedUser.userImage && (
                      <img
                        src={updatedUser.userImage}
                        alt="Preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          marginTop: "10px",
                        }}
                      />
                    )}
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPage;
