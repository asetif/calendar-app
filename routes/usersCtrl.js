//imports
var bcrypt = require('bcryptjs');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');
//constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/*const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;*/

//Routes
module.exports = {
    register: function (req, res) {
        // params
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var login = req.body.login;
        var password = req.body.password;
        var cost = req.body.cost;
        var isAdmin = req.body.isAdmin;
        var hasCompletedTutorial = req.body.hasCompletedTutorial;


        if (firstName == null || lastName == null || login == null || password == null || cost == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (!EMAIL_REGEX.test(login)){
            return res.status(400).json({ 'error' : 'email is not valid'});
        }
        /*if (!PASSWORD_REGEX.test(password)){
            return res.status(400).json({ 'error' : 'password invalid (must length 4 - 8 and include 1 number atleast)'});
        }*/

        models.User.findOne({
            attributes: ['login'],
            where: { login: login }
        })

            .then(function (userFound) {
                if (!userFound) {

                    bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                        models.User.create({
                            firstName: firstName,
                            lastName: lastName,
                            login: login,
                            password: bcryptedPassword,
                            cost: cost,
                            isAdmin: isAdmin,
                            hasCompletedTutorial: hasCompletedTutorial
                        })
                            .then(function (newUser) {
                                return res.status(201).json({
                                    'userId': newUser.id
                                })
                            })
                            .catch(function (err) {

                                return res.status(500).json({ 'error': 'cannot add user' });
                            });
                    });

                } else {
                    return res.status(409).json({ 'error': 'user already exist' });
                }
            })
            .catch(function (err) {
                return res.status(500).json({ 'error': 'unable to verify user' })
            });
    },

    login: function (req, res) {
        console.log(req)
        // params
        var login = req.body.login;
        console.log(JSON.stringify(req.body))
        var password = req.body.password;
        console.log(password)


        if (login == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }
        models.User.findOne({
            where: { login: login }
        })
            .then(function (userFound) {
                if (userFound) {

                    bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                        if (resBycrypt) {
                            return res.status(200).json({
                                'userId': userFound.id,
                                'token': jwtUtils.generateTokenForUser(userFound)
                            });
                        } else {
                            return res.status(403).json({ 'error': 'invalid password' });
                        }
                    });
                } else {
                    return res.status(404).json({ ' error': 'not exist in DB' });
                }
            })
            .catch(function (err) {
                return res.status(500).json({ 'error': 'unable to verify user' });
            });
    },

    getUserprofile: function (req, res) {
        //getting auth header
        var headerAuth = req.headers['authorization'];
        if (!headerAuth)
            res.status(404).json({ 'error': ' token not found' })
        var userId = jwtUtils.getUserId(headerAuth.split(" ")[1]);
        if (userId < 0)

            return res.status(400).json({ 'error': 'wrong token' });

        models.User.findOne({
            attributes: ['id', 'firstName', 'lastName', 'login', 'cost', 'isAdmin'],
            where: { id: userId }
        }).then(function (user) {
            if (user) {
                return res.status(201).json(user);
            } else {
                return res.status(404).json({ 'error': 'user not found' });
            }
        }).catch(function (err) {

            return res.status(500).json({ 'erro': 'cannot fetch user' });
        });
    },
    updateUserProfile: function (req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        //params
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var login = req.body.login;
        var password = req.body.password;
        var cost = req.body.cost;
        var isAdmin = req.body.isAdmin;
        var hasCompletedTutorial = req.body.hasCompletedTutorial;

        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['id', 'firstName', 'lastName', 'login'],
                    where: { id: userId }
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        console.log(err)
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },

            function (userFound, done) {
                if (userFound) {

                    bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                        userFound.update({
                            firstName: (firstName ? firstName : userFound.firstName),
                            lastName: (lastName ? lastName : userFound.lastName),
                            login: (login ? login : userFound.login),
                            password: (bcryptedPassword ? bcryptedPassword : userFound.bcryptedPassword),
                            cost: (cost ? cost : userFound.cost),
                            isAdmin: (isAdmin ? isAdmin : userFound.isAdmin),
                            hasCompletedTutorial: (hasCompletedTutorial ? hasCompletedTutorial : userFound.hasCompletedTutorial)

                        })
                            .then(function (newUser) {
                                return res.status(201).json({
                                    'userId': newUser.id, firstName, lastName, login, cost, isAdmin, hasCompletedTutorial,
                                });

                            }).catch(function (err) {
                                res.status(500).json({ 'error': 'cannot update user' });
                            });
                    });

                } else {

                    res.status(404).json({ 'error': 'user not found' });
                }
            },

        ], function (userFound) {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': 'cannot update user profile' });
            }
        });
    },

    deleteUserProfile: function (req, res) {
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);
        //params
        var id = req.body.id
        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    where: { id: id }
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },

            function (userFound) {
                if (userFound) {
                    models.User.destroy({
                        where: { id: id }

                    }).then(function (userFound) {
                        if (!userFound);
                        res.status(201).json('user was removed')

                    }).catch(function (err) {
                        console.log(err)
                        res.status(500).json({ 'error': 'cannot remove user' });
                    });

                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ]);

    },
}

