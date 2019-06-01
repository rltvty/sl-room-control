const pcap = require("pcap");
const pcap_session = pcap.createSession("en0", "");

var s = "";
for (var i = 20; i < 99; i++) {
    s = s + i;
}

for (var j = 88; j < 108; j++) {
    console.log('' + j + ': "aux_out_' + (j-87) + '",');
}

s = s + "000102030405060708";

levels = {
    20: "in_01/Rear L",
    21: "in_02/Front L",
    22: "in_03/Front C",
    23: "in_04/Front R",
    24: "in_05/Rear R",
    25: "in_06/Sub",
    26: "in_07",
    27: "in_08",
    28: "in_09",
    29: "in_10",
    30: "in_11",
    31: "in_12",
    32: "in_13",
    33: "in_14",
    34: "in_15",
    35: "in_16",
    36: "in_17",
    37: "in_18",
    38: "in_19",
    39: "in_20",
    40: "in_21",
    41: "in_22",
    42: "in_23",
    43: "in_24",
    44: "in_25",
    45: "in_26",
    46: "in_27",
    47: "in_28",
    48: "in_29",
    49: "in_30",
    50: "in_31",
    51: "in_32",
    52: "",
    53: "",
    54: "",
    55: "",
    56: "main_1",
    57: "main_2",
    58: "main_3",
    59: "main_4",
    60: "main_5",
    61: "main_6",
    62: "main_7",
    63: "main_8",
    64: "main_9",
    65: "main_10",
    66: "main_11",
    67: "main_12",
    68: "main_13",
    69: "main_14",
    70: "main_15",
    71: "main_16",
    72: "main_17",
    73: "main_18",
    74: "main_19",
    75: "main_20",
    76: "main_21",
    77: "main_22",
    78: "main_23",
    79: "main_24",
    80: "main_25",
    81: "main_26",
    82: "main_27",
    83: "main_28",
    84: "main_29",
    85: "main_30",
    86: "main_31",
    87: "main_32",
    88: "aux_out_1/Rear L",
    89: "aux_out_2/Front L",
    90: "aux_out_3/Front C",
    91: "aux_out_4/Front R",
    92: "aux_out_5/Rear R",
    93: "aux_out_6/Sub",
    94: "aux_out_7",
    95: "aux_out_8",
    96: "aux_out_9",
    97: "aux_out_10",
    98: "aux_out_11",
    99: "aux_out_12",
    100: "aux_out_13",
    101: "aux_out_14",
    102: "aux_out_15",
    103: "aux_out_16",
    104: "",
    105: "fx_out_a",
    106: "fx_out_b",
    107: "fx_out_c",
    108: "fx_out_d"
};

pcap_session.on("packet", function (raw_packet) {
    const packet = pcap.decode.packet(raw_packet);

    if (packet && packet.payload && packet.payload.payload) {
        if (packet.payload.payload.saddr) {
            if (packet.payload.payload.saddr.addr) {
                if (packet.payload.payload.saddr.addr[3] === 236) {
                    if (packet.payload.payload.payload.data) {
                        //console.log(packet.payload.payload.payload.data);
                        const o = parseData(packet.payload.payload.payload.data);
                        if (o.type === 16973) {
                            //console.log(o.level_hex);
                            console.log(o.levels);

                            //console.log('Buffer:');
                            //console.log(packet.payload.payload.payload.data);
                            //console.log('String:');
                            //console.log([packet.payload.payload.payload.data.toString('ascii')]);
                            //console.log('Object:');*/
                            //console.log(o.endpoint + "\t" + (parseInt(o.level * 1000) / 1000) + "\t" + o.other);

                        }
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
        o.mode = "Mixer Info (not parsed correctly yet)";
        o.port = data.readUInt16LE(4);
        o.other = data.toString("ascii", 8, 16);
        o.name = data.toString("ascii", 16, 24);
        o.spk = data.toString("ascii", 24, 28);
        o.address = data.toString("ascii", 28);
        break;
    case 16973:
        o.mode = "Level Meters";
        o.endpoint = data.toString("ascii", 12, 16); //always 'redu'
        o.hex = data.toString("hex");
        o.level_hex = data.toString("hex", 20, 108);
        o.length = data.length;
        o.levels = {};
        for (var i = 20; i < 108; i++) {
            var level = data.readUInt8(i);
            if (level > 0) {
                o.levels[levels[i]] = level;
            }
        }
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
