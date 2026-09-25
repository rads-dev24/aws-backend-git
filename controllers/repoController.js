const mongoose = require("mongoose");
const Repository = require("../models/repoModel.js");
const User = require("../models/userModel.js");
const Issue = require("../models/issueModel.js");

const createNewRepo = async(req, res) => {
    const { owner, name, description, content, visibility, issues} = req.body;

    try{
        if(!name){
            return res.status(400).json({error : "Requires repo Name! "});
        }

        if(!mongoose.Types.ObjectId.isValid(owner)){
            return res.status(400).json({error : "Requires User ID! "});
        }

        const newRepo = new Repository({
            name,
            description,
            content,
            visibility,
            owner,
            issues
        });

        const result = await newRepo.save();

        await User.findByIdAndUpdate(
            owner,
            { $push: { repositories: result._id } }
        );
        return res.status(201).json({message : "Repo created!",repositoryID : result._id});

    }catch(err){
        console.error("Error during creating new Repo :", err.message);
        res.status(500).send("Server error");
    }
}

const getAllRepo = async(req, res) => {

    try{
        const result = await Repository.find({})
        .populate("owner")
        .populate("issues");
        //populate is used if we want mongoose.Types.ObjectId MODEL all info instead of just id 

        res.status(200).json({repos : result});

    }catch(err){
        console.error("Error during fetching all Repo:", err.message);
        res.status(500).send("Server error");
    }

}

const fetchRepoById = async(req, res) => {
    const repoId = req.params.id;
    
    try{
        const result =  await Repository.find({ _id : repoId})
        .populate("owner")
        .populate("issues")

        res.json(result);
    }catch(err){
        console.error("Error during fetching  by Id:", err.message);
        res.status(500).send({ message: "Server error" });
    }
}

const fetchRepoByName = async(req, res) => {
    const repoName = req.params.name;
    
    try{
        const result =  await Repository.find({ name : repoName})
        .populate("owner")
        .populate("issues")

        res.json(result);
    }catch(err){
        console.error("Error during fetching by Name :", err.message);
        res.status(500).send({ message: "Server error" });
    }
}

const fetchRepoForCurrentUser = async(req, res) => {
    const userId = req.params.userId;
    try{
        const repo =  await Repository.find({ owner : userId});
        if( repo.length == 0 || !repo ){
            return res.status(200).json({error : "No Repo yet!",repo : []});
        }

        return res.json({ message :"Repos Found!", repo : repo});
    }catch(err){
        console.error("Error during fetching repo of currentUser:", err.message);
        res.status(500).send({ message: "Server error" });
    }
}

const updateRepoById = async(req, res) => {
    const {id} =  req.params;
    const {content, description} = req.body;

    try{
        const repo = await Repository.findById(id);
        if(!repo){
            return res.status(404).json({error : "Repo not found!"});
        }

        repo.content.push(content);
        repo.description = description;
        
        const updatedRepo = await repo.save();
        return res.json({ message :"Repo Updated!", repo : updatedRepo});

    }catch(err){
        console.error("Error during updating repo of currentUser:", err.message);
        res.status(500).send("Server error");
    }
}

const deleteRepoById = async(req, res) => {
    const {id} =  req.params;

    try{
        const repo = await Repository.findById(id);
        if(!repo ){
            return res.status(404).json({error : "Repo not found!"});
        }

        await User.findByIdAndUpdate(
            repo.owner,{
            $pull : {repositories : id}
        })
        
        await Repository.findByIdAndDelete(id);
        return res.json({ message :"Repo deleted succesfully!"});

    }catch(err){
        console.error("Error during fetching deleting repo:", err.message);
        res.status(500).send("Server error");
    }
}
const toggleVisibilityById = async(req, res) => {
    const {id} =  req.params;

    try{
        const repo = await Repository.findById(id);
        if(!repo ){
            return res.status(404).json({error : "Repo not found!"});
        }

        repo.visibility = !repo.visibility ;
        const updatedRepo = await repo.save();
        return res.json({ message :"Repo toggled visibilty!", repo : updatedRepo});

    }catch(err){
        console.error("Error during fetching epo of currentUser:", err.message);
        res.status(500).send("Server error");
    }
}

const starRepo = async(req,res) => {
    const { repoId, userId } = req.body;

    try {

        const user = await User.findById(userId);
        if(!user){
            return res.status(200).json({ message: "User not Found!" });
        }
        const repo = await Repository.findById(repoId);
        if(!repo){
            return res.status(200).json({ message: "Repo not Found!" });
        }

        const alreadyStarred = user.starRepo
            .map( id => id.toString())
            .includes(repoId.toString());
        
        if(alreadyStarred){
            await User.findByIdAndUpdate(
                userId,
                {
                    $pull : { starRepo : repoId}
                }
            )
            return res.status(200).json({ message: "Repo unstarred!" });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { starRepo: repoId } },
            { new: true }
        );

        
        return res.status(200).json({ message: "Repo starred !" });

    } catch (err) {
        console.error("Error starring repo:", err.message);
        res.status(500).json({ message: "Server error" });
    }



}

module.exports = {createNewRepo, toggleVisibilityById,  deleteRepoById,updateRepoById, 
    fetchRepoForCurrentUser,  fetchRepoByName, 
    fetchRepoById, getAllRepo,starRepo
}