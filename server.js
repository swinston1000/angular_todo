var express = require('express')
var cors = require('cors')

var app = express()
app.use(express.static(__dirname))
app.use(cors());


var path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.put('/update/:id', function(req, res) {

})

app.delete('/delete/:id', function(req, res) {

})

app.post('/create', function(req, res) {

    //add an id??

})

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})
