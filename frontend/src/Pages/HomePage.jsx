import React, { useState, useEffect } from "react";
import axios from "axios";

const HomePage = () => {
  const [formData, setFormData] = useState({
    UserName: "",
    UserEmail: "",
    UserPassword: "",
    userImage: null,
    selectedOption: "",
  });
  const [roles, setRoles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Fetch user roles from the backend
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
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, UserImage: file });

    // Generate image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("UserName", formData.UserName);
    data.append("UserEmail", formData.UserEmail);
    data.append("UserPassword", formData.UserPassword);
    data.append("UserImage", formData.userImage);
    data.append("selectedOption", formData.selectedOption);

    try {
      const response = await axios.post(
        "http://localhost:5000/createaccount",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Backend response:", response.data);

      if (response.data.success) {
        alert("User registered successfully");
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error.response || error.message);
      console.log(data);

      alert(
        `Error uploading image: ${
          error.response ? error.response.data.message : error.message
        }`
      );
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-6 mt-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Enter Name</label>
              <input
                type="text"
                className="form-control"
                name="UserName"
                value={formData.UserName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Enter Email</label>
              <input
                type="email"
                className="form-control"
                name="UserEmail"
                value={formData.UserEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="UserPassword"
                value={formData.UserPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                name="userImage"
                onChange={handleFileChange}
                required
              />
              {imagePreview && (
                <div className="mt-3">
                  <p>Image Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Selected Preview"
                    style={{ maxWidth: "20%", height: "100%" }}
                  />
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Select Role</label>
              <select
                className="form-control"
                name="selectedOption"
                value={formData.selectedOption}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                {roles.length > 0 ? (
                  roles.map((role, index) => (
                    <option key={index} value={role.Role_name}>
                      {role.Role_name}
                    </option>
                  ))
                ) : (
                  <option disabled>Loading roles...</option>
                )}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  );
};

export default HomePage;
