import { SalesAgent } from '../../models/salesAgent';
import { createHmac, randomBytes } from 'crypto';



export  const registerSalesAgent=async(name: string, email: string, password: string, role:string)=> {
  const existingAgent = await SalesAgent.findByEmail(email);
  if (existingAgent) throw new Error('Sales Agent already exists');

  const salt = randomBytes(16).toString('hex');
  const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

  await SalesAgent.create({ name, email, password: hashedPassword, salt,role, });

  return { message: 'Sales Agent registered successfully' };
}
