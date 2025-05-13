const net = require('net');
const tls = require('tls');
const fs = require('fs');

class Url {
	constructor(urlStr) {
		this.fullUrl = urlStr;
		let rest;
		[this.schema, rest] = urlStr.split('://');
		let hostAndPath = rest.split('/');
		this.host = hostAndPath.shift(); // First item is host:port
		this.path = '/' + hostAndPath.join('/'); // Recombine rest as path
		let port;
		[this.host, port] = this.host.split(':');
		this.port = port || (this.schema === 'https' ? 443 : 80);
	}
}
const request = async (url, redirectCount = 0) => {
	if(redirectCount > 10) throw new Error('Too many redirects');
	let clint;
	const port = url.port; 
	let respond = '';

	if(url.schema === 'file') {
		const stats = await fs.promises.stat(url.path);
		if (stats.isFile()) {
			respond = await fs.promises.readFile(url.path, { encoding : "utf8"});
			return [ 'text', respond ]
		} else {
			return console.log('Path is not a file:', url.path);
		}
	}

	if(url.schema === 'https') {
		clint = await new Promise((resolve) => {
			socket =  tls.connect({
				host: url.host,
				port: port,
				servername: url.host,
				rejectUnauthorized: true
			}, () => {
				console.log('connected');
				resolve(socket);
			});
		});

	} else if(url.schema === 'http') {
		clint = await new Promise((resolve) => {
			const socket =	net.connect({host: url.host, port: port}, () => {
				console.log('connected');
				resolve(socket);
			});
		});
	}
	const data = await new Promise((resolve, reject) => {
		let respond = '';
		let request = `GET ${url.path} HTTP/1.1\r\n`;
		request += `Host: ${url.host}\r\n`;
		request += `User-Agent: Zrowser\r\n`;
		request += `Connection: close\r\n`;  // <- force server to close
		request += "\r\n";
		clint.setEncoding('utf8');
		clint.write(request);
		clint.on('data', (data) => {
			respond += data;
		});
		clint.on('end', () => {
			resolve(respond);
		});
		clint.on('error', (error) => {
			reject(error);
		});
	});
	return handleResponse(data, url, redirectCount);
};

const handleResponse = (res, url, redirectCount) => {
	let header, body;
	[ header, body] = res.split('\r\n\r\n');
	header = header.split('\r\n');
	const st = header.shift().split(" ");
	const headers = {};
	header.forEach((line) => {
		headers[line.split(':')[0]] = line.split(': ')[1];
	});
	const stcode = Number( st[1] );
	
	if(stcode >= 300 && stcode <= 308) {
		if(headers.Location.startsWith('/')) {
			url.path = headers.Location; 
		} else {
			url = new Url(headers.Location);
		}
		console.log('redirect to:', url);
		return request(url, redirectCount + 1);
	}
	return [ [ st, headers ], body];
}

module.exports = { Url, request, handleResponse };
