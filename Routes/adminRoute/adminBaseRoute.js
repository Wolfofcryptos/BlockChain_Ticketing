/**
 * Created by Navit
 */
//
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var Controller = require('../../Controllers');
var Joi = require('joi');
var Config = require('../../Config');

var adminRegister = {
    method: 'POST',
    path: '/api/admin/register',
    handler: function (request, reply) {
        var payloadData = request.payload;
        if(!UniversalFunctions.verifyEmailFormat(payloadData.emailId)){
            reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
        }
        else{
            Controller.AdminBaseController.createAdmin(payloadData, function (err, data) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(201)
                }
            });
        }
    },
    config: {
        description: 'Register a new Admin',
        tags: ['api', 'admin'],
        validate: {
            payload: {
                first_name: Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
                last_name: Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
                emailId: Joi.string().required(),
                password: Joi.string().required().min(5).trim(),
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
}

var login = {
    method: 'POST',
    path: '/api/admin/login',
    handler: function (request, reply) {
        var payloadData = request.payload;
        if(!UniversalFunctions.verifyEmailFormat(payloadData.emailId)){
            reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
        }
        else{
            Controller.AdminBaseController.loginUser(payloadData, function (err, data) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(null, data))
                }
            });
        }
    },
    config: {
        description: 'Login Via Password For User',
        tags: ['api', 'admin'],
        validate: {
            payload: {
                emailId: Joi.string().required(),
                password: Joi.string().required().min(5).trim()
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};

var accessTokenLogin =
{
    /* *****************access token login****************** */
    method: 'POST',
    path: '/api/admin/accessTokenLogin',
    handler: function (request, reply) {
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        Controller.AdminBaseController.accessTokenLogin(userData, function (err, data) {
            console.log('%%%%%%%%%%%%%%%', err, data)
            if (!err) {
                return reply(UniversalFunctions.sendSuccess(null, data));
            }
            else {
                return reply(UniversalFunctions.sendError(err));
            }
        });
    },
    config: {
        description: 'access token login',
        tags: ['api', 'admin'],
        auth: 'UserAuth',
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }

}

var logoutCustomer = {
    method: 'PUT',
    path: '/api/admin/logout',
    config: {
        description: 'Logout admin',
        auth: 'UserAuth',
        tags: ['api', 'admin'],
        handler: function (request, reply) {
            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
                 Controller.AdminBaseController.logoutCustomer(userData, function (err, data) {
                    if (err) {
                        reply(UniversalFunctions.sendError(err));
                    } else {
                        reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.LOGOUT));
                    }
                });

        },
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }

    }
};

var getProfile = {
    method: 'GET',
    path: '/api/admin/getProfile',
    config: {
        description: 'get profile of admin',
        auth: 'UserAuth',
        tags: ['api', 'admin'],
        handler: function (request, reply) {
            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
            if (userData && userData.id) {
                Controller.AdminBaseController.getProfile(userData, function (error, success) {
                    if (error) {
                        reply(UniversalFunctions.sendError(error));
                    } else {
                        reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
                    }
                });
            } else {
                reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN));
            }
        },
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};

var changePassword =
{
    method: 'POST',
    path: '/api/admin/changePassword',
    handler: function (request, reply) {
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        Controller.AdminBaseController.changePassword(userData,request.payload, function (err, user) {
            if (!err) {
                return reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.PASSWORD_RESET, user));
            }
            else {
                return reply(UniversalFunctions.sendError(err));
            }
        });
    },
    config: {
        description: 'change Password',
        tags: ['api', 'admin'],
        auth: 'UserAuth',
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            payload: {
                oldPassword: Joi.string().required().min(4),
                newPassword: Joi.string().required().min(4)
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
}

var forgotPassword = {
    method: 'POST',
    path: '/api/admin/forgotPassword',
    config: {
        description: 'forgot password',
        tags: ['api', 'admin'],
        handler: function (request, reply) {
            var payloadData = request.payload;
            if(!UniversalFunctions.verifyEmailFormat(payloadData.emailId)){
                reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
            }
            else{
                Controller.AdminBaseController.forgetPassword(request.payload, function (error, success) {
                    if (error) {
                        reply(UniversalFunctions.sendError(error));
                    } else {
                        reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFY_SENT, success));
                    }
                });
            }
        },
        validate: {
            payload: {
                emailId: Joi.string().required()
            },
            failAction:  UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages:  UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }

    }
};

var resetPassword = {

    method: 'POST',
    path: '/api/admin/resetPassword',
    config: {
        description: 'reset password',
        tags: ['api', 'admin'],
        handler: function (request, reply) {
            var payloadData = request.payload;
            if(!UniversalFunctions.verifyEmailFormat(payloadData.emailId)){
                reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
            }
            else{
                Controller.AdminBaseController.resetPassword(request.payload, function (error, success) {
                    if (error) {
                        reply(UniversalFunctions.sendError(error));
                    } else {
                        reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.PASSWORD_RESET, success));
                    }
                });
            }
        },
        validate: {
            payload: {
                password: Joi.string().min(6).required().trim(),
                emailId: Joi.string().required(),
                OTPCode : Joi.string().required()
            },
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }

    }
};

var getAllUsers = {
    method: 'GET',
    path: '/api/admin/getAllUsers',
    config: {
        description: 'get all users for admin',
        auth: 'UserAuth',
        tags: ['api', 'admin'],
        handler: function (request, reply) {
            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
            if (userData && userData.id) {
                Controller.AdminBaseController.getAllUsers(userData, function (error, success) {
                    if (error) {
                        reply(UniversalFunctions.sendError(error));
                    } else {
                        reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
                    }
                });
            } else {
                reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN));
            }
        },
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};

var getEventManagers = {
    method: 'GET',
    path: '/api/admin/getEventManagers',
    config: {
        description: 'get all event managers for admin',
        auth: 'UserAuth',
        tags: ['api', 'admin'],
        handler: function (request, reply) {
            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
            if (userData && userData.id) {
                Controller.AdminBaseController.getEventManagers(userData, function (error, success) {
                    if (error) {
                        reply(UniversalFunctions.sendError(error));
                    } else {
                        reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
                    }
                });
            } else {
                reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN));
            }
        },
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction
        },
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};


var AdminBaseRoute =
    [
        adminRegister,
        login,
        accessTokenLogin,
        logoutCustomer,
        getProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        getAllUsers,
        getEventManagers
    ]
module.exports = AdminBaseRoute;