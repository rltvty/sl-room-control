var pcap = require('pcap'),
    pcap_session = pcap.createSession('en0', "");



pcap_session.on('packet', function (raw_packet) {
    var packet = pcap.decode.packet(raw_packet);
    if (packet.payload.payload.saddr) {
        if (packet.payload.payload.saddr.addr) {
            if (packet.payload.payload.saddr.addr[3] === 101) {
                if (packet.payload.payload.payload.data) {
                    var o = parseData(packet.payload.payload.payload.data);
                    if (o['type'] === 22096) {
                        //console.log('Buffer:');
                        // console.log(packet.payload.payload.payload.data);
                        //console.log('String:');
                        //console.log([packet.payload.payload.payload.data.toString('ascii')]);
                        //console.log('Object:');*/
                        console.log(o['endpoint'] + "\t" + parseInt(o['level'] * 100));
                    }
                }
            }
        }
    }
});


function parseData(data) {
    var o = {};

    o['device'] = data.toString('ascii', 0, 2);
    o['boop'] = data.readUInt16LE(2);
    o['type'] = data.readUInt16LE(6);
    switch (o['type']) {
        case 16708: //speaker type info
            o['port'] = data.readUInt16LE(4);
            o['other'] = data.toString('ascii', 8, 16);
            o['name'] = data.toString('ascii', 16, 24);
            o['spk'] = data.toString('ascii', 24, 28);
            o['address'] = data.toString('ascii', 28);
            o['mode'] = 'Speaker Info';
            break;
        case 21325:
            o['mode'] = 'Something 1';
            o['other'] = data.toString('ascii', 8);
            break;
        case 16973:
            o['mode'] = 'Something 2';
            o['other'] = data.toString('ascii', 8);
            break;
        case 22096:
            o['mode'] = 'Settings Return';
            o['len'] = data.readUInt16LE(4);
            var end =  o['len'] + 2;
            o['other'] = data.toString('ascii', 8, 12);
            o['endpoint'] = data.toString('ascii', 12, end);
            o['extra'] = data.toString('ascii', end);
            o['hex'] = data.toString('hex', end);
            o['level'] = data.readFloatLE(end);
            break;
        case 48767:
            o['mode'] = 'Something 4';
            o['other'] = data.toString('ascii', 8);
            break;
        default:
            o['mode'] = 'Unknown';
            o['other'] = data.toString('ascii', 8);
    }

    return o;
    var buf = data.slice(2, 16);

    var i;
    for (i = 0; i < 14; i++) {
        console.log(buf.readUInt16LE(i));
    }







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
