import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './routes/user_routes';

const app = express();
const port = 7000;

app.use(cors({
  credentials: true,
}));

app.use(compression());

app.use(cookieParser());

app.use(express.json());

app.use('/api', router);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})