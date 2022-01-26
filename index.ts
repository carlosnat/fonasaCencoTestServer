import * as dotenv from 'dotenv';
dotenv.config();
import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors'
import patientsRouter from './src/patients/routes'
import hospitalRouter from './src/hospitals/routes'
import consultationRouter from './src/consultants/route';
import { connecToDataBase } from './src/database/connection';


const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(cors())
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/patient', patientsRouter)
app.use('/hospital', hospitalRouter)
app.use('/consultation', consultationRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Hello from the TypeScript world!</h1>');
});

app.listen(PORT, () => {
  console.log(`Running on ${PORT} ⚡`)
  connecToDataBase()
});