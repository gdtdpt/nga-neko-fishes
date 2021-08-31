import { ViewColumn, window } from 'vscode';
import { Post } from '../models';
import { resources } from '../utils';

export function createPostDetailPanel(post: Post) {
  console.log(`post detail: `, post);
  let subject = post.subject;
  if (subject.length > 12) {
    subject = `${subject.substring(0, 10)}...`;
  }
  const panel = window.createWebviewPanel(`${post.fid}`, `${subject}`,
    ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true,
      enableFindWidget: true
    });
  panel.iconPath = resources('favicon.ico');
  panel.webview.html = `
  <!DOCTYPE html>
  <html>
    <body>
      1231123123
    </body>
  </html>
  `;
}