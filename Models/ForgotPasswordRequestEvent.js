/**
 * Created by Navit
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CONFIG = require('../Config');

var forgetPasswordRequestsEvent = new Schema({
    eventID: {type: Schema.ObjectId, ref: 'eventmanager'},
    userType: {
        type: String,
        enum: [
            CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.EVENT_MANAGER
        ],
        required: true
    },
    isChanged: {type: Boolean, default: false},
    requestedAt: {type: Date},
    changedAt: {type: Date}
});

module.exports = mongoose.model('forgetPasswordRequestsEvent', forgetPasswordRequestsEvent);