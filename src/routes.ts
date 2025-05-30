import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

type Customer = {
  id: string;
  cpf: string;
  name: string;
  statement: object[];
};

export const router = Router();

const customers: Customer[] = [];

const getCustomer = (cpf) => {
  return customers.find((customer) => customer.cpf === cpf);
};

router.post("/account", (req: Request, res: Response) => {
  const { cpf, name } = req.body;
  const id = uuidv4();

  const checkUserAlreadyExists = getCustomer(cpf);

  if (checkUserAlreadyExists) {
    throw new Error("User already exists");
  }

  customers.push({
    id,
    cpf,
    name,
    statement: [],
  });

  res.status(201).end();
});

router.get("/account/:cpf", (req: Request, res: Response) => {
  const { cpf } = req.params;
  const customer = getCustomer(cpf);

  if (!customer) {
    throw new Error("customer not found");
  }

  res.status(200).json({
    statement: customer?.statement,
  });
});
