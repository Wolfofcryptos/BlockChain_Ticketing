/**
 * Created by Navit
 */
var Service = require('../../Services');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var async = require('async');
var UploadManager = require('../../Lib/uploadManager');
var TokenManager = require('../../Lib/TokenManager');
var CodeGenerator = require('../../Lib/CodeGenerator');
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
var _ = require('underscore');

var createEventManager = function (payloadData,callback) {
    console.log('payload:', payloadData);
    var accessToken = null;
    var uniqueCode = null;
    var dataToSave = payloadData;
    console.log('payload Data:', payloadData);
    if (dataToSave.password)
        dataToSave.password = UniversalFunctions.CryptData(dataToSave.password);
    var eventManagerData = null;
    var dataToUpdate = {};
    async.series([
        function (cb) {
                var query = {
                    $or: [{emailId: payloadData.emailId}]
                };
                Service.EventManagerService.getEventManager(query, {}, {lean: true}, function (error, data) {
                    if (error) {
                        cb(error);
                    } else {
                        if (data && data.length > 0) {
                            if (data[0].emailVerified == true) {
                                cb(ERROR.EVENT_MANAGER_ALREADY_REGISTERED)
                            }
                            else {
                                Service.EventManagerService.deleteEventManager({_id: data[0]._id}, function (err, updatedData) {
                                    if (err) cb(err)
                                    else cb(null);
                                })
                            }
                        } else {
                            cb(null);
                        }
                    }
                });

        },
        function (cb) {
            //Validate for facebookId and password
            if (!dataToSave.password) {
                cb(ERROR.PASSWORD_REQUIRED);
            } else {
                cb();
            }
        },
        function (cb) {
            CodeGenerator.generateUniqueCode(6, UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.EVENT_MANAGER, function (err, numberObj) {
                if (err) {
                    cb(err);
                } else {
                    if (!numberObj || numberObj.number == null) {
                        cb(ERROR.UNIQUE_CODE_LIMIT_REACHED);
                    } else {
                        uniqueCode = numberObj.number;
                        cb();
                    }
                }
            })
        },
        function (cb) {
            //Insert Into DB
            dataToSave.OTPCode = uniqueCode;
            dataToSave.registrationDate = new Date().toISOString();
            Service.EventManagerService.createEventManager(dataToSave, function (err, eventManagerDataFromDB) {
                console.log('hello', err, eventManagerDataFromDB)
                if (err) {
                    if (err.code == 11000 && err.message.indexOf('emailId_1') > -1) {
                        cb(ERROR.EMAIL_EXIST);

                    }
                    else {
                        cb(err)
                    }
                } else {
                    eventManagerData = eventManagerDataFromDB;
                    cb();
                }
            })
        },
        // function (cb) {
        //     //Send Mail to User
        //     if (customerData) {
        //         NotificationManager.sendSMSToUser(uniqueCode, dataToSave.countryCode, dataToSave.mobileNo, function (err, data) {
        //             cb();
        //         })
        //     } else {
        //         cb(ERROR.IMP_ERROR)
        //     }
        //
        // },
        function (cb) {
            //Set Access Token
            if (eventManagerData) {
                var tokenData = {
                    id: eventManagerData._id,
                    type: UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.EVENT_MANAGER
                };
                TokenManager.setToken(tokenData, function (err, output) {
                    if (err) {
                        cb(err);
                    } else {
                        accessToken = output && output.accessToken || null;
                        cb();
                    }
                })
            } else {
                cb(ERROR.IMP_ERROR)
            }
        },
    ], function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                accessToken: accessToken,
                otpCode:eventManagerData.OTPCode,
                userDetails: UniversalFunctions.deleteUnnecessaryUserData(eventManagerData)
            });
        }
    });
};

