const endpoints = require('./experiments/endpoints.js');
//const locator = require('./locator.js');
const shared = require('./shared.js');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 3000;

const contourMap = {'normal': 0, 'lbr_source': 0.5, 'floor_monitor': 1};
const onOffMap = {'off': 0, 'on': 1};
const winkMap = {'blue': 0, 'white': 1};

const getValueFromBodyOrSend400 = (req, res, paramName, validChoices) => {
    const valueOrError = shared.getValueOrError(req.body, paramName, validChoices);
    if (valueOrError instanceof  Error) {
        res.status(400).send({ error: valueOrError.message });
    } else {
        return valueOrError;
    }
};

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/endpoints', (req, res) => res.send(endpoints.endpoints));

app.get('/speakers', (req, res) => res.send(locator.speakers()));

app.param('speaker', function(req, res, next, id) {
    const speaker = locator.getSpeaker(id);
    if (speaker) {
        req.speaker = speaker;
        next();
    } else {
        res.status(404).send({ error: 'speaker not found'});
    }
});

app.param('band', function(req, res, next, id) {
    if (req.path.includes('graphic_eq')) {
        if (id < 1 || id > 31) {
            res.status(404).send({ error: 'graphic eq band must be in range: 1..31'});
        }
    } else if (req.path.includes('notch_eq')) {
        if (id < 1 || id > 8) {
            res.status(404).send({ error: 'notch eq band must be in range: 1..8'});
        }
    } else if (req.path.includes('parametric_eq')) {
        if (id < 1 || id > 8) {
            res.status(404).send({ error: 'parametric eq band must be in range: 1..8'});
        }
    }
    req.band = id;
    next();
});

app.post('/speaker/:speaker/endpoint/:endpoint/value/:value', (req, res) => {
    res.send(req.speaker.monitor.sendCommand(req.params["endpoint"], parseFloat(req.params["value"])));
});

app.post('/test', (req, res) => {
    console.log(req.body);
    if ('level' in req.body && returnSocket != null) {
        returnSocket.send(req.body.level);
    }
    res.sendStatus(200);
});


// SWITCH ENDPOINTS

const handleSwitchEndpoint = (req, res, endpoint, map) => {
    const inputValue = getValueFromBodyOrSend400(req, res, 'value', Object.keys(map));
    const commandValue = shared.getValueFromMap(map, inputValue);
    req.speaker.monitor.sendCommand(endpoint, commandValue);
    res.sendStatus(201);
};

app.post('/speaker/:speaker/contour', (req, res) => {
    handleSwitchEndpoint(req, res, 'Speaker/contour', contourMap);
});

app.post('/speaker/:speaker/delay/enable', (req, res) => {
    handleSwitchEndpoint(req, res, 'Speaker/line/ch1/delay_enable', onOffMap);
});

app.post('/speaker/:speaker/gain/enable', (req, res) => {
    handleSwitchEndpoint(req, res, 'Speaker/line/ch1/volume_enable', onOffMap);
});

app.post('/speaker/:speaker/graphic_eq/enable', (req, res) => {
    handleSwitchEndpoint(req, res, 'Speaker/line/ch1/geq/on', onOffMap);
});

app.post('/speaker/:speaker/high_pass_filter/enable', (req, res) => {
    handleSwitchEndpoint(req, res, 'Speaker/75hz', onOffMap);
});

app.post('/speaker/:speaker/limiter/enable', (req, res) => {
    handleSwitchEndpoint(req, res, 'Speaker/line/ch1/limit/limiteron', onOffMap);
});

app.post('/speaker/:speaker/mute/enable', (req, res) => {
    handleSwitchEndpoint(req, res, 'Speaker/line/ch1/mute', onOffMap);
});

app.post('/speaker/:speaker/notch_eq/enable', (req, res) => {
    handleSwitchEndpoint(req, res, 'Speaker/line/ch1/notch/notchallon', onOffMap);
});

app.post('/speaker/:speaker/notch_eq/:band/enable', (req, res) => {
    handleSwitchEndpoint(req, res, `Speaker/line/ch1/notch/notchbandon${req.band}`, onOffMap);
});

app.post('/speaker/:speaker/parametric_eq/enable', (req, res) => {
    handleSwitchEndpoint(req, res, 'Speaker/line/ch1/eq/eqallon', onOffMap);
});

app.post('/speaker/:speaker/parametric_eq/:band/enable', (req, res) => {
    handleSwitchEndpoint(req, res, `Speaker/line/ch1/eq/eqbandon${req.band}`, onOffMap);
});

app.post('/speaker/:speaker/wink', (req, res) => {
    handleSwitchEndpoint(req, res, 'Speaker/wink', winkMap);
});

/*


    "Speaker/line/ch1/delay": "0..1", //Actual range is 0..500 ms
    "Speaker/line/ch1/eq/eqfreq1": "0..1", //Param EQ1 Freq.  Actual range is 20..20,000 Hz
    "Speaker/line/ch1/eq/eqfreq8": "0..1", //Param EQ8 Freq.  Actual range is 20..20,000 Hz
    "Speaker/line/ch1/eq/eqgain1": "0..1", //Param EQ1 Gain.  Actual range is -15..15 dB
    "Speaker/line/ch1/eq/eqgain8": "0..1", //Param EQ8 Gain.  Actual range is -15..15 dB
    "Speaker/line/ch1/eq/eqq1": "0..1", //Param EQ1 Q. Actual range is 0.10..4
    "Speaker/line/ch1/eq/eqq8": "0..1", //Param EQ8 Q. Actual range is 0.10..4
    "Speaker/line/ch1/geq/gain1": "0..1",  //Graphic EQ01 Gain.  Actual range is -16..16 dB
    "Speaker/line/ch1/geq/gain31": "0..1", //Graphic EQ31 Gain.  Actual range is -16..16 dB
    "Speaker/line/ch1/limit/threshold": "0..1", //actual range is -28..0 dB
    "Speaker/line/ch1/notch/notchfreq1": "0..1", //Notch EQ1 Freq.  Actual range is 20..20,000 Hz
    "Speaker/line/ch1/notch/notchfreq8": "0..1", //Notch EQ8 Freq.  Actual range is 20..20,000 Hz
    "Speaker/line/ch1/notch/notchgain1": "0..1", //Notch EQ1 Gain.  Actual range is -48..0 dB
    "Speaker/line/ch1/notch/notchgain8": "0..1", //Notch EQ8 Gain.  Actual range is -48..0 dB
    "Speaker/line/ch1/volume": "0..1", //Actual range is -84..10 dB
    "Speaker/presetloading": "0", //seems to show while the speaker is muted to change modes
    "Speaker/remote_lim_on": "0/1", //follows Speaker/line/ch1/limit/limiteron
    "Speaker/remote_notch_on": "0/1", //follows Speaker/line/ch1/notch/notchallon
    "Speaker/remote_geq_on": "0/1", //follows Speaker/line/ch1/geq/on
    "Speaker/remote_peq_on": "0/1", //follows Speaker/line/ch1/eq/eqallon
    "Speaker/remotelayeron": "0/1", //User mode Enable
    "Speaker/signal": "0/1", //Speaker signal LED flash
    "Speaker/clip": "0/1", //speaker digital clip LED flash
    "Speaker/limit": "0/1", //Speaker limit LED flash?
*/

//not found route
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});

//error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let returnSocket = null;

wss.on('connection', function(ws, request) {
    returnSocket = ws;
});


//start server
server.listen(port, () => console.log(`Example app listening on port ${port}!`));

