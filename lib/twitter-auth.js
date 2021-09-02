// const { response } = require('./app');

module.exports = (callBack) => {

  const TWITTER_KEY = process.env.TWITTER_KEY;
  const TWITTER_SECRET = process.env.TWITTER_SECRET;
  const _oauth = new (require('oauth').OAuth)(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    TWITTER_KEY,
    TWITTER_SECRET,
    '1.0',
    callBack,
    'HMAC-SHA1'
  );

  const oauth = {
    getOAuthRequestToken: () => {
      return new Promise((res, rej) => {
        _oauth.getOAuthRequestToken((error, oauth_token, oauth_token_secret, results) => {
          if(error) {
            rej(error);
          } else {
            res({ oauth_token, oauth_token_secret, results });
          }
        });
      });
    },

    getOAuthAccessToken: (oauth_token, oauth_token_secret, oauth_verifier) => {
      return new Promise((res, rej) => {
        _oauth.getOAuthAccessToken(oauth_token, oauth_token_secret, oauth_verifier, (error, oauth_access_token, oauth_acess_token_secret, results) => {
          if(error) {
            rej(error);
          } else {
            res({ oauth_access_token, oauth_acess_token_secret, results });
          }
        });
      });
    },

    getResources: (url, method, oauth_access_token, oauth_acess_token_secret) => {
      return new Promise((res, rej) => {
        _oauth.getResources(url, method, oauth_access_token, oauth_acess_token_secret, (error, data, response) => {
          if(error) { rej(error);
          } else {
            res({ data, response });
          }
        });
      });
    }
  };

  return oauth;
};