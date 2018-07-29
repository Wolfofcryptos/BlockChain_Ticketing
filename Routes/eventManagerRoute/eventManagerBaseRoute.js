/**
 * Created by Navit
 */
//
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var Controller = require('../../Controllers');
var Joi = require('joi');
var Config = require('../../Config');

var eventManagerRegister = {
    method: 'POST',
    path: '/api/eventmanager/register',
    handler: function (request, reply) {
        var payloadData = request.payload;
        if(!UniversalFunctions.verifyEmailFormat(payloadData.emailId)){
            reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
        }
        else{
            Controller.EventManagerBaseController.createEventManager(payloadData, function (err, data) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(201)
                }
            });
        }
    },
    config: {
        description: 'Register a new event manager',
        tags: ['api', 'eventmanager'],
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

var verifyOTP =
{
    method: 'PUT',
    path: '/api/eventmanager/verifyOTP',
    handler: function (request, reply) {
        var payloadData = request.payload;
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        Controller.EventManagerBaseController.verifyOTP(userData,payloadData, function (err, data) {
            if (err) {
                reply(UniversalFunctions.sendError(err));
            } else {
                reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFY_COMPLETE, data))
            }
        });
    },
    config: {
        auth: 'UserAuth',
        description: 'Verify OTP for Event Manager',
        tags: ['api', 'eventmanager'],
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            payload: {
                OTPCode: Joi.string().length(6).required()
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

var login = {
    method: 'POST',
    path: '/api/eventmanager/login',
    handler: function (request, reply) {
        var payloadData = request.payload;
        if(!UniversalFunctions.verifyEmailFormat(payloadData.emailId)){
            reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
        }
        else{
            Controller.EventManagerBaseController.loginManager(payloadData, function (err, data) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(null, data))
                }
            });
        }
    },
    config: {
        description: 'Login Via Password For Event Manager',
        tags: ['api', 'eventmanager'],
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

var resendOTP =
{
    method: 'PUT',
    path: '/api/eventmanager/resendOTP',
    handler: function (request, reply) {
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        Controller.EventManagerBaseController.resendOTP(userData, function (err, data) {
            if (err) {
                reply(UniversalFunctions.sendError(err));
            } else {
                reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFY_SENT, data))
            }
        });
    },
    config: {
        auth: 'UserAuth',
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            failAction: UniversalFunctions.failActionFunction
        },
        description: 'Resend OTP for Event Manager',
        tags: ['api', 'eventmanager'],
        plugins: {
            'hapi-swagger': {
                responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
            }
        }
    }
};

var getOTP = {
    method: 'GET',
    path: '/api/getOTP/EventManager',
    config: {
        description: 'get OTP for Event Manager only for Testing use',
        tags: ['api', 'eventmanager'],
        handler: function (request, reply) {
            var userData = request.query;
            Controller.EventManagerBaseController.getOTP(userData, function (error, success) {
                if (error) {
                    reply(UniversalFunctions.sendError(error));
                } else {
                    reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
                }
            });
        },
        validate: {
            query:{
                emailId: Joi.string().required()
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
    path: '/api/eventmanager/accessTokenLogin',
    handler: function (request, reply) {
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        Controller.EventManagerBaseController.accessTokenLogin(userData, function (err, data) {
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
        tags: ['api', 'eventmanager'],
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
    path: '/api/eventmanager/logout',
    config: {
        description: 'Logout Event Manager',
        auth: 'UserAuth',
        tags: ['api', 'eventmanager'],
        handler: function (request, reply) {
            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
                 Controller.EventManagerBaseController.logoutManager(userData, function (err, data) {
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
    path: '/api/eventmanager/getProfile',
    config: {
        description: 'get profile of event manager',
        auth: 'UserAuth',
        tags: ['api', 'eventmanager'],
        handler: function (request, reply) {
            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
            if (userData && userData.id) {
                Controller.EventManagerBaseController.getProfile(userData, function (error, success) {
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
    path: '/api/eventmanager/changePassword',
    handler: function (request, reply) {
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        Controller.EventManagerBaseController.changePassword(userData,request.payload, function (err, user) {
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
        tags: ['api', 'eventmanager'],
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
    path: '/api/eventmanager/forgotPassword',
    config: {
        description: 'forgot password',
        tags: ['api', 'eventmanager'],
        handler: function (request, reply) {
            var payloadData = request.payload;
            if(!UniversalFunctions.verifyEmailFormat(payloadData.emailId)){
                reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
            }
            else{
                Controller.EventManagerBaseController.forgetPassword(request.payload, function (error, success) {
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
    path: '/api/eventmanager/resetPassword',
    config: {
        description: 'reset password',
        tags: ['api', 'eventmanager'],
        handler: function (request, reply) {
            var payloadData = request.payload;
            if(!UniversalFunctions.verifyEmailFormat(payloadData.emailId)){
                reply(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL_FORMAT));
            }
            else{
                Controller.EventManagerBaseController.resetPassword(request.payload, function (error, success) {
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

var EventManagerBaseRoute =
    [
        eventManagerRegister,
        verifyOTP,
        login,
        resendOTP,
        getOTP,
        accessTokenLogin,
        logoutCustomer,
        getProfile,
        changePassword,
        forgotPassword,
        resetPassword
    ]
module.exports = EventManagerBaseRoute;