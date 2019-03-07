#!/usr/bin/env node
const Msg = require('node-msg');
const axios = require('axios');
const config = require('./config.json');
const terminalLink = require('terminal-link');

const URL = 'https://www.ups.com/track/api/Track/GetStatus?loc=en_IE';


const loader = new Msg.loading();
axios
	.post(URL, { TrackingNumber: [config.TrackingNumber] })
	.then(resp => {
		loader.stop();
		const res = resp.data.trackDetails[0];
		const table = [['Date', 'Location', 'Activity']];
		res
			.shipmentProgressActivities
			.reverse()
			.forEach(item => {
				if (!item.date || !item.location) return;
				table.push([ item.date + ' ' + item.time, item.location, item.activityScan ]);
			});

		const link = terminalLink(Msg.green(res.packageStatus), `https://www.ups.com/track?loc=en_IE&tracknum=${config.TrackingNumber}&requester=WT/trackdetails`);

		Msg.log('\nParcel no: ' + Msg.green(config.TrackingNumber));
		Msg.log('   Status: ' + link + '\n');
		Msg.table(table);
		// Msg.print(`\nhttps://www.ups.com/track?loc=en_IE&tracknum=${config.TrackingNumber}&requester=WT/trackdetails`, 'grey');
	})
	.catch(e => Msg.error(e));
