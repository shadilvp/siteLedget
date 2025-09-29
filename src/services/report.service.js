import Site from "../models/site.model.js";
import Spending from "../models/spending.model.js";
import Fund from "../models/fund.model.js";

export const getSiteReports = async (companyId) => {
  // Fetch all active sites of company
  const sites = await Site.find({ companyId, status: "active" });

  const reports = [];

  for (const site of sites) {
    // Calculate total funds
    const totalFunds = await Fund.aggregate([
      { $match: { siteId: site._id, status: "active" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Calculate total spendings
    const totalSpendings = await Spending.aggregate([
      { $match: { siteId: site._id, status: "active" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    reports.push({
      id: site._id,
      name: site.name,
      description: site.description,
      initial_budget: site.initialBudget,
      total_funds: totalFunds[0]?.total || 0,
      total_spendings: totalSpendings[0]?.total || 0,
      current_balance: site.currentBalance,
      status: site.status,
      createdAt: site.createdAt,
      updatedAt: site.updatedAt,
    });
  }

  return reports;
};
