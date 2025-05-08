const { request, Url, handleResponse } = require('./request.js');

class browser {
	constructor(){
		this.cash = {};
		this.cookies = {};
	} 

	async run(urlStr) {
		const url = new Url(urlStr);
		if(this.cash[url.fullUrl]) this.show(this.cash[url.fullUrl][2])
		else {
			let response = await request(url);
			if(response[0] === 'html') {
				response[1] = handleResponse(response[1]);
			}
			this.cash[url.fullUrl] = response;
			this.show(response);
		}	
	}

	show(res) {
		let tag = false;
		let char;
		let data = res[1];
		if(!data) throw new Error("there are no body or data");
		if(res[0] !== 'text') {
			data = '';
			for(let i = 0; i < data.length; i++) {
				char = this.body[i];
				if(char === '<') tag = true;
				if(!tag) data += char;
				if(char === '>') tag = false;
			}
		}
		console.log(data);
	}
}

const local = new browser();
if(process.argv[2]) {
	const urlStr = process.argv[2];
	local.run(urlStr);
} else {
	console.log('zrowser URl \n  OR \nnode app.js URL');
};
