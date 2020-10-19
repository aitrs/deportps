const http = require("http");
const glob = require('./app');
const app = glob.app;
let db = glob.db;

const nport = (val) => {
	const p = parseInt(val, 10);

	if(isNaN(p)) {
		return val;
	}

	if(p > 0) {
		return p;
	}

	return false;
}

const port = nport(process.env.PORT || 1312);
app.set('port', port);


const server = http.createServer(app);

const errHandler = (err) => {
	if (error.syscall !== 'listen') {
		throw err;
	}
	
	const addr = server.address();
	const bind = typeof address === 'string' ? 'pipe '+addr : 'port: '+port;
	
	switch(err.code) {
		case 'EACCESS':
			console.error(bind+' operation not allowed');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(port+' already in use');
			process.exit(1);
			break;
		default:
			throw err;
	}
};

server.on('error', errHandler);
server.on('listening', () => {
	const addr = server.address();
	const bind = typeof address === 'string' ? 'pipe '+addr : 'port: '+port;
	console.log('Listening on '+bind);
});
server.on('close', () => {
	db.close((err) => {
		if(err) {
			return console.error(err.message);
		}
	});
});

process.on('SIGINT', () => {
	server.close(() => { process.exit(0); });
});

server.listen(port);
