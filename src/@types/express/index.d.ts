import { Customer } from "../Customer";

declare module "express" {
  interface Request {
    customer?: Customer;
  }
}
