const express = require('express')
const http = require('http')
const Server = require('socket.io').Server
const Connection = require('./db.js')
const Chat = require('./models/Chat.js')
const User = require('./models/User.js')
const cors = require('cors'); 
const redis = require('./redis');

const app = express()
app.use(express.json())
app.use(cors());
Connection()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", (socket) => {
    const loadMessages = async () => {
        try {
            const messages = await redis.lrange('chats', 0, -1);
            socket.emit('chat', messages.map(JSON.parse));
        } catch(err) {
            console.log(err)
        }
    }
    loadMessages();

    socket.on('newMessage', async (msg) => {
        try {
            const newMessage = new Chat(msg)
            await newMessage.save()

            await redis.rpush('chats', JSON.stringify(msg));

            io.emit('message', msg)
        }catch(err) {
            console.log(err)
        }
    })
})

app.post('/saveUser', async (req, res) => {
    const { userName, avatarUrl } = req.body;
    try {
        const existingUser = await User.findOne({ username: userName });

        if (!existingUser) {
            const user = {
                username: userName,
                avatar: avatarUrl
            };
            const newUser = new User(user);
            await newUser.save();
            console.log('New user saved:', userName);
        } else {
            console.log('User already exists:', userName);
        }

        res.status(200).send('User data received successfully');
    } catch(err) {
        console.error('Error saving user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

server.listen("3002", () => {
    console.log("running on 3002 port")
})