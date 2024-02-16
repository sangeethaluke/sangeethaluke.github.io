// Example server-side code
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Handle login POST request
app.post('/login', (req, res) => {
    // Your login logic here
    res.send('Login request received!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
