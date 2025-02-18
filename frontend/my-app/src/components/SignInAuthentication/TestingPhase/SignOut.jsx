import React, { useState } from 'react';
import axiosInstance from '../../../axiosInstance';

const Signout = () => {
  const [message, setMessage] = useState();
  // const navigate = useNavigate();
  const Role=localStorage.getItem("Role")

  const handleLogOut = async () => {
    try {
    // Clear the token and navigate to login page
    if(Role){
        localStorage.removeItem("token");
        localStorage.removeItem("role")
        localStorage.removeItem("userId")
        // window.location.href = "/allhotels"; // Redirects to the login page
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setMessage("Logout failed. Please try again.");
    }
  };

  return (
    <div>
      <ul>
        <li>
            <button onClick={handleLogOut} className="ml-4  text-zinc-700 px-4 py-2 rounded hover:text-slate-950 transition duration-300 ease-in-out text-xl ">
              SignOut
            </button>
        </li>
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signout;