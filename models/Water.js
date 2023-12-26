import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "./hooks.js";
import Joi from "joi";

const waterSchema = new Schema({
  waterVolume: {
    type: Number,
    max: 5000
  },
  time: {
    type: String
  },
  date: {
    type: Number,
    min: 1,
    max: 31
  },
  month: {
    type: String,
    enum: ["January", "February", "March", "April", "May", "June", "July", "August",
      "September", "October", "November", "December"]
  },
  percent: {
    type: Number
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
},
  { versionKey: false, timestamps: true }
)

waterSchema.post("save", handleSaveError);
waterSchema.pre("findOneAndUpdate", preUpdate);
waterSchema.post("findOneAndUpdate", handleSaveError);

export const Water = model("water", waterSchema);

export const addWaterSchema = Joi.object({
  waterVolume: Joi.number().min(1).max(5000).required().messages({ "any.required": "missing required amount field" }),
  time: Joi.string().required().messages({ "any.required": "missing required time field" }),
  date: Joi.number().min(1).max(31).required().messages({ "any.required": "missing required date field" }),
  month: Joi.string().valid("January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December").required().messages({ "any.required": "missing required month field" }),
  percent: Joi.number().messages({ "any.required": "missing required percent field" }),
})

export const updateWaterSchema = Joi.object({
  waterVolume: Joi.number().min(1).max(5000),
  time: Joi.string(),
  date: Joi.number(),
  month: Joi.string()
})

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
})