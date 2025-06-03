import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { CreateScheduleController } from "../controllers/create-schedule.controller";
import { createScheduleValidation } from "../middlewares/create-schedule-validation.middleware";
import { createScheduleUseCase } from "./scheduling.routes";

const createScheduleController = new CreateScheduleController(createScheduleUseCase);
const createScheduleRoutes = Router();

createScheduleRoutes.post(
  "/agendamentos",
  createScheduleValidation,
  (req: Request, res: Response, next: NextFunction) =>
    createScheduleController.handle(req, res, next),
);

export { createScheduleRoutes };
