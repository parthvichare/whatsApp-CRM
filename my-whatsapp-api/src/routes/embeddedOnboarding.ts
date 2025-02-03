import express,{Router} from "express";

const router:Router = express.Router();

router.post("/createClientWabaId")
router.post("/:wabaId/addphonenumber")  
router.post("/:phonenumberId/requestCode")
router.post("/:phonenumberId/verifyCode")
router.get("/:wabaId/phonenumber")


export default router;

// /****
//    Embedded Login with whatsApp Phone Number otp-verification
// *****/ 

// //WABA= WhatsApp Business Account
// router.post("/:businessId/whatsapp_business_accounts/",createClientWabaId);  
// router.post("/createClientWabaId")

// //OTP-verification
// router.post("/:wabaId/addphonenumber",{query_params:{phone_number,cc,type,verified_name}})  //Add-CLIENT_Number under clientwabaId

// //Get PhoneNumberId of the addedPhoneNumber
// router.get("/:wabaId/phonenumber")

// //Request-OTP
// router.post("/:phonenumberId/requestCode",{query_params:{code_method,langauge}})

// //Verify-OTP
// router.post("/:phonenumberId/verifyCode",{params:{otp}})


// /****
//    Message Templates
// *****/ 

