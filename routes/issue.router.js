const express = require("express");
const issueRouter = express.Router();
const issueController = require( "../controllers/issueController.js");


issueRouter.post("/create", issueController.createIssue);
issueRouter.get("/all", issueController.getAllIssues);
issueRouter.get("/:id", issueController.getIssueById);
issueRouter.put("/update/:id", issueController.updateIssueById);
issueRouter.delete("/delete/:id", issueController.deleteIssueById);


module.exports = issueRouter;