import {
  createFund,
  getFunds,
  getFundById,
  updateFund,
  softDeleteFund,
  hardDeleteFund,
} from "../services/fund.service.js";
import AppError from "../utils/AppError.js";
import { AppResponse } from "../utils/AppResponse.js";

// Create Fund
export const create = async (req, res, next) => {
  try {
    const { title, description, amount } = req.body;
    if (!title || !amount) throw new AppError("Title and amount required", 400);

    const fund = await createFund({
      siteId: req.params.siteId,
      title,
      description,
      amount,
      companyId: req.company.id,
    });

    return AppResponse.success(
      res,
      "Fund added successfully",
      {
        id: fund._id,
        site_id: fund.siteId,
        title: fund.title,
        description: fund.description,
        amount: fund.amount,
        status: fund.status,
        createdAt: fund.createdAt,
        updatedAt: fund.updatedAt,
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

// List Funds
export const list = async (req, res, next) => {
  try {
    const funds = await getFunds(req.company.id, req.params.siteId);

    const pagination = {
      total: funds.length,
      page: 1,
      totalPages: 1,
    };

    const formatted = funds.map((f) => ({
      id: f._id,
      site_id: f.siteId,
      title: f.title,
      description: f.description,
      amount: f.amount,
      status: f.status,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    }));

    return AppResponse.success(res, "Funds fetched successfully", {
      funds: formatted,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};

// Get by ID
export const getById = async (req, res, next) => {
  try {
    const fund = await getFundById(req.company.id, req.params.siteId, req.params.id);

    return AppResponse.success(res, "Fund fetched successfully", {
      id: fund._id,
      site_id: fund.siteId,
      title: fund.title,
      description: fund.description,
      amount: fund.amount,
      status: fund.status,
      createdAt: fund.createdAt,
      updatedAt: fund.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};

// Update
export const update = async (req, res, next) => {
  try {
    const fund = await updateFund(
      req.company.id,
      req.params.siteId,
      req.params.id,
      req.body
    );

    return AppResponse.success(res, "Fund updated successfully", {
      id: fund._id,
      site_id: fund.siteId,
      title: fund.title,
      description: fund.description,
      amount: fund.amount,
      status: fund.status,
      createdAt: fund.createdAt,
      updatedAt: fund.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};

// Soft Delete
export const softDelete = async (req, res, next) => {
  try {
    const fund = await softDeleteFund(req.company.id, req.params.siteId, req.params.id);

    return AppResponse.success(res, "Fund soft deleted successfully", {
      id: fund._id,
      site_id: fund.siteId,
      title: fund.title,
      amount: fund.amount,
      status: fund.status,
    });
  } catch (err) {
    next(err);
  }
};

// Hard Delete
export const hardDelete = async (req, res, next) => {
  try {
    const fund = await hardDeleteFund(req.company.id, req.params.siteId, req.params.id);

    return AppResponse.success(res, "Fund permanently deleted", {
      id: fund._id,
      site_id: fund.siteId,
      title: fund.title,
      amount: fund.amount,
    });
  } catch (err) {
    next(err);
  }
};
