# Next.js Express Socket.IO MQTT Project

This project is a real-time web application that uses Next.js for the client-side and Express with Socket.IO for the server-side. The server connects to HiveMQ using MQTT.js and communicates with the client using Socket.IO.

## Project Structure

```
nextjs-mqtt
├── client
│   ├── app
│   │   └── src
|   |       └── page.tsx
│   └── utils
│       └── socket.ts
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
- Docker Desktop

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/OGPowell/nextjs-mqtt.git
cd nextjs-mqtt
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
TOPIC=your/topic
```

Replace `your_hivemq_host`, `your_hivemq_username`, and `your_hivemq_password` with your HiveMQ credentials.

### 4. Running the Server

Navigate to the server folder and start the server:

```bash
cd server
npm run start
```

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
...

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

...
```

### Client

The client is set up using Next.js and connects to the server via Socket.IO to receive real-time updates.

#### pages/index.js

```javascript
...
  useEffect(() => {
    socket.on('mqttMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('mqttMessage');
    };
  }, []);

...
```

## Running the Docker Container

You can run the docker container using the command `docker-compose up --build`. Ensure that you have Docker Desktop open and running, as this will ensure that the Docker Engine is running.

## Conclusion

This project demonstrates how to set up a real-time web application using Next.js, Express, Socket.IO, and MQTT.js. The server connects to HiveMQ to receive MQTT messages and broadcasts them to clients using Socket.IO. The Next.js client listens for these messages and updates the UI in real-time.

Feel free to modify and extend this project to suit your needs!

---

Make sure to replace placeholder values with your actual HiveMQ credentials and project-specific details before using this README.
