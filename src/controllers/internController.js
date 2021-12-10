const InternModel = require('../models/internModel')
const CollegeModel = require('../models/collegeModel')

const regexMobile = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null ) return false
    if (typeof value === 'string'  && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

//let interests = [];


// creating college

const createIntern = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern details' })
            return
        }

        //extract params

        let { name, email, mobile, collegeName } = requestBody;

        //validation starts

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid name' })
            return
        }

        if (!isValid(email)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid email' })
            return
        }
         email = email.trim();
        
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({status: false, message: `Email should be a valid email address`})
            return
        }
         

        if (!isValid(mobile)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid mobile' })
            return
        }
        mobile = mobile.trim();

        if(!(regexMobile.test(mobile))){
            res.status(400).send({status: false, message: `mobile should be valid `}) 
            return
        }


        if (!isValid(collegeName)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide valid collegeName' })
            return
        }

        const isNumberAlreadyUsed = await InternModel.findOne({mobile}); 

        if(isNumberAlreadyUsed) {
            res.status(400).send({status: false, message: `${mobile} mobile is already registered`})
            return
        }

        const isEmailAlreadyUsed = await InternModel.findOne({email}); 

        if(isEmailAlreadyUsed) {
            res.status(400).send({status: false, message: `${email} email is already registered`})
            return
        }

        //validation ends
         let nm = req.body.collegeName;
         //console.log(nm)
        const collegeData = await CollegeModel.findOne({name: nm , isDeleted: false})
        //console.log(collegeData)

        if(!collegeData){
            res.status(400).send({status: false, message: ` not a valid college name or the college is not active at present`})
        }

   
        let Id = collegeData._id;
       // console.log(Id)
        req.body.collegeId = Id;
       //console.log(req.body)

        const internData = {name, email, mobile,  collegeId:Id }
        const createIntern = await InternModel.create(internData);

        res.status(201).send({ status: true, message: `college created successfully`, data: createIntern });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
        return

    }
}





module.exports.createIntern = createIntern;
