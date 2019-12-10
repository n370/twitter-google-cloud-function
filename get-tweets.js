var qs = require('querystring');
var axios = require('axios');
var consumerKey = qs.escape(process.env.API_KEY);
var consumerSecret = qs.escape(process.env.API_SECRET_KEY);
var bearerCredentials = Buffer.from(consumerKey + ':' + consumerSecret, 'utf8').toString('base64');

module.exports = function(req, res) {
  axios({
    method: 'post',
    url: 'https://api.twitter.com/oauth2/token',
    headers: {
      'Authorization': 'Basic ' + bearerCredentials,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    data: qs.stringify({ 'grant_type': 'client_credentials' })
  })
  .then(function (response) {
    return axios({
      method: 'get',
      url: 'https://api.twitter.com/1.1/search/tweets.json?q=from:n370n370',
      headers: {
        'Authorization': 'Bearer ' + response.data.access_token
      }
    });
  })
  .then(function (response) {
    res.status(200).json(response.data);
  })
  .catch(function (error) {
    res.status(error.response.status).json(error);
  });
};
