"use client";

import { useEffect, useState } from "react";
import socket from "../utils/socket";

export default function Home() {
  const [messages, setMessages] = useState<
    { topic: string; message: string }[]
  >([]);

  useEffect(() => {
    socket.on("mqttMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("mqttMessage");
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
