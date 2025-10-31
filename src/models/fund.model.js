import mongoose from "mongoose";
import Joi from "joi";

const fundSchema = new mongoose.Schema(
  {
    siteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Site",
      required: true,
    },
    amount: { type: Number, required: true },
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const validateFund = (data) => {
  const schema = Joi.object({
    siteId: Joi.string().required(),
    amount: Joi.number().min(1).required(),
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().allow(""),
    status: Joi.string().valid("active", "inactive").optional(),
  });
  return schema.validate(data);
};

export default mongoose.model("Fund", fundSchema);
