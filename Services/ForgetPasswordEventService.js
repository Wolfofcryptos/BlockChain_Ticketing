/**
 * Created by Navit
 */
//
var Models = require('../Models');

var getForgetPasswordRequest = function (conditions, projection, options, callback ) {
    Models.ForgetPasswordEvent.find(conditions, projection, options, callback );
};
var updateForgetPasswordRequest = function(criteria, dataToSet, options, callback) {
    Models.ForgetPasswordEvent.findOneAndUpdate(criteria, dataToSet, options, callback);

};

var createForgetPasswordRequest = function (data, callback) {
    var forgotPasswordEntry = new Models.ForgetPasswordEvent(data);
    forgotPasswordEntry.save( function (err, result) {
        callback(err, result);
    })
}
module.exports = {
    getForgetPasswordRequest : getForgetPasswordRequest,
    updateForgetPasswordRequest : updateForgetPasswordRequest,
    createForgetPasswordRequest : createForgetPasswordRequest
}