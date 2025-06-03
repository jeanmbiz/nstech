import { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';

export const ChangeStatusValidation = [
  param('id')
    .isUUID()
    .withMessage('ID deve ser um UUID válido'),

  body('status')
    .isIn(['pendente', 'concluído', 'atrasado', 'cancelado'])
    .withMessage('Status deve ser: pendente, concluído, atrasado ou cancelado'),

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