import { Router } from "express";
import IncomeController from "../controllers/IncomeController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

//Get all Incomes
router.get("/", [checkJwt, checkRole(["ADMIN"])], IncomeController.listAll);

// Get one Income
router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  IncomeController.getOneById
);

//Create a new Income
router.post("/", [checkJwt, checkRole(["ADMIN"])], IncomeController.newUser);

//Edit one Income
router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  IncomeController.editUser
);

//Delete one Income
router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  IncomeController.deleteUser
);

export default router;