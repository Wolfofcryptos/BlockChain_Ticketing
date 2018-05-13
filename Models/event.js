/**
 * Created by Navit
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CONFIG = require('../Config');

var event = new Schema({
    event_name: {type: String, trim: true, required: true},
    description: {type: String, trim: true},
    venue: {type: String, trim: true},
    numberOfTickets: {type: Number, trim: true},
    ticketsSold : {type: Number, trim: true, default: 0},
    priceOfTicket: {type: Number, trim: true},
    creationDate: {type: Date, default: Date.now},
    eventStatus: {
        type: String,
        enum: [
            CONFIG.APP_CONSTANTS.DATABASE.EVENT_STATUS.AVAILABLE,
            CONFIG.APP_CONSTANTS.DATABASE.EVENT_STATUS.FULL
        ],
        required: true,
        default: CONFIG.APP_CONSTANTS.DATABASE.EVENT_STATUS.AVAILABLE
    },
    eventManagerID: {type: Schema.ObjectId, ref: 'eventmanager'}
});

module.exports = mongoose.model('event', event);