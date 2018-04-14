/**
 * Created by Navit
 */

 'use strict';

var mongo = {
    //URI: process.env.MONGO_URI || 'mongodb://localhost/BlockChain_Ticketing',
    URI: process.env.MONGO_URI || 'mongodb://localhost/BlockChain_Ticketing_Dev',
    //URI: process.env.MONGO_URI || "mongodb://"+process.env.MONGO_USER+":"+process.env.MONGO_PASS+"@localhost/"+process.env.MONGO_DBNAME_DEV,
    port: 27017
};

module.exports = {
    mongo: mongo
};



