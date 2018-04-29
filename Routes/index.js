/**
 * Created by Navit
 */
'use strict'

var UserBaseRoute = require('./userRoute/userBaseRoute');
var EventManagerBaseRoute = require('./eventManagerRoute/eventManagerBaseRoute');
var AdminBaseRoute = require('./adminRoute/adminBaseRoute');
var APIs = [].concat(UserBaseRoute,EventManagerBaseRoute,AdminBaseRoute);
module.exports = APIs;