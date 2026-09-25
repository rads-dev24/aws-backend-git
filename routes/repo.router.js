const express = require("express");
const repoRouter = express.Router();
const repoController = require("../controllers/repoController.js");


repoRouter.post('/create',repoController.createNewRepo);
repoRouter.get('/all',repoController.getAllRepo);
repoRouter.get('/user/:userId',repoController.fetchRepoForCurrentUser);
repoRouter.get('/:id',repoController.fetchRepoById);
repoRouter.get('/name/:name',repoController.fetchRepoByName);
repoRouter.put('/update/:id',repoController.updateRepoById);
repoRouter.delete('/delete/:id',repoController.deleteRepoById);
repoRouter.patch('/toggle/:id',repoController.toggleVisibilityById);
repoRouter.post('/update/star',repoController.starRepo );



module.exports = repoRouter;