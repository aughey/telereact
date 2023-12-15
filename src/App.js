import './App.css';
import React, { useState, useEffect } from 'react';
import { Client } from 'paho-mqtt';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { v4 as uuidv4 } from 'uuid';

function MQTTComponent() {
  const [message, setMessage] = useState('');

  useEffect(() => {

    // get the hostname that I'm connected to as a window
    const hostname = window.location.hostname;

    //const client = new Client(window.location.hostname, 9000, "teleclientId");
    const client = new Client(hostname, 9001, uuidv4());

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
      // setTimeout(() => {
      //   window.scrollTo(0, document.documentElement.scrollHeight);
      // },100);
    };

    client.connect({
      onSuccess: () => {
        console.log('Connected to MQTT broker');
        client.subscribe('teleprompter');
      },
    });

    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, []);

  const doubleClick = () => {
    window.scrollTo(0, document.documentElement.scrollHeight);
  };

  return (
    <div>
      <h2>Received MQTT Message:</h2>
      <h2>&nbsp;</h2>
      <h2>&nbsp;</h2>
      <div onDoubleClick={doubleClick}>
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
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
