import { Router } from "express";
import EmployeeController from "../controllers/EmployeeController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

//Get all Employees
router.get("/", [checkJwt, checkRole(["ADMIN"])], EmployeeController.listAll);

// Get one Employee
router.get(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  EmployeeController.getOneById
);

//Create a new Employee
router.post("/", [checkJwt, checkRole(["ADMIN"])], EmployeeController.newUser);

//Edit one Employee
router.patch(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  EmployeeController.editUser
);

//Delete one Employee
router.delete(
  "/:id([0-9]+)",
  [checkJwt, checkRole(["ADMIN"])],
  EmployeeController.deleteUser
);

export default router;