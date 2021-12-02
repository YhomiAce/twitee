const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ "message": err.msg }));

  return res.status(422).json({
    errors: extractedErrors
  });
};

const okvalidate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(422).json({ errors: errors.array() });
  };
};

const registerValidation = () => {
    return [
      body("name", "Name is required").notEmpty(),
      body("email", "Please Provide a valid Email address").isEmail(),
      body("password", "Enter Password with length of 8 or more characters").isLength({min:8})     
    ];
};
  
const loginValidation = () => {
    return [
      body("email", "email is required").isEmail(),
      body("password", "Enter Password with length of 8 or more characters").isLength({min:8})     
    ];
};


module.exports = {
    validate,
    okvalidate,
    registerValidation,
    loginValidation
}