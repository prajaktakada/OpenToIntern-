const express = require('express')

const router = express.Router()
//college
const CollegeController = require('../controllers/collegeController')
const internController = require('../controllers/internController')

//intern
router.post("/colleges", CollegeController.createCollege)
router.post("/interns", internController.createIntern)
router.get("/collegeDetails", CollegeController.getCollegeDetails)

module.exports = router;