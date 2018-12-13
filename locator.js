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
    console.log(`Found new ${data.model} at ${data.sender}:${data.port} with name: ${data.name}`);
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
                    speakerEvents.emit('new', Object.assign(data, shared.getSpeakerDetails(data.address)));
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
                'model': speaker.model,
                'name': speaker.name,
                'port': speaker.port,
            })
        }
    }
    return list;
};

const getSpeaker = (addressOrName) => {
    if (addressOrName in speakers) {
        return speakers[addressOrName];
    }
    for (let address in speakers) {
        if (speakers.hasOwnProperty(address)) {
            if (speakers[address].name === addressOrName) {
                return speakers[address];
            }
        }
    }
    return null;
};

module.exports.sendCommand = (addressOrName, endpoint, value) => {
    const speaker = getSpeaker(addressOrName);
    if (speaker) {
        return speaker.monitor.sendCommand(endpoint, value);
    }
    return false;
};
