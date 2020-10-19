let Machine = require('./models/machine');
const fs = require('fs');
const readline = require('readline');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const randomstring = require('randomstring');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const genSha256 = async (str) => {
	const enc = new TextEncoder();
	const data = enc.encode(str);
	const hash = await crypto.createHash('sha256').update(data).digest('base64');

	return hash;
};

let db = new sqlite3.Database('./db/deportps.db', (err) => {
	if(err) {
		console.error(err.message);
		process.exit(1);
	}
});

rl.question('Machine name :',(mname) => {
	rl.question('Machine IP :', async (mip) => {
		const rs = randomstring.generate({
			length: 8,
			charset: 'alphanumeric'
		});
		const sha = await genSha256(rs);

		const conf = {
			name: mname,
			ip: mip,
			token: rs
		}

		console.log('Generating machine configuration with the following items :');
		console.log(conf);

		let m = new Machine(-1, sha, mname, mip, db);
		m.save((err) => {
			if(err) {
				console.log(err.message);
				process.exit(1);
			}

			const fdata = JSON.stringify(conf);
			fs.writeFileSync(mname+'.json', fdata);
			console.log('Configuration has been written to '+mname+'.json');
			rl.close();
		});
	});
});

rl.on('close', () => {
	console.log("Done !");
	db.close((err) => {
		if(err) {
			return console.error(err.message);
		}
	});
	process.exit(0);
});
