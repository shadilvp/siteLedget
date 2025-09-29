import { getSiteReports } from "../services/report.service.js";
import { AppResponse } from "../utils/AppResponse.js";

export const siteReports = async (req, res, next) => {
  try {
    const reports = await getSiteReports(req.company.id);

    return AppResponse.success(res, "Site reports fetched successfully", {
      sites: reports,
    });
  } catch (err) {
    next(err);
  }
};
