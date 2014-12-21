
# WebSocketHelper

Minimalist wrapper for `WebSocket` native object in the browser.

The main advantage is that the object is not linked to a connection.
You can configure connection parameters and event handler at startup and connect later,
or disconnect then reconnect to another server without having to reapply the configuration.


# Documentation

## Constructor

### WebSocketHelper([url], [protocols])

`url` : websocket server URL (optional)  
`protocols`: array of accepted sub-protocols (optional)

If valid values are passed they are stored in the `socketUrl` and `socketProtocols` properties respectively.

See `socketProtocols` property's documentation for details about accepted sub-protocols.

The socket is not connected. Call `connect()` to open the connection using the given parameters.


## Properties

### socket

Underlying native `WebSocket` object. May be `null`.

### onReady

Callback called when socket is ready to send and receive data.

Selected sub-protocol is passed as first argument.

### onClose

Callback called when socket is closed.

Close event is passed as first argument. See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent.

### onError

Callback called when socket encounters an error.

An error message can be passed as first parameter.

### onMessage

Callback called when socket receives data.

Message data is passed as first argument.  
Message event is passed as second argument. See https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent.

### socketUrl

URL of the server.

The value of this property is used by function `connect()` when called with no arguments.  
The value of this property is set by constructor and `connect()` when called with the `url` parameter.

### socketProtocols

Array of accepted sub-protocols (only used when using `connect()` with no arguments).

The value of this property is used by function `connect()` when called with no arguments.  
The value of this property is set by constructor and `connect()` when called with the `protocols` parameter.

When trying to connect to a server, the connection will be rejected if :
- the server selects a sub-protocol that is not in this list or
- the server does not select any protocol and this list is not empty.


## Methods

### connect([url], [protocols])

Open socket connection.

`url` : websocket server URL (optional)  
`protocols`: array of accepted sub-protocols (optional)

Both `url` and `protocols` can be omitted.
If valid values are passed they are used and stored in the `socketUrl` and `socketProtocols` properties respectively.
If they are omitted, previous values of `socketUrl` and `socketProtocols` properties are used.

See `socketProtocols` property's documentation for details about accepted sub-protocols.

If the connection is not accepted due to an incorrect protocol, `onError` is called.

### close([code], [reason])

Close connection.

`code` : close code, see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Close_codes  
`reason` : human readable string explaining why the connection is closing

Both arguments are optional.
Default value for `code` is `1000`, indicating a normal closure.

### send(message)

Send data through socket. `message` can be a string, Blob, or ArrayBuffer.

### isConnected()

Indicates whether the connection is properly open and ready for sending or receiving.

### isClosed()

Indicates whether the connection is properly closed or uninitialized.


# Run the demo

Host the pages in `demo/` on an HTTP server then load `index.html`.


# Infos

WebSocket overview on MDN : https://developer.mozilla.org/en-US/docs/Web/API/WebSocket  


# Contact

Alexandre Bintz <alexandre.bintz@gmail.com>  
Comments or suggestions are welcome.
