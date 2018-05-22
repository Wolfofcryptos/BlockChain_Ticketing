/**
 * Created by Navit
 */
var Service = require('../../Services');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var async = require('async');
var UploadManager = require('../../Lib/uploadManager');
var TokenManager = require('../../Lib/TokenManager');
var CodeGenerator = require('../../Lib/CodeGenerator');
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require('underscore');

var createEvent = function(userData,payloadData,callback){
    var eventData = null ;
    async.series([
        function (cb) {
            var criteria = {
                _id: userData.id
            }
            Service.EventManagerService.getEventManager(criteria, {}, {}, function (err, data) {
                if (err) cb(err)
                else {
                    if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
                    else {
                        cb()
                    }
                }

            })
        },
        function(cb){
            payloadData.eventManagerID = userData.id;
            Service.EventService.createEvent(payloadData,function(err,data){
                console.log("????????",err,data);
                if(err) cb(err);
                else{
                    eventData = data;
                    cb();
                }
            })
        },
        function(cb){
            var dataToSend = {
                _id: (eventData._id).toString(),
                "numberOfTickets": eventData.numberOfTickets,
                "venue": eventData.venue,
                "price": eventData.priceOfTicket,
                "eventManager": (eventData.eventManagerID).toString(),
                "time": eventData.creationDate
            }
            Service.HyperledgerService.createEvent(dataToSend,function(err,data){
                if(err) cb(err);
                else{
                    console.log(">>>>>>Hyper",data);
                    cb();
                }
            })
        },
        function(cb){
            var dataToSend = {
                "event": (eventData._id).toString(),
                "numberOfTickets": eventData.numberOfTickets,
                "timestamp": eventData.creationDate
            }
            Service.HyperledgerService.createTicket(dataToSend,function(err,data){
                if(err) cb(err);
                else{
                    console.log(">>>>>>Hyper",data);
                    cb();
                }
            })
        }
    ], function (err, user) {
        if (!err) callback(null, {
            eventDetails:eventData
        });
        else callback(err);

    });
}

var getEvent = function (userData,callback) {
    var eventData;
    async.series([
        function (cb) {
            var criteria = {
                _id: userData.id
            }
            Service.EventManagerService.getEventManager(criteria, {}, {}, function (err, data) {
                if (err) cb(err)
                else {
                    if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
                    else {
                        cb()
                    }
                }

            })
        },
        function(cb){
            var query = {
                eventManagerID: userData.id
            };
            var projection = {
                __v:0,
            };
            var options = {lean: true};
            Service.EventService.getEvent(query, projection, options, function (err, data) {
                if (err) {
                    cb(err);
                } else {
                    eventData = data;
                        cb()
                }
            });
        }

    ], function (err, result) {
        if(err) callback(err)
        else callback(null,{eventData:eventData})
    })
}

var getBoughtTickets = function(userData,payloadData,callback){
    var ticketData;
    var finalData;
    async.series([
        function (cb) {
            var criteria = {
                _id: userData.id
            }
            Service.EventManagerService.getEventManager(criteria, {}, {}, function (err, data) {
                if (err) cb(err)
                else {
                    if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
                    else {
                        cb()
                    }
                }

            })
        },
        function(cb){
            var criteria = {
                _id: payloadData.eventId
            }
            Service.EventService.getEvent(criteria,{},{},function(err,data){
                if(err) cb(err);
                else{
                    if(data.length == 0) cb(ERROR.EVENT_NO_FOUND);
                    else cb();
                }
            })
        },
        function(cb){
            var dataToSend = {
                "event": (payloadData.eventId).toString()
            }
            Service.HyperledgerService.getBoughtTickets(dataToSend,function(err,data){
                if(err) cb(err);
                else{
                    console.log(">>>>>>Hyper",data);
                    ticketData = data;
                    cb();
                }
            })
        },
        function(cb){
            if(ticketData.length>0){
                finalData = ticketData;
                cb()
            }
            else{
                finalData = ticketData;
                cb()
            }
        }

    ], function (err, result) {
        if(err) callback(err)
        else callback(null,{tickets:finalData})
    })
}

var getAvailableTickets = function(userData,payloadData,callback){
    var ticketData;
    var finalData;
    async.series([
        function (cb) {
            var criteria = {
                _id: userData.id
            }
            Service.EventManagerService.getEventManager(criteria, {}, {}, function (err, data) {
                if (err) cb(err)
                else {
                    if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
                    else {
                        cb()
                    }
                }

            })
        },
        function(cb){
            var criteria = {
                _id: payloadData.eventId
            }
            Service.EventService.getEvent(criteria,{},{},function(err,data){
                if(err) cb(err);
                else{
                    if(data.length == 0) cb(ERROR.EVENT_NO_FOUND);
                    else cb();
                }
            })
        },
        function(cb){
            var dataToSend = {
                "event": (payloadData.eventId).toString()
            }
            Service.HyperledgerService.getAvailableTickets(dataToSend,function(err,data){
                if(err) cb(err);
                else{
                    console.log(">>>>>>Hyper",data);
                    ticketData = data;
                    cb();
                }
            })
        },
        function(cb){
            if(ticketData.length>0){
                finalData = ticketData;
                cb()
            }
            else{
                finalData = ticketData;
                cb()
            }
        }

    ], function (err, result) {
        if(err) callback(err)
        else callback(null,{tickets:finalData})
    })
}

