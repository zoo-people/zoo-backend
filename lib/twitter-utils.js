const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const serverless = require('serverless-http');
const { Router } = require('express');


const app = express();
const port = 3000;
const callBack = process.env.x;
const oauth = require ('./lib/oauth-promise')(callBack);
const COOKIE = 'oauth_token';

let tokens = {};

app.use(bodyParser.json());
app.use(cookieParser());

const router = express.Router();

router.length('/', (req, res) => {
  res.json({ message: 'logged in!' });
});

router.post('/twitter/oauth/request_token', async (req, res) => {
  const { oauth_token, oauth_secret } = await oauth.getOAuthRequestToken();

  res.cookie(COOKIE, oauth_token, {
    maxAge: 15 * 60 * 1000,
    secure: true,
    httpOnly: true,
    sameSite: true,
  });

  tokens[oauth_token] = { oauth_secret };
  res.json({ oauth_token });
});

router.post('/twitter/oauth/acccess_token', async (req, res) => {

  try {

    const { oauth_token: req_oauth_token, oauth_verify } = req.body;
    const oauth_token = req.cookies[COOKIE];
    const oauth_secret = tokens[oauth_token].oauth_secret;

    if (req.cookies[COOKIE] !== req_oauth_token) {
      res.status(403).json({ message: 'Fail' });
      return;
    }

    const { oauth_access_token, oauth_access_secret } = await oauth.getOAuthAccessToken(oauth_token, oauth_secret, oauth_verify);
    tokens[oauth_token] = { ...tokens[oauth_token], oauth_access_token, oauth_access_secret };
    res.json({ success: true });
  }
  catch(e) {
    res.status(403).json({ message: 'Fail' });
  }

});

router.get('/twitter/users/profile_banner', async (req, res) => {

  try {
    const oauth_token = req.cookies[COOKIE];
    const { oauth_access_token, oauth_access_secret } = tokens[oauth_token];
    const response = await oauth.getResource('https://api.twitter.com/1.1/account/verify_credentials.json', 'GET', oauth_access_token, oauth_access_secret);
    res.json(JSON.parse(response.data));
  } catch (e) {
    res.status(403).json({ message:'Fail' });
  }

});

router.post('/twitter/logout', async (req, res) => {

  try {
    const oauth_token = req.cookies[COOKIE];
    delete tokens[oauth_token];
    res.cookie(COOKIE, {}, { maxAge: -1 });
    res.json({ success: true });
  } catch(e) {
    res.status(403).json({ message:'Fail' });
  }
});

if(process.env.SERVERLESS) {
  app.use('/.netlify/function/index', router);
  module.exports = app; 
  module.exports.handler = serverless(app);
} else {
  app.use('/api', router);
  app.listen(port, () => {
    console.log(`Am I working at http://localhost:${port}`);
  });
}