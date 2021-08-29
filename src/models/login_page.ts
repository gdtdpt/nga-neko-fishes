import { Uri, Webview } from 'vscode';

export interface LoginPageParam {
  webview: Webview,
  helpImgSrc: Uri,
  styleHref: Uri,
  scriptSrc: Uri,
}