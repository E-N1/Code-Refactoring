import * as fs from 'fs';
import 'dotenv/config';
import { config } from '../currentConfig';

export function deleteAllFiles(sourceCode: string, filePath: string): string {

    if (config.deleteExtensions.some(ext => filePath.endsWith(ext.trim()))) {
      fs.unlinkSync(filePath);
      console.log(`Gelöscht: ${filePath}`);
    }

    return "";
  }
  