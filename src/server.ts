import express from 'express';

// Initialize the app
const app = express();

// Define the port
const port = process.env.PORT || 5000;  // Use environment variable PORT for Heroku

// Define a simple route to test
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Make the app listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { app, port };
