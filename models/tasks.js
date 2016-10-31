var mysql = require('mysql');
var fs = require('fs');

var connection = mysql.createConnection({
	host     	: 'localhost',
	database	: 'attachfiles', 
	user     	: 'root',
	password 	: ''
});

connection.connect();

var Tasks = {

	list: function(callback) {
		connection.query('SELECT f.filename, f.filedirect, r.id as idrecord, r.recordname, r.color FROM records r LEFT JOIN files f ON r.id = f.idrecord', callback);
	},

	createFile: function(task, direct, callback) {
		connection.query('INSERT INTO files SET ?', {filename: task, filedirect: direct}, callback);
	},

	delete: function(id, callback) {
		connection.query('SELECT * FROM files WHERE ?',{idrecord: id}, function(err, rows) {
			
			if (err) throw err;

			rows.forEach(function(value, index){
				var direct =  rows[index].filedirect;

				fs.unlinkSync('Z:/home/localhost/www/Uploads/' + direct.substring(direct.lastIndexOf('/')+1,direct.length), function(err){
					if (err) throw err;	
				});

			});

			connection.query('DELETE FROM files WHERE ?', {idrecord: id}, callback);
		    connection.query('DELETE FROM records WHERE ?', {id: id}, callback);
		});
	},

	createRecord: function(recordname, color, callback) {
		connection.query('INSERT INTO records SET ?', {recordname: recordname, color: color}, function(err, result) {
			if (err) throw err;
		});

	},

	link: function(callback) {

		connection.query('SELECT * FROM records WHERE havefile IS NULL', function(err, rows) {
			if (err) throw err;
			var idrecord = rows[0].id;
			var recordname = rows[0].recordname;
			var color = rows[0].color;
			
			connection.query('SELECT * FROM files WHERE idrecord IS NULL', function(err, rows) {
				var newdata = {
					id : idrecord,
					recordname : recordname,
					color : color,
					idsarray : rows 
				};
				callback(err, newdata);
			});

			connection.query('UPDATE records SET havefile = ? WHERE id = ? ',[1, rows[0].id]);
			connection.query('UPDATE files SET ? WHERE idrecord IS NULL ',{idrecord: rows[0].id});
		});

	}
};

module.exports = Tasks;