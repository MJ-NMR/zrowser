const browser =  require("./app.js").browser
const local = new browser();
console.log(local);
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
