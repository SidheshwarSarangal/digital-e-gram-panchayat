import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import { Provider } from 'react-redux';
import store from '../redux/store';
import App from './App';
import { Toaster } from 'react-hot-toast';

import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Correct usage of window.crypto
const randomValues = window.crypto.getRandomValues(new Uint8Array(10));
console.log(randomValues);


import stream from 'stream-browserify';
global.stream = stream;

import util from 'util';
global.util = util;

import process from 'process';
global.process = process; // Explicitly assign `process` to the global object

import dotenv from 'dotenv';
dotenv.config();
console.log("index",process.env)


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Toaster />
    <App />
  </Provider>
);