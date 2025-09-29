import Spending from "../models/spending.model.js";
import Site from "../models/site.model.js";
import AppError from "../utils/AppError.js";

// Create Spending and deduct from site balance
export const createSpending = async ({
  siteId,
  title,
  description,
  amount,
  companyId,
}) => {
  const site = await Site.findOne({ _id: siteId, companyId, status: "active" });
  if (!site) throw new AppError("Site not found or not accessible", 404);

  if (site.currentBalance < amount)
    throw new AppError("Insufficient balance", 400);

  const spending = await Spending.create({
    siteId,
    title,
    description,
    amount,
  });

  site.currentBalance -= amount;
  await site.save();

  return spending;
};

// Get all spendings for a site
export const getSpendings = async (companyId, siteId) => {
  const site = await Site.findOne({ _id: siteId, companyId });
  if (!site) throw new AppError("Site not found", 404);

  return await Spending.find({ siteId, status: "active" });
};

// Get single spending
export const getSpendingById = async (companyId, siteId, spendingId) => {
  const site = await Site.findOne({ _id: siteId, companyId });
  if (!site) throw new AppError("Site not found", 404);

  const spending = await Spending.findOne({ _id: spendingId, siteId });
  if (!spending) throw new AppError("Spending not found", 404);

  return spending;
};

// Update spending and adjust balance if amount changed
export const updateSpending = async (
  companyId,
  siteId,
  spendingId,
  updates
) => {
  const site = await Site.findOne({ _id: siteId, companyId });
  if (!site) throw new AppError("Site not found", 404);

  const spending = await Spending.findOne({ _id: spendingId, siteId });
  if (!spending) throw new AppError("Spending not found", 404);

  // If amount changed, adjust balance
  if (updates.amount && updates.amount !== spending.amount) {
    const diff = updates.amount - spending.amount;
    if (diff > 0 && site.currentBalance < diff)
      throw new AppError("Insufficient balance", 400);

    site.currentBalance -= diff;
    await site.save();
  }

  Object.assign(spending, updates);
  await spending.save();

  return spending;
};

// Soft delete (restore balance)
export const softDeleteSpending = async (companyId, siteId, spendingId) => {
  const spending = await Spending.findOneAndUpdate(
    { _id: spendingId, siteId, status: "active" },
    { status: "inactive" },
    { new: true }
  );
  if (!spending) throw new AppError("Spending not found", 404);

  const site = await Site.findOne({ _id: siteId, companyId });
  if (site) {
    site.currentBalance += spending.amount;
    await site.save();
  }

  return spending;
};

// Hard delete (restore balance + remove permanently)
export const hardDeleteSpending = async (companyId, siteId, spendingId) => {
  const spending = await Spending.findOneAndDelete({ _id: spendingId, siteId });
  if (!spending) throw new AppError("Spending not found", 404);

  const site = await Site.findOne({ _id: siteId, companyId });
  if (site) {
    site.currentBalance += spending.amount;
    await site.save();
  }

  return spending;
};
