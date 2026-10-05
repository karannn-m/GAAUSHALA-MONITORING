const mqtt = require('mqtt');
const axios = require('axios');

// Connect to ChirpStack MQTT Broker
const client = mqtt.connect('mqtt://localhost:1883', {
  username: 'chirpstack_user',
  password: 'chirpstack_password'
});

const BACKEND_URL = 'http://localhost:3000/api/iot/telemetry';

client.on('connect', () => {
  console.log('Connected to ChirpStack MQTT broker');
  // Subscribe to all application application/+/device/+/event/up
  client.subscribe('application/+/device/+/event/up', (err) => {
    if (!err) {
      console.log('Subscribed to IoT Telemetry topics');
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    // Parse the payload from ChirpStack
    const payload = JSON.parse(message.toString());
    
    // Assuming the LoRaWAN payload was decoded in ChirpStack into an 'object' field
    if (payload.objectJSON) {
      const decodedData = JSON.parse(payload.objectJSON);
      
      const telemetry = {
        rfid_tag: decodedData.rfid_tag || payload.devEUI,
        lat: decodedData.latitude,
        lng: decodedData.longitude,
        battery: decodedData.batteryVoltage
      };

      // Forward to backend Fastify API for PostGIS geofence check
      await axios.post(BACKEND_URL, telemetry);
      console.log(`Forwarded telemetry for ${telemetry.rfid_tag}`);
    }
  } catch (error) {
    console.error('Error processing MQTT message:', error.message);
  }
});
