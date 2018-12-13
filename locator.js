const eventEmitter = require('events');
const pcap = require("pcap");
const monitors = require("./monitor.js");
const shared = require("./shared.js");

const speakers = {};
const speakerEvents = new eventEmitter();

const devices = shared.getNetworkDevices();
let device = null;
switch (devices.length) {
    case 0:
        console.log('No network devices found. Exiting.');
        process.exit(1);
        break;
    case 1:
        device = devices[0].name;
        break;
    default:
        console.log('More than 2 network devices found.  Need to write some selection code.  Quitting for now...')
        process.exit(1);
        break;
}

const speakerWatch = pcap.createSession(device, "ip broadcast");

speakerEvents.on('new', (data) => {
    console.log(`Found new ${data.name} at ${data.sender}:${data.port}`);
    data.monitor = monitors.monitor(device, data);
    speakers[data.address] = data;
});

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

module.exports.speakers = () => {
    const list = [];
    for (const address in speakers) {
        if (speakers.hasOwnProperty(address)) {
            const speaker = speakers[address];
            list.push({
                'address': address,
                'ip': speaker.sender,
                'port': speaker.port,
                'name': speaker.name
            })
        }
    }
    return list;
};

module.exports.sendCommand = (address, endpoint, value) => {
    if (address in speakers) {
        return speakers[address].monitor.sendCommand(endpoint, value);
    }
    return false;
};
