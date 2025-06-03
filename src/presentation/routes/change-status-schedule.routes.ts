import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { ChangeStatusScheduleController } from "../controllers/change-statusSchedule.controller";
import { ChangeStatusValidation } from "../middlewares/change-status-validation.middleware";
import { changeStatusSchedulingUseCase } from "./scheduling.routes";

const changeStatusScheduleController = new ChangeStatusScheduleController(
  changeStatusSchedulingUseCase,
);
const changeStatusScheduleRoutes = Router();

changeStatusScheduleRoutes.patch(
  "/agendamentos/:id/status",
  ChangeStatusValidation,
  (req: Request, res: Response, next: NextFunction) =>
    changeStatusScheduleController.handle(req, res, next),
);

export { changeStatusScheduleRoutes };
