var tasks = require('./models/tasks');
var express = require('express');
var app = express();
var crypto = require('crypto');
var Busboy = require('busboy');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

function parseData(data)
{
    var newarray = [];
    var lastRecord = 0;
    var lastnamerecord;
    var lastcolor;
    var addRecord = 0;
    var idsarray = [];

    function objectid (idd, ffilename, ffiledirect, ccolor)
    {
      this.id = idd;
      this.filename =ffilename;
      this.filedirect = ffiledirect;
    }

    function recordobj (lastRecordd, lastnamerecordd, idssarray, color)
    {
      this.id = lastRecordd;
      this.recordname =lastnamerecordd
      this.idsarray = idssarray;
      this.color = color;
    }

    data.forEach(function(value, index){

      if(data[index].idrecord == lastRecord || addRecord == 0)
      {
        idsarray.push(new objectid(data[index].id, data[index].filename, data[index].filedirect));
        lastRecord = data[index].idrecord;
        lastnamerecord = data[index].recordname;
        lastcolor = data[index].color;
        addRecord = 1;
      }

      else
      {

        if(data[index].idrecord != lastRecord)
        {
          newarray.push(new recordobj(
            lastRecord,
            lastnamerecord,
            idsarray, 
            lastcolor
          ));
          addRecord = 1;
          idsarray = [];
          idsarray.push(new objectid(data[index].id, data[index].filename, data[index].filedirect));
          lastRecord = data[index].idrecord;
          lastnamerecord = data[index].recordname;
          lastcolor = data[index].color;
        }

      }

    });

    if (lastRecord != 0)
    {
      newarray.push(new recordobj(lastRecord, lastnamerecord, idsarray, lastcolor));
      
    }

    return newarray;  

}

app.post('/list', function(req, res) {

  tasks.list(function(err, tasks) {
    var newarray = parseData(tasks);
    console.log(newarray);
    res.send(newarray);
  });

});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/del', function(req, res) {
  tasks.delete(req.body);
  res.sendStatus(200);
});

app.post('/', function(req, res) {

	var busboy = new Busboy({ headers: req.headers });

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    if(filename != '')
    {
      var format = filename.split('.').pop();
      var hash = crypto.createHash('md5').update(filename+Date()).digest('hex');
      var generateName = hash + '.' + format;
      var saveTo = 'Z:/home/localhost/www/Uploads/' + generateName;
      file.pipe(fs.createWriteStream(saveTo));
      tasks.createFile(filename, 'http://localhost/Uploads/' + generateName); 
    }
  });

  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
    var parametrs = val.split(';');
    tasks.createRecord(parametrs[0], parametrs[1]); 
  });

  busboy.on('finish', function() {
    
    tasks.link(function(err,result) {
      res.send(result);
    });

  });

  return req.pipe(busboy);
});

app.listen(8080);
console.log('Express server listening on port 8080');