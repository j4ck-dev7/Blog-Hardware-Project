import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

import adminRoute from './src/routes/admin/adminRoute.js'
import userRoute from './src/routes/user/userRoute.js'

const app = express();
dotenv.config();
import {connect} from './src/db/db.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', adminRoute)
app.use('/api', userRoute)

const PORT = process.env.PORT
app.listen(PORT, () => {
    connect(),
    console.log(`Server is running on port ${PORT}`)
})