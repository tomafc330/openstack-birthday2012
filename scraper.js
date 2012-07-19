/**
 * This will go out to the openstack bday page to scrape the data.
 * @type {*}
 */
var nodeio = require('node.io');

/**
 * Scrapes the site and return the return the results in the callback function given.
 * @param cb The callback which should take in a parameter that is the output.
 */
var scrape = function (url, cb) {
    nodeio.start(new nodeio.Job(jobOptions, scrapeJob), [url], function (err, output) {
        console.log('result is: ' + output);
        cb(output);
    }, true);
}

var scrapeJob = {
    input:false,
    run:function () {
        this.getHtml(this.options[0], function (err, $, data, headers) {
            var url = jobOptions[0];
            try {
                this.emit($('#contest-description em').text);
            } catch (err) { //not found
                console.log(err);
                this.emit(err);
            }
        });
    },
    addAbsoluteUrl:function ($, baseUrl) {
    }
}

var jobOptions = {timeout:10};

module.exports.scrape = scrape;

