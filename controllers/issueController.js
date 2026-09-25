const mongoose = require("mongoose");
const Repository = require("../models/repoModel.js");
const User = require("../models/userModel.js");
const Issue = require("../models/issueModel.js");


const createIssue = async(req,res) => {
    const {title, description} = req.body;
    const {id} = req.params;
    
    try{
        const issue = new Issue({ title, description, repository : id});
        await issue.save();
        return res.status(201).json({message : "Issue created!", issue : issue});


    }catch(err){
        console.error("Error during creating new Issue :", err.message);
        res.status(500).send("Server error");
    }
}

const updateIssueById = async(req,res) => {
    const { title, description, status } = req.body;
    try{
        const {id} = req.params;
        
        const issue = await Issue.findById(id);
        if(!issue){
            return res.status(404).json({message : "Issue not found!"});
        }

        issue.title = title;
        issue.description = description ;
        issue.status = status;
        await issue.save();
        return res.json({message : "Issue updated!", issue: issue});

    }catch(err){
        console.error("Error during deleting Issue :", err.message);
        res.status(500).send("Server error");
    }
}

const deleteIssueById = async(req,res) => {
    const {id} = req.params;
    try{
        
        const issue = await Issue.findByIdAndDelete(id);
        if(!issue){
            return res.status(400).json({message : "Issue not found!"});
        }
        return res.json({message : "Issue deleted!"});

    }catch(err){
        console.error("Error during deleting Issue :", err.message);
        res.status(500).send("Server error");
    }

}

const getAllIssues = async(req,res) => {
    const {id} = req.params; //repoId
    try{
        
        const issues = await Issue.find({ repository : id});
        if(!issues){
            return res.status(400).json({message : "Issues not found!"});
        }
        return res.status(200).json(issues);

    }catch(err){
        console.error("Error during fetching all issues :", err.message);
        res.status(500).send("Server error");
    }

}


const getIssueById = async(req,res) => {

    const {id} = req.params;
    try{
        
        const issue = await Issue.findById(id);
        if(!issue){
            return res.status(400).json({message : "Issue not found!"});
        }
        return res.json(issue);

    }catch(err){
        console.error("Error during fetching issue by Id:", err.message);
        res.status(500).send("Server error");
    }
}




module.exports = {createIssue, updateIssueById, deleteIssueById, getIssueById, getAllIssues };