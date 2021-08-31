export * from './topic_post_info';
import * as https from 'https';
import { Persistence } from '../utils';
import { showErrorMessage } from '../utils/commands';
import * as iconv from 'iconv-lite';
import { commands } from 'vscode';
import { NGAResponse, NGAResponseError, NGA_LOGIN_COMMAND } from '../models';
import { PostDetailResponse } from '../models/post_detail';

/**
 * 帖子数据太特殊了，只能这样处理
 */
export function requestPostDetail(url: string): Promise<PostDetailResponse> {
  return request(url, some => {
    const jsonStr = some.replace('window.script_muti_get_var_store=', '')
      .replace(/"alterinfo":".*?",/g, '')
      .replace(/\[img\]\./g, '<img style=\\"background-color: #FFFAFA\\" src=\\"https://img.nga.178.com/attachments')
      .replace(/\[\/img\]/g, '\\">')
      .replace(/\[img\]/g, '<img style=\\"background-color: #FFFAFA\\" src=\\"')
      .replace(/\[url\]/g, '<a href=\\"').replace(/\[\/url\]/g, '\\">url</a>')
      .replace(/"signature":".*?",/g, '');
    const json = JSON.parse(jsonStr);
    console.log(`json: `, json);
    return json;
  });
}

export function requestJSON<T>(url: string): Promise<NGAResponse<T>> {
  return request(url, some => {
    const jsonString = some.trim().replace('window.script_muti_get_var_store=', '');
    return JSON.parse(jsonString);
  });
}

export function request<T>(url: string, fn: (some: string) => any): Promise<any> {
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
        const result = fn(some);
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