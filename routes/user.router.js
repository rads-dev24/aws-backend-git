const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController.js");

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/login", userController.login);
userRouter.post("/signup", userController.SignUp);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);
userRouter.put("/starRepo/:id", userController.updateStarRepo);

module.exports = userRouter;