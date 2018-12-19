const eventEmitter = require('events');
const pcap = require("pcap");
const shared = require("./shared.js");
const connection = require("./connection");

module.exports.monitor = (device, data) => {

    const filter = `src host ${data.sender} && not ip broadcast && udp`;
    const monitor = pcap.createSession(device, filter);
    const speakerEvents = new eventEmitter();
    const conn = connection.connection(data, speakerEvents);
    let wink = false;

    monitor.on("packet", (raw_packet) => {
        const packet = pcap.decode.packet(raw_packet);
        const data = shared.decodeData(shared.getData(packet), "monitor.js");
        if (data) {
            speakerEvents.emit(data.mode, data);
        }
    });

    speakerEvents.on('open', () => {
        console.log('Speaker Connected');
        /*setInterval(() => {
            sendCommand('Speaker/wink', wink ? 0 : 1);
            wink = !wink;
        }, 5000)*/
    });

    speakerEvents.on('close', () => {
        console.log('Speaker Disconnected');
    });

    speakerEvents.on('error', (error) => {
        console.log(error);
    });

    speakerEvents.on('level', (data) => {
        //console.log(`Level now at ${data.level} from ${data.source}`);
    });

    const decodingMap = {
        'Speaker/line/ch1/delay' : 'delay',
        'Speaker/line/ch1/eq/eqfreq' : 'eq_freq',
        'Speaker/line/ch1/eq/eqgain' : 'para_gain',
        'Speaker/line/ch1/notch/notchfreq' : 'eq_freq',
    };

    speakerEvents.on('settings', (data) => {
        let actualValue = null;
        if (data.hasOwnProperty('endpoint')) {
            for (let key in decodingMap) {
                if (decodingMap.hasOwnProperty(key) && data['endpoint'].includes(key)) {
                    actualValue = shared.getActualValueFromCommandValue(decodingMap[key], data.value);
                    break;
                }
            }
        }
        if (actualValue) {
            console.log(`${data.endpoint} set to ${actualValue} (${data.value}) from ${data.source}`);
        } else {
            console.log(`${data.endpoint} set to ${data.value} from ${data.source}`);
        }
    });

    speakerEvents.on('unknown', (data) => {
        //console.log(data);
    });

    const sendCommand = (endpoint, value) => {
        conn.write(shared.getCommand(endpoint, value));
        return true;
    };

    return {
        sendCommand : sendCommand
    }
};

