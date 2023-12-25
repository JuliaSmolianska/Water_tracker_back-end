import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "./hooks.js";
import Joi from "joi";

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const userSchema = new Schema({
  name: {
    type: String,
    minLenth: 1,
    maxLenth: 32,
    required: [true, 'Username must be field'],
  },
  email: {
    type: String,
    match: emailPattern,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    minLenth: 8,
    maxLenth: 64,
    required: [true, 'Set password for user'],
  },
  avatarURL: {
    type: String,
    required: [true, "set avatarURL"],
  },
  gender: {
    type: String,
    enum: ["man", "woman"],
    default: "man"
  },
  waterRate: {
    type: Number,
    default: 0
  },
  token: {
    type: String,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  }

},
  { versionKey: false, timestamps: true }
)

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", preUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

export const User = model("user", userSchema);

export const userRegisterSchema = Joi.object({
  name: Joi.string().min(1).max(32).required().messages({ "any.required": `"username" is a required field` }),
  email: Joi.string().pattern(emailPattern).required().messages({ "any.required": `"email" is a required field` }),
  password: Joi.string().min(8).max(64).required().messages({ "any.required": `"password" is a required field` }),
  gender: Joi.string().valid("man", "woman").default("man"),
  waterRate: Joi.number().default(0)
})

export const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required().messages({ "any.required": `"email" is a required field` }),
  password: Joi.string().min(8).max(64).required().messages({ "any.required": `"password" is a required field` }),
})

export const userUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(32).messages({ "any.required": `"username" is a required field` }),
  email: Joi.string().pattern(emailPattern).messages({ "any.required": `"email" is a required field` }),
  gender: Joi.string().valid("man", "woman").default("man"),
  waterRate: Joi.number().min(1).max(15000),
})

export const userNormWaterSchema = Joi.object({
  waterRate: Joi.number().min(1).max(15000).required().messages({ "any.required": "missing required field dailyWaterNorm" }),
  gender: Joi.string().valid("man", "woman"),
})