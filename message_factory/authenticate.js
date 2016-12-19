var request = require('request');
var auth0api = process.env.AUTH0_API || require('../auth0-secret').auth0api;

var getUserFromDB = function(psid, cb) {
    request({
        url: 'https://app60017704.eu.auth0.com/api/v2/users',
        headers: {
            Authorization: 'Bearer ' + auth0api
        },
        qs: {
            search_engine: 'v2',
            q: 'psid:"' + psid + '"',
        }
    }, function(error, response, body) {
        if (error) {
            return cb(error)
        } else if (JSON.parse(body).length === 0) {
            return cb(null, false)
        } else {
            return cb(null, JSON.parse(body)[0].email)
        }
    })
}

module.exports = getUserFromDB
