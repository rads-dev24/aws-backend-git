const jwt = require("jsonwebtoken");
const {MongoClient} =  require("mongodb");
var ObjectId = require('mongodb').ObjectId;
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGODB_URI;
let client;

async function connectClient(){
    if(!client){
        client = new MongoClient(uri);
    }
    await client.connect();
}


const login = async(req, res) =>{
    const {email, password } = req.body;

    try{
        await connectClient();
        const db = client.db("githubclone");
        const userscollection = db.collection("users");

        const user  = await userscollection.findOne({email});
        if(!user){
            return res.status(400).json({message : "Invalid Credentials!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message : "Invalid Credentials!"});
        }

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET_KEY, {expiresIn:"1h"});
        
        res.status(200).json({message :"User Login!", token, userId: user._id});

    }catch(err){
        console.error("Error during signup :", err);
        res.status(500).send("Server error");
    }
}

const SignUp = async(req, res) =>{
    const {username, password, email} = req.body;

    try{
        await connectClient();
        const db = client.db("githubclone");
        const userscollection = db.collection("users");

        const user  = await userscollection.findOne({username});
        if(user){
            return res.status(400).json({message : "User Already exists!"});
        }

        const salt = await  bcrypt.genSalt(10);
        const hashedPswd = await bcrypt.hash(password, salt);

        const newuser = {
            username : username,
            password : hashedPswd,
            email : email,
            repositories : [],
            followedUsers :[],
            starRepo : []
        }

        const result = await userscollection.insertOne(newuser);

        const token = jwt.sign({id: result.insertedId},process.env.JWT_SECRET_KEY, {expiresIn:"1h"});
        res.json({token,userId : result.insertedId});
        
    }catch(err){
        console.error("Error during signup :", err);
        res.status(500).send("Server error");
    }
    
}

const getUserProfile = async(req, res) =>{
    const currentid = req.params.id;

    try{
        await connectClient();
        const db = client.db("githubclone");
        const userscollection = db.collection("users");

        const user  = await userscollection.findOne({
            _id : new ObjectId(currentid),
        });
        if(!user){
            return res.status(400).json({message : "User not found!"});
        }

        res.send(user);


    }catch(err){
        console.error("Error during fetching :", err);
        res.status(500).send("Server error");
    }
    
}

const getAllUsers = async(req, res) =>{
    try{
        await connectClient();
        const db = client.db("githubclone");
        const userscollection = db.collection("users");

        const users  = await userscollection.find({}).toArray();  //to convert into json Array
        if(!users){
            return res.status(400).json({message : "No users!"});
        }

        res.json(users);
    }catch(err){
        console.error("Error during fetching :", err);
        res.status(500).send("Server error");
    }
    
}

const updateUserProfile = async(req, res) =>{
    const currentId = req.params.id;
    const {email,password} = req.body;

    try{
        await connectClient();
        const db = client.db("githubclone");
        const usersCollection = db.collection("users");

        let updateFields = {email};
        if (password){
            const salt = await bcrypt.genSalt(10);
            const hashedPswd = await bcrypt.hash(password, salt);
            updateFields.password = hashedPswd;

        }


        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }

        const updatedUser = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(currentId) },
            { $set: updateFields },
            { returnDocument: "after", projection: { password: 0 } }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.json(updatedUser);


    }catch(err){
        console.error("Error during fetching :", err.message);
        res.status(500).send("Server error");
    }
    
    
}

const deleteUserProfile = async(req, res) =>{
    const currentid = req.params.id;

    try{
        await connectClient();
        const db = client.db("githubclone");
        const userscollection = db.collection("users");

        const result  = await userscollection.deleteOne({
            _id : new ObjectId(currentid),
        });
        if(result.deleteCount ==0){
            return res.status(400).json({message : "User not found!"});
        }

        res.json({message : "User Profile deleted!"});


    }catch(err){
        console.error("Error during fetching :", err);
        res.status(500).send("Server error");
    }
}

const updateStarRepo = async(req,res) => {
    res.send("Star Repo updated!");
}


module.exports = {
    getAllUsers,login,SignUp, getUserProfile, updateUserProfile,deleteUserProfile,updateStarRepo };
