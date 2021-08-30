import React, { Component } from 'react';
import { ReactDOM } from 'react-dom';
import twitterAuth from './twitter-auth';
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
    <React.StrictMode>
        <twitterAuth />
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();