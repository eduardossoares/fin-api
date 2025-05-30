import { NextFunction, Response, Request } from "express";
import { customers } from "../routes";

export const cpfMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cpf } = req.params;
  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    throw new Error("Customer not found");
  }

  req.customer = customer;

  return next();
};
