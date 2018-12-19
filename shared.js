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

module.exports.decodeData = (data, source) => {
    if (data && data.length > 20 && data.toString("ascii", 0, 2) === "UC") {
        switch (data.readUInt16LE(6)) {
            case 16708:
                return {
                    source : source,
                    mode : "broadcast",
                    port : data.readUInt16LE(4),
                    model : data.toString("ascii", 16, 28).replace(findNulls,' ').trim(),
                    address: data.toString("ascii", 28, 45)
                };
            case 21325:
                return {
                    source : source,
                    mode: "level",
                    level: data.readUInt16LE(20)
                };
            case 22096:
                const len = data.readUInt16LE(4);
                return {
                    source : source,
                    mode: "settings",
                    endpoint: data.toString("ascii", 12, len + 2).replace(findNulls,'').trim(),
                    value: data.readFloatLE(len + 2)
                };
            default:
                return {
                    source : source,
                    mode: "unknown",
                    type: data.readUInt16LE(6),
                    hex: data.toString('hex', 8),
                    ascii: data.toString('ascii', 8),
                    trimmed: data.toString('ascii', 8).replace(findNulls,'').trim()
                }
        }
    }
    return null;
};

module.exports.getSpeakerDetails = (address) => {
    if (speaker_config.hasOwnProperty(address)) {
        return speaker_config[address]
    } else {
        return {
            name: address,
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
