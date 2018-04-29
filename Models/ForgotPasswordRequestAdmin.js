/**
 * Created by Navit
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CONFIG = require('../Config');

var forgetPasswordRequestsAdmin = new Schema({
    eventID: {type: Schema.ObjectId, ref: 'admin'},
    userType: {
        type: String,
        enum: [
            CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN
        ],
        required: true
    },
    isChanged: {type: Boolean, default: false},
    requestedAt: {type: Date},
    changedAt: {type: Date}
});

module.exports = mongoose.model('forgetPasswordRequestsAdmin', forgetPasswordRequestsAdmin);