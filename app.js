const express=require('express');
const app = express();
const cookieParser = require("cookie-parser")
const cors = require('cors')

const errorMiddleware = require("./middlewares/error")
const corsOptions = {
    origin: 'https://ecommerce-frontend-bice-one.vercel.app/',
    credentials: true
  };
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//Importing Routes
const product  = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");


app.use('/api/v1',product)
app.use('/api/v1',user)
app.use('/api/v1',order)
app.use("/api/v1", payment);


//Middleware for Error
app.use(errorMiddleware);

module.exports = app;
