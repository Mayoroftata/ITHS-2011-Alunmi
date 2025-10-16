// api/dashboard.js
import { readFile } from 'fs/promises';
import { join } from 'path';

export default async function handler(req, res) {
  try {
    const filePath = join(process.cwd(), 'public', 'committe.html');
    const htmlContent = await readFile(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlContent);
  } catch (error) {
    res.status(404).json({ error: 'Dashboard not found' });
  }
}