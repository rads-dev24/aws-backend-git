const yargs = require("yargs");
const {hideBin} = require("yargs/helpers");
const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");  // capital S, not server
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const {initRepo} = require("./controllers/init.js");
const {addRepo} = require("./controllers/add.js");
const { commitRepo } = require("./controllers/commit.js");
const { pullRepo } = require("./controllers/pull.js");
const { pushRepo } = require("./controllers/push.js");
const { revertRepo } = require("./controllers/revert.js");
const {loveRepo} = require("./controllers/love.js");
const mainRouter = require("./routes/main.router.js");

yargs(hideBin(process.argv))
 .command("start", "Start Server ",{}, startServer)
 .command("love <file>", "who i love",(yargs) => {
    yargs.positional("file", {
        describe : "Msg to be added ",
        type : "string"
    });
 }, 
(argv) => { loveRepo(argv.file);})
 .command('init' , "Init a new repository" , {} , initRepo)
 .command("add <file>" , "Add a file to the repository" , 
    (yargs)  => {
        yargs.positional("file",{
            describe : "Fiile to add to staging area",
            type : "string"
        });
    },
     (argv) => { addRepo(argv.file);

     })
  .command("commit <message>" , "Commit staged files ", 
    (yargs) => {
        yargs.positional("message" ,{
            describe: "Commit Message",
            type: "string",
        });
    },
    (argv) => { commitRepo(argv.message);
     })
 .command('pull' , "Pull a new repository" , {} , pullRepo)
 .command('push' , "Push a new repository" , {} , pushRepo)
 .command("revert <commitId>" , "Revert to a specific commit ", 
    (yargs) => {
        yargs.positional("commitID" ,{
            describe: "Commit Id to revert it ",
            type: "string"
        });
    },
    revertRepo)
 .demandCommand(1, " You need to add atleast one command")
 .help().argv




function startServer(){
    const app = express();
    const port = process.env.PORT || 3000;
    const mongoURI = process.env.MONGODB_URI;

    mongoose.connect( mongoURI)
     .then( ()=> console.log("MongoDB Connected!"))
     .catch((err) => console.log("mONGOdB ERROR", err));
    
    app.use(cors( {origin : "*"}));
    app.use(bodyParser.json())
    app.use(express.json())
    // app.listen(port, () => console.log(`Server running on port ${port}`));
    app.use("/api",mainRouter);

    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin : "*",
            methods : ["GET", "POST"]
        }
    });
    
    io.on( "connection", (socket) => {
        socket.on( "joinRoom", (userID) => {
            user = userID;
            console.log("====");
            console.log(user);
            console.log("===");
            socket.join(userID);
        })
    })

    const db = mongoose.connection;
    db.once("open", async() => {
        console.log("CRUD operations called!");
    })
    
    httpServer.listen(port , () => {
        console.log(`Server listening at port ${port}`);
    })

    console.log("Server Started");
}