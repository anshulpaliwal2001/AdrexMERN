// ====== Imports =======
const express = require("express");
const app = express();
const dotenv = require("dotenv")
const color = require("colors");
// dotenv path
dotenv.config({path: './config.env'});
// dotenv PORT assignment
const port = process.env.PORT;
// connection
require('./db/db-connection');
app.use(express.json())

//Routes
const authRoute = require('./router/authRoute')
const faqRoute = require('./router/faqRoute')


app.use('/adrex/api/v1/auth', authRoute)

app.use('/adrex/api/v1/faq', faqRoute)

app.all('*', (req, res) => {
    res.status(404).send('404! Page not found');
});

app.listen(port, () => {
    console.log(`==============================================`);
    console.log(color.bold(`> Server is running on ${port}`));
});
