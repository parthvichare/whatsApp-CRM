import React,{useState,useEffect} from 'react'
import axiosInstance from '../../axiosInstance';
import { useNavigate } from "react-router-dom";

const HotelRegister = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
      hotelname: "",
      address: "",
      logo: "",
    });
  
    const handleClick = () => {
      setIsRegister(!isRegister);
    };

    const navigate =  useNavigate()
  
    const handleChange = (e) => {
        if (e.target.name === "logo") {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData({
              ...formData,
              logo: reader.result, // Store the base64 string
            });
          };
          if (file) {
            reader.readAsDataURL(file); // Read the file as base64
          }
        } else {
          setFormData({
            ...formData,
            [e.target.name]: e.target.value,
          });
        }
      };
    
  
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/hotel/register-hotel', formData);
            const{_id} =  await response.data.hotel
            console.log(response.data); // Log the response from the server
            navigate(`/hotel/${_id}`)
        } catch (error) {
            console.error('Error registering hotel:', error);
        }
    };
    
  return (
    <div>
      <div className="laptop-l:w-full laptop:w-full tablet:w-full l:w-full m:w-full s:w-full flex justify-center my-24">
        <div className="border-2 h-1/2 py-4 rounded-xl">
          <div className="mb-3 mx-10 m:mx-5 s:mx-2 s:ml-2">
            <h1 className="text-3xl font-semibold px-2 m:text-2xl s:text-xl">
              Register Your Hotel
            </h1>
          </div>
          <div className="border-b-2 border-zinc-950 mb-2"></div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 mx-2 m:pl-4">
              <p className="text-xl mb-3 m:mx-2 s:mx-8">Hotel Name</p>
              <input
                type="text"
                name="hotelname"
                onChange={handleChange}
                placeholder="Hotel Name"
                className="border-2 border-gray-100 w-[350px] m:w-[300px] s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 rounded-full"
                required
              />
            </div>
            <div className="mb-3 mx-2 m:pl-4">
              <p className="text-xl mb-3 m:mx-2 s:ml-8">Address</p>
              <input
                type="text"
                name="address"
                onChange={handleChange}
                placeholder="Address"
                className="border-2 border-gray-100 w-[350px] m:w-[300px] s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 rounded-full"
                required
              />
            </div>
            <div className="mx-2 m:pl-4">
              <p className="text-xl mb-3 m:mx-2 s:ml-8">Logo</p>
              <input
                type="file"
                name="logo"
                onChange={handleChange}
                className="border-2 border-gray-100 w-[350px] m:w-[300px] s:w-[280px] s:ml-8 m:ml-2 px-2 py-1 mb-8 rounded-full"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-black w-[350px] m:w-[300px] s:w-[280px] py-1 s:ml-8 hover:bg-gray-600 rounded-full mb-6 m:px-2"
            >
              <span className="text-gray-50">Sign Up</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default HotelRegister