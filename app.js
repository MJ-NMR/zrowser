const net = require('node:net')

class browser {
	constructor(url) {
		[this.schema, url] = url.split('://');
		[this.host, this.path] = url.split('/', 1);
		this.path = (this.path) ? '/' + this.path : '/';
		this.port = 80;
		this.headers = {};
		this.body = null;
		this.content = '';
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
			this.handleResponse(respond);
			this.show();
		});
	}

	handleResponse(res) {
		console.log(res.split('\r\n\r\n'));
		let header, body;
		[ header, body] = res.split('\r\n\r\n');
		this.body = body;
		header = header.split('\r\n');
		const st = header.shift();
		header.forEach((line) => {
			this.headers[line.split(':')[0]] = line.split(': ')[1];
		});
		return st; 
	}

	show() {
		let tag = false;
		let char;
		if(!this.body) throw new Error("there are no body");
		if(!this.content) {
			for(let i = 0;i < this.body.length; i++) {
				char = this.body[i];
				if(char === '<') tag = true;
				if(!tag) this.content += char;
				if(char === '>') tag = false;
			}
		}
		console.log(this.content);
	}
}

const local = new browser('http://localhost');
local.request();
//local.show();
