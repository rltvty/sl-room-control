const net = require('net');
const shared = require('./shared');

const init_request = Buffer.from('554300010800554d00006400cfde', "hex");
//'UC§JMfd{"id": "Subscribe","clientName": "SL Room Control","clientType": "Mac","clientDescription": "Eric\'s MacBook Air","clientIdentifier": "Ericâs MacBook Air"}UCKAfd'
const subscription_request = Buffer.from('55430001a7004a4d660064009d0000007b226964223a2022537562736372696265222c22636c69656e744e616d65223a2022534c20526f6f6d20436f6e74726f6c222c22636c69656e7454797065223a20224d6163222c22636c69656e744465736372697074696f6e223a2022457269635c2773204d6163426f6f6b20416972222c22636c69656e744964656e746966696572223a202245726963e2809973204d6163426f6f6b20416972227d5543000106004b4166006400', "hex");
//UCKAed
const keep_alive = Buffer.from('5543000106004b4166006400', 'hex');

module.exports.connection = (speakerInfo, speakerEvents) => {
    if (speakerInfo && speakerInfo.port && speakerInfo.sender) {
        const client = new net.Socket({'allowHalfOpen': true});

        client.connect(speakerInfo.port, speakerInfo.sender, function () {
            client.write(init_request);
            client.write(subscription_request);
            setInterval(() => { client.write(keep_alive); }, 3000);
            speakerEvents.emit('open');
        });

        client.on('data', (tcpData) => {
            const data = shared.decodeData(tcpData, "connection.js");
            if (data) {
                speakerEvents.emit(data.mode, data);
            }
        });

        client.on('close', () => {
            speakerEvents.emit('close')
        });

        client.on('error', (error) => {
            speakerEvents.emit('error', error);
        });

        return client;
    }

    return null;
};
