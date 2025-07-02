import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// ----------------------------------------------

import { connectDB } from './utils/mongodb';
import { config } from './utils/config';

// ----------------------------------------------

import mainRouter from './routes';
import { dbMiddleware } from './middlewares/dbMiddleware';
import { responseMiddleware } from './middlewares/response';
import logger from './middlewares/logger';

// ----------------------------------------------

const app = express();
connectDB();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.use(logger);
app.use(responseMiddleware);
app.use(dbMiddleware);

app.use(mainRouter);

const port = config.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

export default app;
