/**
 * Created by Navit
 */
//
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CONFIG = require('../Config');

var forgetPasswordRequests = new Schema({
    customerID: {type: Schema.ObjectId, ref: 'user'},
    userType: {
        type: String,
        enum: [
            CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER
        ],
        required: true
    },
    isChanged: {type: Boolean, default: false},
    requestedAt: {type: Date},
    changedAt: {type: Date}
});

module.exports = mongoose.model('forgetPasswordRequests', forgetPasswordRequests);