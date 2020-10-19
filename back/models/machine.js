class Machine {
	#id = -1;
	#db = null;
	verbose = false;

	constructor(id, sha256token, name, ip, db) {
		this.#id = id;
		this.sha = sha256token;
		this.name = name;
		this.ip = ip;
		this.#db = db;
	}

	save(errcb) {
		if(this.#id === -1) {
			let req = 'INSERT INTO machine(sha256token, name, ip) VALUES ("'+this.sha+'","'+this.name+'","'+this.ip+'")';
			if(this.verbose) {
				console.log("Running SQL statement : ");
				console.log(req);
			}

			this.#db.run(req, (err) => {
				errcb(err); 
				let selid = 'SELECT id FROM machine ORDER BY id DESC LIMIT 1';
				if(this.verbose) {
					console.log("Running SQL statement : ");
					console.log(selid);
				}

				this.#db.get(selid, [], (err, row) => {
					errcb(err);
					this.#id = row.id;
				});
			});
		} else {
			let req = 'UPDATE machine SET sha256token="'+this.sha+'", name="'+this.name+', ip="'+this.ip+'" ';
			req += 'WHERE id='+this.id+';';
			
			if(this.verbose) {
				console.log("Running SQL statement : ");
				console.log(req);
			}

			this.#db.run(req, (err) => {
				errcb(err); 
			});
		}
	}

	get id() { return this.#id; }
	get db() { return this.#db; }
}

module.exports = Machine;
