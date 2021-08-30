import { ViewColumn, window, commands } from 'vscode';
import { Post } from '../models';
import { Persistence, resources } from '../utils';

export function createPostDetailPanel() {
  const panel = window.createWebviewPanel(`test`, `test`, ViewColumn.One, {
    enableScripts: true,
    retainContextWhenHidden: true,
    enableFindWidget: true
  });
  panel.iconPath = resources('favicon.png');
  panel.webview.html = `
  <!DOCTYPE html>
  <html>
    <body>
      1231123123
    </body>
  </html>
  `;
}