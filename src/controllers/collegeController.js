const CollegeModel = require('../models/collegeModel')
const InternModel = require('../models/internModel')

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

// creating college

const createCollege = async function (req, res) {
    try {
        const requestBody = req.body; 
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide college details' })
            return
        }

        //extract params

        let { name, fullName, logoLink } = requestBody;

        //validation starts

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid name' })
            return
        }

        name = name.toLowerCase();

        if (!isValid(fullName)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid fullName' })
            return
        }
        if (!isValid(logoLink)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid logoLink' })
            return
        }

        const isNameAlreadyUsed = await CollegeModel.findOne({name}); 

        if(isNameAlreadyUsed) {
            res.status(400).send({status: false, message: `${name} is already registered`})
            return
        }

        //validation ends

        const collegeData = { name, fullName, logoLink } 
        const createCollege = await CollegeModel.create(collegeData);

        res.status(201).send({ status: true, message: `college created successfully`, data: createCollege });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });

    }
}


//
const getCollegeDetails = async function (req, res){
    try{
        let que = req.query;
        if(!isValidRequestBody(que)){
            res.status(400).send({status: false, msg: `Invalid request. No request passed in the query`}) 
            return
        }
        let collegeAbb = req.query.collegeName;
       
        let collegeDetail = await CollegeModel.findOne({name: collegeAbb, isDeleted: false})//.select({name: 1, fullName: 1, logoLink: 1})
      //console.log(collegeDetail)

        if(!isValid(collegeDetail)){
            res.status(400).send({ status: false, message: `Invalid request parameters. ${collegeAbb} is not a valid college name` })
            return
        }

        clgId = collegeDetail._id;
       // console.log(clgId)

         let internsData = await InternModel.find({collegeId: clgId, isDeleted: false}).select({_id: 1, name:1,email: 1, mobile: 1})
         if(internsData.length == 0){
            res.status(204).send({ status: true, message: ` No interns applied for this college` })
            return
         }
       
        let newData = {
            name: collegeDetail.name, 
            fullName: collegeDetail.fullName, 
            logoLink: collegeDetail.logoLink,
            internsData: internsData 
        }

        res.status(200).send({ status: true, message: `college details with intern ` , data: newData })

    }catch(err){
        res.status(500).send({ status: false, message: err.message });
    }
}





module.exports.createCollege = createCollege;
module.exports.getCollegeDetails = getCollegeDetails 

