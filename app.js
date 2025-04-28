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

		let respond;
		let request = `GET ${this.path} HTTP/1.0\r\n`;
        request += `Host: ${this.host}\r\n`;
        request += "\r\n";
        console.log(request);

        clint.write(request);
        clint.on('data', (data) => {
        	console.log(data.toString());
        	respond += data;
        });
	}
}

const google = new Url('http://localhost');
google.request();