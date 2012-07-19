/**
 * This app uses a screen scraper to scrape the happy birthday right from appfog.
 * This app also uses mongo and rabbitmq services also from appfog! (brownie points right???)
 * Finally, this app is written using VI.
 */
var scraper = require('./scraper.js');
var express = require('express');
var mongo = require('./mongodb.js');
var rabbitmq = require("./rabbitmq.js");
var app = express.createServer().listen(process.env.VMC_APP_PORT || 1337, null);

app.get('/', function (req, res) {
    //scrapes the contest entry page for the term. (Happy Birthday OpenStack)
    scraper.scrape('http://openstack.appfog.com/', function (output) {
        //save the result to mongodb
        mongo.createNew({text:output}, function (jsonObj) {
            console.log("Inserted into mongo.");

            //now we set up rabbitmq to display message on receive.
            rabbitmq.onReceive(function (id) {
                //retrieve the message from mongo and display it!
                mongo.findAndDisplay(id, res);
            });

            //we send our id to the queue
            rabbitmq.publish(jsonObj._id);
        });
    });
});

app.get('/src', function (req, res) {
    var fs = require("fs");
    var files = ['app.js', 'scraper.js', 'rabbitmq.js', 'mongodb.js'];

    res.writeHead(200, {'Content-Type':'text/plain'});

    for (var i in files) {
        if (files[i].split('.')[1] === 'js') {
            console.log(files[i]);
            var fileName = files[i];
            var content = fs.readFileSync(fileName, 'utf-8');
            res.write("Filename: " + fileName + "\n");
            res.write(content);
        }
    }
    res.end();
});

