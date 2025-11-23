import { Router } from "express";
import {
  getAllServices,
  getServiceByName,
  registerService,
  updateService,
  deleteService,
} from "../controllers/serviceController";

const router = Router();

router.get("/", getAllServices);
router.get("/:name", getServiceByName);
router.post("/", registerService);
router.put("/:name", updateService);
router.delete("/:name", deleteService);

export default router;
