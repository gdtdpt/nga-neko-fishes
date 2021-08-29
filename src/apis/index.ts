export * from './topic_post_info';
import * as https from 'https';
import { Persistence } from '../utils';
import { showErrorMessage } from '../utils/commands';
import * as iconv from 'iconv-lite';
import { commands } from 'vscode';
import { NGAResponse, NGAResponseError, NGA_LOGIN_COMMAND } from '../models';

export function request<T>(url: string): Promise<NGAResponse<T>> {
  return new Promise<T>((resolve, reject) => {
    const requestClient = https.request(url, {
      headers: {
        'Cookie': Persistence.cookie
      }
    }, res => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const some = iconv.decode(buf, 'GBK');
        const jsonString = some.trim().replace('window.script_muti_get_var_store=', '');
        const result = JSON.parse(jsonString);
        if (result?.error) {
          handleError(result as NGAResponseError);
          showErrorMessage(result.error['0']);
          reject(result);
        } else {
          resolve(result);
        }
      });
    });
    requestClient.on('error', (err) => console.log(`err`, err));
    requestClient.end();
  });
}

function handleError(error: NGAResponseError) {
  const errorMsg: string | number = error.error[0];
  showErrorMessage(errorMsg);
  if (`${errorMsg}`.includes('未登录')) {
    clearCacheAndShowLoginPage();
  }
}

function clearCacheAndShowLoginPage() {
  Persistence.cookie = '';
  commands.executeCommand(NGA_LOGIN_COMMAND);
}