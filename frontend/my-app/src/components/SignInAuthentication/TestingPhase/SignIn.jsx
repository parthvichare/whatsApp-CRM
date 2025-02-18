import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance"; // Import the Axios instance
import { useNavigate } from "react-router-dom";

const SignIn = ({ socket }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [Id, setId] = useState(null); // Initialize Id as null
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState();
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.email,formData.password)
    try {
      const response = await axiosInstance.post(
        "/api/demo/login", 
        formData);
      const { token,userdetails } = response.data;
      if (!token) {
        setError(error);
      } else {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userdetails.id);
        localStorage.setItem("role", userdetails.role);

        // setMessage(Loginstatus);
        // navigate(`/user/${userId}`);
        navigate("/chat-room");
        window.location.reload();
      }
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred during login");
    }
  };

  return (
    <div>
      <div className="laptop-l:w-full laptop:w-full tablet:w-full s:w-full flex justify-center my-44">
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        {/* Display error message */}
        <div class="border-2 p-2 h-96 py-4 rounded-xl s:justify-center">
          <div class="mb-6 m:w-full s:w-full l:w-full">
            <h1 class="text-3xl font-semibold px-8 s:ml-12">LogIn to Get Onboard on CRM</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div class="mb-3 mx-2 s:mx-8">
              <p class="text-xl mb-3">Email:</p>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="border-2 border-gray-100  w-[350px] s:w-[290px] mx-1 px-2 py-1 rounded-full"
                required
              />
            </div>
            <div class="mx-2 s:mx-8">
              <p class="text-xl mb-3">Password</p>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="border-2 border-gray-100  w-[350px] s:w-[290px]  mx-1 px-2 py-1 mb-8 rounded-full"
                required
              />
            </div>
            <button type="submit" className="bg-black laptop-l:w-[310px] laptop:w-[310px] tablet:w-[310px] l:w-[350px] s:w-[290px] s:ml-8 py-1 mx-4 hover:bg-gray-600 rounded-full">
              <span class="text-gray-50">Log In</span>
            </button>
          </form>
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default SignIn;