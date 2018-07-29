/**
 * Created by Navit
 */
//
'use strict';

var Models = require('../Models');


var updateEventManager = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.EventManager.findOneAndUpdate(criteria, dataToSet, options, callback);
};
//Insert User in DB
var createEventManager = function (objToSave, callback) {
    new Models.EventManager(objToSave).save(callback)
};
//Delete User in DB
var deleteEventManager = function (criteria, callback) {
    Models.EventManager.findOneAndRemove(criteria, callback);
};

//Get Users from DB
var getEventManager = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.EventManager.find(criteria, projection, options, callback);
};

var getAllGeneratedCodes = function (callback) {
    var criteria = {
        OTPCode : {$ne : null}
    };
    var projection = {
        OTPCode : 1
    };
    var options = {
        lean : true
    };
    Models.EventManager.find(criteria,projection,options, function (err, dataAry) {
        if (err){
            callback(err)
        }else {
            var generatedCodes = [];
            if (dataAry && dataAry.length > 0){
                dataAry.forEach(function (obj) {
                    generatedCodes.push(obj.OTPCode.toString())
                });
            }
            callback(null,generatedCodes);
        }
    })
};

module.exports = {
    updateEventManager: updateEventManager,
    createEventManager: createEventManager,
    deleteEventManager: deleteEventManager,
    getEventManager:getEventManager,
    getAllGeneratedCodes:getAllGeneratedCodes
};