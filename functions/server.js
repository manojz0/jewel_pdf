const express = require('express');
const serverless = require('serverless-http');

const puppeteer = require('puppeteer');
// const chromium = require('chrome-aws-lambda'); 
const chromium = require('netlify-plugin-chromium');



const app = express();


app.get('/.netlify/functions/server', (req, res) => {
  res.send(chromium);
});

app.get('/find-chromium-path', async (req, res) => {
  try {
    const executablePath = await chromium.executablePath();
    res.json({ path: executablePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/generate-pdf', async (req, res) => {
  const { htmlContent } = req.body;

  try {
    const browser = await puppeteer.launch({
      executablePath: '/opt/build/repo/node_modules/chromium/lib/chromium/chrome-linux/chrome',
      headless: 'new'
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    res.set('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send(`Error generating PDF: ${error.message}`);
  }
});

module.exports.handler = serverless(app);
