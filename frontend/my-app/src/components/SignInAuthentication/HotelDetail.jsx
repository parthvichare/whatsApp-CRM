import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import GuestRegister from "./GuestRegister";

const HotelDetail = () => {
  const { id } = useParams();
  const [hoteldetail, setHotelDetail] = useState(null);
  const[isRegister,setIsRegister] = useState(false)
  useEffect(() => {
    const fetchhotelInfo = async () => {
      try {
        const response = await axiosInstance.get(`/hotel/api/${id}`);
        setHotelDetail(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchhotelInfo();
  }, []);

  const handletoggle=()=>{
    setIsRegister(!isRegister)
  }
  console.log(hoteldetail);

  if (!hoteldetail) {
    return <p>Loading....</p>;
  }
  return (
<div className="flex flex-col items-center justify-center">
  <div className="p-6 text-center  w-full">
    {/* Hotel Name */}
    <h1 className="text-2xl font-bold text-gray-800 mb-4">
      {hoteldetail.hotelname}
    </h1>
    {/* Hotel Logo */}
    <img
      src={`http://localhost:8000/uploads/${hoteldetail.logo}`}
      alt="Hotel Logo"
      className="w-60 h-60 rounded-full object-cover mx-auto"
    />

    <button className="px-4 py-2 bg-red-700 hover:bg-red-200 mt-10" onClick={handletoggle}>BookYourStayWithUS</button>
  </div>
  <div className="absolute top-32">
  <GuestRegister isRegister={isRegister} handletoggle={handletoggle}/>
  </div>
</div>

  );
};

export default HotelDetail;
