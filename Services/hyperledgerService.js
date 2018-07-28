/**
 * Created by Navit
 */
'use strict';

var Models = require('../Models');
var request = require('request');

var createAdmin = function(details,callback){
    var data_to_send = {
        "$class": "org.deakin.ticketing.app.Admin",
        "id": details._id,
        "name": details.name,
        "email": details.emailId
        }
        request({
            url: 'http://13.211.104.116:3000/api/Admin', //URL to hit
            method: 'POST',
            form: data_to_send //Set the body as a string
        }, function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                body = JSON.parse(body);
                console.log('Response >>>>>>>>', body);
                callback(null,body)
            }
        });

}

var createEventManager = function(details,callback){
    var data_to_send = {
        "$class": "org.deakin.ticketing.app.EventManager",
        "id": details._id,
        "name": details.name,
        "email": details.emailId
        }
        request({
            url: 'http://13.211.104.116:3000/api/EventManager', //URL to hit
            method: 'POST',
            form: data_to_send //Set the body as a string
        }, function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                body = JSON.parse(body);
                console.log('Response >>>>>>>>', body);
                callback(null,body)
            }
        });

}
var createAtendee = function(details,callback){
    var data_to_send = {
        "$class": "org.deakin.ticketing.app.Attendee",
        "id": details._id,
        "name": details.name,
        "email": details.emailId
        }
        request({
            url: 'http://13.211.104.116:3000/api/Attendee', //URL to hit
            method: 'POST',
            form: data_to_send //Set the body as a string
        }, function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                body = JSON.parse(body);
                console.log('Response >>>>>>>>', body);
                callback(null,body)
            }
        });

}

var createEvent = function(details,callback){
    var data_to_send = {
        "$class": "org.deakin.ticketing.app.EEvent",
        "id": details._id,
        "numberOfTickets": details.numberOfTickets,
        "venue": details.venue,
        "price": details.price,
        "time": details.time,
        "eventManager": "resource:org.deakin.ticketing.app.EventManager#"+details.eventManager
        }
        console.log(">>>>>>>>",data_to_send);
        request({
            url: 'http://13.211.104.116:3000/api/EEvent', //URL to hit
            method: 'POST',
            form: data_to_send //Set the body as a string
        }, function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                body = JSON.parse(body);
                console.log('Response >>>>>>>>', body);
                callback(null,body)
            }
        });

}

var createTicket = function(details,callback){
    var data_to_send = {
        "$class": "org.deakin.ticketing.app.CreateTickets",
        "numberOfTickets": details.numberOfTickets,
        "event": "resource:org.deakin.ticketing.app.EEvent#"+details.event,
        "timestamp": details.timestamp
      }
        request({
            url: 'http://13.211.104.116:3000/api/CreateTickets', //URL to hit
            method: 'POST',
            form: data_to_send //Set the body as a string
        }, function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                body = JSON.parse(body);
                console.log('Response >>>>>>>>', body);
                callback(null,body)
            }
        });

}

var getBoughtTickets = function(details,callback){
    var data_to_send = {
        "where":{
            "event": "resource:org.deakin.ticketing.app.EEvent#"+details.event,
            "state": "BOUGHT"
        }
    }
    
    var query = 'http://13.211.104.116:3000/api/Ticket'
    request({
        url: query ,
        qs:{filter:data_to_send}, //URL to hit
        method: 'GET'
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            body = JSON.parse(body);
            console.log('Response >>>>>>>>', body);
            callback(null,body)
        }
    });
}

var getAvailableTickets = function(details,callback){
    var data_to_send = {
        "where":{
            "event": "resource:org.deakin.ticketing.app.EEvent#"+details.event,
            "state": "NEW"
        }
    }
    
    var query = 'http://13.211.104.116:3000/api/Ticket'
    request({
        url: query ,
        qs:{filter:data_to_send}, //URL to hit
        method: 'GET'
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            body = JSON.parse(body);
            console.log('Response >>>>>>>>', body);
            callback(null,body)
        }
    });
}

var buyTicket = function(details,callback){
    var data_to_send = {
        "$class": "org.deakin.ticketing.app.BuyTicket",
        "ticket": {
          "$class": "org.deakin.ticketing.app.Ticket",
          "id": details.ticketId,
          "token": details.tokenId,
          "message": "Event Ticket Bought",
          "price": details.price,
          "event": "resource:org.deakin.ticketing.app.EEvent#"+details.event,
          "state": "UP_FOR_SALE",
          "owner": "resource:org.deakin.ticketing.app.EventManager#"+details.eventManager
        },
        "buyer": "org.deakin.ticketing.app.Attendee#"+details.user,
        "timestamp": "2018-05-11T10:49:49.539Z"
      }
        request({
            url: 'http://13.211.104.116:3000/api/BuyTicket', //URL to hit
            method: 'POST',
            form: data_to_send //Set the body as a string
        }, function(error, response, body){
            if(error) {
                console.log(error);
            } else {
                body = JSON.parse(body);
                console.log('Response >>>>>>>>', body);
                callback(null,body)
            }
        });

}

var getUserBoughtTickets = function(details,callback){
    var data_to_send = {
        "where":{
            "owner": "resource:org.deakin.ticketing.app.Attendee#"+details.owner,
            "state": "BOUGHT"
        }
    }
    
    var query = 'http://13.211.104.116:3000/api/Ticket'
    request({
        url: query ,
        qs:{filter:data_to_send}, //URL to hit
        method: 'GET'
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            body = JSON.parse(body);
            console.log('Response >>>>>>>>', body);
            callback(null,body)
        }
    });
}

module.exports = {
    createAdmin:createAdmin,
    createEventManager:createEventManager,
    createAtendee:createAtendee,
    createEvent:createEvent,
    createTicket:createTicket,
    getBoughtTickets:getBoughtTickets,
    buyTicket:buyTicket,
    getAvailableTickets:getAvailableTickets,
    getUserBoughtTickets:getUserBoughtTickets
};