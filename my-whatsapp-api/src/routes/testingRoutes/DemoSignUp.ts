// import express,{Router} from "express";

// import { registerSalesAgent } from "../../controllers/testingControllers/registerSalesAgent";
// import { matchPasswordAndGenerateTokenForAgent } from "../../controllers/testingControllers/matchPasswordAndGenerateTokenForAgent";
// import { SalesAgent } from "../../models/salesAgent";


// const router:Router = express.Router();


// // "/api/demo/register"
// router.post('/register', async (req, res) => {
//     const { name, email, password,role } = req.body;
//     console.log(name,email,password)
//     console.log("Register")
//     try {
//       const result = await registerSalesAgent(name, email, password,role);
//       res.json(result);
//     } catch (error) {
//       res.status(400).json(error);
//     }
// });

// export default router;

// router.post('/login', async (req, res) => {
//     try {
//       console.log("Hello")
//       const { email, password } = req.body;
//       const agent = await SalesAgent.findByEmail(email);
//       console.log(email,password)
//       const token = await matchPasswordAndGenerateTokenForAgent(email, password);
//       const userdetails = {id:agent.id, role:agent.role}
//       res.json({ token,userdetails });
//     } catch (error) {
//       if (error instanceof Error) {
//         res.status(401).json({ error: error.message }); // Ensure error is an instance of Error
//       } else {
//         res.status(401).json({ error: "An unknown error occurred" });
//       }
//     }
// });
