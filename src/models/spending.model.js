import mongoose from "mongoose";
import Joi from "joi";

const spendingSchema = new mongoose.Schema(
  {
    siteId: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
    title: { type: String, required: true },
    description: String,
    amount: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

export const validateSpending = (data) => {
  const schema = Joi.object({
    siteId: Joi.string().required(),
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().allow(""),
    amount: Joi.number().min(1).required(),
    status: Joi.string().valid("active", "inactive").optional()
  });
  return schema.validate(data);
};

export default mongoose.model("Spending", spendingSchema);
