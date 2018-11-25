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
