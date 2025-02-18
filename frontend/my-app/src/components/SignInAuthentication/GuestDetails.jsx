import React, { useEffect, useState } from "react";
import axiosInstance from '../../axiosInstance';

const GuestDetails = () => {
  const [guestdetail, setGuestDetail] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null); // To store guest being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal toggle state

  const Role = localStorage.getItem("Role")

  useEffect(() => {
    const fetchGuestInfo = async () => {
      try {
        const response = await axiosInstance.get(
          "/guest/guestdetails"
        );
        setGuestDetail(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchGuestInfo();
  }, []);


  const handleEditClick = (guest) => {
    setSelectedGuest(guest); // Set selected guest for editing
    setIsEditModalOpen(true); // Open modal
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedGuest({ ...selectedGuest, [name]: value });
  };

  console.log(selectedGuest)

  const handleUpdateGuest = async (e) => {
    console.log("In",selectedGuest)
    e.preventDefault(); // Prevent form submission default
    try {
      const response = await axiosInstance.patch(
        `/guest/guest_update/${selectedGuest._id}`,
        selectedGuest
      );
      setGuestDetail((prevDetails) =>
        prevDetails.map((guest) =>
          guest._id === selectedGuest._id ? response.data : guest
        )
      );
      setIsEditModalOpen(false); // Close the modal
      window.location.reload()
    } catch (error) {
      console.error("Error updating guest:", error.message);
    }
  };

  const handleDeleteGuest = async (id) => {
    try {
      await axiosInstance.delete(`/guest/guest_delete/${id}`);
      setGuestDetail((prevDetails) =>
        prevDetails.filter((guest) => guest._id !== id)
      );
      alert("Guest deleted successfully");
    } catch (error) {
      console.error("Error deleting guest:", error.message);
    }
  };

  const Print = () => {
    window.print();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Guest Name</th>
            <th className="py-3 px-6 text-left">Guest Address</th>
            <th className="py-3 px-6 text-left">Check In</th>
            <th className="py-3 px-6 text-left">Check Out</th>
            <th className="py-3 px-6 text-left">Mobile Number</th>
            <th className="py-3 px-6 text-left">Email Id</th>
            <th className="py-3 px-6 text-left">Id Proof Number</th>
            <th className="py-3 px-6 text-left">Purpose of Visit</th>
            <th className="py-3 px-6 text-left">Hotel Name</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {guestdetail.map((guest) => (
            <tr
              key={guest.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 font-bold">{guest.fullName}</td>
              <td className="py-3 px-6 font-bold">{guest.address}</td>
              <td className="py-3 px-6 font-bold">{guest.checkIn}</td>
              <td className="py-3 px-6 font-bold">{guest.checkOut}</td>
              <td className="py-3 px-6 font-bold">{guest.mobileNumber}</td>
              <td className="py-3 px-6 font-bold">{guest.emailId}</td>
              <td className="py-3 px-6 font-bold">{guest.IdProofNumber}</td>
              <td className="py-3 px-6 font-bold">{guest.purposeOfVisit}</td>
              <td className="py-3 px-6 font-bold">{guest.hotel.hotelname}</td>
              <td className="py-3 px-6 flex space-x-2">
                <button
                  onClick={() => handleEditClick(guest)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                {Role === "Main Admin" ? (
                  <button
                    onClick={() => handleDeleteGuest(guest._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                ) : (
                  <div></div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-center mt-10">
        <button className="bg-red-500 px-2 py-2" onClick={Print}>
          Print Out
        </button>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Guest Details</h2>
            <form onSubmit={handleUpdateGuest}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={selectedGuest?.fullName || ""}
                  onChange={handleInputChange}
                  className="border w-full px-4 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={selectedGuest?.mobileNumber || ""}
                  onChange={handleInputChange}
                  className="border w-full px-4 py-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestDetails;

