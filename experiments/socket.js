var net = require('net');

var init_request = Buffer.from('554300010800554d00006400cfde', "hex");
//'UC§JMfd{"id": "Subscribe","clientName": "SL Room Control","clientType": "Mac","clientDescription": "Eric\'s MacBook Air","clientIdentifier": "Ericâs MacBook Air"}UCKAfd'
var subscription_request = Buffer.from('55430001a7004a4d660064009d0000007b226964223a2022537562736372696265222c22636c69656e744e616d65223a2022534c20526f6f6d20436f6e74726f6c222c22636c69656e7454797065223a20224d6163222c22636c69656e744465736372697074696f6e223a2022457269635c2773204d6163426f6f6b20416972222c22636c69656e744964656e746966696572223a202245726963e2809973204d6163426f6f6b20416972227d5543000106004b4166006400', "hex");

/* subscription request response:
 (a bunch of junk)
 55:43:00:01:ea:06:5a:4d:64:00:66:00:e0:06:00:00:78:5e:ed:58:cb:ae:1b:37:12:fd:15:43:6b:47:e0:fb:91:5d:66:11:60:00:cf:2c:c6:cb:60:20:b4:25:46:b7:e1:7e:e8:b6:5a:4e:1c:c3:ff:3e:a7:48:76:37:a9:8b:58:49:90:85:0d:8c:20:dc:cb:62:17:ab:0e:8b:a7:aa:8b:fa:b4:6b:4f:bb:ef:5f:ed:de:7e:1c:8e:4f:d3:38:b4:bf:85:dd:eb:dd:f1:a9:ed:4e:53:18:f0:e4:d3:ee:ed:25:34:ef:c3:14:c7:1f:9a:ee:16:ae:71:78:ec:da:0b:06:ec:f5:ee:da:9e:87:a6:4b:e3:ae:ed:db:39:0d:c7:db:7c:b9:cd:ed:a9:0b:49:9e:9f:c2:d4:2f:7a:bf:b4:c3:fb:34:3a:4f:6d:d7:1d:ba:70:3a:8c:e4:8f:c3:fb:38:cc:e3:8d:1c:e2:f1:14:fa:71:0e:5d:f3:31:4c:cb:f3:cb:14:ae:61:ee:c6:e6:d4:0e:e7:a4:d5:0e:70:15:a7:93:6c:f5:d3:6f:69:d4:8f:a7:40:3e:77:6f:df:48:e1:7e:f8:27:76:37:b4:c7:f7:43:d3:13:ac:62:f6:38:f6:7d:18:66:da:dc:0e:e2:87:30:5d:db:e8:11:3a:af:f8:9e:ed:1d:d3:16:0f:e6:d0:5f:c2:d4:cc:b7:29:1c:7e:26:1f:7b:6d:99:d5:ca:32:e3:b4:d7:ce:19:21:99:32:ce:ea:5a:f7:98:74:8d:b5:de:68:67:bd:52:4c:32:6b:b8:e5:51:b5:1f:87:f1:7a:eb:13:e8:6b:f3:21:bc:a1:48:c6:b0:63:62:08:f3:2f:e3:f4:be:6b:af:79:83:c7:db:84:f3:99:0f:d7:6b:3a:bf:7f:8f:03:1d:5c:8a:d6:e1:12:9e:d7:68:e6:a9:61:9c:8f:4f:69:72:8d:ea:01:a7:75:3f:75:2e:96:9e:da:73:3b:37:5d:9b:35:c6:cb:8c:88:1c:9b:89:3c:42:be:dc:70:24:6f:c6:63:3e:c8:f0:2b:40:e5:98:6d:90:71:24:b7:0b:1d:42:de:d9:8c:68:5c:71:da:fc:4e:16:24:7f:a6:89:09:a7:9a:29:b6:12:e1:27:6c:30:92:e7:f5:ee:cd:3f:fe:f3:ea:2d:66:8f:b4:df:1f:bb:71:9c:5e:fd:0b:bc:9d:c7:69:f7:df:cf:77:d4:05:74:f2:fb:a9:9e:3d:3e:91:f3:8a:cc:1f:c6:ee:16:09:41:c7:ac:9c:75:42:2a:67:40:0d:2e:70:36:e9:e9:21:0c:cd:bb:48:66:84:a6:bf:cd:79:47:27:22:67:31:dc:d4:28:44:63:d7:4c:ed:9c:9f:2f:a4:03:f0:3e:e4:b3:dd:33:c6:b4:74:4c:78:ee:14:f3:5e:38:03:6e:18:23:94:d5:1a:84:92:91:1c:a4:4d:69:b8:ac:30:d2:0a:ab:85:d0:8c:5b:c1:bd:75:44:22:c3:99:d4:5c:1b:82:7c:9e:0e:53:7f:5d:bd:c4:09:32:50:cc:c4:9c:c1:e9:9e:87:75:0b:2f:e3:97:b2:b9:8a:55:9c:cc:d9:c8:28:ad:91:77:4f:63:47:a4:88:74:eb:42:73:8d:db:ff:0c:73:e1:f9:7e:79:78:6e:ba:6e:61:58:78:9e:3f:5e:42:e4:c2:5e:a6:8f:92:c2:58:24:87:45:2e:79:a7:e2:fe:c3:f3:b9:69:87:a4:66:b8:67:ca:5a:c6:25:65:91:e6:c6:b0:bc:e7:f0:fc:9c:54:34:9e:71:89:10:1a:83:03:e4:52:5a:e7:59:56:f9:79:0a:59:4b:20:01:85:76:a4:e2:ad:64:02:ea:2c:85:3b:3c:bf:6b:86:d3:18:1d:46:90:51:bc:ac:22:61:26:be:46:81:90:45:f2:ee:13:84:34:b6:48:6b:e5:19:f6:00:ff:8e:19:ae:c1:a8:6c:9c:20:24:2d:81:f3:75:d2:42:01:47:0f:3c:56:08:b3:ec:25:41:88:7a:1b:84:55:24:08:b2:84:40:c2:02:21:8d:1f:41:48:5a:52:7b:50:89:81:49:52:30:25:15:8a:99:8c:a4:5f:10:44:b5:0d:c1:2a:12:02:55:22:20:61:41:90:c6:8f:10:24:2d:84:9d:59:54:4c:b0:17:e7:aa:2c:72:c1:ae:6a:09:43:54:dc:30:ac:22:61:d0:d1:88:49:1f:67:34:12:d7:71:ed:39:ca:6c:2c:ac:09:5c:d2:4a:e0:d2:f8:11:b8:bc:c2:30:c5:a5:b5:a8:08:d0:33:5a:bf:c0:16:f5:36:6c:24:ae:24:31:65:7c:48:58:20:14:63:f2:95:44:30:d9:6a:cb:85:52:42:7a:c7:30:da:68:9b:7c:45:bd:cd:d7:2a:92:2f:5b:fa:22:61:f1:55:8c:c9:57:12:f1:e2:e1:0c:79:c4:19:aa:87:42:c5:5b:df:59:8b:af:a8:b7:f9:5a:45:f2:e5:32:de:2f:c7:3c:69:25:10:c5:98:40:24:d1:19:ae:28:98:8e:71:e6:8c:12:da:a6:7a:bb:40:88:5a:1b:04:12:39:15:95:f8:2e:db:dd:d5:95:38:b9:94:16:2a:b6:24:2f:65:83:67:39:a5:7e:16:b6:52:00:ec:c8:40:69:38:40:20:1f:35:8e:80:ab:14:fa:a8:b9:95:83:d2:70:2e:01:c9:70:ce:cc:d5:f0:a3:04:2f:ec:96:4b:97:54:5e:ed:e6:7c:5b:ed:3e:c8:da:c2:6c:b9:72:c9:cf:d5:6c:4e:a1:d5:ec:c3:54:2c:0c:97:6b:97:dc:5a:0d:e7:74:58:0d:3f:4a:a3:c2:6e:b9:74:49:98:d5:6e:e6:fa:6a:f7:51:ca:14:76:cb:a5:4b:72:ac:76:33:af:57:bb:8f:d2:a3:b0:5b:2e:5d:f8:be:da:cd:dc:5d:ed:7e:99:f1:85:d5:a8:48:2c:3f:bf:7c:77:6e:6f:41:cd:34:7d:f0:1a:14:f8:eb:9d:94:cb:bb:b2:7a:1f:55:6f:86:aa:48:57:45:b1:2a:4f:55:fd:a8:f2:98:04:5f:0a:9c:55:52:86:96:a5:0a:04:af:50:f0:0a:06:af:70:f0:0a:08:af:90:f0:04:45:a1:79:c6:47:78:87:b3:11:ac:68:01:a2:52:05:51:54:10:45:05:51:54:10:45:05:51:54:10:45:05:51:54:10:45:05:51:54:d1:12:15:16:59:61:91:2b:96:a5:1b:ba:ce:4b:f1:ea:43:7f:68:de:d1:f8:73:fc:2c:b7:a9:dd:9f:6c:66:2d:73:b8:65:18:c5:19:5a:20:e5:c0:e5:a5:c7:b9:ef:69:c9:e9:df:d4:d3:4a:f4:68:0e:ed:33:f5:66:4a:4a:0e:9e:4a:43:12:e7:a9:a3:0e:df:31:5d:37:b5:7f:70:49:dd:d5:f2:38:51:76:b5:7c:89:d3:75:be:c5:e8:fd:6e:00:ee:3b:dd:fe:d6:cd:6d:ee:6c:ef:e3:b9:1c:4f:d9:e9:b2:3d:9a:74:bc:2c:b4:37:68:1e:15:47:f7:ee:95:4e:35:b8:99:e7:26:5d:8a:f6:4c:0b:66:3c:f2:1c:5d:86:73:da:2a:91:6e:7b:45:97:bc:47:e5:4e:5f:ec:56:2b:83:cb:24:d7:12:65:3d:19:c3:ed:b1:1d:d3:56:e0:c1:ca:58:ec:94:64:1a:3e:fd:62:ad:bf:d6:d8:1c:ae:11:28:8b:28:b1:70:e8:a5:d9:ee:05:50:2d:e0:c1:0d:6c:09:b9:95:37:3c:2f:b1:c1:47:fa:1a:6b:a8:a5:ce:97:55:d2:ca:b8:38:6d:e6:74:3b:d2:d5:90:96:24:b6:1e:9f:28:b5:be:32:56:3a:e6:24:0e:0d:ce:04:57:da:d3:a6:18:c3:7d:0b:b4:4b:ad:df:4b:5e:2a:ba:6c:a1:af:61:b8:97:30:67:8d:c3:ad:0c:95:17:47:8a:12:ce:62:f1:fe:3f:33:bf:31:66:52:99:ff:aa:98:a9:f7:20:95:50:5e:0a:cf:25:22:e9:34:f6:ac:d1:7f:a1:06:fe:6e:c5:34:7b:6a:4a:18:62:27:10:00:86:d5:68:34:d1:60:6a:2f:6c:ea:ad:be:55:62:72:7a:a3:33:41:64:13:78:09:18:e9:b8:93:f9:87:90:8a:9d:5c:a7:2f:ae:f7:da:2b:6a:80:bc:d3:1b:9f:0a:1a:fc:55:16:72:ef:bc:e4:9e:09:a3:d0:69:39:fa:69:62:f9:bd:ee:9e:8e:d8:0e:be:68:ef:05:90:a0:37:b7:6e:4b:94:c7:9c:a4:66:e3:ab:e2:a4:47:87:09:3a:71:5c:eb:1c:b6:65:b4:33:3e:5d:89:5e:52:31:fe:22:c5:39:ba:65:50:58:0b:74:b6:48:4c:0e:94:28:98:38:f1:a5:2f:fd:c6:88:78:47:36:5c:e0:e8:8b:fc:d4:74:9d:b3:96:1b:69:bc:59:ef:1b:5f:a4:9b:8c:7c:93:1c:8d:8d:e1:c2:7a:91:ef:c9:35:db:e2:5d:4e:58:21:b9:82:51:a4:01:f2:5b:94:ba:35:fb:7d:fc:a2:76:3b:14:3f:fc:97:5a:a9:a2:ee:7e:89:72:e9:f3:3f:c3:42:87:88

 UC%JMdf{"id": "SubscriptionReply"}
 55:43:00:01:25:00:4a:4d:64:00:66:00:1b:00:00:00:7b:22:69:64:22:3a:20:22:53:75:62:73:63:72:69:70:74:69:6f:6e:52:65:70:6c:79:22:7d
 */


