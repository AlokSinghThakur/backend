const mongoose = require('mongoose')

require('dotenv').config()

const start = () => {

    mongoose.connect(process.env.DBURI)
    mongoose.connection.on(
        "error",()=>{
            console.log("error")
        }
    )
    mongoose.connection.once(
        "Connection_OK",()=>{
            console.log('DB Connected')
        }
    )
} 

module.exports= {
    start
}