import mongoose from "mongoose";
import Joi from "joi";

const siteSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    name: { type: String, required: true },
    description: String,
    initialBudget: { type: Number, required: true },
    currentBalance: { type: Number, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" }
  },
  { timestamps: true }
);

export const validateSite = (data) => {
  const schema = Joi.object({
    companyId: Joi.string().required(),
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().allow(""),
    initialBudget: Joi.number().min(0).required(),
    currentBalance: Joi.number().min(0).required(),
    status: Joi.string().valid("active", "inactive").optional()
  });
  return schema.validate(data);
};

export default mongoose.model("Site", siteSchema);
