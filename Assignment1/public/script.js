document.getElementById('registerForm').onsubmit = function(event) { 
// ^ for registration form, when submittion, function(event) takes effect
    event.preventDefault(); // Prevent the form from submitting the traditional way
    var deviceId = document.getElementById('deviceId').value; // value of deviceID is stored in variable deviceID
    var Type = document.getElementById('Type').value; // value of Type is stored in variable Type
    
    fetch('/register', {
        method: 'POST', // send POST request to /register endpoint. 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({deviceId: deviceId, Type: Type}) // sent request includes device ID and type
    })
    .then(response => response.text()) // Convert response from server to text
    .then(data => alert(data)) // show alert of response data from server
    .catch(error => console.error('Error:', error)); // handles logs any errors
};
