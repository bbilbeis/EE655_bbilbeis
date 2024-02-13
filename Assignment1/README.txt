Instructions on how to set up and run the application:
1. Load server.js through the terminal or command prompt by entering: node server.js.
2. Once the server runs, access the local host: http://localhost:3000
3. For individual testing, use postman (set to POST), and paste the local host link.
Usage: inside of raw>body (as JSON) for each:
http://localhost:3000/register
{
    "deviceId": "12345",
    "deviceType": "sensor"
}


http://localhost:3000/data
{
    "deviceId": "12345",
    "data": "some data"
}


http://localhost:3000/command
{
    "deviceId": "12345",
    "command": "restart"
}

These are just example setups, any deviceID or type/data/command can be used.