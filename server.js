const app = require('./app');
const dotenv = require('dotenv');
const connectDb = require('./config/database')

//Handling Uncaught Exceptions
process.on("uncaughtException",err=>{
    console.log(`ERROR: ${err.message}`);
    console.log(`Shutting down the server due to  Uncaught Exception`);
    process.exit(1);
});

//config

dotenv.config({path:"backend/config/config.env"})

//connecting to database
connectDb();

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is  working on http://localhost:${process.env.PORT}`)
})
//uncaught exception error
// console.log(youtube)


//UnHandled Promise Rejections
process.on("unhandledRejection",err=>{
    console.log(`ERROR: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    });
})