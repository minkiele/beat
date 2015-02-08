var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 8888));
app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.listen(app.get('port'));
