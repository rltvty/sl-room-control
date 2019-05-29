const findNulls = new RegExp("\u0000", "g");
const speaker_config = require("./speaker_config.json");

module.exports.getNetworkDevices = () => {
    const choices = [];
    const devices = require('os').networkInterfaces();
    for (let key in devices) {
        if (devices.hasOwnProperty(key) && key.startsWith('en')) {
            const device = devices[key];
            for (let info_index in device) {
                if (device.hasOwnProperty(info_index)) {
                    const info = device[info_index];
                    if (info['family'] === 'IPv4') {
                        choices.push({ name: key, address : info['address'], mac: info['mac'] });
                        break;
                    }
                }
            }
        }
    }
    return choices;
};

const hexFormatter = (buf) => {
    let line = '';
    for (let i = 0; i < buf.length; i += 1) {
        line += buf.toString('hex', i, i+1);
        if ((i+1) % 32 === 0) {
            line += '\n';
        } else if ((i+1) % 4 === 0) {
            line += " ";
        } else {
            line += ":";
        }
    }
    return line + '\n\n';
};

module.exports.decodeData = (data, source) => { //source is `locator.js`, `connection.js`, or `monitor.js`
    if (data && data.length > 20 && data.toString("ascii", 0, 2) === "UC") {
        switch (data.readUInt16LE(6)) {
            case 16708:
                if (data.length <= 50) {
                    return decodeSpeakerBroadcast(data, source)
                } else {
                    return decodeMixerBroadcast(data, source)
                }
            case 21325:
                return {
                    source: source,
                    mode: "input_level",
                    level: data.readUInt16LE(20)
                };
            case 22096:
                const len = data.readUInt16LE(4);
                return {
                    source: source,
                    mode: "settings",
                    endpoint: data.toString("ascii", 12, len + 2).replace(findNulls, '').trim(),
                    value: data.readFloatLE(len + 2)
                };
            default:
                switch (data.toString('ascii', 12, 16)) {
                    case 'levl':
                        return {
                            source: source,
                            mode: "output_level",
                            level: data.readUInt8(21)
                        };
                    case 'redu':
                        return {
                            source: source,
                            mode: "redu",
                            type: data.readUInt16LE(6),
                            level: data.readUInt8(10),
                            hex: data.toString('hex', 0),
                            ascii: data.toString('ascii', 12, 16),
                            trimmed: data.toString('ascii', 0).replace(findNulls, '').trim()
                        };
                    default:
                        return {
                            source: source,
                            mode: "unknown",
                            actual_len : data.length,
                            //hex: hexFormatter(data),
                            base64: data.toString('base64'),
                            decoded: Buffer.from(data.toString('base64'), 'base64').toString('binary')
                        }
                }
        }
    }
    return null;
};

module.exports.getSpeakerDetails = (mac_address) => {
    if (speaker_config.hasOwnProperty(mac_address)) {
        return speaker_config[mac_address]
    } else {
        return {
            mac_address: mac_address,
            description: "Pls add this speaker to `speaker_config.json`"
        }
    }
};

module.exports.getSender = (packet) => {
    if (packet && packet.payload && packet.payload.payload) {
        if (packet.payload.payload.saddr && packet.payload.payload.saddr.addr) {
            return packet.payload.payload.saddr.addr.join(".");
        }
    }
    return null;
};

module.exports.getData = (packet) => {
    if (packet && packet.payload && packet.payload.payload) {
        if (packet.payload.payload.payload && packet.payload.payload.payload.data) {
            return packet.payload.payload.payload.data;
        }
    }
    return null;
};

module.exports.getCommand =  (endpoint, value) => {
    if (value < 0 || value > 1) {
        return new Error("value must be between 0 and 1, inclusive");
    }
    const len = endpoint.length + 19;
    const command = Buffer.alloc(len);
    command.write("UC", 0, 2, "ascii");
    command.writeUInt8(1, 3);
    command.writeUInt8(endpoint.length + 13, 4);
    command.write("5056660064", 6, 5, "hex"); //opposite of `??:??:64:00:66:00` seen on return from speaker at location 8
    command.write(endpoint, 12, endpoint.length, 'ascii');
    command.writeFloatLE(value, len - 4);
    return command;
};

module.exports.getValueOrError = (obj, paramName, validChoices) => {
    if (!obj.hasOwnProperty(paramName)) {
        return new Error(`'${paramName}' is required`);
    }
    const value = obj[paramName];
    if (Array.isArray(validChoices)) {
        if (!validChoices.includes(value)) {
            return new Error(`${paramName} must be one of these values: ${validChoices.join(', ')}`);
        }
    } else if (typeof (validChoices) === 'string') {
        if (validChoices.includes('-')) { //range of values, including non-integers
            const range = validChoices.split('-');
            if (value < parseInt(range[0]) || value > parseInt(range[1])) {
                return new Error(`'${paramName}' must be between ${range[0]} and ${range[1]}`);
            }
        } else if (validChoices.includes('/')) { //choice of two or more specific values
            if (!validChoices.split('/').includes(value)) {
                return new Error(`'${paramName}' must be one of these values: ${validChoices.split('/').join(', ')}`);
            }
        } else if (validChoices.includes('..')) { //range of integers
            const range = validChoices.split('..');
            const actualChoices = [];
            for (let choice = parseInt(range[0]); choice <= parseInt(range[1]); choice += 1) {
                actualChoices.push(choice);
            }
            if (!actualChoices.includes(value)) {
                return new Error(`'${paramName}' must be one of these values: ${actualChoices.join(', ')}`);
            }
        }
    }
    return value;
};

