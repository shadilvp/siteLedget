import {
  createSite,
  getSites,
  getSiteById,
  updateSite,
  hardDeleteSite,
  softDeleteSite,
} from "../services/site.service.js";
import AppError from "../utils/AppError.js";
import { AppResponse } from "../utils/AppResponse.js";

// Create Site
export const create = async (req, res, next) => {
  try {
    const { name, description, initialBudget } = req.body;
    if (!name || !initialBudget) throw new AppError("Name and budget required", 400);

    const site = await createSite({
      companyId: req.company.id,
      name,
      description,
      initialBudget,
    });

    res.status(201).json({ message: "Site created", site });
  } catch (err) {
    next(err);
  }
};


export const list = async (req, res, next) => {
  try {
    // fetch sites
    const sites = await getSites(req.company.id);

    const pagination = {
      total: sites.length,
      page: 1,
      totalPages: 1,
    };

    const formattedSites = sites.map((s) => ({
      id: s._id,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      name: s.name,
      description: s.description,
      initial_budget: s.initialBudget,
      current_balance: s.currentBalance,
      fk_company_id: s.companyId,
      status: s.status,
    }));

    return AppResponse.success(res, "Sites fetched successfully", {
      sites: formattedSites,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};


// Get Single Site
export const getById = async (req, res, next) => {
  try {
    const site = await getSiteById(req.company.id, req.params.id);
    res.json(site);
  } catch (err) {
    next(err);
  }
};

// Update Site
export const update = async (req, res, next) => {
  try {
    const site = await updateSite(req.company.id, req.params.id, req.body);
    res.json({ message: "Site updated", site });
  } catch (err) {
    next(err);
  }
};

// Soft Delete Site
export const softDelete = async (req, res, next) => {
  try {
    const site = await softDeleteSite(req.company.id, req.params.id);

    return AppResponse.success(res, "Site soft deleted successfully", {
      id: site._id,
      name: site.name,
      status: site.status,
    });
  } catch (err) {
    next(err);
  }
};

// Hard Delete Site
export const hardDelete = async (req, res, next) => {
  try {
    const site = await hardDeleteSite(req.company.id, req.params.id);

    return AppResponse.success(res, "Site permanently deleted", {
      id: site._id,
      name: site.name,
    });
  } catch (err) {
    next(err);
  }
};
