const pcap = require("pcap");
const pcap_session = pcap.createSession("en0", "");

pcap_session.on("packet", function (raw_packet) {
    const packet = pcap.decode.packet(raw_packet);
    if (packet.payload.payload.saddr) {
        if (packet.payload.payload.saddr.addr) {
            if (packet.payload.payload.saddr.addr[3] === 100) {
                if (packet.payload.payload.payload.data) {
                    const o = parseData(packet.payload.payload.payload.data);
                    if (o.type === 22096) {
                        //console.log('Buffer:');
                        //console.log(packet.payload.payload.payload.data);
                        //console.log('String:');
                        //console.log([packet.payload.payload.payload.data.toString('ascii')]);
                        //console.log('Object:');*/
                        //console.log(o.endpoint + "\t" + (parseInt(o.level * 1000) / 1000) + "\t" + o.other);
                        console.log(o);
                    }
                }
            }
        }
    }
});


function parseData(data) {
    const o = {};

    o.device = data.toString("ascii", 0, 2);
    o.boop = data.readUInt16LE(2);
    o.type = data.readUInt16LE(6);
    switch (o.type) {
    case 16708: //speaker type info
        o.mode = "Speaker Info";
        o.port = data.readUInt16LE(4);
        o.other = data.toString("ascii", 8, 16);
        o.name = data.toString("ascii", 16, 24);
        o.spk = data.toString("ascii", 24, 28);
        o.address = data.toString("ascii", 28);
        break;
    case 21325:
        o.mode = "Meter Level?"; //so far only tested without any input signal playing
        o.umm = data.readUInt16LE(4); //always 39829 for 328AI in my room
        o.other = data.toString("hex", 8, 12); //always `64:00:66:00` for 328AI in my room
        o.endpoint = data.toString("ascii", 12, 16); //always 'levl'
        o.more = data.toString("hex", 16, 20); //always `00:00:05:00` for 328AI in my room
        o.level = data.readUInt16LE(20); //speaker output level meter 0..??
        o.extra = data.toString("hex", 22); //always `00:00:00:00:00:00:00:00:03:00:00:00:00:01:00:06:00:01:00:04:00:07:00:05:00:00:00`
        break;
    case 16973:
        o.mode = "Something 2";
        o.umm = data.readUInt16LE(4);
        o.other = data.toString("hex", 8, 12); //always `64:00:66:00` for 328AI in my room
        o.endpoint = data.toString("ascii", 12, 16); //always 'redu'
        o.extra = data.toString("hex", 16);
        break;
    case 22096:
        o.mode = "Settings Return";
        o.len = data.readUInt16LE(4);
        o.other = data.toString("hex", 8, 12);  //always `64:00:66:00` for 328AI in my room
        o.endpoint = data.toString("ascii", 12, o.len + 2);
        o.level = data.readFloatLE(o.len + 2);
        break;
    case 48767:
        o.mode = "Something 4";
        o.umm = data.readUInt16LE(4);
        o.other = data.toString("ascii", 8);
        break;
    default:
        o.mode = "Unknown";
        o.umm = data.readUInt16LE(4);
        o.other = data.toString("ascii", 8);
    }

    return o;
    /*
    var buf = data.slice(2, 16);

    var i;
    for (i = 0; i < 14; i++) {
        console.log(buf.readUInt16LE(i));
    }
    */

    /*
    buf.readInt8(offset)
    buf.readInt16BE(offset)
    buf.readInt16LE(offset)
    buf.readInt32BE(offset)
    buf.readInt32LE(offset)
    buf.readIntBE(offset, byteLength)
    buf.readIntLE(offset, byteLength)
    buf.readUInt8(offset)
    buf.readUInt16BE(offset)
    buf.readUInt16LE(offset)
    buf.readUInt32BE(offset)
    buf.readUInt32LE(offset)
    buf.readUIntBE(offset, byteLength)
    buf.readUIntLE(offset, byteLength)
    */
}
