import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

// Set up the server
// Enable CORS for port 3000
app.use(cors());
app.use(express.static('public'));
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});


