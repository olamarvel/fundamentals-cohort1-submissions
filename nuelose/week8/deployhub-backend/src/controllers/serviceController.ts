import { Request, Response } from "express";
import { Service } from "../models/Services";

export const registerService = async (req: Request, res: Response) => {
  try {
    const { name, url, version } = req.body;

    if (!name || !url || !version) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await Service.findOne({ name });
    if (existing) {
      return res.status(409).json({ error: "Service already registered" });
    }

    const service = new Service({ name, url, version });
    await service.save();

    res
      .status(201)
      .json({ message: "Service registered successfully", service });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message, error: "Failed to register service" });
  }
};

export const getAllServices = async (_req: Request, res: Response) => {
  const services = await Service.find();
  res.json(services);
};

export const getServiceByName = async (req: Request, res: Response) => {
  const { name } = req.params;
  const service = await Service.findOne({ name });

  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }

  res.json(service);
};

export const updateService = async (req: Request, res: Response) => {
  const { name } = req.params;
  const updates = req.body;

  try {
    const service = await Service.findOneAndUpdate({ name }, updates, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json({ message: "Service updated", service });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  const { name } = req.params;

  try {
    const service = await Service.findOneAndDelete({ name });

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json({ message: "Service deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
