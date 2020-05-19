import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        if (transaction.type === 'income') {
          accumulator.income += transaction.value;
        }
        if (transaction.type === 'outcome') {
          accumulator.outcome += transaction.value;
        }
        const total = accumulator.income - accumulator.outcome;
        accumulator.total = total;
        return accumulator;
      },
      { income: 0, outcome: 0, total: 0 },
    );
    return balance;
  }

  public create({ title, value, type }: CreateTransaction): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (type === 'outcome') {
      const { income, outcome } = this.getBalance();
      const copyOutcome = outcome + value;
      if (copyOutcome > income) {
        throw Error('Outcome não pode ser maior que income');
      }
    }
    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
