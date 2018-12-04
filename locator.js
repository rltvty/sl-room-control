const eventEmitter = require('events');
const pcap = require("pcap");
const monitors = require("./monitor.js");
const shared = require("./shared.js");

const speakers = {};
const speakerEvents = new eventEmitter();

speakerEvents.on('new', (data) => {
    console.log(`Found new ${data.name} at ${data.sender}:${data.port}`);
    data.monitor = monitors.monitor(data);
    speakers[data.address] = data;
});

const speakerWatch = pcap.createSession("en0", "ip broadcast");

speakerWatch.on("packet", function (raw_packet) {
    const packet = pcap.decode.packet(raw_packet);
    const data = shared.decodeData(shared.getData(packet), "locator.js");
    if (data) {
        switch (data.mode) {
            case 'broadcast':
                if (!(data.address in speakers)) {
                    data.sender = shared.getSender(packet);
                    speakerEvents.emit('new', data);
                }
                break;
            default:
                console.log(data);
                break;
        }

    }
});

