/**
 * This file will help talk to the mongo service to persist the data.
 * @type {*}
 */
var mongodb = require('mongodb');
var init = function () {
    if (process.env.VCAP_SERVICES) {
        var env = JSON.parse(process.env.VCAP_SERVICES);
        var mongo = env['mongodb-1.8'][0]['credentials'];
    }
    else {
        var mongo = {
            "hostname":"localhost",
            "port":27017,
            "username":"",
            "password":"",
            "name":"",
            "db":"af2012"
        }
    }

    var generate_mongo_url = function (obj) {
        obj.hostname = (obj.hostname || 'localhost');
        obj.port = (obj.port || 27017);
        obj.db = (obj.db || 'test');

        if (obj.username && obj.password) {
            return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
        }
        else {
            return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
        }
    };

    return generate_mongo_url(mongo);
};


var config = {
    collectionName:'sites'
};
/**
 * Tries to create a new entry in the db.
 * @param json The json obj to write the entry to.
 */
var createNew = function (json, cb) {
    /* Connect to the DB and auth */
    mongodb.connect(init(), function (err, conn) {
        if (err) {
            writeError(res);
        }
        conn.collection(config.collectionName, function (err, coll) {
            /* Note the _id will be created */
            coll.insert(json, {safe:true}, function (err) {
                cb(json);
            });
        });
    });
};

var findAndDisplay = function (id, res) {
    mongodb.connect(init(), function (err, conn) {
        conn.collection(config.collectionName, function (err, coll) {

            var BSON = mongodb.BSONPure;
            var o_id = new BSON.ObjectID(id.body);

            coll.find({'_id':o_id}, {}, function (err, cursor) {
                cursor.toArray(function (err, items) {
                    res.writeHead(200, {'Content-Type':'text/plain'});
                    res.write(items[0].text + "\n");
                    res.end();
                });
            });
        });
    });
};

module.exports.createNew = createNew;
module.exports.findAndDisplay = findAndDisplay;

