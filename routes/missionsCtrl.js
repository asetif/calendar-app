var express = require('express');
var missionsCtrl = require('./routes/missionsCtrl');

exports.router = (function(){
    var apiRouter = express.Router();

    apiRouter.route('/missions')
        .get(missionsCtrl.list_all_missions)
        .post(missionsCtrl.create_a_missions);

    apiRouter.route('/tasks/:taskId')
        .get(missionsCtrl.read_a_missions)
        .put(missionsCtrl.update_a_missions)
        .delete(missionsCtrl.delete_a_missions);
});

var newMission = {
    mission: InputDeviceInfo.value,
    date: new Date()
}