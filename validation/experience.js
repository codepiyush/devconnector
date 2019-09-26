const validator = require('validator');
const isEmpty = require('./is-empty')


module.exports = function validateExperienceInput(data) {

    let errors = {}

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (isEmpty(data.title)) {
        errors.title = "job title field is required";
    }
    if (validator.isEmpty(data.company)) {
        errors.company = "company field couldn't be empty";
    }

    if (isEmpty(data.from)) {
        errors.from = "from field is required";
    }
    return ({
        errors,
        isValid: isEmpty(errors)
    })

}