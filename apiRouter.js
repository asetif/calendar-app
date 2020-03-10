// imports
var express = require('express');
var usersCtrl = require('./routes/usersCtrl');
var missionsCtrl = require('./routes/missionsCtrl');
//router
exports.router = (function(){
    var apiRouter = express.Router();

//Users routes
apiRouter.route('/users/create').post(usersCtrl.register);
apiRouter.route('/users/login').post(usersCtrl.login);
apiRouter.route('/users/read').get(usersCtrl.getUserprofile);
apiRouter.route('/users/update').put(usersCtrl.updateUserProfile);
apiRouter.route('/users/delete').delete(usersCtrl.deleteUserProfile);
// Missions routes
apiRouter.route('/missions/new').post(missionsCtrl.createMission);
apiRouter.route('/missions').get(missionsCtrl.readMission);
return apiRouter;
})();