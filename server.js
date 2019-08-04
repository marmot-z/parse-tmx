const {createServer} = require('http'); 
const {createReadStream} = require('fs');
const {parse} = require('url');
const {resolve} = require('path');

createServer(function (request, response) {   
    let {pathname} = parse(request.url);
    let path = resolve(decodeURIComponent(pathname).slice(1));

    if (request.url.indexOf('js') > -1) {
        response.writeHead(200, {'Content-Type': 'application/javascript'});
    } else if (request.url.indexOf('html') > -1) {
        response.writeHead(200, {'Content-Type': 'text/html'});
    } else if (request.url.indexOf('png') > -1) {
        response.writeHead(200, {'Content-Type': 'image/png'});        
    } else if (request.url.indexOf('tmx') > -1 || request.url.indexOf('tsx') > -1) {
        response.writeHead(200, {'Content-Type': 'application/xml'});
    }

    createReadStream(path).pipe(response);
}).listen(3000); 

console.log('Node.js web server at port 3000 is running..')