const eventEmitter = require('events');
const pcap = require("pcap");
const monitors = require("./monitor.js");
const shared = require("./shared.js");

const speakers = {};
const speakerEvents = new eventEmitter();

speakerEvents.on('new', (data) => {
    console.log(`Found new Speaker: ${data.model} at ${data.sender}:${data.port} with address: ${data.mac_address}`);
    data.monitor = monitors.monitor(device, data);
    speakers[data.mac_address] = data;
});

let mixer = null;
let mixerEvents = new eventEmitter();

mixerEvents.on('new', (data) => {
    console.log(`Found new Mixer: ${data.model} at ${data.sender}:${data.port}`);
    mixer = data;
});

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

speakerWatch.on("packet", function (raw_packet) {
    const packet = pcap.decode.packet(raw_packet);
    const data = shared.decodeData(shared.getData(packet), "locator.js");
    if (data) {
        switch (data.mode) {
            case 'broadcast':
                switch (data.type) {
                    case "speaker":
                        if (!(data.mac_address in speakers)) {
                            data.sender = shared.getSender(packet);
                            speakerEvents.emit('new', Object.assign(data, shared.getSpeakerDetails(data.mac_address)));
                        }
                        break;
                    case "mixer":
                        if (mixer === null) {
                            data.sender = shared.getSender(packet);
                            mixerEvents.emit('new', data)
                        }
                        break;
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
    for (const mac_address in speakers) {
        if (speakers.hasOwnProperty(mac_address)) {
            const speaker = speakers[mac_address];
            list.push({
                'mac_address': mac_address,
                'ip': speaker.sender,
                'model': speaker.model,
                'name': speaker.name,
                'port': speaker.port,
            })
        }
    }
    return list;
};

module.exports.getSpeaker = (addressOrName) => {
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
