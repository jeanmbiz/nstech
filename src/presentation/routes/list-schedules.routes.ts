import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { ListSchedulesController } from "../controllers/list-schedules.controller";
import { listSchedulesUseCase } from "./scheduling.routes";

const listSchedulesController = new ListSchedulesController(listSchedulesUseCase);
const listSchedulesRoutes = Router();

listSchedulesRoutes.get("/agendamentos", (req: Request, res: Response, next: NextFunction) =>
  listSchedulesController.handle(req, res, next),
);

export { listSchedulesRoutes };
