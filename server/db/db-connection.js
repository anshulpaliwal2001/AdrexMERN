const MongoClient = require('mongoose')
const color = require("colors");
const DB = process.env.DATABASE;

//
// mongoose.connect(DB).then(() => {
//
// }).catch((err) => {
//     console.log(err.red)
// })


async function check() {
    try {
        const client = await MongoClient.connect(DB).then(()=>{
            console.log('> Connected Successfully'.green.bold)
        })
        if (!client) {
        }
    } catch(err) {

        console.log("> Connection Unsuccessful".bold.red)
        console.log({msg : err})
    } finally {
        console.log(`==============================================`);
    }
}


check();

