const eventEmitter = require('events');
const pcap = require("pcap");
const shared = require("./shared.js");
const conneciton = require("./connection");



module.exports.monitor = (data) => {

    const filter = `src host ${data.sender} && not ip broadcast`;
    const monitor = pcap.createSession("en0", filter);

    monitor.on("packet", function (raw_packet) {
        const packet = pcap.decode.packet(raw_packet);
        const data = shared.udpDecode(shared.getData(packet));
        if (data) {
            data.source = "monitor";
            switch (data.mode) {
                case 'level':
                    //console.log(data);
                    break;
                case 'settings':
                    console.log(data);
                    break;
                case 'unknown':
                    //console.log(data.hex);
                    break;
                default:
                    //console.log(data);
                    break;
            }
        }
    });

    const conn = conneciton.connection(data);
};

