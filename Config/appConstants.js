/**
 * Created by Navit
 */

'use strict';

var SERVER = {
    APP_NAME: 'BlockChain_Ticketing',
    PORTS: {
        HAPI: 8000
        //HAPI: 3000
    },
    TOKEN_EXPIRATION_IN_MINUTES: 600,
    JWT_SECRET_KEY: 'sUPerSeCuREKeY&^$^&$^%$^%7782348723t4872t34Ends',
    COUNTRY_CODE : '+91',
    THUMB_WIDTH : 50,
    THUMB_HEIGHT : 50,
    DOMAIN_NAME : 'http://localhost:8000/'
};

var SOCIAL = {
    FACEBOOK:"FACEBOOK"
};
var swaggerDefaultResponseMessages = [
    {code: 200, message: 'OK'},
    {code: 400, message: 'Bad Request'},
    {code: 401, message: 'Unauthorized'},
    {code: 404, message: 'Data Not Found'},
    {code: 500, message: 'Internal Server Error'}
];
var DATABASE = {
    DEVICE_TYPES:{
        ANDROID:"ANDROID",
        IOS:"IOS"
    },
    USER_ROLES:{
        USER:"USER"
    }
};

var STATUS_MSG = {
    ERROR: {
        DEFAULT: {
            statusCode:400,
            customMessage : 'Error',
            type : 'DEFAULT'
        },
        IMP_ERROR: {
            statusCode:500,
            customMessage : 'Implementation Error',
            type : 'IMP_ERROR'
        },
        UNIQUE_CODE_LIMIT_REACHED: {
            statusCode:400,
            customMessage : 'Cannot Generate Unique Code, All combinations are used',
            type : 'UNIQUE_CODE_LIMIT_REACHED'
        },
        INVALID_TOKEN: {
            statusCode:401,
            customMessage : 'Invalid token provided',
            type : 'INVALID_TOKEN'
        },
        INCORRECT_ACCESSTOKEN: {
            statusCode:403,
            customMessage : 'Incorrect AccessToken',
            type : 'INCORRECT_ACCESSTOKEN'
        }
    },
    SUCCESS: {
        DEFAULT: {
            statusCode: 200,
            customMessage: 'Success',
            type: 'DEFAULT'
        }
    }
};

var notificationMessages = {

};

var TIME_UNITS = {
    MONTHS: 'months',
    HOURS: 'hours',
    MINUTES: 'minutes',
    SECONDS: 'seconds',
    WEEKS: 'weeks',
    DAYS: 'days'
};

var APP_CONSTANTS = {
    SERVER: SERVER,
    SOCIAL:SOCIAL,
    //EMAIL: EMAIL,
    TIME_UNITS: TIME_UNITS,
    DATABASE: DATABASE,
    swaggerDefaultResponseMessages: swaggerDefaultResponseMessages,
    STATUS_MSG: STATUS_MSG,
    notificationMessages:notificationMessages
    //NOTIFICATION: NOTIFICATION,
    //PAYMENT_GATEWAY: PAYMENT_GATEWAY
};

module.exports = APP_CONSTANTS;