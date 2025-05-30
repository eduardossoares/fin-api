import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { cpfMiddleware } from "./middlewares/CpfMiddleware";
import { loggingMiddleware } from "./middlewares/LoggingMiddleware";
import { Customer } from "./@types/Customer";
import { Statement } from "./@types/Customer";

export const router = Router();
export let customers: Customer[] = [];

const getBalance = (customer: Customer) => {
  const balance = customer.statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return Number(acc) + Number(operation.amount);
    } else {
      return Number(acc) - Number(operation.amount);
    }
  }, 0);
  return balance;
};

router.post("/account", loggingMiddleware, (req: Request, res: Response) => {
  const { cpf, name } = req.body;
  const id = uuidv4();

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
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

router.get(
  "/account/:cpf",
  cpfMiddleware,
  loggingMiddleware,
  (req: Request, res: Response) => {
    const customer = req.customer;
    res.status(200).json({
      customer: customer,
    });
  }
);

router.get(
  "/account/:cpf/statement",
  cpfMiddleware,
  loggingMiddleware,
  (req: Request, res: Response) => {
    const customer = req.customer;
    res.status(200).json({
      statement: customer?.statement,
    });
  }
);

router.get(
  "/account/:cpf/statement/date",
  cpfMiddleware,
  loggingMiddleware,
  (req: Request, res: Response) => {
    const customer = req.customer;
    const { date } = req.query;

    if (!date) {
      throw new Error("Type a valid date");
    }

    const dateFormat = new Date(date + " 00:00");

    const statement = customer?.statement.filter(
      (s) => s.created_at.toDateString() === new Date(dateFormat).toDateString()
    );

    res.status(200).json({
      statement: statement,
    });
  }
);

router.post(
  "/account/:cpf/deposit",
  cpfMiddleware,
  loggingMiddleware,
  (req: Request, res: Response) => {
    const customer = req.customer;
    const { description, amount } = req.body;

    if (!description) {
      throw new Error("Type a valid description");
    }

    if (!amount) {
      throw new Error("Type a valid amount");
    }

    const statementOperation: Statement = {
      description,
      amount,
      created_at: new Date(),
      type: "credit",
    };

    customer?.statement.push(statementOperation);

    res.status(201).end();
    return;
  }
);

router.post(
  "/account/:cpf/withdraw",
  cpfMiddleware,
  loggingMiddleware,
  (req: Request, res: Response) => {
    const customer = req.customer;
    const { description, amount } = req.body;

    if (!description) {
      throw new Error("Type a valid description");
    }

    if (!amount) {
      throw new Error("Type a valid amount");
    }

    const balance = getBalance(customer!);

    if (balance < amount) {
      throw new Error("Insufficient funds");
    }

    const statementOperation: Statement = {
      description,
      amount,
      created_at: new Date(),
      type: "debit",
    };

    customer?.statement.push(statementOperation);
    res.status(201).end();
    return;
  }
);

router.get(
  "/account/:cpf/balance",
  cpfMiddleware,
  loggingMiddleware,
  (req: Request, res: Response) => {
    const customer = req.customer;
    const balance = getBalance(customer!);
    res.status(200).json({
      balance: balance,
    });
  }
);

router.delete(
  "/account/:cpf",
  cpfMiddleware,
  loggingMiddleware,
  (req: Request, res: Response) => {
    const customer = req.customer;
    customers.splice(customers.indexOf(customer!), 1);
    res.status(200).end();
  }
);

router.put(
  "/account/:cpf",
  cpfMiddleware,
  loggingMiddleware,
  (req: Request, res: Response) => {
    const customer = req.customer;
    const { name } = req.body;

    if (!name) {
      throw new Error("Type a valid name");
    }

    customers.map((c) => {
      if (c.cpf === customer?.cpf) {
        c.name = name;
      }
    });

    res.status(200).end();
  }
);
