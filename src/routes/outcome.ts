import { Router } from "express";
import OutcomeController from "../controllers/OutcomeController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

// Get all Outcomes
router.get("/", [checkJwt, checkRole(["ADMIN"])], OutcomeController.listAllOucomes);

// Get one Outcome
router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  OutcomeController.getOneOucomeById,
);

// Create a new Outcome
router.post("/", [checkJwt, checkRole(["ADMIN"])], OutcomeController.newOucome);

// Edit one Outcome
router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  OutcomeController.editOucome,
);

// Delete one Outcome
router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  OutcomeController.deleteOucome,
);

export default router;
