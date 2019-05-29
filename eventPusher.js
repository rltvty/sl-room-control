const shared = require("./shared.js");
const fs = require("fs");

let returnWebSocket = null;

const eventEmitters = [];


module.exports.setWebSocket = (ws) => {
    returnWebSocket = ws;
};

const decodingMap = {
    'Speaker/line/ch1/delay' : 'delay',
    'Speaker/line/ch1/eq/eqfreq' : 'eq_freq',
    'Speaker/line/ch1/eq/eqgain' : 'para_gain',
    'Speaker/line/ch1/notch/notchfreq' : 'eq_freq',
};

module.exports.subscribeSpeaker = (speakerEvents) => {
    eventEmitters.push(speakerEvents);

    speakerEvents.on('open', (data) => {
        console.log(`Speaker ${data.speakerInfo.mac_address} Connected`);
    });

    speakerEvents.on('close', (data) => {
        console.log(`Speaker ${data.speakerInfo.mac_address} Disconnected`);
    });

    speakerEvents.on('error', (data) => {
        console.log(data);
    });

    speakerEvents.on('input_level', (data) => {
        console.log(`Input Level now at ${data.data.level} from ${data.data.source} for ${data.speakerInfo.mac_address}`);
    });

    speakerEvents.on('output_level', (data) => {
        console.log(`Output Level now at ${data.data.level} from ${data.data.source} for ${data.speakerInfo.mac_address}`);
    });

    speakerEvents.on('settings', (data) => {
        let actualValue = null;
        if (data.data.hasOwnProperty('endpoint')) {
            for (let key in decodingMap) {
                if (decodingMap.hasOwnProperty(key) && data.data['endpoint'].includes(key)) {
                    actualValue = shared.getActualValueFromCommandValue(decodingMap[key], data.data.value);
                    break;
                }
            }
        }
        let output;
        if (actualValue) {
            output = `${data.data.endpoint} set to ${actualValue} (${data.data.value}) from ${data.data.source} for ${data.speakerInfo.mac_address}`;
        } else {
            output = `${data.data.endpoint} set to ${data.data.value} from ${data.data.source} for ${data.speakerInfo.mac_address}`;
        }
        console.log(output);
        //fs.appendFileSync('./subscription_reply.log', output + '\n\n');
    });

    speakerEvents.on('redu', (data) => {
        //console.log(data);
    });

    speakerEvents.on('unknown', (data) => {
        //fs.appendFileSync('./subscription_reply.log', data.hex);
        //console.log(data);
    });
};