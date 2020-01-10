import { Router } from "express";
import OutcomeController from "../controllers/OutcomeController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

//Get all Outcomes
router.get("/", [checkJwt, checkRole(["ADMIN"])], OutcomeController.listAll);

// Get one Outcome
router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  OutcomeController.getOneById
);

//Create a new Outcome
router.post("/", [checkJwt, checkRole(["ADMIN"])], OutcomeController.newUser);

//Edit one Outcome
router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  OutcomeController.editUser
);

//Delete one Outcome
router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  OutcomeController.deleteUser
);

export default router;