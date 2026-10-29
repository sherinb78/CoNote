const { WebSocketServer } = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils.js');

const wss = new WebSocketServer({ port: 1234 });

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req);
});

console.log('Yjs WebSocket server running on ws://localhost:1234');