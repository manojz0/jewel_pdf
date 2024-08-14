const express = require('express');
const serverless = require('serverless-http');

const puppeteer = require('puppeteer');

const app = express();

app.get('/.netlify/functions/server', (req, res) => {
  res.send('Hello, World!');
});


app.post('/generate-pdf', async (req, res) => {
  const { htmlContent } = req.body;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    res.set('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports.handler = serverless(app);
