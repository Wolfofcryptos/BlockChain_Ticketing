/**
 * Created by Navit
 */
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var Controller = require('../../Controllers');
var Joi = require('joi');
var Config = require('../../Config');

var createEvent = {
    method: 'POST',
    path: '/api/eventmanager/createEvent',
    handler: function (request, reply) {
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        var payloadData = request.payload;
        Controller.EventBaseController.createEvent(userData,payloadData, function (err, data) {
            if (err) {
                reply(UniversalFunctions.sendError(err));
            } else {
                reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(201)
            }
        });
    },
    config: {
        auth: 'UserAuth',
        description: 'Create Event for event manager',
        tags: ['api', 'eventmanager'],
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            payload: {
                event_name: Joi.string().required(),
                description: Joi.string().required(),
                venue: Joi.string().required(),
                numberOfTickets: Joi.number().required(),
                priceOfTicket: Joi.number().required(),
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

var getEvent = {
    method: 'GET',
    path: '/api/eventmanager/getEvent',
    config: {
        description: 'get event for event manager',
        auth: 'UserAuth',
        tags: ['api', 'eventmanager'],
        handler: function (request, reply) {
            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
            if (userData && userData.id) {
                Controller.EventBaseController.getEvent(userData, function (error, success) {
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

var getBoughtTickets = {
    method: 'GET',
    path: '/api/eventmanager/getBoughtTickets',
    config: {
        description: 'get bought tickets for event',
        auth: 'UserAuth',
        tags: ['api', 'eventmanager'],
        handler: function (request, reply) {
            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
            var payloadData = request.query;
            if (userData && userData.id) {
                Controller.EventBaseController.getBoughtTickets(userData,payloadData, function (error, success) {
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
            query:{
                eventId: Joi.string().required()
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

var getAvailableTickets = {
    method: 'GET',
    path: '/api/eventmanager/getAvailableTickets',
    config: {
        description: 'get available tickets for event',
        auth: 'UserAuth',
        tags: ['api', 'eventmanager'],
        handler: function (request, reply) {
            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
            var payloadData = request.query;
            if (userData && userData.id) {
                Controller.EventBaseController.getAvailableTickets(userData,payloadData, function (error, success) {
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
            query:{
                eventId: Joi.string().required()
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

var getUserEvent = {
    method: 'GET',
    path: '/api/user/getUserEvent',
    config: {
        description: 'get event for user',
        auth: 'UserAuth',
        tags: ['api', 'user'],
        handler: function (request, reply) {
            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
            console.log(">>>>>>",userData);
            if (userData && userData.id) {
                Controller.EventBaseController.getUserEvent(userData, function (error, success) {
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

var buyTicket = {
    method: 'POST',
    path: '/api/user/buyTicket',
    handler: function (request, reply) {
        var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
        var payloadData = request.payload;
        Controller.EventBaseController.buyTicket(userData,payloadData, function (err, data) {
            if (err) {
                reply(UniversalFunctions.sendError(err));
            } else {
                reply(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.CREATED, data)).code(201)
            }
        });
    },
    config: {
        auth: 'UserAuth',
        description: 'buy event tickets',
        tags: ['api', 'user'],
        validate: {
            headers: UniversalFunctions.authorizationHeaderObj,
            payload: {
                eventId: Joi.string().required()
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

var userBoughtTickets = {
    method: 'GET',
    path: '/api/user/userBoughtTickets',
    config: {
        description: 'get bought tickets for user',
        auth: 'UserAuth',
        tags: ['api', 'user'],
        handler: function (request, reply) {
            var userData = request.auth && request.auth.credentials && request.auth.credentials.userData || null;
            if (userData && userData.id) {
                Controller.EventBaseController.userBoughtTickets(userData, function (error, success) {
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
}


var EventManagerEventRoute =
    [
        createEvent,
        getEvent,
        getBoughtTickets,
        getAvailableTickets,
        getUserEvent,
        buyTicket,
        userBoughtTickets
    ]
module.exports = EventManagerEventRoute;