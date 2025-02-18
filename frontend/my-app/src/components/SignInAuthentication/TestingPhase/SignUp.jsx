import React, { useState } from "react";
import axiosInstance from "../../../axiosInstance"; // Import the Axios instance
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send form data as JSON
      const response = await axiosInstance.post(
        "/api/demo/register",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const { message, user, userexist } = response.data;

      if (userexist) {
        setMessage(userexist); // Show the user already exists message
      } else {
        setMessage(message); // Show success message
        navigate("/admin-signIn"); // Navigate to user page
      }
    } catch (err) {
      // Handle the error based on the response status
      if (err.response && err.response.status === 400) {
        setMessage(err.response.data.userexist || "An error occurred.");
      } else {
        setMessage("An error occurred while creating the account."); // General error message
      }
    }
  };

  return (
    <div>
      <div className="laptop-l:w-full laptop:w-full tablet:w-full l:w-full m:w-full s:w-full flex justify-center my-24">
        {/* Display error message */}
        <div class="border-2 h-1/2 py-4 rounded-xl ">
          <div class="mb-3 mx-10 m:mx-5 s:mx-2 s:ml-2">
            <h1 class="text-3xl font-semibold px-2 m:text-2xl s:text-xl">
              WhatApp-CRM SignUp 
            </h1>
            <p class="mx-2 text-slate-900 m:text-base">
              Sign up to create your Account
            </p>
          </div>
          <div class="border-b-2 border-zinc-950 mb-2"></div>
          <form onSubmit={handleSubmit}>
            <div class="mb-3 mx-2 m:pl-4">
              <p class="text-xl mb-3 m:mx-2 s:mx-8">Name:</p>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                className="border-2 border-gray-100  w-[350px] m:w-[300px] s:w-[280px] s:ml-8 m:ml-2  px-2 py-1 rounded-full"
                required
              />
            </div>
            <div class="mb-3 mx-2  m:pl-4">
              <p class="text-xl mb-3 m:mx-2 s:ml-8">Email:</p>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="border-2 border-gray-100  w-[350px] m:w-[300px]  s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 rounded-full"
                required
              />
            </div>
            <div class="mx-2  m:pl-4 mb-10">
              <label className="text-xl mb-6 m:mx-2 s:ml-8" htmlFor="role">
                Select Role:
              </label>
              <select
                className="flex flex-row w-48 border border-gray-300 rounded p-2"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value=""> Select Role </option>
                <option value="Super Admin">Super Admin</option>
                <option value="Sales Agent">Sales Agent</option>
              </select>
            </div>
            <div class="mx-2  m:pl-4">
              <p class="text-xl mb-3 m:mx-2 s:ml-8 ">Password:</p>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="border-2 border-gray-100  w-[350px]  m:w-[300px] s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 mb-8 rounded-full"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-black w-[350px] m:w-[300px] s:w-[280px] py-1 s:ml-8 hover:bg-gray-600 rounded-full mb-6 m:px-2"
            >
              <span class="text-gray-50">Sign Up</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
