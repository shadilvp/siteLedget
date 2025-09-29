import {
  createSpending,
  getSpendings,
  getSpendingById,
  updateSpending,
  softDeleteSpending,
  hardDeleteSpending,
} from "../services/spending.service.js";
import AppError from "../utils/AppError.js";
import { AppResponse } from "../utils/AppResponse.js";

// Create Spending
export const create = async (req, res, next) => {
  try {
    const { title, description, amount } = req.body;
    if (!title || !amount) throw new AppError("Title and amount required", 400);

    const spending = await createSpending({
      siteId: req.params.siteId,
      title,
      description,
      amount,
      companyId: req.company.id,
    });

    return AppResponse.success(
      res,
      "Spending added successfully",
      {
        id: spending._id,
        site_id: spending.siteId,
        title: spending.title,
        description: spending.description,
        amount: spending.amount,
        status: spending.status,
        createdAt: spending.createdAt,
        updatedAt: spending.updatedAt,
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

// List Spendings
export const list = async (req, res, next) => {
  try {
    const spendings = await getSpendings(req.company.id, req.params.siteId);

    const pagination = {
      total: spendings.length,
      page: 1,
      totalPages: 1,
    };

    const formatted = spendings.map((s) => ({
      id: s._id,
      site_id: s.siteId,
      title: s.title,
      description: s.description,
      amount: s.amount,
      status: s.status,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    return AppResponse.success(res, "Spendings fetched successfully", {
      spendings: formatted,
      pagination,
    });
  } catch (err) {
    next(err);
  }
};

// Get by ID
export const getById = async (req, res, next) => {
  try {
    const spending = await getSpendingById(
      req.company.id,
      req.params.siteId,
      req.params.id
    );

    return AppResponse.success(res, "Spending fetched successfully", {
      id: spending._id,
      site_id: spending.siteId,
      title: spending.title,
      description: spending.description,
      amount: spending.amount,
      status: spending.status,
      createdAt: spending.createdAt,
      updatedAt: spending.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};

// Update
export const update = async (req, res, next) => {
  try {
    const spending = await updateSpending(
      req.company.id,
      req.params.siteId,
      req.params.id,
      req.body
    );

    return AppResponse.success(res, "Spending updated successfully", {
      id: spending._id,
      site_id: spending.siteId,
      title: spending.title,
      description: spending.description,
      amount: spending.amount,
      status: spending.status,
      createdAt: spending.createdAt,
      updatedAt: spending.updatedAt,
    });
  } catch (err) {
    next(err);
  }
};

// Soft Delete
export const softDelete = async (req, res, next) => {
  try {
    const spending = await softDeleteSpending(
      req.company.id,
      req.params.siteId,
      req.params.id
    );

    return AppResponse.success(res, "Spending soft deleted successfully", {
      id: spending._id,
      site_id: spending.siteId,
      title: spending.title,
      amount: spending.amount,
      status: spending.status,
    });
  } catch (err) {
    next(err);
  }
};

// Hard Delete
export const hardDelete = async (req, res, next) => {
  try {
    const spending = await hardDeleteSpending(
      req.company.id,
      req.params.siteId,
      req.params.id
    );

    return AppResponse.success(res, "Spending permanently deleted", {
      id: spending._id,
      site_id: spending.siteId,
      title: spending.title,
      amount: spending.amount,
    });
  } catch (err) {
    next(err);
  }
};
