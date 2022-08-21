const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
    icon: {
        type: String, require: true
    }, title: {
        type: String, require: true
    },
    subtitle: {
        type: String, require: true
    }, qandA: [{
        question: {
            type: String, require: true
        }, ans: {
            type: String, require: true
        }
    }]
},{
    collection : 'faq'
})

const faqModel = mongoose.model('faq', faqSchema)
module.exports = faqModel