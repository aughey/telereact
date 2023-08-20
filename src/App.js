import './App.css';
import React, { useState, useEffect } from 'react';
import { Client } from 'paho-mqtt';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

function MQTTComponent() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const client = new Client(window.location.hostname, 9000, "teleclientId");

    // const client = new Client({
    //   uri: 'ws://lolcahost:9001',
    //   clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
    // });

    client.onConnectionLost = (responseObject) => {
      console.log('Connection lost:', responseObject.errorMessage);
    };

    client.onMessageArrived = (message) => {
      console.log(`Received message on ${message.destinationName}: ${message.payloadString}`);
      setMessage(message.payloadString);
      setTimeout(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
      },100);
    };

    client.connect({
      onSuccess: () => {
        console.log('Connected to MQTT broker');
        client.subscribe('your/topic');
      },
    });

    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <h2>Received MQTT Message:</h2>
      <ReactMarkdown>{message}</ReactMarkdown>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <MQTTComponent />
    </div>
  );
}

export default App;
