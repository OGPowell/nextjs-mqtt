require("dotenv").config();

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

console.log(
  `Username: ${process.env.HIVEMQ_USERNAME}\nPassword: ${process.env.HIVEMQ_PASSWORD}`
);

const options = {
  host: process.env.HIVEMQ_HOST,
  port: 8883,
  protocol: "mqtts",
  username: process.env.HIVEMQ_USERNAME,
  password: process.env.HIVEMQ_PASSWORD,
};

const mqttClient = mqtt.connect(options);
const topic = "AGI/International/Office/Manufacturing_Operations_Center/#";

mqttClient.on("connect", () => {
  console.log("Connected to HiveMQ broker");
  mqttClient.subscribe(topic, (err) => {
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