//UCKAed
var keep_alive = Buffer.from('5543000106004b4166006400', 'hex');

var client = new net.Socket({'allowHalfOpen': true});
client.connect(51383, '192.168.0.101', function() {
    console.log('Connected');
    client.write(init_request);
    setTimeout(function()  {
        console.log('Sending 2nd command now');
        client.write(subscription_request);
        console.log('2nd command sent');
    }, 100);
    setTimeout(function()  {
        console.log('starting keep alive');
        setInterval(function() {
            client.write(keep_alive);
            console.log('keep alive sent')
        }, 3000)
    }, 500);
    console.log('Data written');
});

client.on('data', function(data) {
    console.log('Data Received: ');
    console.log(data);
});

client.on('close', function() {
    console.log('Connection closed');
});

client.on('error', function(error) {
    console.log('ERROR');
    console.log(error);
});

/*
 ****** got this (list of endpoints?)

 55:43:00:01:2e:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:6e:6f:74:63:68:2f:6e:6f:74:63:68:66:72:65:71:35:00:00:00:47:77:0f:3f:55:43:00:01:2e:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:6e:6f:74:63:68:2f:6e:6f:74:63:68:66:72:65:71:36:00:00:00:61:27:29:3f:55:43:00:01:2e:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:6e:6f:74:63:68:2f:6e:6f:74:63:68:66:72:65:71:37:00:00:00:7c:d7:42:3f:55:43:00:01:2e:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:6e:6f:74:63:68:2f:6e:6f:74:63:68:66:72:65:71:38:00:00:00:95:87:5c:3f:55:43:00:01:27:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:67:65:71:2f:67:61:69:6e:31:00:00:00:17:6c:01:3f:55:43:00:01:28:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:67:65:71:2f:67:61:69:6e:31:38:00:00:00:d2:27:fd:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:67:65:71:2f:6f:6e:00:00:00:00:00:80:3f:55:43:00:01:26:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:7f:41:35:3f:55:43:00:01:2a:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:31:2f:6f:75:74:70:75:74:73:74:75:62:00:00:00:7f:41:35:3f:55:43:00:01:26:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:32:2f:76:6f:6c:75:6d:65:00:00:00:7f:41:35:3f:55:43:00:01:2a:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:32:2f:6f:75:74:70:75:74:73:74:75:62:00:00:00:7f:41:35:3f:55:43:00:01:26:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:33:2f:76:6f:6c:75:6d:65:00:00:00:7f:41:35:3f:55:43:00:01:2a:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:33:2f:6f:75:74:70:75:74:73:74:75:62:00:00:00:7f:41:35:3f:55:43:00:01:26:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:34:2f:76:6f:6c:75:6d:65:00:00:00:7f:41:35:3f:55:43:00:01:2a:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:34:2f:6f:75:74:70:75:74:73:74:75:62:00:00:00:7f:41:35:3f:55:43:00:01:06:00:4b:41:65:00:64:00

 UC.PVedSpeaker/line/ch1/notch/notchfreq5Gw?UC.PVedSpeaker/line/ch1/notch/notchfreq6a')?UC.PVedSpeaker/line/ch1/notch/notchfreq7|×B?UC.PVedSpeaker/line/ch1/notch/notchfreq8\?UC'PVedSpeaker/line/ch1/geq/gain1l?UC(PVedSpeaker/line/ch1/geq/gain18Ò'ý>UC$PVedSpeaker/line/ch1/geq/on?UC&PVedSpeaker/output/ch1/volumeA5?UC*PVedSpeaker/output/ch1/outputstubA5?UC&PVedSpeaker/output/ch2/volumeA5?UC*PVedSpeaker/output/ch2/outputstubA5?UC&PVedSpeaker/output/ch3/volumeA5?UC*PVedSpeaker/output/ch3/outputstubA5?UC&PVedSpeaker/output/ch4/volumeA5?UC*PVedSpeaker/output/ch4/outputstubA5?UCKAed

 ****** then this later (maybe I opened the control panel?)

 55:43:00:01:19:00:50:56:64:00:65:00:53:70:65:61:6b:65:72:2f:77:69:6e:6b:00:00:00:00:00:80:3f

 UCPVdeSpeaker/wink?

 **** Sent this command to set master to 7 db:

 UC$PVedSpeaker/line/ch1/volume;½g?

 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:3b:bd:67:3f

 **** Recieved this back:

 UC$PVdeSpeaker/line/ch1/volume;½g?

 55:43:00:01:24:00:50:56:64:00:65:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:3b:bd:67:3f

 **** Turned limiter on

 UC"PVedSpeaker/remote_lim_on?

 55:43:00:01:22:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:72:65:6d:6f:74:65:5f:6c:69:6d:5f:6f:6e:00:00:00:00:00:80:3f

 (no response)

 **** Sent this command to set master to 4 db:

 UC$PVedSpeaker/line/ch1/volumeQ?

 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:17:14:51:3f


 **** Sent this command to set master to 0 db:

 UC$PVedSpeaker/line/ch1/volumeA5?

 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:7f:41:35:3f


 **** Sent this command to set master to -5 db:

 UC$PVedSpeaker/line/ch1/volumeP"?

 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:50:22:16:3f


 **** Sent this command to set master to -9 db:

 UC$PVedSpeaker/line/ch1/volume?

 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:00:00:00:3f

 **** Dragged to set master to -35.14 db:

 UC$PVedSpeaker/line/ch1/volumeÊàü>
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:ca:e0:fc:3e

 UC$PVedSpeaker/line/ch1/volumeÁù>UCKAed
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:91:c1:f9:3e:55:43:00:01:06:00:4b:41:65:00:64:00

 UC$PVedSpeaker/line/ch1/volumeó>
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:1e:83:f3:3e

 UC$PVedSpeaker/line/ch1/volumeu%ê>UC$PVedSpeaker/line/ch1/volume^Ú>
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:75:25:ea:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:5e:89:da:3e

 UC$PVedSpeaker/line/ch1/volume¶+Ñ>UC$PVedSpeaker/line/ch1/volumefp¾>UC$PVedSpeaker/line/ch1/volumeó±>
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:b6:2b:d1:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:66:70:be:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:89:f3:b1:3e

 UC$PVedSpeaker/line/ch1/volumeµ«>UC$PVedSpeaker/line/ch1/volumeÚ>UC$PVedSpeaker/line/ch1/volume>
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:12:b5:ab:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:8a:da:95:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:19:9c:8f:3e

 UC$PVedSpeaker/line/ch1/volume©]>
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:a9:5d:89:3e

 UC$PVedSpeaker/line/ch1/volume9>UC$PVedSpeaker/line/ch1/volume s>UC$PVedSpeaker/line/ch1/volume°Dm>UC$PVedSpeaker/line/ch1/volume}N>
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:39:1f:83:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:20:83:73:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:b0:44:6d:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:7d:0c:4e:3e

 UC$PVedSpeaker/line/ch1/volumeÎG>UC$PVedSpeaker/line/ch1/volume,Q;>
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:0f:ce:47:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:2c:51:3b:3e

 UC$PVedSpeaker/line/ch1/volume½5>
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:bd:12:35:3e

 UC$PVedSpeaker/line/ch1/volumeMÔ.>UC$PVedSpeaker/line/ch1/volumeÝ(>
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:4d:d4:2e:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:dd:95:28:3e

 UC$PVedSpeaker/line/ch1/volumemW">UC$PVedSpeaker/line/ch1/volumeú>
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:6d:57:22:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:fa:18:1c:3e

 UC$PVedSpeaker/line/ch1/volumeÚ>UC$PVedSpeaker/line/ch1/volume>
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:8a:da:15:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:1a:9c:0f:3e

 UC$PVedSpeaker/line/ch1/volume©]	>
 55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:a9:5d:09:3e


 /*
 **** after drag, and auto disconnect -> reconnect.

 UCPVedSpeaker/winkUCUMdýUC§JMed{"id": "Subscribe","clientName": "SL Room Control","clientType": "Mac","clientDescription": "Eric\'s MacBook Air","clientIdentifier": "Ericâs MacBook Air"}UC"PVedSpeaker/remotelayeron?UC!PSedSpeaker/nicknameSL328AIUC"PVedSpeaker/remote_peq_on?UC"PVedSpeaker/remote_lim_on?UC"PVedSpeaker/remote_geq_on?UCPVedSpeaker/digitalinUC$PVedSpeaker/line/ch1/volume©]	>UC+PVedSpeaker/line/ch1/volume_enable?UC(PVedSpeaker/line/ch1/eq/eqgain1éy?UC%PVedSpeaker/line/ch1/eq/eqq1¡u?UC(PVedSpeaker/line/ch1/eq/eqfreq1ÿv>UC*PVedSpeaker/line/ch1/eq/eqbandon1?UC%PVedSpeaker/line/ch1/eq/eqq2çE?UC(PVedSpeaker/line/ch1/eq/eqfreq2óÍ>UC%PVedSpeaker/line/ch1/eq/eqq3çE?UC(PVedSpeaker/line/ch1/eq/eqfreq3%.¸>UC%PVedSpeaker/line/ch1/eq/eqq4çE?UC(PVedSpeaker/line/ch1/eq/eqfreq4Zë>UC(PVedSpeaker/line/ch1/eq/eqtype5«ª*?UC%PVedSpeaker/line/ch1/eq/eqq5çE?UC(PVedSpeaker/line/ch1/eq/eqfreq5Gw?UC*PVedSpeaker/line/ch1/eq/eqbandop5?UC(PVedSpeaker/line/ch1/eq/eqfreq6a')?UC(PVedSpeaker/line/ch1/eq/eqfreq7|×B?UC(PVedSpeaker/line/ch1/eq/eqfreq8\?UC.PVedSpeaker/line/ch1/notch/notchfreq1zÛ">UC.PVedSpeaker/line/ch1/notch/notchfreq2óÍ>UC.PVedSpeaker/line/ch1/notch/notchfreq3%.¸>
 55:43:00:01:19:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:77:69:6e:6b:00:00:00:00:00:00:00:55:43:00:01:08:00:55:4d:00:00:64:00:88:fd:55:43:00:01:a7:00:4a:4d:65:00:64:00:9d:00:00:00:7b:22:69:64:22:3a:20:22:53:75:62:73:63:72:69:62:65:22:2c:22:63:6c:69:65:6e:74:4e:61:6d:65:22:3a:20:22:53:4c:20:52:6f:6f:6d:20:43:6f:6e:74:72:6f:6c:22:2c:22:63:6c:69:65:6e:74:54:79:70:65:22:3a:20:22:4d:61:63:22:2c:22:63:6c:69:65:6e:74:44:65:73:63:72:69:70:74:69:6f:6e:22:3a:20:22:45:72:69:63:5c:27:73:20:4d:61:63:42:6f:6f:6b:20:41:69:72:22:2c:22:63:6c:69:65:6e:74:49:64:65:6e:74:69:66:69:65:72:22:3a:20:22:45:72:69:63:e2:80:99:73:20:4d:61:63:42:6f:6f:6b:20:41:69:72:22:7d:55:43:00:01:22:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:72:65:6d:6f:74:65:6c:61:79:65:72:6f:6e:00:00:00:00:00:80:3f:55:43:00:01:21:00:50:53:65:00:64:00:53:70:65:61:6b:65:72:2f:6e:69:63:6b:6e:61:6d:65:00:00:00:53:4c:33:32:38:41:49:00:55:43:00:01:22:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:72:65:6d:6f:74:65:5f:70:65:71:5f:6f:6e:00:00:00:00:00:80:3f:55:43:00:01:22:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:72:65:6d:6f:74:65:5f:6c:69:6d:5f:6f:6e:00:00:00:00:00:80:3f:55:43:00:01:22:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:72:65:6d:6f:74:65:5f:67:65:71:5f:6f:6e:00:00:00:00:00:80:3f:55:43:00:01:1e:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:64:69:67:69:74:61:6c:69:6e:00:00:00:00:00:00:00:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:a9:5d:09:3e:55:43:00:01:2b:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:76:6f:6c:75:6d:65:5f:65:6e:61:62:6c:65:00:00:00:00:00:80:3f:55:43:00:01:28:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:67:61:69:6e:31:00:00:00:e9:79:1e:3f:55:43:00:01:25:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:71:31:00:00:00:a1:75:03:3f:55:43:00:01:28:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:66:72:65:71:31:00:00:00:ff:17:76:3e:55:43:00:01:2a:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:62:61:6e:64:6f:6e:31:00:00:00:00:00:80:3f:55:43:00:01:25:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:71:32:00:00:00:e7:97:45:3f:55:43:00:01:28:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:66:72:65:71:32:00:00:00:f3:cd:84:3e:55:43:00:01:25:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:71:33:00:00:00:e7:97:45:3f:55:43:00:01:28:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:66:72:65:71:33:00:00:00:25:2e:b8:3e:55:43:00:01:25:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:71:34:00:00:00:e7:97:45:3f:55:43:00:01:28:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:66:72:65:71:34:00:00:00:5a:8e:eb:3e:55:43:00:01:28:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:74:79:70:65:35:00:00:00:ab:aa:2a:3f:55:43:00:01:25:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:71:35:00:00:00:e7:97:45:3f:55:43:00:01:28:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:66:72:65:71:35:00:00:00:47:77:0f:3f:55:43:00:01:2a:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:62:61:6e:64:6f:70:35:00:00:00:00:00:80:3f:55:43:00:01:28:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:66:72:65:71:36:00:00:00:61:27:29:3f:55:43:00:01:28:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:66:72:65:71:37:00:00:00:7c:d7:42:3f:55:43:00:01:28:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:65:71:2f:65:71:66:72:65:71:38:00:00:00:95:87:5c:3f:55:43:00:01:2e:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:6e:6f:74:63:68:2f:6e:6f:74:63:68:66:72:65:71:31:00:00:00:7a:db:22:3e:55:43:00:01:2e:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:6e:6f:74:63:68:2f:6e:6f:74:63:68:66:72:65:71:32:00:00:00:f3:cd:84:3e:55:43:00:01:2e:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:6e:6f:74:63:68:2f:6e:6f:74:63:68:66:72:65:71:33:00:00:00:25:2e:b8:3e

 *** and a few packets later:

 UC.PVedSpeaker/line/ch1/notch/notchfreq4Zë>UC.PVedSpeaker/line/ch1/notch/notchfreq5Gw?UC.PVedSpeaker/line/ch1/notch/notchfreq6a')?UC.PVedSpeaker/line/ch1/notch/notchfreq7|×B?UC.PVedSpeaker/line/ch1/notch/notchfreq8\?UC'PVedSpeaker/line/ch1/geq/gain1l?UC(PVedSpeaker/line/ch1/geq/gain18Ò'ý>UC$PVedSpeaker/line/ch1/geq/on?UC&PVedSpeaker/output/ch1/volumeA5?UC*PVedSpeaker/output/ch1/outputstubA5?UC&PVedSpeaker/output/ch2/volumeA5?UC*PVedSpeaker/output/ch2/outputstubA5?UC&PVedSpeaker/output/ch3/volumeA5?UC*PVedSpeaker/output/ch3/outputstubA5?UC&PVedSpeaker/output/ch4/volumeA5?UC*PVedSpeaker/output/ch4/outputstubA5?UCKAed
 55:43:00:01:2e:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:6e:6f:74:63:68:2f:6e:6f:74:63:68:66:72:65:71:34:00:00:00:5a:8e:eb:3e:55:43:00:01:2e:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:6e:6f:74:63:68:2f:6e:6f:74:63:68:66:72:65:71:35:00:00:00:47:77:0f:3f:55:43:00:01:2e:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:6e:6f:74:63:68:2f:6e:6f:74:63:68:66:72:65:71:36:00:00:00:61:27:29:3f:55:43:00:01:2e:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:6e:6f:74:63:68:2f:6e:6f:74:63:68:66:72:65:71:37:00:00:00:7c:d7:42:3f:55:43:00:01:2e:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:6e:6f:74:63:68:2f:6e:6f:74:63:68:66:72:65:71:38:00:00:00:95:87:5c:3f:55:43:00:01:27:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:67:65:71:2f:67:61:69:6e:31:00:00:00:17:6c:01:3f:55:43:00:01:28:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:67:65:71:2f:67:61:69:6e:31:38:00:00:00:d2:27:fd:3e:55:43:00:01:24:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6c:69:6e:65:2f:63:68:31:2f:67:65:71:2f:6f:6e:00:00:00:00:00:80:3f:55:43:00:01:26:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:31:2f:76:6f:6c:75:6d:65:00:00:00:7f:41:35:3f:55:43:00:01:2a:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:31:2f:6f:75:74:70:75:74:73:74:75:62:00:00:00:7f:41:35:3f:55:43:00:01:26:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:32:2f:76:6f:6c:75:6d:65:00:00:00:7f:41:35:3f:55:43:00:01:2a:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:32:2f:6f:75:74:70:75:74:73:74:75:62:00:00:00:7f:41:35:3f:55:43:00:01:26:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:33:2f:76:6f:6c:75:6d:65:00:00:00:7f:41:35:3f:55:43:00:01:2a:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:33:2f:6f:75:74:70:75:74:73:74:75:62:00:00:00:7f:41:35:3f:55:43:00:01:26:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:34:2f:76:6f:6c:75:6d:65:00:00:00:7f:41:35:3f:55:43:00:01:2a:00:50:56:65:00:64:00:53:70:65:61:6b:65:72:2f:6f:75:74:70:75:74:2f:63:68:34:2f:6f:75:74:70:75:74:73:74:75:62:00:00:00:7f:41:35:3f:55:43:00:01:06:00:4b:41:65:00:64:00


 */
