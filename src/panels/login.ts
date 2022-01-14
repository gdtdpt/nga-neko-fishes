import { Disposable, ViewColumn, WebviewPanel, window } from 'vscode';
import * as handlebars from 'handlebars';
import { getRawTemplateSource, normalWebviewOptions } from '.';
import { Optional } from '../models';
import { getNonce, Persistence, resources, scripts, styles } from '../utils';
import { showInfoMessage } from '../utils/commands';

export class LoginPanel {
  private static currentPanel: Optional<LoginPanel>;
  private _panel: WebviewPanel;
  private _disposables: Disposable[] = [];  // not know why
  private constructor() {
    const loginPanel = window.createWebviewPanel(
      'ngaLogin',
      '登录',
      ViewColumn.One,
      normalWebviewOptions()
    );
    loginPanel.onDidDispose(() => this.dispose(), null, this._disposables);
    loginPanel.webview.onDidReceiveMessage(({ cookie }) => {
      Persistence.cookie = cookie;
      showInfoMessage("Cookie已保存");
      loginPanel.dispose();
    });
    this._panel = loginPanel;
  }

  private getLoginPageHtml() {
    // get login page help image path
    const loginHelpImg = resources('login_help_get_cookie.png');
    // get login page stylesheel path
    const styleResource = styles('login_page.css');
    // get login page script path
    // const scriptSrc = scripts('login_page.js');
    const styleHref = this._panel.webview.asWebviewUri(styleResource);
    const helpImgSrc = this._panel.webview.asWebviewUri(loginHelpImg);
    const nonce = getNonce();
    const cookie = Persistence.cookie || '';
    const templateHtml = getRawTemplateSource('login_page.html');
    const page = handlebars.compile(templateHtml)({
      cookie,
      nonce,
      helpImgSrc,
      styleHref,
      // scriptSrc,
      cspSource: this._panel.webview.cspSource
    });
    this._panel.webview.html = page;
  }

  static init() {
    if (LoginPanel.currentPanel) { // panel exists
      const column = window.activeTextEditor
        ? window.activeTextEditor.viewColumn
        : undefined;
      LoginPanel.currentPanel._panel.reveal(column);
      return;
    }
    LoginPanel.currentPanel = new LoginPanel();
    LoginPanel.currentPanel.getLoginPageHtml();
  }

  dispose() {
    LoginPanel.currentPanel = undefined;
    this._panel.dispose();
    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}