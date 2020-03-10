//imports
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');
//routes
module.exports = {
    createMission : function(req, res){
        //console.log('req ===',req.body)
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        //console.log('userId : ',userId);
    // params
    var name = req.body.name;
    var code = req.body.code;
    var technologie = req.body.technologie;
    var startDate = req.body.startDate;

    if(name == null || code == null || technologie == null){
        return res.status(400).json({ 'error': 'missing parameters'});
        }
        asyncLib.waterfall([
            function(done){
                models.User.findOne({
                    where : { id : userId}
                })
                .then(function(userFound){
                    //console.log(userFound)
                    done(null, userFound);
                })   
                .catch(function(err){
                    //console.log(err)
                    res.status(500).json({ 'error' : 'unable to verify user'});
                });
            },
            function(userFound, done){
                if(userFound){
                    //console.log('userFound ===== ', userFound)
                    models.Mission.create({
                        name,
                        code,
                        technologie,
                        startDate,
                        userId : userFound.id
                    })
                .then(function(newMission){
                    //console.log('newMission ===',newMission)
                    done(newMission);
                });
                }else{
                    res.status(404).json({ 'error' : 'user not found'});
                }
            },
        ],  function(newMission){
                if(newMission){
                    return res.status(201).json(newMission);
                }else{
                    return res.status(500).json({ 'error' : 'cannot creat mission '})
                }
        })
    },
   readMission : function(req, res){
        var fields = req.query.fields;
        var limit = parseInt(req.query.limit);
        var offset = parseInt(req.query.offset);
        var order = req.query.order;
        
        models.Mission.findAll({
            order : [(order != null) ? order.split(':') : ['name', 'ASC']],
            attributes : (fields != '*' && fields != null) ? fields.split(',') : null,
            limit : limit || null,
            offset : offset || null,
            include : [{
                model : models.User,
                attributes : [ 'firstName', 'lastName' ]
            }]
        }).then(function(missions){
            if(missions){
                res.status(200).json(missions);
            }else(
                res.status(4054).json({ 'error' : 'not found a mission'})
            )
        }).catch(function(err){
            //console.log(err);
            res.status(500).json({ "error" : "invalide fields"});
        });
    }
}