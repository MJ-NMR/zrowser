const { JSDOM } = require('jsdom');

const getRequestBody = async (urlStr) => {
	if(urlStr.includes(' ')) return console.log('google search');
	if( !urlStr.includes('https:') || !urlStr.includes('http:')) urlStr = 'https://' + urlStr;

	const request = new Request(urlStr);
	const response = await fetch(request);
	const blob = await response.blob();
	const row = await blob.text();
	const dom = new JSDOM(row);
	const document = dom.window.document;

	if (!document.querySelector('base')) {
		const base = document.createElement('base');
		base.href = new URL(request.url).origin + '/';
		const head = document.querySelector('head');
		if (head) {
			head.insertBefore(base, head.firstChild); // Add <base> as the first element in <head>
		}
	}
	return dom.serialize();
}

module.exports = { getRequestBody };
