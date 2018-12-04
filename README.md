# sl-room-control

## Code Design

### locator.js

Uses `pcap` library to watch for speaker broadcast events on the wire.  If it sees a speaker that is not yet subscribed,
it emits a `new` event.

An event handler watches for `new` events.  When sent, it creates a new `monitor.js` connection with the data from the
broadcast event.

### monitor.js

Uses `pcap` library to watch for events from a specific speaker address.  When data is recieved, it emits events based
on the type of data.  So far we have seen 3 types of data: `level` events, `settings` updates, and some other
`"unknown"` type.

When a monitor is setup, it also creates a `connection.js` connection to communicate back to the speaker.

### connection.js

Uses the node.js net.Socket methods to create a TCP connection to the speaker, using the address and port found in the
initial speaker broadcast.

After opening a connection to the speaker, several commands are sent:
* An "initialization" message to start communication
* A "subscription" message to start receiving events from the speaker
* After the above 2 are sent, a "keep alive" message is sent every 3 seconds

All data returned from the speaker on this connection is currently logged.

### shared.js

A library of shared functions used in the above 3 classes.  Mostly encoder and decoder functions for the data being
sent to and recieved from the speaker.


