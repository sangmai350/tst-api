import { Router } from "express";
import auth from "./auth";
import employee from "./employee";
import income from "./income";
import outcome from "./outcome";
import user from "./user";
const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/employee", employee);
routes.use("/income", income);
routes.use("/outcome", outcome);

export default routes;
