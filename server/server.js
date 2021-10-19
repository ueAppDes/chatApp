
const express = require('express');
var cors = require('cors')
const app = express();
app.use(cors())
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    console.log('a user connected');
    const id = socket.handshake.query.id
    socket.join(id)

    socket.on('send-message', ({recipients, text}) => {
        console.log("send-message", text);
        recipients.forEach(recipient => {
            const newRecipients = recipients.filter(r => r !== recipient)
            newRecipients.push(id)
            socket.broadcast.to(recipient).emit('receive-message', {
                recipients: newRecipients, sender: id, text
            })
        });
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
})


server.listen(5000, () => {
  console.log('listening on *:5000');
});