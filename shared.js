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

const getCommand = (endpoint, value) => {
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

module.exports.getCommand = getCommand;

/*
const testCommand = (endpoint, value, expected) => {
    const result = getCommand(endpoint, value).toString("hex");
    expected = expected.replace(/:/g,'');
    if (result === expected) {
        console.log(`${endpoint} SUCCESS!`);
    } else {
        console.log(`${endpoint} FAILURE:`);
        console.log(`\t Expected: ${expected}`);
        console.log(`\t   Result: ${result}`);
    }
};

testCommand("Speaker/line/ch1/eq/eqgain4", Buffer.from("b0f80a3f", "hex").readFloatLE(0), "55:43:00:01:28:00:50:56:66:00:64:00:537065616b65722f6c696e652f6368312f65712f65716761696e34:00:00:00:b0:f8:0a:3f");
testCommand("Speaker/line/ch1/eq/eqfreq4", Buffer.from("80aaeb3e", "hex").readFloatLE(0), "55:43:00:01:28:00:50:56:66:00:64:00:537065616b65722f6c696e652f6368312f65712f65716672657134:00:00:00:80:aa:eb:3e");
testCommand("Speaker/line/ch1/limit/threshold", Buffer.from("64703e3f", "hex").readFloatLE(0), "55:43:00:01:2d:00:50:56:66:00:64:00:537065616b65722f6c696e652f6368312f6c696d69742f7468726573686f6c64:00:00:00:64:70:3e:3f");
testCommand("Speaker/wink", 1, "55:43:00:01:19:00:50:56:66:00:64:00:537065616b65722f77696e6b:00:00:00:00:00:80:3f");
testCommand("Speaker/wink", 0, "55:43:00:01:19:00:50:56:66:00:64:00:537065616b65722f77696e6b:00:00:00:00:00:00:00");
testCommand("Speaker/remote_lim_on", 1, "55:43:00:01:22:00:50:56:66:00:64:00:537065616b65722f72656d6f74655f6c696d5f6f6e:00:00:00:00:00:80:3f");
testCommand("Speaker/line/ch1/volume", Buffer.from("e963303f", "hex").readFloatLE(0), "55:43:00:01:24:00:50:56:66:00:64:00:537065616b65722f6c696e652f6368312f766f6c756d65:00:00:00:e9:63:30:3f");
testCommand("Speaker/line/ch1/volume_enable", 1, "55:43:00:01:2b:00:50:56:66:00:64:00:537065616b65722f6c696e652f6368312f766f6c756d655f656e61626c65:00:00:00:00:00:80:3f");
*/

const getValueOrError = (obj, paramName, validChoices) => {
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

module.exports.getValueOrError = getValueOrError;


/*
const testValueOrError = (obj, paramName, validChoices, expectedResult) => {
    const result = getValueOrError(obj, paramName, validChoices);
    if (result instanceof Error) {
        if (expectedResult === '<Error>' || result.message === expectedResult) {
            console.log(`SUCCESS! Get '${paramName}' returned Error: ${result.message}`);
        } else {
            console.log(`FAILURE! Get '${paramName}' returned Error: ${result.message}`);
        }
    } else {
        if (result=== expectedResult) {
            console.log(`SUCCESS! Get '${paramName}' returned Value: ${result}`);
        } else {
            console.log(`FAILURE! Get '${paramName}' returned Value: ${result}`);
        }
    }
};

testValueOrError({}, 'taco', null, '<Error>');
testValueOrError({ 'freq' : '10' }, 'freq', '20-20000', '<Error>');
testValueOrError({ 'freq' : '56' }, 'freq', '20-20000', '56');
testValueOrError({ 'band' : '9' }, 'band', '1..8', '<Error>');
testValueOrError({ contour: 'normal' }, 'contour', ['normal', 'not-normal'], 'normal');
testValueOrError({ feeling: 'sad' }, 'feeling', ['happy', 'okay'], '<Error>');
testValueOrError({ height: 'giant' }, 'height', 'tall/short/normal', '<Error>');
testValueOrError({ build: 'thin' }, 'build', 'thin/athletic', 'thin');
*/
