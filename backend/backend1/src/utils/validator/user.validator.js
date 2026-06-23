const joi = require("joi");

const userSchema = joi
  .object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .min(6)
      .max(30)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};:'\",.<>/?]).{6,30}$",
        ),
      )
      .message(
        "Password must be 6-30 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    role: joi.array()
      .items(joi.string().valid("user", "seller", "admin"))
      .min(1) // Optional: requires at least one role
      .required(),
    authProvider: joi.string().valid("local", "google").required(),
  })
  .unknown(true); // Allow unknown keys

const validateUser = (userData) => {
  return userSchema.validate(userData);
};

module.exports = validateUser;
