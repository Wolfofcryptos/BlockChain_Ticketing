/**
 * Created by Navit
 */
//
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Config = require('../Config');

var eventmanager = new Schema({
    first_name: {type: String, trim: true, required: true},
    last_name: {type: String, trim: true, required: true},
    emailId: {type: String, trim: true, required: true, unique:true},
    accessToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    password: {type: String},
    code:{type: String, trim: true},
    OTPCode: {type: String, trim: true},
    emailVerified: {type: Boolean, default: true},
    approved: {type: Boolean, default: true},
    registrationDate: {type: Date, default: Date.now},
    codeUpdatedAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('eventmanager', eventmanager);