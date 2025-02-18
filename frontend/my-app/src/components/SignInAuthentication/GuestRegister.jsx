import React, { useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

const GuestRegister = ({ isRegister, handletoggle }) => {
    const{id}=useParams()
    const [formData, setFormData] = useState({
        fullName: "",
        mobileNumber: "",  // Corrected key name
        address: "",
        purposeOfVisit: "",
        checkIn:"",
        checkOut:"",
        emailId: "",
        IdProofNumber: "",
        hotel:id
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGuestSubmission = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post("/guest/guest-register", formData);
            navigate("/welcomePage");
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div>
            {isRegister ? (
                <div>
                    <div className="laptop-l:w-full laptop:w-full tablet:w-full l:w-full m:w-full s:w-full flex justify-center my-24 bg-red-600">
                        <div className="border-2 h-1/2 py-4 rounded-xl ">
                            <div className="flex justify-between mb-3 mx-10 m:mx-5 s:mx-2 s:ml-2">
                                <h1 className="text-3xl font-semibold px-2 m:text-2xl s:text-xl">
                                    Book Your Hotel
                                </h1>
                                <p onClick={handletoggle} className="cursor-pointer text-4xl">
                                    X
                                </p>
                            </div>
                            <div className="border-b-2 border-zinc-950 mb-2"></div>
                            <form onSubmit={handleGuestSubmission}>
                                <div className="mb-3 mx-2 m:pl-4">
                                    <p className="text-xl mb-3 m:mx-2 s:mx-8">Full Name</p>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="First Name"
                                        onChange={handleChange}
                                        className="border-2 border-gray-100 w-[350px] m:w-[300px] s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 rounded-full"
                                        required
                                    />
                                </div>
                                <div className="mb-3 mx-2 m:pl-4">
                                    <p className="text-xl mb-3 m:mx-2 s:ml-8">Mobile Number</p>
                                    <input
                                        type="tel" // Corrected type
                                        name="mobileNumber"  // Corrected key name
                                        placeholder="Mobile Number"
                                        onChange={handleChange}
                                        className="border-2 border-gray-100 w-[350px] m:w-[300px] s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 rounded-full"
                                        required
                                    />
                                </div>
                                <div className="mx-2 m:pl-4">
                                    <p className="text-xl mb-3 m:mx-2 s:ml-8">Address</p>
                                    <input
                                        type="text" // Corrected type
                                        name="address"
                                        placeholder="Address"
                                        onChange={handleChange}
                                        className="border-2 border-gray-100 w-[350px] m:w-[300px] s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 mb-8 rounded-full"
                                        required
                                    />
                                </div>
                                <div className="mx-2 m:pl-4">
                                    <p className="text-xl mb-3 m:mx-2 s:ml-8">Purpose Of Visit:</p>
                                    <select
                                        name="purposeOfVisit"
                                        onChange={handleChange}
                                        className="border-2 border-gray-100 w-[350px] m:w-[300px] s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 mb-8 rounded-full"
                                        required
                                    >
                                        <option value="Business">Business</option>
                                        <option value="Personal">Personal</option>
                                        <option value="Tourist">Tourist</option>
                                    </select>
                                </div>
                                <div className="mx-2 m:pl-4">
                                    <p className="text-xl mb-3 m:mx-2 s:ml-8">Stay Dates</p>

                                    <div className="flex flex-col">
                                        <label htmlFor="checkIn" className="mb-2">Check-In Date</label>
                                        <input
                                            type="date"
                                            name="checkIn" // Updated to match formData structure
                                            onChange={handleChange}
                                            className="border-2 border-gray-100 w-[350px] m:w-[300px] s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 mb-4 rounded-full"
                                            required
                                        />

                                        <label htmlFor="checkOut" className="mb-2">Check-Out Date</label>
                                        <input
                                            type="date"
                                            name="checkOut" // Updated to match formData structure
                                            onChange={handleChange}
                                            className="border-2 border-gray-100 w-[350px] m:w-[300px] s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 mb-8 rounded-full"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mx-2 m:pl-4">
                                    <p className="text-xl mb-3 m:mx-2 s:ml-8">Email ID</p>
                                    <input
                                        type="text" // Corrected type
                                        name="emailId"
                                        placeholder="Email"
                                        onChange={handleChange}
                                        className="border-2 border-gray-100 w-[350px] m:w-[300px] s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 mb-8 rounded-full"
                                        required
                                    />
                                </div>

                                <div className="mx-2 m:pl-4">
                                    <p className="text-xl mb-3 m:mx-2 s:ml-8">ID Proof Number</p>
                                    <input
                                        type="text" // Corrected type
                                        name="IdProofNumber"
                                        placeholder="ID Proof Number"
                                        onChange={handleChange}
                                        className="border-2 border-gray-100 w-[350px] m:w-[300px] s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 mb-8 rounded-full"
                                        required
                                    />
                                </div>

                                <div className="mx-2 m:pl-4">
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                    >
                                        Register
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default GuestRegister;
