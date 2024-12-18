const mongoose = require('mongoose');

const connectDatabase = async ()=>{
   await mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true,
        autoCreate: true}).then((data)=>{
            console.log(`Mongodb connected with server ${data.connection.host}`)
        }).catch((err)=>{
            console.log(err)
        })
}
module.exports = connectDatabase;
// ,{useNewUrlParser:true,useUnifiedTopology:true,
//     useCreateIndex:true} 