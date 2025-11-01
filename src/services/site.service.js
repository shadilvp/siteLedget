import Site from "../models/site.model.js";
import AppError from "../utils/AppError.js";

// ✅ Create Site
export const createSite = async ({ companyId, name, description, initialBudget }) => {
  const site = await Site.create({
    companyId,
    name,
    description,
    initialBudget,
    currentBalance: initialBudget,
  });
  return site;
};

// ✅ Get All Sites (for one company)
export const getSites = async (companyId) => {
  return await Site.find({ companyId, status: "active" });
};

// ✅ Get Single Site
export const getSiteById = async (companyId, siteId) => {
  const site = await Site.findOne({ _id: siteId, companyId });
  if (!site) throw new AppError("Site not found", 404);
  return site;
};

// ✅ Update Site
export const updateSite = async (companyId, siteId, updates) => {
  const site = await Site.findOneAndUpdate(
    { _id: siteId, companyId },
    updates,
    { new: true }
  );
  if (!site) throw new AppError("Site not found or not yours", 404);
  return site;
};

// ✅ Soft Delete Site (mark inactive and timestamp)
export const softDeleteSite = async (companyId, siteId) => {
  const site = await Site.findOneAndUpdate(
    { _id: siteId, companyId },
    { status: "inactive", deletedAt: new Date() },
    { new: true }
  );
  if (!site) throw new AppError("Site not found or not yours", 404);
  return site;
};

// ✅ Hard Delete Site (manual)
export const hardDeleteSite = async (companyId, siteId) => {
  const site = await Site.findOneAndDelete({ _id: siteId, companyId });
  if (!site) throw new AppError("Site not found or not yours", 404);
  return site;
};

// ✅ Automated Cleanup Logic (used by cron job)
export const cleanupOldSites = async () => {
  const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const result = await Site.deleteMany({
    status: "inactive",
    deletedAt: { $lte: cutoffDate },
  });
  return result.deletedCount;
};
