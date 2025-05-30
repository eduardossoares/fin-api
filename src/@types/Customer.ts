export type Statement = {
  type: "credit" | "debit";
  amount: number;
  description: string;
  created_at: Date;
};
export type Customer = {
  cpf: string;
  id: string;
  name: string;
  statement: Statement[];
};
