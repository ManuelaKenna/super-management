const express = require('express');
// Import and require mysql2
const routes = require ("./routes")

const PORT = process.env.PORT || 3002;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(routes);

// Connect to database
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  