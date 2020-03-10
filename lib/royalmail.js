const Msg = require('node-msg');
const axios = require('axios');
// const terminalLink = require('terminal-link');

const parcelID = 'LX038886275PL';

async function track (no) {
	// const loader = new Msg.loading();

	const options = {
		method: 'GET',
		url: `https://api.royalmail.net/mailpieces/v2/${no}/events`,
		headers: {
			accept: 'application/json',
			'x-ibm-client-secret': secret,
			'x-ibm-client-id': clientID,
		},
	};

	axios(options)
		.then(res => {
			console.log('Success: ', body);
		});

}

module.exports = track;
