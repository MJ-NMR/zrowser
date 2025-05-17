const { request, Url} = require('./request.js');

class browser {
	constructor(){
		this.cashe = {};
		this.cookies = {};
	} 

	async run(urlStr) {
		const url = new Url(urlStr);
		if(this.cashe[url.fullUrl]) this.show(this.cashe[url.fullUrl])
		else {
			let response = await request(url);
			this.cashe[url.fullUrl] = response;
			this.show(response);
		}	
	}

	show(res) {
		let data = res[1];
		if(!data) throw new Error("there are no body or data");
		if(res[0] !== 'text') {
			let row = res[1];
			data = '';
			let tag = false;
			let char;
			for(let i = 0; i < row.length; i++) {
				char = row[i];
				if(char === '<') tag = true;
				if(!tag) data += char;
				if(char === '>') tag = false;
			}
		}
		console.log(data);
	}
}

const local = new browser();
async function app() {
	process.stdin.setEncoding('utf8');
	process.stdout.write("Enter a URL: ");
	process.stdin.on('data', async  (input) => {
		if(input.trim() == 'exit') process.exit();
		try {
			await local.run(input.trim());
			process.stdout.write("Enter a URL: ");
		} catch (error) {
			console.log(error);	
		}	
	})	
}

app();
