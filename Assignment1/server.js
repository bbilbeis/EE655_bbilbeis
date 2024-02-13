
// 1.

const express = require('express'); // import express to create server
const fs = require('fs'); // To access server-side files (read/write/delete)
const path = require('path'); // To access server-side files (manage path)
const app = express(); // use of express.js
const port = 3000; // server listening to port 3000

// 7.
const logsFilePath = path.join(__dirname, 'logs.txt'); // save location for logs as logs.txt (from current directory)

function logData(message) { // function to log all activities
  const timestamp = new Date().toISOString(); // convert the date logged to a string, for logs.txt
  const logMessage = `[${timestamp}] ${message}\n`; // return activity logs as timestamps

  // Append log message to logs.txt
  fs.appendFileSync(logsFilePath, logMessage); // Append the log message to log.txt
}

//Bonues vvv

const filePath = path.join(__dirname, 'devices.json'); // Path to devices.json

// Global array to hold devices in memory
let devicesInMemory = []; // hold device data in-memory as an empty array

// Function to load existing devices from devices.json into memory
function loadDevices() { //  load devices from devices.json into memory
  if (fs.existsSync(filePath)) { // check if devices.json (initialized in 'filePath') exists.
    const devicesData = fs.readFileSync(filePath); // If devices.json exists, reads the file and return it's contents
    devicesInMemory = JSON.parse(devicesData); // converts the 'deviceData' strings into a manipulatable javascript format
    console.log('Devices loaded into memory:', devicesInMemory); // log loaded devices. 
  } else { // if not found, logs a message of no device found
    console.log('No devices file found. Starting with an empty devices list.');
  }
}

loadDevices(); // call function begin the loadDevice processes previously explain.

//Bonus ^^^

// c.	Serve static files from a directory named public.
app.use(express.static('public'));

// start server. Listen on port. Log messge of server start
app.listen(port, () => { console.log(`Server listening at http://localhost:${port}`); 
});

//2.
app.use(express.json()); // Middleware to parse JSON request body

// POST endpoint /register to register new devices.
app.post('/register', (req, res) => { // Define the post endpoint '/register/ to register new devices.
  const { deviceId, deviceType } = req.body; // extract the deviceID and deviceType from req.body

  // c.	Validate the presence of deviceId and deviceType in the request body.
  if (!deviceId || !deviceType) { // if not deviceID or not deviceType, practically checking if either is false, then there is one of them missing.
    return res.status(400).send('Missing deviceId or deviceType'); // missing message to use
  }

  logData(`Device registered: Device ID=${req.body.deviceId}, Device Type=${req.body.deviceType}`); // message of the logged devices


  // Load existing devices
  let devices = []; // hold list of devices that will be read
  if (fs.existsSync(filePath)) { // if file exists, read and return contents.
    devices = JSON.parse(fs.readFileSync(filePath));
  }
 
  // b.	Each device should have a unique deviceId and a deviceType.
  const existingDevice = devices.find(device => device.deviceId === deviceId);
  if (existingDevice) { // if a device has a same ID, a 409 error is sent indicating a duplicate/non-unique device.
    return res.status(409).send('Duplicate device!');
  }

  // Add new device
  devices.push({ deviceId, deviceType }); // add new device to the array 'devices' created earlier
  fs.writeFileSync(filePath, JSON.stringify(devices, null, 2)); // sync the updates devices to the appropriate .json file

  res.status(201).send('Device registered'); // 201 status for a successful registration
});

//3.

// a.	Implement a GET endpoint /show to display all registered devices.
app.get('/show', (req, res) => { // display all registered devices with '/show'
  if (!fs.existsSync(filePath)) { // again, checking if 'devices.json' exists, if not, send a message with 404 error.
    return res.status(404).send('No devices registered');
  }

  try { // b.	Read the devices from devices.json and return them in the response.
    const devices = JSON.parse(fs.readFileSync(filePath)); // read devices.json and part contents to the devices array
    res.json(devices);
  } catch (error) { // c.	Handle errors appropriately.
    res.status(500).send('Error reading file');
  }
});

//4.

// a.	Implement a POST endpoint /data for devices to send data.
app.post('/data', (req, res) => {// post endpoint /data for devices to send data
  const { deviceId, data } = req.body;

  // b.	Ensure deviceId and data are present in the request body.
  if (!deviceId || !data) { // if deviceID or data are not present, then respond with 400 code status.
    return res.status(400).send('Missing deviceId or data');
  }

  logData(`Data from Device ${req.body.deviceId}: ${req.body.data}`); // log the received data as deviceID and data.


  // c.	Respond with a confirmation message and log the command with a timestamp.
  const timestamp = new Date().toISOString(); // convert the date logged to a string, for logs.txt
  console.log(`[${timestamp}] Device ${deviceId}:`, data);

  res.status(200).send('Data received!'); // respond with 200 code status (success in recieving data of device)
});

//5.
// a.	Implement a POST endpoint /command to send commands to devices.
app.post('/command', (req, res) => { // send commands to devices
  const { deviceId, command } = req.body;

  // b.	Validate the presence of deviceId and command in the request body.
  if (!deviceId || !command) { // if deviceID or command are not present, then respond with 400 error (similar to the other two endpoints)
    return res.status(400).send('Missing deviceId or command'); // if missing, respond with 400 code statu
  }

  logData(`Command sent: Device ID=${req.body.deviceId}, Command=${req.body.command}`); // log command as deviceid and command instruction

  // c.	Respond with a confirmation message and log the command with a timestamp.
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Command to Device ${deviceId}:`, command); // log command with timestamps to the console (to be visible to user)

  res.status(200).send(`Command '${command}' sent to device ${deviceId}`); // respond with 200 code status (success in sending command to device)
});
