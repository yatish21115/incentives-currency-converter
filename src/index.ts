import express, {Express} from "express";
import dotenv from "dotenv";
import {errorHandler} from "./middlewares/errorHandler";
import currencyRouter from "./routers/currency-router";
import path from "node:path";
import registerRouter from "./routers/register-router";
import cookieSession from 'cookie-session';
import {requireAuth} from "./middlewares/requireAuthHandler";
import loginRouter from "./routers/login-router";
import logoutRouter from "./routers/logout-router";
import {sessionAuth} from "./middlewares/sessionAuthHandler";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cookieSession({
    name: 'session',
    keys: [process.env.SECRET_KEY!],
    maxAge:  10 * 1000//15 * 60 * 1000 //24 * 60 * 60 * 1000 (24 hours)
}));
app.use(express.json());

app.get('/', (req, res) => {
   res.redirect('/login');
});

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/currencies', sessionAuth, currencyRouter);

app.get('/currency-management', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'main.html'))
});


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.use(errorHandler);