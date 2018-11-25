const net = require('net');
const shared = require('./shared');

const init_request = Buffer.from('554300010800554d00006400cfde', "hex");
//'UC§JMfd{"id": "Subscribe","clientName": "SL Room Control","clientType": "Mac","clientDescription": "Eric\'s MacBook Air","clientIdentifier": "Ericâs MacBook Air"}UCKAfd'
const subscription_request = Buffer.from('55430001a7004a4d660064009d0000007b226964223a2022537562736372696265222c22636c69656e744e616d65223a2022534c20526f6f6d20436f6e74726f6c222c22636c69656e7454797065223a20224d6163222c22636c69656e744465736372697074696f6e223a2022457269635c2773204d6163426f6f6b20416972222c22636c69656e744964656e746966696572223a202245726963e2809973204d6163426f6f6b20416972227d5543000106004b4166006400', "hex");
//UCKAed
const keep_alive = Buffer.from('5543000106004b4166006400', 'hex');

const wink_on = Buffer.from('554300011900505666006400537065616b65722f77696e6b0000000000803f', 'hex');
const wink_off = Buffer.from('554300011900505666006400537065616b65722f77696e6b00000000000000', 'hex');


module.exports.connection = (data) => {
    var wink = false;

    if (data && data.port && data.sender) {
        const client = new net.Socket({'allowHalfOpen': true});

        client.connect(data.port, data.sender, function () {
            console.log('Connected, sending init command');
            client.write(init_request);
            console.log('Init command sent');
            setTimeout(function () {
                console.log('Sending 2nd command now');
                client.write(subscription_request);
                console.log('2nd command sent');
            }, 100);
            setTimeout(function () {
                console.log('starting keep alive');
                setInterval(function () {
                    client.write(keep_alive);
                    if (wink) {
                        client.write(wink_off);
                    } else {
                        client.write(wink_on);
                    }
                    wink = !wink;
                    //console.log('keep alive sent')
                }, 3000)
            }, 500);
        });

        client.on('data', function (data) {
            data.source = 'connection';
            console.log(shared.udpDecode(data));
        });

        client.on('close', function () {
            console.log('Connection closed');
        });

        client.on('error', function (error) {
            console.log('ERROR');
            console.log(error);
        });
    }
};
