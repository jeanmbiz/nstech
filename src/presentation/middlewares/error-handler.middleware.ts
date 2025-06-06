import type { Response } from "express";
import {
  InvalidStatusException,
  ScheduleNotFoundException,
} from "../../domain/exceptions/domain.exceptions";

// biome-ignore lint/suspicious/noExplicitAny: Express error middleware requires any type
export function errorHandler(error: any, res: Response) {
  if (error instanceof ScheduleNotFoundException) {
    res.status(404).json({ error: error.message });
    return;
  }

  if (error instanceof InvalidStatusException) {
    res.status(400).json({ error: error.message });
    return;
  }

  if (error.message === "Conflito de agendamento") {
    res.status(409).json({ error: error.message });
    return;
  }

  if (error.message && (error.message.includes("inválido") || error.message.includes("vazio"))) {
    res.status(400).json({ error: error.message });
    return;
  }

  console.error("Erro não tratado:", error);
  res.status(500).json({ error: "Erro interno do servidor" });
}
