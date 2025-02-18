import React from 'react';
import Signout from './TestingPhase/SignOut';


const Navbar = () => {
  const adminRole = localStorage.getItem('Role');
  const token = localStorage.getItem('token');

  return (
    <div className="flex justify-between items-center mb-2 mx-6">
      {/* Logo Section */}
      <a href="/bookyourhotel" className="flex items-center space-x-2 text-stone-600 hover:text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Hotel Registration"
          className="bg-transparent"
        >
          <rect x="4" y="8" width="16" height="10" fill="#B0C4DE" />
          <polygon points="4,8 12,3 20,8" fill="#4682B4" />
          <rect x="8" y="10" width="2" height="4" fill="white" />
          <rect x="14" y="10" width="2" height="4" fill="white" />
          <rect x="11" y="12" width="2" height="6" fill="#FFD700" />
        </svg>
        <span className="text-lg font-medium">Book Your Hotel</span>
      </a>
      {/* Authentication Links */}
      <div className="flex space-x-6">
        <a href="/admin-signUp" className="text-stone-700 hover:text-black">
          SignUp
        </a>
        <a href="/admin-signIn" className="text-stone-700 hover:text-black">
          SignIn
        </a>
        <Signout/>
      </div>
    </div>
  );

  // if (token) {
  //   // For unauthenticated users
  //   return (
  //     <div className="flex justify-between items-center mb-2 mx-6">
  //       {/* Logo Section */}
  //       <a href="/bookyourhotel" className="flex items-center space-x-2 text-stone-600 hover:text-black">
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           width="40"
  //           height="40"
  //           fill="none"
  //           viewBox="0 0 24 24"
  //           aria-label="Hotel Registration"
  //           className="bg-transparent"
  //         >
  //           <rect x="4" y="8" width="16" height="10" fill="#B0C4DE" />
  //           <polygon points="4,8 12,3 20,8" fill="#4682B4" />
  //           <rect x="8" y="10" width="2" height="4" fill="white" />
  //           <rect x="14" y="10" width="2" height="4" fill="white" />
  //           <rect x="11" y="12" width="2" height="6" fill="#FFD700" />
  //         </svg>
  //         <span className="text-lg font-medium">Book Your Hotel</span>
  //       </a>
  //       {/* Authentication Links */}
  //       <div className="flex space-x-6">
  //         <a href="/admin-signUp" className="text-stone-700 hover:text-black">
  //           SignUp
  //         </a>
  //         <a href="/admin-signIn" className="text-stone-700 hover:text-black">
  //           SignIn
  //         </a>
  //       </div>
  //     </div>
  //   );
  // } else if (adminRole === 'Guest Admin') {
  //   // For Guest Admin
  //   return (
  //     <div className="flex justify-between items-center mb-2 mx-6">
  //       {/* Logo Section */}
  //       <a  className="font-thin text-2xl">HotelManagement</a>
  //       {/* Guest Details */}
  //       <a href="/guest-details" className="text-stone-700 hover:text-black">
  //         Guest Details
  //       </a>
  //       <Signout/>
  //     </div>
  //   );
  // } else if (adminRole === 'Main Admin') {
  //   // For Main Admin
  //   return (
  //     <div className="flex justify-between items-center mb-2 mx-6">
  //       {/* Logo Section */}
  //       <a href="/admin" className="font-thin text-2xl">HotelManagement</a>
  //         <a href="/guest-details" className="text-stone-700 hover:text-black">
  //           Guest Details
  //         </a>
  //         <a href="/hotel-register" className="text-stone-700 hover:text-black">
  //           Register Your Hotel
  //         </a>
  //         <Signout/>
          
  //     </div>
  //   );
  // }
  // // Default case (if token exists but no specific role is defined)
  // return (
  //   <Signout/>
  // )
};

export default Navbar;
