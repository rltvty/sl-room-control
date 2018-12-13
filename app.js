const endpoints = require('./experiments/endpoints.js');
const locator = require('./locator.js');
const express = require('express');
const app = express();
const port = 3000;

let wink = false;

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

app.post('/speaker/:speaker/wink', (req, res) => {
    wink = !wink;
    res.send(req.speaker.monitor.sendCommand('Speaker/wink', wink ? 0 : 1));
});

app.post('/speaker/:speaker/endpoint/:endpoint/value/:value', (req, res) => {
    wink = !wink;
    res.send(req.speaker.monitor.sendCommand(req.params["endpoint"], parseFloat(req.params["value"])));
});

app.post('/speaker/:speaker/contour/:value', (req, res) => {

});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));

/*
"Speaker/75hz": "0..1",  //100Hz high pass filter on/off
    "Speaker/contour": "0/0.5/1", //0: Normal, 0.5: LBR Source, 1: Floor Monitor
    "Speaker/clip": "0/1", //speaker digital clip LED flash
    "Speaker/limit": "0/1", //Speaker limit LED flash?
    "Speaker/line/ch1/delay": "0..1", //Actual range is 0..500 ms
    "Speaker/line/ch1/delay_enable": "0/1",
    "Speaker/line/ch1/eq/eqallon": "0/1", //Param EQ Enable
    "Speaker/line/ch1/eq/eqbandon1": "0/1", //Param EQ1 Enable
    "Speaker/line/ch1/eq/eqbandon8": "0/1", //Param EQ8 Enable
    "Speaker/line/ch1/eq/eqfreq1": "0..1", //Param EQ1 Freq.  Actual range is 20..20,000 Hz
    "Speaker/line/ch1/eq/eqfreq8": "0..1", //Param EQ8 Freq.  Actual range is 20..20,000 Hz
    "Speaker/line/ch1/eq/eqgain1": "0..1", //Param EQ1 Gain.  Actual range is -15..15 dB
    "Speaker/line/ch1/eq/eqgain8": "0..1", //Param EQ8 Gain.  Actual range is -15..15 dB
    "Speaker/line/ch1/eq/eqq1": "0..1", //Actual range is 0.10..4
    "Speaker/line/ch1/eq/eqq8": "0..1", //Actual range is 0.10..4
    "Speaker/line/ch1/geq/on": "0/1", //Graphic EQ Enable
    "Speaker/line/ch1/geq/gain1": "0..1",  //Graphic EQ01 Gain.  Actual range is -16..16 dB
    "Speaker/line/ch1/geq/gain31": "0..1", //Graphic EQ31 Gain.  Actual range is -16..16 dB
    "Speaker/line/ch1/limit/limiteron": "0/1",
    "Speaker/line/ch1/limit/threshold": "0..1", //actual range is -28..0 dB
    "Speaker/line/ch1/mute": "0/1",
    "Speaker/line/ch1/notch/notchallon": "0/1", //Notch EQ Enable
    "Speaker/line/ch1/notch/notchbandon1": "0/1", //Notch EQ1 Enable
    "Speaker/line/ch1/notch/notchbandon8": "0/1", //Notch EQ8 Enable
    "Speaker/line/ch1/notch/notchfreq1": "0..1", //Notch EQ1 Freq.  Actual range is 20..20,000 Hz
    "Speaker/line/ch1/notch/notchfreq8": "0..1", //Notch EQ8 Freq.  Actual range is 20..20,000 Hz
    "Speaker/line/ch1/notch/notchgain1": "0..1", //Notch EQ1 Gain.  Actual range is -48..0 dB
    "Speaker/line/ch1/notch/notchgain8": "0..1", //Notch EQ8 Gain.  Actual range is -48..0 dB
    "Speaker/line/ch1/volume": "0..1", //Actual range is -84..10 dB
    "Speaker/line/ch1/volume_enable": "0/1",
    "Speaker/presetloading": "0", //seems to show while the speaker is muted to change modes
    "Speaker/remote_lim_on": "0/1", //follows Speaker/line/ch1/limit/limiteron
    "Speaker/remote_notch_on": "0/1", //follows Speaker/line/ch1/notch/notchallon
    "Speaker/remote_geq_on": "0/1", //follows Speaker/line/ch1/geq/on
    "Speaker/remote_peq_on": "0/1", //follows Speaker/line/ch1/eq/eqallon
    "Speaker/remotelayeron": "0/1", //User mode Enable
    "Speaker/signal": "0/1", //Speaker signal LED flash
    "Speaker/wink": "0/1" //Front LED Color.  0: Blue, 1:White
*/