const eventEmitter = require('events');
const pcap = require("pcap");
const shared = require("./shared.js");
const connection = require("./connection");

module.exports.monitor = (data) => {

    const filter = `src host ${data.sender} && not ip broadcast && udp`;
    const monitor = pcap.createSession("en4", filter);
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
        console.log(`Level now at ${data.level} from ${data.source}`);
    });

    speakerEvents.on('settings', (data) => {
        console.log(`${data.endpoint} set to ${data.value} from ${data.source}`);
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

