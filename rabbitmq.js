/**
 * This file helps with subscribing and publishing to the rabbitmq service.
 * @type {*}
 */
var amqp = require('amqp');

function rabbitUrl() {
    if (process.env.VCAP_SERVICES) {
        conf = JSON.parse(process.env.VCAP_SERVICES);
        return conf['rabbitmq-2.4'][0].credentials.url;
    }
    else {
        return "amqp://guest:7788911331@localhost";
    }
}

var config = {
    exchangeName:'af.job',
    queueName:'birthdayDisplayJob',
    bound:false //whether thie queue that is listen to is init() already.
};

/**
 * Creates the exchange.
 */
function onReceive(cb) {
    var conn = createConnection();
    conn.on('ready', function () {
        conn.exchange(config.exchangeName, {}, function (exchange) {
            console.log("Starting to listen on queue...");
            conn.queue(config.queueName, {durable:true, exclusive:true},
                function (q) {
                    config.bound = true;
                    q.bind(config.exchangeName, '#'); //subscribe to all messages.
                    q.subscribe(function (msg) {
                        console.log(msg);
                        cb(msg);
                        conn.end(); //don't want to hold on to connection
                    });
                });
        });
    });
}

function publish(msg, conn) {
    if (conn === undefined) {
        conn = createConnection();
    }
    conn.on('ready', function () {
        console.log("Sending message...");
        conn.publish(config.queueName, {body:msg});
    });
}

function createConnection() {
    return amqp.createConnection({url:rabbitUrl()}, {defaultExchangeName:config.exchangeName});
}

module.exports.onReceive = onReceive;
module.exports.publish = publish;


