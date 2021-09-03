import { window, ViewColumn } from 'vscode';
import { normalWebviewOptions } from '.';
import { resources } from '../utils';


export function createImageView(link: string) {
  let subject = link;
  if (subject.length > 12) {
    subject = `${subject.substring(0, 10)}...`;
  }
  const panel = window.createWebviewPanel(`${subject}`, `${subject}`,
    ViewColumn.One,
    Object.assign({
      enableScripts: true,
      enableFindWidget: true,
    }, normalWebviewOptions())
  );
  panel.iconPath = resources('favicon.ico');
  panel.webview.html = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="{{bootstrapStyle}}">
    <link rel="stylesheet" href="{{style}}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <img src="${link}">
  </body>
  </html>
  `;
}