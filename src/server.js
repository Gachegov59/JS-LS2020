// const http = require('http')
//
// http
//     .createServer((req, res) => {
//
//     })
//     .listen(8800, ()=>{
//
//     })

const http = require('http')
const server = http.createServer();

server.on('request', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.writeHead(200, { 'content-Type': 'text/plain' });
    res.end('12111')

})

server.listen(3000, '127.0.0.1', () => console.log('сервер работате'))