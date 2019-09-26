const validator = require('validator');
const isEmpty = require('./is-empty')


module.exports = function validateEducationInput(data) {

    let errors = {}

    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.from = !isEmpty(data.from) ? data.from : '';
    data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';

    if (isEmpty(data.school)) {
        errors.school = "school field is required";
    }
    if (validator.isEmpty(data.degree)) {
        errors.degree = "degree field is required";
    }

    if (validator.isEmpty(data.fieldOfStudy)) {
        errors.fieldOfStudy = "fieldOfStudy field is required";
    }

    if (isEmpty(data.from)) {
        errors.from = "from field is required";
    }
    return ({
        errors,
        isValid: isEmpty(errors)
    })

}