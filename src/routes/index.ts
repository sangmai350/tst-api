import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";
import employee from "./employee";
import income from "./income"
import outcome from "./outcome"
const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/employee", employee);
routes.use("/income", income);
routes.use("/outcome", outcome);

export default routes;