var verifyOTP = function (userData,payloadData,callback) {
    var customerData;
    async.series([
        function(cb){
            var query = {
                _id: userData.id
            };
            var options = {lean: true};
            Service.EventManagerService.getEventManager(query, {}, options, function (err, data) {
                if (err) {
                    cb(err);
                } else {
                    if(data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
                    else {
                        customerData = data && data[0] || null;
                        cb()
                    }
                }
            });
        },
        function (cb) {
            //Check verification code :
            if (payloadData.OTPCode == customerData.OTPCode) {
                cb();
            } else {
                cb(ERROR.INVALID_CODE)
            }
        },
        function (cb) {
            //trying to update customer
            var criteria = {
                _id: userData.id,
                OTPCode: payloadData.OTPCode
            };
            var setQuery = {
                $set: {emailVerified: true},
                $unset: {OTPCode: 1}
            };
            var options = {new: true};
            console.log('updating>>>', criteria, setQuery, options)
            Service.EventManagerService.updateEventManager(criteria, setQuery, options, function (err, updatedData) {
                console.log('verify otp callback result', err, updatedData)
                if (err) {
                    cb(err)
                } else {
                    if (!updatedData) {
                        cb(ERROR.INVALID_CODE)
                    } else {
                        cb();
                    }
                }
            });
        }
    ], function (err, result) {
        if (err) {
            callback(err)
        } else {
            callback();
        }

    });
}

var loginManager = function (payloadData,callback) {
    var userFound = false;
    var accessToken = null;
    var successLogin = false;
    var updatedUserDetails = null;
    async.series([
        function (cb) {
            var criteria = {
                emailId: payloadData.emailId
            };
            var option = {
                lean: true
            };
            Service.EventManagerService.getEventManager(criteria, {}, option, function (err, result) {
                if (err) {
                    cb(err)
                } else {
                    userFound = result && result[0] || null;
                    cb();
                }
            });

        },
        function (cb) {
            //validations
            if (!userFound) {
                cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.USER_NOT_FOUND);
            } else {
                if (userFound && userFound.password != UniversalFunctions.CryptData(payloadData.password)) {
                    cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INCORRECT_PASSWORD);
                } else if (userFound.emailVerified == false) {

                    cb(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.EMAIL_VERIFICATION);

                }
                else {
                    successLogin = true;
                    cb();
                }
            }
        },
        function(cb){
            var criteria = {
                emailId: payloadData.emailId

            };
            var projection = {
                _id:1,
                first_name:1,
                last_name:1,
                emailId:1,
                emailVerified:1,
                approved:1
            };
            var option = {
                lean: true
            };
            Service.EventManagerService.getEventManager(criteria,  projection , option, function (err, result) {
                if (err) {
                    cb(err)
                } else {
                    userFound = result && result[0] || null;
                    cb();
                }
            });
        },
        function (cb) {
            if (successLogin) {
                var tokenData = {
                    id: userFound._id,
                    type: UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.EVENT_MANAGER,
                };
                TokenManager.setToken(tokenData, function (err, output) {
                    if (err) {
                        cb(err);
                    } else {
                        if (output && output.accessToken) {
                            accessToken = output && output.accessToken;
                            cb();
                        } else {
                            cb(ERROR.IMP_ERROR)
                        }
                    }
                })
            } else {
                cb(ERROR.IMP_ERROR)
            }

        },
    ], function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                accessToken: accessToken,
                userDetails: UniversalFunctions.deleteUnnecessaryUserData(userFound)
            });
        }
    });
};

var resendOTP = function (userData,callback) {
    /*
     Create a Unique 6 digit code
     Insert It Into Event Manager DB
     Send the 6 digit code via Email
     Send Back Response
     */
    var uniqueCode = null;
    var customerData;
    async.series([
        function(cb){
            var query = {
                _id: userData.id
            };
            var options = {lean: true};
            Service.EventManagerService.getEventManager(query, {}, options, function (err, data) {
                if (err) {
                    cb(err);
                } else {
                    if(data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
                    else {
                        customerData = data && data[0] || null;
                        if (customerData.emailVerified == true) {
                            cb(ERROR.EMAIL_VERIFICATION_COMPLETE);
                        } else {
                            cb();
                        }
                    }
                }
            });
        },
        function (cb) {
            CodeGenerator.generateUniqueCode(6, UniversalFunctions.CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.EVENT_MANAGER, function (err, numberObj) {
                if (err) {
                    cb(err);
                } else {
                    if (!numberObj || numberObj.number == null) {
                        cb(ERROR.UNIQUE_CODE_LIMIT_REACHED);
                    } else {
                        uniqueCode = numberObj.number;
                        cb();
                    }
                }
            })
        },
        function (cb) {
            var criteria = {
                _id: userData.id
            };
            var setQuery = {
                $set: {
                    OTPCode: uniqueCode,
                    codeUpdatedAt: new Date().toISOString()
                }
            };
            var options = {
                lean: true
            };
            Service.EventManagerService.updateEventManager(criteria, setQuery, options, cb);
        }
    ], function (err, result) {
        callback(err, {OTPCode: uniqueCode});
    })
};

var getOTP = function (payloadData,callback) {
    var query = {
        emailId: payloadData.emailId
    };
    var projection = {
        _id:0,
        OTPCode:1
    };
    var options = {lean: true};
    Service.EventManagerService.getEventManager(query, projection, options, function (err, data) {
        if (err) {
            callback(err);
        } else {
            var customerData = data && data[0] || null;
            console.log("customerData-------->>>" + JSON.stringify(customerData))
            if (customerData == null||customerData.OTPCode==undefined) {
                callback(ERROR.OTP_CODE_NOT_FOUND);
            } else {
                callback(null, customerData);
            }
        }
    });
};

var accessTokenLogin = function (userData,callback) {
    var userdata = {};
    var userFound=null;
    async.series([
        function (cb) {
            var criteria = {
                _id: userData.id
            }
            Service.EventManagerService.getEventManager(criteria, {}, {}, function (err, data) {
                if (err) cb(err)
                else {
                    if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN)
                    else {
                        cb()
                    }
                }

            })
        },
        function(cb){
            var criteria = {
                _id:  userData.id,

            };
            var projection = {
                _id:1,
                first_name:1,
                last_name:1,
                emailId:1,
                emailVerified:1,
                accessToken:1,
                approved:1
            };
            var option = {
                lean: true
            };
            Service.EventManagerService.getEventManager(criteria,  projection , option, function (err, result) {
                if (err) {
                    cb(err)
                } else {
                    userFound = result && result[0] || null;
                    cb();
                }
            });
        }], function (err, user) {
        if (!err) callback(null, {
            accessToken: userFound.accessToken,
            userDetails: UniversalFunctions.deleteUnnecessaryUserData(userFound)
        });
        else callback(err);

    });
}

module.exports = {
    createEventManager:createEventManager,
    verifyOTP:verifyOTP,
    loginManager:loginManager,
    resendOTP:resendOTP,
    getOTP:getOTP,
    accessTokenLogin:accessTokenLogin
};