const findNulls = new RegExp("\u0000", "g");

module.exports.udpDecode = (data) => {
    if (data && data.length > 20 && data.toString("ascii", 0, 2) === "UC") {
        switch (data.readUInt16LE(6)) {
            case 16708:
                return {
                    mode : "broadcast",
                    port : data.readUInt16LE(4),
                    name : data.toString("ascii", 16, 28).replace(findNulls,' ').trim(),
                    address: data.toString("ascii", 28, 45)
                };
            case 21325:
                return {
                    mode: "level",
                    level: data.readUInt16LE(20)
                };
            case 22096:
                const len = data.readUInt16LE(4);
                return {
                    mode: "settings",
                    endpoint: data.toString("ascii", 12, len + 2).replace(findNulls,'').trim(),
                    value: data.readFloatLE(len + 2)
                };
            default:
                return {
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


testCommand("Speaker/line/ch1/eq/eqgain4", Buffer.from("b0f80a3f", "hex").readFloatLE(0), "55:43:00:01:28:00:50:56:66:00:64:00:537065616b65722f6c696e652f6368312f65712f65716761696e34:00:00:00:b0:f8:0a:3f");
testCommand("Speaker/line/ch1/eq/eqfreq4", Buffer.from("80aaeb3e", "hex").readFloatLE(0), "55:43:00:01:28:00:50:56:66:00:64:00:537065616b65722f6c696e652f6368312f65712f65716672657134:00:00:00:80:aa:eb:3e");
testCommand("Speaker/line/ch1/limit/threshold", Buffer.from("64703e3f", "hex").readFloatLE(0), "55:43:00:01:2d:00:50:56:66:00:64:00:537065616b65722f6c696e652f6368312f6c696d69742f7468726573686f6c64:00:00:00:64:70:3e:3f");
testCommand("Speaker/wink", 1, "55:43:00:01:19:00:50:56:66:00:64:00:537065616b65722f77696e6b:00:00:00:00:00:80:3f");
testCommand("Speaker/wink", 0, "55:43:00:01:19:00:50:56:66:00:64:00:537065616b65722f77696e6b:00:00:00:00:00:00:00");
testCommand("Speaker/remote_lim_on", 1, "55:43:00:01:22:00:50:56:66:00:64:00:537065616b65722f72656d6f74655f6c696d5f6f6e:00:00:00:00:00:80:3f");
testCommand("Speaker/line/ch1/volume", Buffer.from("e963303f", "hex").readFloatLE(0), "55:43:00:01:24:00:50:56:66:00:64:00:537065616b65722f6c696e652f6368312f766f6c756d65:00:00:00:e9:63:30:3f");
testCommand("Speaker/line/ch1/volume_enable", 1, "55:43:00:01:2b:00:50:56:66:00:64:00:537065616b65722f6c696e652f6368312f766f6c756d655f656e61626c65:00:00:00:00:00:80:3f");

