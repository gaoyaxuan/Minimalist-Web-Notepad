const nodeStatic = require('node-static');
const http = require('http');
const ywsUtils = require('y-websocket/bin/utils')
const setupWSConnection = ywsUtils.setupWSConnection
const WebSocket = require('ws')

port = 3000
const distFolder = new nodeStatic.Server('./dist');

const server = http.createServer(function (req, res) {
    distFolder.serve(req, res, function (err, result) {
        // Fallback for history mode
        if (err !== null && err.status === 404) {
            distFolder.serveFile('/index.html', 200, {}, req, res);
        }
    });

}).listen(port, () => {
    console.log('Server listening on: http://localhost:%s', port)
})


const wss = new WebSocket.Server({server})

wss.on('connection', (conn, req) => {
    setupWSConnection(conn, req)
})


