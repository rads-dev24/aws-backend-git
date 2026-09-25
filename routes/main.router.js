const express = require("express");
const mainRouter = express.Router();
const userRouter = require("./user.router.js");
const repoRouter = require("./repo.router.js");
const issueRouter = require("./issue.router.js");

mainRouter.use("/user",userRouter);
mainRouter.use("/repo", repoRouter);
mainRouter.use("/issue", issueRouter);

mainRouter.get("/" , (req, res ) => {
        res.send( "Server at home page !");
})


module.exports = mainRouter;