import express from 'express';
import type { Express, Response, Request } from 'express';
import router from './routes/user.route.ts'

const app:Express = express()

app.use(express.json());
app.use('/api', router)

app.get('/',(req,res)=>{
    console.log('first')
})

app.listen(3000, ()=>{
    console.log(`server is running at port http://localhost:${3000}/`);
})