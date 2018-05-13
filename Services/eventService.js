/**
 * Created by Navit
 */
'use strict';

var Models = require('../Models');


var updateEvent = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.Event.findOneAndUpdate(criteria, dataToSet, options, callback);
};
//Insert User in DB
var createEvent = function (objToSave, callback) {
    new Models.Event(objToSave).save(callback)
};
//Delete User in DB
var deleteEvent = function (criteria, callback) {
    Models.Event.findOneAndRemove(criteria, callback);
};

//Get Users from DB
var getEvent = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Event.find(criteria, projection, options, callback);
};


module.exports = {
    updateEvent: updateEvent,
    createEvent: createEvent,
    deleteEvent: deleteEvent,
    getEvent:getEvent
};