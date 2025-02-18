import { writeFile } from 'fs/promises';
import { resolve } from 'path';

/**
 * WARN: WRAP IT IN TRY CATCH
 */
export async function saveObjectToJSON(
  filename: string,
  data: object | null
): Promise<void> {
  if (data === null) throw new Error('Failed to save, data was not provided');

  const filePath = resolve(process.cwd(), `${filename}.json`);
  const jsonData = JSON.stringify(data, null, 2);

  await writeFile(filePath, jsonData, 'utf-8');
}
