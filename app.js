const net = require('node:net');
const tls = require('tls');
const fs = require('fs');

class browser {
	constructor(url) {
		[this.schema, url] = url.split('://');
		let hostAndPath = url.split('/');
		this.host = hostAndPath.shift(); // First item is host:port
		this.path = '/' + hostAndPath.join('/'); // Recombine rest as path
		[this.host, this.port] = this.host.split(':');
		this.headers = {};
		this.body = null;
		this.content = '';
	}

	request() {
		let clint;
		const port = this.port || (this.schema === 'https' ? 443 : 80);
		if(this.schema === 'https') {
			clint = tls.connect({
				host: this.host,
				port: port,
				servername: this.host,
				rejectUnauthorized: true
			});
		} else if(this.schema === 'file') {
			fs.stat(this.path, (err, stats) => {
				if (err) throw err;
				if (stats.isFile()) {
					fs.readFile(this.path, (err, data) => {
						if (err) throw err;
						this.content = data.toString();
						this.show(true);
					});
				} else {
					console.error('Path is not a file:', this.path);
				}
			});
			return;
		} else {
			clint = net.connect({host: this.host, port: port}); 
		}
		let respond = '';
		let request = `GET ${this.path} HTTP/1.1\r\n`;
		request += `Host: ${this.host}\r\n`;
		request += `User-Agent: Zrowser\r\n`;
		request += `Connection: close\r\n`;  // <- force server to close
		request += "\r\n";
		clint.setEncoding('utf8');
		clint.on(this.schema === 'https' ? 'secureConnect' : 'connect', () => {
			console.log('connected');
			clint.write(request);
		});
		clint.on('data', (data) => {
			respond += data;
		});
		clint.on('end', () => {
			this.handleResponse(respond);
			this.show();
		});
		clint.on('error', (error) => {
			console.log(error);
		});
	}

	handleResponse(res) {
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

	show(file) {
		let tag = false;
		let char;
		if(!this.body && !file) throw new Error("there are no body");
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

if(process.argv[2]) {
	const url = process.argv[2];
	const local = new browser(url);
	local.request();
} else {
	console.log('zrowser URl \n  OR \nnode app.js URL');
};
