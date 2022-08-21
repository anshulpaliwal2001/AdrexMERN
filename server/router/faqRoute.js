const express = require("express")
const router = express.Router()
const faqModel = require('../model/faqSchema')


router.get('/all', (req, res) => {
    console.log(req.query)
    try {
        faqModel.findOne({"_id": "62da8affe1c0bd69e359ed4a"}, {'_id': 0}).then(data => {
            const { q = '' } = req.query
            const queryLowered = q.toLowerCase()
            const filteredData = {}
            Object.entries(data).forEach(entry => {
                const [categoryName, categoryObj] = entry
                const filteredQAndAOfCategory = categoryObj.qandA.filter(qAndAObj => {
                    return qAndAObj.question.toLowerCase().includes(queryLowered)
                })
                filteredData[categoryName] = {
                    ...categoryObj,
                    qandA: filteredQAndAOfCategory.length ? filteredQAndAOfCategory : []
                }
            })
            res.status(200).json(filteredData)
        })
    } catch (err) {
        console.log(err)
    }
});

module.exports = router