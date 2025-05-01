const net = require('node:net')

class Url {
	constructor(url) {
		[this.schema, url] = url.split('://');
		[this.host, this.path] = url.split('/', 1);
		this.path = (this.path) ? '/' + this.path : '/';
		this.port = 80;
	}

	request() {
		const clint = net.connect({host: this.host, port: this.port}, () => {
			clint.on('connect', () => console.log('connected'))
		});
		let respond = '';
		let request = `GET ${this.path} HTTP/1.0\r\n`;
		request += `Host: ${this.host}\r\n`;
		request += "\r\n";
		clint.write(request);
		clint.on('data', (data) => {
			respond += data;
		});
		clint.on('end', () => {
			this.handleRespons(respond);
		});
	}

	handleRespons(res) {
		let [header, body] = res.split('\r\n\r\n');
		header = header.split('\r\n');
		const st = header.shift();
		const headers = {};
		header.forEach((line) => {
			headers[line.split(':')[0]] = line.split(': ')[1];
		});
		const size = Number(headers['Content-Length']);	
		console.log(headers);
	}
}

const local = new Url('http://localhost');
local.request();