var getUserEvent = function (userData,callback) {

    console.log("????????",userData);

    var eventData;
    async.series([
        function (cb) {
            var criteria = {
                _id: userData.id
            }
            Service.UserService.getUser(criteria, {}, {}, function (err, data) {
                console.log(data);
                if (err) cb(err)
                else {
                    if (data.length == 0){

                        cb(ERROR.INCORRECT_ACCESSTOKEN)
                    } 
                    else {
                        cb()
                    }
                }

            })
        },
        function(cb){
            var query = {
                
            };
            var projection = {
                __v:0,
            };
            var options = {lean: true};
            Service.EventService.getEvent(query, projection, options, function (err, data) {
                if (err) {
                    cb(err);
                } else {
                    eventData = data;
                    cb();
                }
            });
        }

    ], function (err, result) {
        if(err) callback(err)
        else callback(null,{eventData:eventData})
    })
}

var buyTicket = function(userData,payloadData,callback){
    var eventData;
    var ticketBought;
    async.series([
        function (cb) {
            var criteria = {
                _id: userData.id
            }
            Service.UserService.getUser(criteria, {}, {}, function (err, data) {
                if (err) cb(err)
                else {
                    if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
                    else {
                        cb()
                    }
                }

            })
        },
        function(cb){
            var criteria = {
                _id: payloadData.eventId
            }
            Service.EventService.getEvent(criteria,{},{},function(err,data){
                if(err) cb(err);
                else{
                    if(data.length == 0) cb(ERROR.EVENT_NO_FOUND);
                    else {
                        if(data[0].eventStatus == UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.EVENT_STATUS.FULL){
                            cb(ERROR.EVENT_FULL);
                        }
                        else {
                            eventData = data[0];
                            cb()
                        }
                    };
                }
            })
        },
        function(cb){
            var dataToSend = {
                "event": (payloadData.eventId).toString()
            }
            Service.HyperledgerService.getAvailableTickets(dataToSend,function(err,data){
                if(err) cb(err);
                else{
                    ticketData = data[0];
                    console.log(ticketData);
                    cb();
                }
            })
        },
        function(cb){
            var dataToSend = {
                "ticketId":ticketData.id,
                "tokenId":ticketData.token,
                "price":ticketData.price,
                "event": (payloadData.eventId).toString(),
                "eventManager":(eventData.eventManagerID).toString(),
                "user":(userData.id).toString()
            }
            Service.HyperledgerService.buyTicket(dataToSend,function(err,data){
                if(err) cb(err);
                else{
                    ticketBought = data;
                    //console.log(ticketData);
                    cb();
                }
            })
        },
        function(cb){
            if(eventData.numberOfTickets == eventData.ticketsSold + 1){
                criteria = {
                    _id:eventData._id
                }
                query = {
                    ticketsSold:eventData.numberOfTickets,
                    eventStatus:UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.EVENT_STATUS.FULL
                }
                var options = {lean: true};
                Service.EventService.updateEvent(criteria,query,options,function(err,data){
                    if(err) cb(err);
                    else cb()
                })
            }
            else{
                criteria = {
                    _id:eventData._id
                }
                query = {
                    ticketsSold:eventData.ticketsSold + 1,
                }
                var options = {lean: true};
                Service.EventService.updateEvent(criteria,query,options,function(err,data){
                    if(err) cb(err);
                    else cb()
                })
            }
        }
    ], function (err, user) {
        if (!err) callback(null, {
            ticket:ticketBought
        });
        else callback(err);

    });
}

var userBoughtTickets = function(userData,callback){
    var ticketData;
    var finalData;
    async.series([
        function (cb) {
            var criteria = {
                _id: userData.id
            }
            Service.UserService.getUser(criteria, {}, {}, function (err, data) {
                if (err) cb(err)
                else {
                    if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
                    else {
                        cb()
                    }
                }

            })
        },
        function(cb){
            var dataToSend = {
                "owner": (userData.id).toString()
            }
            Service.HyperledgerService.getUserBoughtTickets(dataToSend,function(err,data){
                if(err) cb(err);
                else{
                    console.log(">>>>>>Hyper",data);
                    ticketData = data;
                    cb();
                }
            })
        },
        function(cb){
            if(ticketData.length>0){
                console.log('!!!!!!!!!!!!!!!', ticketData);
                var taskInParallel = [];
                for (var key in ticketData) {
                    (function (key) {
                        taskInParallel.push((function (key) {
                            return function (embeddedCB) {
                                //TODO
                                var eventparts = (ticketData[key].event).split("#");
                                var eventId = eventparts[1];
                                console.log(">>>>>",eventId);
                                Service.EventService.getEvent({_id:eventId},{},{},function(err,data){
                                    var eventName = data[0].event_name;
                                    ticketData[key].eventName = eventName;
                                    embeddedCB();
                                })
                            }
                        })(key))
                    }(key));
                }
                async.parallel(taskInParallel, function (err, result) {
                    finalData = ticketData;
                    cb();
                });
                
            }
            else{
                finalData = ticketData;
                cb()
            }
        }

    ], function (err, result) {
        if(err) callback(err)
        else callback(null,{tickets:finalData})
    })
}

var getAllEvent = function (callback) {
    async.series([
        
        function(cb){
            var query = {
                
            };
            var projection = {
                __v:0,
            };
            var options = {lean: true};
            Service.EventService.getEvent(query, projection, options, function (err, data) {
                if (err) {
                    cb(err);
                } else {
                    eventData = data;
                    cb();
                }
            });
        }

    ], function (err, result) {
        if(err) callback(err)
        else callback(null,{eventData:eventData})
    })
}

module.exports = {
    createEvent:createEvent,
    getEvent:getEvent,
    getBoughtTickets:getBoughtTickets,
    getUserEvent:getUserEvent,
    buyTicket:buyTicket,
    getAvailableTickets:getAvailableTickets,
    userBoughtTickets:userBoughtTickets,
    getAllEvent:getAllEvent
};