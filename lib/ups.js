#!/usr/bin/env node
const Msg = require('node-msg');
const browser = require('./browser');
const cheerio = require('cheerio');
const terminalLink = require('terminal-link');

const URL = 'https://www.ups.com/track?loc=en_IE&requester=WT/trackdetails&tracknum=';

const SELECTOR = {
	status: '#stApp_txtPackageStatus',
	details: '#stApp_lblShipProgressTableViewDetailed',
	table: '.ups-progress_table table',
	delivery: {
		day: '#stApp_scheduledDeliveryDay',
		date: '#stApp_scheduledDelivery',
	}
};


function parseDataTable (html) {
	const $ = cheerio.load(html);
	return $('tbody tr')
		.map((i, el) => {
			const date = $('td:nth-child(3)', el).text()
				.trim()
				.replace(/\s+/, ' ');

			if (date === '-') return;

			const location = $('td:nth-child(4)', el).text().trim();
			const activity = $('td:nth-child(5)', el).text()
				.split('\n')
				.filter(n => n.trim())[0]
				.trim();

			return {date, location, activity};
		})
		.get()
		.filter(el => !!el);
}



async function run (trackingNo) {

	const loader = new Msg.loading();

	const page = await browser.page();
	await page.goto(URL + trackingNo);

	await page.waitFor(SELECTOR.status);
	await page.click(SELECTOR.details);

	const status = await page.$eval(SELECTOR.status, e => e.innerText);
	const deliveryDay = await page.$eval(SELECTOR.delivery.day, e => e.innerText);
	const deliveryDate = await page.$eval(SELECTOR.delivery.date, e => e.innerText);
	const tableHtml = await page.$eval(SELECTOR.table, e => e.outerHTML);

	await page.browser().close();
	loader.stop();

	const table = parseDataTable(tableHtml).reverse();



	// const res = resp.data.trackDetails[0];
	const output = [['Date', 'Location', 'Activity']];
	table.forEach(item => {
		if (!item.date || !item.location) return;
		output.push([ item.date, item.location, item.activity ]);
	});

	const link = terminalLink(Msg.green(status), `https://www.ups.com/track?loc=en_IE&tracknum=${trackingNo}&requester=WT/trackdetails`);

	Msg.log('\n    Parcel no: ' + Msg.green(trackingNo));
	Msg.log('       Status: ' + link);
	Msg.log('Delivery date: ' + Msg.green(deliveryDay + ', ' + deliveryDate) + '\n');
	Msg.table(output);
	// Msg.print(`\nhttps://www.ups.com/track?loc=en_IE&tracknum=${trackingNo}&requester=WT/trackdetails`, 'grey');

}

module.exports = run;
