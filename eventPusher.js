const shared = require("./shared.js");
const fs = require("fs");

let returnWebSocket = null;

const eventEmitters = [];

pushEvent = (event, data, speakerInfo) => {
    if (returnWebSocket) {
        returnWebSocket.send(JSON.stringify({event:event, data:data, speakerInfo:speakerInfo}));
    }
};


module.exports.setWebSocket = (ws) => {
    returnWebSocket = ws;
};

const decodingMap = {
    'Speaker/line/ch1/delay': 'delay',
    'Speaker/line/ch1/eq/eqfreq': 'eq_freq',
    'Speaker/line/ch1/eq/eqgain': 'para_gain',
    'Speaker/line/ch1/notch/notchfreq': 'eq_freq',
};

module.exports.subscribeSpeaker = (speakerEvents) => {
    eventEmitters.push(speakerEvents);

    speakerEvents.on('open', (data, speakerInfo) => {
        //data is always null for `open` event
        setImmediate(() => {
            console.log(`Speaker ${speakerInfo.mac_address} Connected`);
            pushEvent('open', data, speakerInfo);
        });
    });

    speakerEvents.on('close', (data, speakerInfo) => {
        //data is always null for `close` event
        setImmediate(() => {
            console.log(`Speaker ${speakerInfo.mac_address} Disconnected`);
            pushEvent('close', data, speakerInfo);
        });
    });

    speakerEvents.on('error', (error, speakerInfo) => {
        setImmediate(() => {
            console.log(error, speakerInfo);
            pushEvent('error', error, speakerInfo);
        });
    });

    speakerEvents.on('input_level', (data, speakerInfo) => {
        setImmediate(() => {
            //console.log(`Input Level now at ${data.level} from ${data.source} for ${speakerInfo.mac_address}`);
            pushEvent('input_level', data, speakerInfo);
        });
    });

    speakerEvents.on('output_level', (data, speakerInfo) => {
        setImmediate(() => {
            console.log(`Output Level now at ${data.level} from ${data.source} for ${speakerInfo.mac_address}`);
            pushEvent('output_level', data, speakerInfo);
        });
    });

    speakerEvents.on('settings', (data, speakerInfo) => {
        setImmediate(() => {
            let actualValue = null;
            if (data.hasOwnProperty('endpoint')) {
                for (let key in decodingMap) {
                    if (decodingMap.hasOwnProperty(key) && data['endpoint'].includes(key)) {
                        actualValue = shared.getActualValueFromCommandValue(decodingMap[key], data.value);
                        break;
                    }
                }
            }
            let output;
            if (actualValue) {
                output = `${data.endpoint} set to ${actualValue} (${data.value}) from ${data.source} for ${speakerInfo.mac_address}`;
                data.actualValue = actualValue
            } else {
                output = `${data.endpoint} set to ${data.value} from ${data.source} for ${speakerInfo.mac_address}`;
            }
            console.log(output);
            pushEvent('settings', data, speakerInfo);
            //fs.appendFileSync('./subscription_reply.log', output + '\n\n');
        });
    });

    speakerEvents.on('redu', (data, speakerInfo) => {
        setImmediate(() => {
            //console.log(data);
            //pushEvent('redu', data, speakerInfo);
        });
    });

    speakerEvents.on('unknown', (data, speakerInfo) => {
        setImmediate(() => {
            //fs.appendFileSync('./subscription_reply.log', data.hex);
            //console.log(data);
            //pushEvent('unknown', data, speakerInfo);
        });
    });
};