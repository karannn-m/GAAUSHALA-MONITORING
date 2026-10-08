require('dotenv').config({ path: '../.env' });
const mqtt = require('mqtt');
const axios = require('axios');

// Connect to ChirpStack MQTT Broker
const client = mqtt.connect('mqtt://localhost:1883', {
  username: process.env.MQTT_USER || 'chirpstack_user',
  password: process.env.MQTT_PASSWORD || 'chirpstack_password'
});

const BACKEND_URL = process.env.BACKEND_TELEMETRY_URL || 'http://localhost:3000/api/iot/telemetry';
const API_KEY = process.env.IOT_API_KEY || 'my_secure_iot_api_key_123';

client.on('connect', () => {
  console.log('Connected to ChirpStack MQTT broker');
  client.subscribe('application/+/device/+/event/up', (err) => {
    if (!err) {
      console.log('Subscribed to IoT Telemetry topics');
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    
    if (payload.objectJSON) {
      const decodedData = JSON.parse(payload.objectJSON);
      
      const telemetry = {
        rfid_tag: decodedData.rfid_tag || payload.devEUI,
        lat: decodedData.latitude,
        lng: decodedData.longitude,
        battery: decodedData.batteryVoltage
      };

      // Forward to backend Fastify API with API Key
      await axios.post(BACKEND_URL, telemetry, {
        headers: {
          'x-iot-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      console.log(`Forwarded telemetry for ${telemetry.rfid_tag}`);
    }
  } catch (error) {
    console.error('Error processing MQTT message:', error.message);
  }
});
