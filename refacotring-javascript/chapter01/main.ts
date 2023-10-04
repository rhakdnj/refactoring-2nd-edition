import { readJSON } from '../file.controller';
import { statement, htmlStatement } from './statment';

const invoices = readJSON('chapter01/invoices.json');
const plays = readJSON('chapter01/plays.json');

invoices.forEach((invoice: object) => {
  console.log(statement(invoice, plays));
});
