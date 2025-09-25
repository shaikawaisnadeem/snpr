import express from 'express';
import type { Express, Response, Request } from 'express';
import router from './routes/user.route.ts'
import cors from 'cors'
import { authMiddleware } from './middleware/get.middleware.ts';
import { forgetMiddleware } from './middleware/forget.middleware.ts';

const app:Express = express()

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,              
}));
app.use(express.json());
app.use('/api', router)
app.use('/',authMiddleware, router)
app.use('/', forgetMiddleware, router)


app.listen(3000, ()=>{
    console.log(`server is running at port http://localhost:${3000}/`);
})