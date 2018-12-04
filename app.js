const endpoints = require('./experiments/endpoints.js');
const locator = require('./locator.js');
const express = require('express');
const app = express();
const port = 3000;

let wink = false;

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/endpoints', (req, res) => res.send(endpoints.endpoints));

app.get('/speakers', (req, res) => res.send(locator.speakers()));

app.post('/:speaker/wink', (req, res) => {
    wink = !wink;
    res.send(locator.sendCommand(req.params["speaker"], 'Speaker/wink', wink ? 0 : 1));
});

app.post('/:speaker/:endpoint/:value', (req, res) => {
    wink = !wink;
    res.send(locator.sendCommand(req.params["speaker"], req.params["endpoint"], parseFloat(req.params["value"])));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
