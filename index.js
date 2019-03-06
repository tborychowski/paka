#!/usr/bin/env node
const Msg = require('node-msg');
const axios = require('axios');
const URL = 'https://www.ups.com/track/api/Track/GetStatus?loc=en_IE';

const NO = '';


var loader = new Msg.loading();
axios
	.post(URL, { TrackingNumber: [NO] })
	.then(resp => {
		loader.stop();
		const res = resp.data.trackDetails[0];
		const table = [['Date', 'Location', 'Activity']];
		res
			.shipmentProgressActivities
			.reverse()
			.forEach(item => {
				if (!item.date || !item.location) return;
				table.push([
					item.date + ' ' + item.time,
					item.location,
					item.activityScan
				]);
			});

		Msg.log('\nStatus: ' + Msg.green(res.packageStatus) + '\n');
		Msg.table(table);

	})
	.catch(e => Msg.error(e));
