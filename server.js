// Importação de depẽndencias 
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';

// Importação de módulos
import adminRoute from './src/routes/admin/adminRoute.js'
import userRoute from './src/routes/user/userRoute.js'

// Inicialização do ambiente de desenvolvimento
const app = express();
dotenv.config();
import {connect} from './src/db/db.js' // Conexão com o banco de dados

// Middleware global
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware de rota
app.use('/app', adminRoute)
app.use('/app', userRoute)

// Inicialização do servidor
const PORT = process.env.PORT
app.listen(PORT, () => {
    connect(), // DB
    console.log(`Server is running on port ${PORT}`)
})