import {
  SignUp,
  addUser,
  editUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  logIn,
  loggedInUser,
  logOut,
} from "../controllers/UserController.js";
import { google } from "../controllers/OAuth.js";
import express from "express";
import upload from "../middleware/Multer.js";
import { authenticate } from "../middleware/Auth.js";

const userRouter = express.Router();

userRouter.post("/", upload.single("image"), SignUp);
userRouter.post("/byId", getOneUser);
userRouter.get("/", getAllUsers);
userRouter.post("/add",upload.single("image"), addUser);
userRouter.patch("/", upload.single("image"), editUser);
userRouter.delete("/", deleteUser);
userRouter.post("/login", logIn);
userRouter.post("/logout", logOut);
userRouter.get("/logged-in-user", authenticate, loggedInUser);
userRouter.post("/google", google, loggedInUser);

export default userRouter;




// {
//   "firstName": "marwa",
//   "lastName": "kassha",
//   "role": "Admin",
//   "email": "marwa@gmail.com",
//   "password": "$2b$10$q.azfeE0N5MfE.A8xUIMl.nTfInSG.0ET/UUORBXGrmPTShLwh9V.",
//   "phoneNumber": 12345,
//   "_id": "65b223c63b96adfd5fd69a01",
//   "createdAt": "2024-01-25T09:03:02.144Z",
//   "updatedAt": "2024-01-25T09:03:02.144Z",
//   "__v": 0
// }