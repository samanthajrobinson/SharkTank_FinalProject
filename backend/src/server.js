import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`FitMatch API listening on port ${port}`);
});
