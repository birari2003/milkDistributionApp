import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import authRoute from './routes/authRoute.js';
import ownerRoute from './routes/ownerRoute.js';
import customerRoute from './routes/customerRoute.js';
import employeeRoute from './routes/employeeRoute.js';
import milkRoute from './routes/milkRoute.js';
 
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(authRoute);
app.use(ownerRoute);
app.use(employeeRoute);
app.use(customerRoute);
app.use(milkRoute);

app.listen(3000, '0.0.0.0', () => {
    console.log("Server running on port 3000");
});
 