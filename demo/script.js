/**
 * script.js - websockethelper demo
 *
 * @author Alexandre Bintz
 * dec. 2014
 */

"use strict";

var socketHelper = new WebSocketHelper();

socketHelper.onReady = onReady;
socketHelper.onClose = onClose;
socketHelper.onError = onError;
socketHelper.onMessage = onMessage;

var inWsUrl        = document.getElementById('input-wsurl');
var inWsProtocols  = document.getElementById('input-wsprotocols');
var outStatus      = document.getElementById('output-connectionstatus');
var outError       = document.getElementById('output-error');
var outProtocol    = document.getElementById('output-selectedprotocol');
var btnConnect     = document.getElementById('btn-connect');
var formConnection = document.getElementById('form-connection');
var formMessage    = document.getElementById('form-message');
var inMessage      = document.getElementById('input-message');
var divlog         = document.getElementById('log');

formConnection.addEventListener('submit', function(pEvent) {
  pEvent.preventDefault();
  connect();
});
formMessage.addEventListener('submit', function(pEvent) {
  pEvent.preventDefault();
  send();
});

function onReady(pProtocol) {

  outStatus.textContent = 'connected';
  outProtocol.textContent = pProtocol ? pProtocol : 'none';
  btnConnect.textContent = 'Disconnect';
  btnConnect.disabled = false;
  inMessage.disabled = false;
  inWsUrl.disabled = true;
  inWsProtocols.disabled = true;

  log('connected to ' + socketHelper.socketUrl + ' with protocol: ' + (pProtocol ? pProtocol : 'none'));

  inMessage.focus();
}

function onClose(pEvent) {

  var status = pEvent.code + ': ' + pEvent.reason + ' (' + (pEvent.wasClean ? 'clean' : 'dirty') + ')';

  outStatus.textContent = 'closed (' + status + ')';
  outProtocol.textContent = '';
  btnConnect.textContent = 'Connect';
  btnConnect.disabled = false;
  inMessage.disabled = true;
  inWsUrl.disabled = false;
  inWsProtocols.disabled = false;

  log('disconnected (' + status + ')');
}

function onError(pError) {

  var out = 'ERROR' + (pError ? ': ' + pError : '');

  outError.textContent = out;

  log(out);
}

function onMessage(pMessage) {

  log('RCVD - ' + pMessage);
}

function connect() {

  if(socketHelper.isConnected()) {

    btnConnect.disabled = true;
    outStatus.textContent = 'disconnecting...';
    socketHelper.close();

    log('closing connection');

  } else if(socketHelper.isClosed()) {

    btnConnect.disabled = true;
    outStatus.textContent = 'connecting...';
    socketHelper.connect(getWsUrl(), getWsProtocols());
    outError.textContent = '';

    log('attempting connection to ' + socketHelper.socketUrl + ' with protocols: ' + (socketHelper.socketProtocols.length ? socketHelper.socketProtocols.join(', ') : 'none'));
  }
}

function getWsUrl() {

  return inWsUrl.value;
}

function getWsProtocols() {

  /*
   * clean protocol list and return it
   */

  var protocolsRaw = inWsProtocols.value.split(',').map(function(p) {
    return p.trim();
  });
  var protocolsClean = [];

  /* delete empty strings
   */
  for(var i in protocolsRaw) {
    if(protocolsRaw[i]) {
      protocolsClean.push(protocolsRaw[i]);
    }
  }

  inWsProtocols.value = protocolsClean.join(', ');

  return protocolsClean;
}

function send() {

  var message = inMessage.value;
  inMessage.value = '';

  socketHelper.send(message);

  log('SENT - ' + message);
}

function log(pText) {

  var p = document.createElement('p');
  p.appendChild(document.createTextNode(new Date() + ' - ' + pText));
  divlog.appendChild(p);
}
