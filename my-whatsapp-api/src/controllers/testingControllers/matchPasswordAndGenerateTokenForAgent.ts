import { SalesAgent } from '../../models/salesAgent';
import { createHmac } from 'crypto';
import { createTokenForUser } from './auth'; // Adjust the path

export async function matchPasswordAndGenerateTokenForAgent(email: string, password: string) {
  const agent = await SalesAgent.findByEmail(email);
  if (!agent) throw new Error('Sales Agent Not Found');

  const salt = agent.salt;
  const hashedPassword = agent.password;

  const userProvidedHash = createHmac('sha256', salt)
    .update(password)
    .digest('hex');

  if (hashedPassword !== userProvidedHash) {
    throw new Error('Incorrect Password');
  }

  const token = createTokenForUser({ id: agent.id, email: agent.email });
  return token;
}
