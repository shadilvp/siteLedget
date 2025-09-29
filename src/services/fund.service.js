import Fund from "../models/fund.model.js";
import Site from "../models/site.model.js";
import AppError from "../utils/AppError.js";

// Create Fund and add to site balance
export const createFund = async ({ siteId, title, description, amount, companyId }) => {
  const site = await Site.findOne({ _id: siteId, companyId, status: "active" });
  if (!site) throw new AppError("Site not found or not accessible", 404);

  const fund = await Fund.create({
    siteId,
    title,
    description,
    amount,
  });

  site.currentBalance += amount;
  await site.save();

  return fund;
};

// Get all funds for a site
export const getFunds = async (companyId, siteId) => {
  const site = await Site.findOne({ _id: siteId, companyId });
  if (!site) throw new AppError("Site not found", 404);

  return await Fund.find({ siteId, status: "active" });
};

// Get single fund
export const getFundById = async (companyId, siteId, fundId) => {
  const site = await Site.findOne({ _id: siteId, companyId });
  if (!site) throw new AppError("Site not found", 404);

  const fund = await Fund.findOne({ _id: fundId, siteId });
  if (!fund) throw new AppError("Fund not found", 404);

  return fund;
};

// Update fund and adjust balance if amount changed
export const updateFund = async (companyId, siteId, fundId, updates) => {
  const site = await Site.findOne({ _id: siteId, companyId });
  if (!site) throw new AppError("Site not found", 404);

  const fund = await Fund.findOne({ _id: fundId, siteId });
  if (!fund) throw new AppError("Fund not found", 404);

  // If amount changed, adjust balance
  if (updates.amount && updates.amount !== fund.amount) {
    const diff = updates.amount - fund.amount;
    site.currentBalance += diff;
    await site.save();
  }

  Object.assign(fund, updates);
  await fund.save();

  return fund;
};

// Soft delete (subtract from balance)
export const softDeleteFund = async (companyId, siteId, fundId) => {
  const fund = await Fund.findOneAndUpdate(
    { _id: fundId, siteId, status: "active" },
    { status: "inactive" },
    { new: true }
  );
  if (!fund) throw new AppError("Fund not found", 404);

  const site = await Site.findOne({ _id: siteId, companyId });
  if (site) {
    site.currentBalance -= fund.amount;
    await site.save();
  }

  return fund;
};

// Hard delete (subtract from balance + remove permanently)
export const hardDeleteFund = async (companyId, siteId, fundId) => {
  const fund = await Fund.findOneAndDelete({ _id: fundId, siteId });
  if (!fund) throw new AppError("Fund not found", 404);

  const site = await Site.findOne({ _id: siteId, companyId });
  if (site) {
    site.currentBalance -= fund.amount;
    await site.save();
  }

  return fund;
};
