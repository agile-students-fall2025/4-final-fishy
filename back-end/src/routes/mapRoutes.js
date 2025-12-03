import express from "express";
import {
  listAll,
  getOne,
  createOne,
  updateOne,
  removeOne,
  addPhotosOne,
} from "../controllers/mapController.js";

const router = express.Router();

router.get("/locations", listAll);
router.get("/locations/:id", getOne);
router.post("/locations", createOne);
router.put("/locations/:id", updateOne);
router.delete("/locations/:id", removeOne);
router.post("/locations/:id/photos", addPhotosOne);

export default router;
