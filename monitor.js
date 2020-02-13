const eventEmitter = require('events');
const pcap = require("pcap");
const shared = require("./shared.js");
const connection = require("./connection");

module.exports.monitor = (device, speakerInfo) => {

    const filter = `src host ${speakerInfo.sender} && not ip broadcast && udp`;
    const monitor = pcap.createSession(device, filter);
    const speakerEvents = new eventEmitter();
    const conn = connection.connection(speakerInfo, speakerEvents);

    monitor.on("packet", (raw_packet) => {
        const packet = pcap.decode.packet(raw_packet);
        const data = shared.decodeData(shared.getData(packet), "monitor.js");
        if (data) {
            speakerEvents.emit(data.mode, data, speakerInfo);
        }
    });

    const sendCommand = (endpoint, value) => {
        conn.write(shared.getCommand(endpoint, value));
        console.log("writing value: "  + value + " to endpoint: " + endpoint);
        return true;
    };

    return {
        sendCommand : sendCommand,
        speakerEvents: speakerEvents
    }
};

