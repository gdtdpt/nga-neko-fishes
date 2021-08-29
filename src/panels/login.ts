import { Disposable, ViewColumn, WebviewPanel, window } from 'vscode';
import { Optional } from '../models';
import { LoginPageParam } from '../models/login_page';
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
      {
        enableScripts: true,
        localResourceRoots: [
          resources(),
          styles(),
          scripts(),
        ],
      },
    );
    //get login page help image path
    const loginHelpImg = resources('login_help_get_cookie.png');
    // get login page stylesheel path
    const styleResource = styles('login_page.css');
    // get login page script path
    const scriptSrc = scripts('login_page.js');
    const styleHref = loginPanel.webview.asWebviewUri(styleResource);
    const helpImgSrc = loginPanel.webview.asWebviewUri(loginHelpImg);

    loginPanel.webview.html = loginPage({
      webview: loginPanel.webview,
      helpImgSrc, styleHref, scriptSrc
    });
    loginPanel.onDidDispose(() => this.dispose(), null, this._disposables);
    loginPanel.webview.onDidReceiveMessage(({ cookie }) => {
      Persistence.cookie = cookie;
      showInfoMessage("Cookie已保存");
      loginPanel.dispose();
    });
    this._panel = loginPanel;
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

const loginPage = (params: LoginPageParam): string => {
  const nonce = getNonce();
  const cookie = Persistence.cookie || '';
  return `
  <!DOCTYPE html>
  <html lang="en" style="height:100%">
  <head>
      <meta charset="UTF-8">
      <link rel="stylesheet" href="${params.styleHref}">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${params.webview.cspSource}; img-src ${params.webview.cspSource} https:; script-src 'nonce-${nonce}';">
      <title>登录</title>
  </head>
  <body>
    <div class="login-tips-wrapper">
      <div class="login-tips">
        <div>感谢DarrenIce老哥的[<a href="https://github.com/DarrenIce/NGA-MoFish">插件</a>]提供的灵感和素材</div>
        <h2>登录提示</h2>
        <h3>第一次使用时</h3>
        <div>浏览器打开NGA并登录之后，按F12打开DevTools，切到Network(网络)页，刷新一下页面，可以看到有类似于这样的url，在请求标头中找到cookie，复制</div>
        <img alt="如何登录" src="${params.helpImgSrc}">
        <div>打开NGA扩展，点击左边的登录按钮，粘贴刚才复制的cookie在下方的输入框中，点击输入框下方的<span class="relax">摸！</span></div>
      </div>
    </div>
    <div class="textarea-region">
      <textarea id="cookies" placeholder="此处粘贴NGA的Cookies" rows="3">${cookie}</textarea>
    </div>
    <div class="btn-region">
      <button id="saveBtn">摸！</button>
    </div>
    <script nonce="${nonce}" src="${params.scriptSrc}"></script>
  </body>
  </html>
  `;
};