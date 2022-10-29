const Joi = require('@hapi/joi')

function userValidation(data){
    const schema = Joi.object ({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
    return schema.validate(data)
}


module.exports.userValidation = userValidation 