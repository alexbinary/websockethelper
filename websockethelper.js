/**
 * websockethelper.js - websocket helper
 *
 * @author Alexandre Bintz
 * dec. 2014
 */

"use strict";

/**
 * WebSocket
 *
 * @constructor
 *
 * @param {string} pUrl       - server URL
 * @param {array}  pProtocols - list of acceptable sub-protocols
 */
function WebSocketHelper(pUrl, pProtocols) {

  this.socket = null;

  this.onReady   = null;
  this.onClose   = null;
  this.onError   = null;
  this.onMessage = null;

  this.acceptUndefinedProtocol = true;

  this.socketUrl       = pUrl       || null;
  this.socketProtocols = pProtocols ||   [];
}

/**
 * WebSocketHelper - connect socket
 *
 * @param {string} pUrl       - server URL
 * @param {array}  pProtocols - list of acceptable sub-protocols
 */
WebSocketHelper.prototype.connect = function(pUrl, pProtocols) {

  this.socketUrl       = pUrl       || this.socketUrl;
  this.socketProtocols = pProtocols || this.socketProtocols || [];

  console.log('opening websocket to ' + this.socketUrl + ' with protocols [' + this.socketProtocols.join(', ') + ']...');

  this.socket = new WebSocket(this.socketUrl, this.socketProtocols);

  var _this = this; // _this references the current WebSocketHelper object

  this.socket.onopen = function onSocketOpen() {

    var selectedProtocol = _this.socket.protocol;

    console.log('socket open, selected protocol is: '+ (selectedProtocol ? selectedProtocol : 'none'));

    if(!_this.isProtocolAcceptable(selectedProtocol)) {

      console.error('ERROR: the server selected an incorrect protocol, closing connection');

      if(typeof _this.onError == 'function') {
        _this.onError('the server selected an incorrect protocol: ' + (selectedProtocol ? selectedProtocol : 'none'));
      }

      _this.close(1000, 'incorrect protocol');
      return;
    }

    if(typeof _this.onReady == 'function') {
      _this.onReady(_this.socket.protocol);
    }
  };

  this.socket.onerror = function onSocketError() {

    console.error('ERROR: socket error');

    if(typeof _this.onError == 'function') {
      _this.onError();
    }
  };

  this.socket.onclose = function onSocketClose(pEvent) {

    console.log('socket closed by server: ' + pEvent.code + ': ' + pEvent.reason + '(' + (pEvent.wasClean ? 'clean' : 'dirty') + ')');

    if(typeof _this.onClose == 'function') {
      _this.onClose(pEvent);
    }
  };

  this.socket.onmessage = function onSocketMessage(pEvent) {

    console.log('socket message: ');
    console.log(pEvent);

    if(typeof _this.onMessage == 'function') {
      _this.onMessage(pEvent.data, pEvent);
    }
  };
}

/**
 * WebSocketHelper - close connection
 *
 * @param {number} pCode   - close code - see https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Close_codes
 * @param {string} pReason - human readable string explaining why the connection is closing
 */
WebSocketHelper.prototype.close = function(pCode, pReason) {

  console.log('socket closing with code: ' + pCode + ' and reason: ' + pReason);

  if(!this.isConnected()) {
    console.error('ERROR: socket is not connected');
    return;
  }

  if(pCode) {
    if(pReason) {
      this.socket.close(pCode, pReason);
    } else {
      this.socket.close(pCode);
    }
  } else {
    this.socket.close();
  }
}

/**
 * WebSocketHelper - send message
 *
 * @param {string} pMessage - message to send
 */
WebSocketHelper.prototype.send = function(pMessage) {

  console.log('socket sending message: ');
  console.log(pMessage);

  if(!this.isConnected()) {
    console.error('ERROR: socket is not connected');
    return;
  }

  this.socket.send(pMessage);
}

/**
 * WebSocketHelper - returns whether socket is properly connected
 * This is not the opposite of isClosed()
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants
 *
 * @return {bool} true if properly connected
 */
WebSocketHelper.prototype.isConnected = function() {

  return this.socket && this.socket.readyState == WebSocket.OPEN;
}

/**
 * WebSocketHelper - returns whether socket is properly closed or uninitialized
 * This is not the opposite of isConnected()
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants
 *
 * @return {bool} true if properly closed or uninitialized
 */
WebSocketHelper.prototype.isClosed = function() {

  return !this.socket || this.socket.readyState == WebSocket.CLOSED;
}

/**
 * WebSocketHelper - returns whether the given websocket sub-protocol is acceptable
 *
 * @param {string} pProtocol - the proposed protocol
 *
 * @return {bool} true if the protocol is acceptable
 */
WebSocketHelper.prototype.isProtocolAcceptable = function(pProtocol) {

  return (
    this.socketProtocols.indexOf(pProtocol) != -1
    || pProtocol == '' && this.acceptUndefinedProtocol
  );
}
