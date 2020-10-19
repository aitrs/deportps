CREATE TABLE machine (
	id integer primary key autoincrement,
	sha256token varchar(128) UNIQUE,
	name varchar(64),
	ip varchar(32)
);

CREATE TABLE pslog ( 
	id integer primary key autoincrement, 
	stamp integer, 
	user varchar(128), 
	pid integer, 
	pccpu real, 
	pcmem real, 
	vsz integer, 
	rss integer, 
	tty varchar(16), 
	stat varchar(16), 
	start varchar(32), 
	time integer, 
	command varchar(256),
	machine_id integer,
	foreign key(machine_id) references machine(id)
);
