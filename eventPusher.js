const shared = require("./shared.js");
const fs = require("fs");

let returnWebSocket = null;

const eventEmitters = [];

pushEvent = (json) => {
    if (returnWebSocket) {
        returnWebSocket.send(JSON.stringify(json));
        if (json.event_name !== 'input_level') {
            console.log(json);
        }
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
            pushEvent({
                event_name:'open',
                mac_address: speakerInfo.mac_address,
                ip: speakerInfo.sender,
                port: speakerInfo.port,
                model: speakerInfo.model,
                type: speakerInfo.type
            });
        });
    });

    speakerEvents.on('close', (data, speakerInfo) => {
        //data is always null for `close` event
        setImmediate(() => {
            console.log(`Speaker ${speakerInfo.mac_address} Disconnected`);
            pushEvent({
                event_name: 'close',
                mac_address: speakerInfo.mac_address
            });
        });
    });

    speakerEvents.on('error', (error, speakerInfo) => {
        setImmediate(() => {
            console.log(error, speakerInfo);
            pushEvent({event_name:'error', data:error, speakerInfo:speakerInfo});
        });
    });

    speakerEvents.on('input_level', (data, speakerInfo) => {
        setImmediate(() => {
            //console.log(`Input Level now at ${data.level} from ${data.source} for ${speakerInfo.mac_address}`);
            pushEvent({
                event_name:'input_level',
                mac_address: speakerInfo.mac_address,
                level: data.level
            });
        });
    });

    speakerEvents.on('output_level', (data, speakerInfo) => {
        setImmediate(() => {
            console.log(`Output Level now at ${data.level} from ${data.source} for ${speakerInfo.mac_address}`);
            pushEvent({
                event_name:'output_level',
                mac_address: speakerInfo.mac_address,
                level: data.level
            });
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
            let json = {
                event_name:'settings',
                mac_address: speakerInfo.mac_address,
                endpoint: data.endpoint,
                value: data.value
            };
            if (actualValue) {
                output = `${data.endpoint} set to ${actualValue} (${data.value}) from ${data.source} for ${speakerInfo.mac_address}`;
                json.actual_value = actualValue;
            } else {
                output = `${data.endpoint} set to ${data.value} from ${data.source} for ${speakerInfo.mac_address}`;
            }
            //if (data.endpoint != "Speaker/signal") {
                console.log(output);
            //}
            pushEvent('settings', data, speakerInfo);
            //pushEvent(json) //not sure if this, or the above is correct.  (bad merge)

            //fs.appendFileSync('./subscription_reply.log', output + '\n\n');
        });
    });

    speakerEvents.on('redu', (data, speakerInfo) => {
        setImmediate(() => {
            //console.log(data);
            //pushEvent({event_name:'redu', data:data, speakerInfo:speakerInfo});
        });
    });

    speakerEvents.on('unknown', (data, speakerInfo) => {
        setImmediate(() => {
            //fs.appendFileSync('./subscription_reply.log', data.hex);
            //console.log(data);
            //pushEvent({event_name:'unknown', data:data, speakerInfo:speakerInfo});
        });
    });
};