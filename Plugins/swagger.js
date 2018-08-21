'use strict';
/**
 * Created by Navit
 */
//

//Register Swagger
var pack = require('../package'),
    swaggerOptions = {
        apiVersion: pack.version,
        pathPrefixSize: 2,
        basePath: 'http://127.0.0.1:8000',
    };

exports.register = function(server, options, next){

    server.register({
        register: require('hapi-swagger'),
        options: swaggerOptions
    }, function (err) {
        if (err) {
            server.log(['error'], 'hapi-swagger load error: ' + err)
        }else{
            server.log(['start'], 'hapi-swagger interface loaded')
        }
    });

    next();
};

exports.register.attributes = {
    name: 'swagger-plugin'
};
