import axios from 'axios';
import { useState, useEffect } from 'react';
import queryString from 'query-string';

const apiPath = process.env.React_APP_SERVERLESS ? '/.url' : '/api';

function twitterAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState();
  const [imageUrl, setImageUrl] = useState();
  const [status, setStatus] = useState();
  const [url, setUrl] = useState();

  const login = () => {
    (async () => {
      try {
        const response = await axios({
          url: `${apiPath}/twitter/oauth/request_token`,
          method: 'POST'
        });
        const { oauth_token } = response.data;
        window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauth_token}`;
      } catch (error) {
        console.error(error);
      }
    })();
  };

  const logout = () => {
      (async () => {
          try {
              await axios({
                  url: `${apiPath}/twitter/logout`,
                  method: 'POST'
              });
              setIsLoggedIn(false);
          } catch (error) {
              console.error(error)
          }
      })();
  }
  useEffect(() => {
      (async() => {
          const {oauth_token, oauth_verifier} = queryString.parse(window.location.search);

          if (oauth_token && oauth_verifier) {
              try {
                  await axios ({
                      url: `${apiPath}/twitter/oauth/access_token`,
                      method: 'POST',
                      data:{oauth_token, oauth_verifier}
                    });
              } catch (error) {
                  console.error(error)
              }
          }

          try {
              const {data: {name, profile_image_url_https, status, entities}} = await axios({
                  url: `${apiPath}/twitter/users/profile_banner`,
                  method: 'GET'
              });

              setIsLoggedIn(true);
              setName(name);
              setImageUrl(profile_image_url_https);
              setStatus(status.text);
              setUrl(entities.url.urls[0].expanded_url);
          } catch (error) {
              console.error(error);
          }
      })();
  }, []);

  return (
      <section className='twitterAuth'>
          <img src={logo} className='twitter-logo' alt='twitter-logo' />
          {!isLoggedIn &&
            <img className='signin-btn' onClick={login} alt='Twitter login' src='https://assets.klaudsol.com/twitter.png'/>
          }

          { isLoggedIn &&
          <div>
            <div>
                <img alt='Profile' src={imageUrl}/>
            </div>
            <div>Name: {name}</div>
            <div>URL: {url}</div>
            <div>Status: {status}</div>
            <button className='signout' alt='signout'></button>
          </div>
          }

      </section>      
  );
}

export default twitterAuth;