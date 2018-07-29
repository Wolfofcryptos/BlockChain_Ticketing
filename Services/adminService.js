/**
 * Created by Navit
 */
//
'use strict';

var Models = require('../Models');


var updateAdmin = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.Admin.findOneAndUpdate(criteria, dataToSet, options, callback);
};
//Insert User in DB
var createAdmin = function (objToSave, callback) {
    new Models.Admin(objToSave).save(callback)
};
//Delete User in DB
var deleteAdmin = function (criteria, callback) {
    Models.Admin.findOneAndRemove(criteria, callback);
};

//Get Users from DB
var getAdmin = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Admin.find(criteria, projection, options, callback);
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
    Models.Admin.find(criteria,projection,options, function (err, dataAry) {
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
    updateAdmin: updateAdmin,
    createAdmin: createAdmin,
    deleteAdmin: deleteAdmin,
    getAdmin:getAdmin,
    getAllGeneratedCodes:getAllGeneratedCodes
};