module.exports.getValueFromMap = (map, input) => {
    if (map.hasOwnProperty(input)) {
        return map[input];
    }
    return null;
};

roundDigits = (number, digits) => {
    const factor = Math.pow(10, digits);
    return Math.round(number * factor) / factor;
};

module.exports.getActualValueFromCommandValue = (kind, commandValue) => {
    switch (kind) {
        case 'delay':
            return roundDigits(500 * commandValue, 1).toString() + ' ms';
        case 'eq_freq':
            const value = 20 * Math.exp(6.91 * commandValue);
            if (value < 100) {
                return roundDigits(value, 2).toString() + ' Hz';
            } else if (value < 1000) {
                return roundDigits(value, 1).toString() + ' Hz';
            } else if (value < 20000) {
                return roundDigits(value/1000, 2).toString() + ' kHz';
            } else {
                return "20 kHz"; //calculates to 20.04 kHz
            }
        case 'para_gain':
            return roundDigits((30 * commandValue) - 15, 2).toString() + ' dB';
        default:
            return 0;
    }
};

module.exports.getCommandValueFromActualValue = (kind, actualValue) => {
    let value = parseFloat(actualValue);
    switch (kind) {
        case 'delay':
            value = value / 500;
            break;
        case 'eq_freq':
            if (actualValue.includes('kHz')) {
                value = value * 1000;
            }
            value = Math.log(value / 20) / 6.91;
            //const value = 20 * Math.exp(6.91 * inputValue);
            break;
        case 'para_gain':
            value = (value + 15) / 30;
            break;
        default:
            return 0;
    }
    if (value < 0) {
        value = 0;
    }
    if (value > 1) {
        value = 1
    }
    return Math.fround(value);
};

// Example speaker broadcasts:

// 'UC\u0000\u0001¢æDAd\u0000\u0000\u0000\u0000\u0000\u0000\u0000SL18sAI\u0000SPK\u000000:0A:92:C8:0B:EF\u0000\u0000'
// 'UC\u0000\u0001 ãDAd\u0000\u0000\u0000\u0000\u0000\u0000\u0000SL315AI\u0000SPK\u000000:0A:92:C8:33:87\u0000\u0000'
// 'UC\u0000\u0001+¢DAd\u0000\u0000\u0000\u0000\u0000\u0000\u0000SL328AI\u0000SPK\u000000:0A:92:D7:04:10\u0000\u0000'
// 'UC\u0000\u0001E¡DAd\u0000\u0000\u0000\u0000\u0000\u0000\u0000SL328AI\u0000SPK\u000000:0A:92:D6:66:EE\u0000\u0000'
// 'UC\u0000\u0001ÕÙDAd\u0000\u0000\u0000\u0000\u0000\u0000\u0000SL328AI\u0000SPK\u000000:0A:92:D6:66:BB\u0000\u0000'
// 'UC\u0000\u0001ÔÆDAd\u0000\u0000\u0000\u0000\u0000\u0000\u0000SL315AI\u0000SPK\u000000:0A:92:C8:33:09\u0000\u0000'
// 'UC\u0000\u0001\u000e©DAd\u0000\u0000\u0000\u0000\u0000\u0000\u0000SL18sAI\u0000SPK\u000000:0A:92:A9:19:0C\u0000\u0000'

function decodeSpeakerBroadcast (data, source) {
    return {
        source: source,
        mode: "broadcast",
        port: data.readUInt16LE(4),
        model: data.toString("ascii", 16, 28).replace(findNulls, ' ').trim(),
        mac_address: data.toString("ascii", 28, 45),
        type: "speaker"
    };
}

/* Example Mixer Broadcast:
{ actual_len: 75,
  hex:
   '55:43:00:01 08:cf:44:41 65:00:00:00 00:00:00:80 da:55:b3:49 12:b6:a0:40 99:55:ea:b6 f6:de:ac:b7
    53:74:75:64 69:6f:4c:69 76:65:20:52 4d:31:36:20 41:49:2f:31 00:41:55:44 00:32:39:37 35:32:39:35
    37:34:37:37 32:34:34:33 35:00:00',
  base64:
   'VUMAAQjPREFlAAAAAAAAgNpVs0kStqBAmVXqtvberLdTdHVkaW9MaXZlIFJNMTYgQUkvMQBBVUQAMjk3NTI5NTc0NzcyNDQzNQAA',
  decoded:
   'UC\u0000\u0001\bÏDAe\u0000\u0000\u0000\u0000\u0000\u0000 ÚU³I\u0012¶ @ Uê¶öÞ¬·StudioLive RM16 AI/1\u0000AUD\u00002975295747724435\u0000\u0000'
 }

*/
function decodeMixerBroadcast(data, source) {
    return {
        source: source,
        mode: "broadcast",
        port: data.readUInt16LE(4),
        model: data.toString("ascii", 32, 50).replace(findNulls, ' ').trim(),
        type: "mixer"
    };
}