import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const createScheduleValidation = [
  body('dataHora')
    .isISO8601()
    .withMessage('Data e hora devem estar no formato ISO 8601'),

  body('numeroContrato')
    .notEmpty()
    .withMessage('Número do contrato é obrigatório'),

  body('motoristaNome')
    .notEmpty()
    .withMessage('Nome do motorista é obrigatório'),

  body('motoristaCpf')
    .isLength({ min: 11, max: 14 })
    .withMessage('CPF deve ter entre 11 e 14 caracteres'),

  body('placaCaminhao')
    .matches(/^[A-Z]{3}-\d{4}$/i)
    .withMessage('Placa deve estar no formato ABC-1234'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Dados inválidos',
        details: errors.array()
      });
    }
    next();
  }
];