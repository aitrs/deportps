const express = require('express');
const bodyparser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const str2timestamp = (val) => {
	const reg = /[0-9]+:[0-9]{2}/;
	let r = 0;
	if(reg.test(val)) {
		const vals = val.split(':');
		if(vals.length === 2) {
			r += vals[0]*60*60;
			r += vals[1]*60;
		}
	}
	return r;
}

let dbfailed = false;

let db = new sqlite3.Database('./db/deportps.db', (err) => {
	if(err) {
		console.error('Error : unable to connect to database');
		dbfailed = true;
	}
});

app.use(bodyparser.json({
	limit: '200mb'
}));

app.use((req, res, next) => {
  	res.setHeader('Access-Control-Allow-Origin', '*');
  	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  	next();
});

app.use('/deportps/test', (req, res, next) => {
	if(dbfailed) {
		res.status(200).json({state: 'error', message: 'database not running'});
	} else {
		res.status(200).json({state: 'Running'});
	}
});

app.post('/deportps/register', (req, res, next) => {
	const now  = Date.now();
	let count = 0;
	for(let i in req.body) {
		let item = req.body[i];
		const stamp = str2timestamp(item.TIME);
		let sql = 'INSERT INTO pslog(stamp, user, pid, pccpu, pcmem, vsz, rss, tty, stat, start, time, command) ';
		sql += 'VALUES (' +now+',"'+ item.USER + '", ' + item.PID + ', '+ item.PCCPU +', '+item.PCMEM+', '+item.VSZ+', '+item.RSS+', "'+item.TTY+'","'+item.STAT+'","'+item.START+'", '+stamp+', "'+item.COMMAND+'")';
		db.run(sql, (err) => {
			if(err) {
				console.error(err.message);
			}
		});
		count++;
		
	}
	console.log('Logged '+count+' lines');
	res.status(200).json({status: 'success'});
});

module.exports = { "app":app, "db":db };
