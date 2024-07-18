# Next.js Express Socket.IO MQTT Project

This project is a real-time web application that uses Next.js for the client-side and Express with Socket.IO for the server-side. The server connects to HiveMQ using MQTT.js and communicates with the client using Socket.IO.

## Project Structure

```
my-nextjs-express-socketio-project
├── client
│   ├── pages
│   │   └── index.js
│   └── utils
│       └── socket.js
├── server
│   └── index.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- HiveMQ account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install Dependencies

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd client
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root of your project and add the following variables:

```
HIVEMQ_HOST=your_hivemq_host
HIVEMQ_USERNAME=your_hivemq_username
HIVEMQ_PASSWORD=your_hivemq_password
PORT=3001
```

Replace `your_hivemq_host`, `your_hivemq_username`, and `your_hivemq_password` with your HiveMQ credentials.

### 4. Running the Server

Navigate to the server folder and start the server:

```bash
cd server
node index.js
```

The server will run on the port specified in the `.env` file (default is 3001).

### 5. Running the Client

Navigate to the client folder and start the Next.js development server:

```bash
cd client
npm run dev
```

The client will run on `http://localhost:3000`.

## Project Details

### Server

The server is set up to connect to HiveMQ using MQTT.js and uses Socket.IO to communicate with the client. The server subscribes to a specified topic on HiveMQ and emits received messages to connected clients via Socket.IO.

```javascript
require('dotenv').config();

const express = require("express");
const http = require("http");
const mqtt = require("mqtt");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const options = {
  host: process.env.HIVEMQ_HOST,
  port: 8883,
  protocol: "mqtts",
  username: process.env.HIVEMQ_USERNAME,
  password: process.env.HIVEMQ_PASSWORD,
};

const mqttClient = mqtt.connect(options);

mqttClient.on("connect", () => {
  console.log("Connected to HiveMQ broker");
  mqttClient.subscribe("your/topic", (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log("Subscribed to topic");
    }
  });
});

mqttClient.on("message", (topic, message) => {
  console.log(`Received message from ${topic}: ${message.toString()}`);
  io.emit("mqttMessage", { topic, message: message.toString() });
});

mqttClient.on("error", (err) => {
  console.error("MQTT client error:", err);
});

mqttClient.on("reconnect", () => {
  console.log("Reconnecting to HiveMQ broker...");
});

mqttClient.on("offline", () => {
  console.log("MQTT client went offline");
});

mqttClient.on("close", () => {
  console.log("MQTT connection closed");
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("A user has disconnected");
  });

  socket.on("getMessage", (msg) => {
    io.emit("sendMessage", msg);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Client

The client is set up using Next.js and connects to the server via Socket.IO to receive real-time updates.

#### pages/index.js

```javascript
import { useEffect, useState } from 'react';
import socket from '../utils/socket';

export default function Home() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('mqttMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('mqttMessage');
    };
  }, []);

  return (
    <div>
      <h1>MQTT Messages</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            Topic: {msg.topic}, Message: {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

#### utils/socket.js

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001'); // Replace with your server URL

export default socket;
```

## Conclusion

This project demonstrates how to set up a real-time web application using Next.js, Express, Socket.IO, and MQTT.js. The server connects to HiveMQ to receive MQTT messages and broadcasts them to clients using Socket.IO. The Next.js client listens for these messages and updates the UI in real-time.

Feel free to modify and extend this project to suit your needs!

---

Make sure to replace placeholder values with your actual HiveMQ credentials and project-specific details before using this README.
