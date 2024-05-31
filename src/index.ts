import express, {Express} from "express";
import dotenv from "dotenv";
import {errorHandler} from "./middlewares/errorHandler";
import currencyRouter from "./routers/currency-router";
import path from "node:path";
import registerRouter from "./routers/register-router";
import {requireAuth} from "./middlewares/requireAuthHandler";
import loginRouter from "./routers/login-router";
import logoutRouter from "./routers/logout-router";
import cookieParser from "cookie-parser";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 80;

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
   res.redirect('/login');
});

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/currencies', currencyRouter);

app.get('/currency-management', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'main.html'))
});


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use(errorHandler);