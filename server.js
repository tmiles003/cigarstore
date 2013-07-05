var express = require('express'),
    path = require('path'),
    http = require('http'),
    cigar = require('./routes/cigars');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 4000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'webroot')));
});

app.get('/cigars', cigar.findAll);
app.get('/cigars/:id', cigar.findById);
app.post('/cigars', cigar.addCigar);
app.put('/cigars/:id', cigar.updateCigar);
app.delete('/cigars/:id', cigar.deleteCigar);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
