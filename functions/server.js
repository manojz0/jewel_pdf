const express = require('express');
const serverless = require('serverless-http');

const puppeteer = require('puppeteer');

const app = express();

app.get('/.netlify/functions/server', (req, res) => {
  res.send('Hello, World!');
});


app.get('/generate-pdf', (req, res) => {
  res.send('generate-pdf, Hello, World!');
});

module.exports.handler = serverless(app);
