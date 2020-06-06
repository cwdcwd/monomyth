const config = require('config');
const app = require('express')();
const exphbs  = require('express-handlebars');

const http = require('http').createServer(app);
const io = require('socket.io')(http);


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
 
app.get('/', function (req, res) {
    res.render('home');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});


http.listen(config.PORT, () => {
  console.log(`listening on *:${config.PORT}`);
});