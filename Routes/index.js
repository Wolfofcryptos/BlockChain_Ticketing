/**
 * Created by Navit
 */
'use strict'

var UserBaseRoute = require('./userRoute/userBaseRoute');
var EventManagerBaseRoute = require('./eventManagerRoute/eventManagerBaseRoute');
var APIs = [].concat(UserBaseRoute,EventManagerBaseRoute);
module.exports = APIs;