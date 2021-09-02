import { ViewColumn, WebviewPanel, window } from 'vscode';
import { getRawTemplateSource, normalWebviewOptions } from '.';
import { fetchPostDetail } from '../apis';
import { Post } from '../models';
import { defaultAvatar, getNonce, resources, scripts, styles } from '../utils';
import { showErrorMessage } from '../utils/commands';
import { getHandlebarsWithHelpers } from '../utils/handlebar';

const posts: Map<number, WebviewPanel> = new Map();

export async function createPostDetailPanel(post: Post) {
  if (posts.has(post.tid)) {
    const column = window.activeTextEditor
      ? window.activeTextEditor.viewColumn
      : undefined;
    posts.get(post.tid)?.reveal(column);
    return;
  }
  let subject = post.subject;
  if (subject.length > 12) {
    subject = `${subject.substring(0, 10)}...`;
  }
  const panel = window.createWebviewPanel(`${post.fid}`, `${subject}`,
    ViewColumn.One,
    Object.assign({
      enableScripts: true,
      retainContextWhenHidden: true,
      enableFindWidget: true,
    }, normalWebviewOptions())
  );
  panel.iconPath = resources('favicon.ico');
  posts.set(post.tid, panel);
  panel.onDidDispose(() => {
    const tid = post.tid;
    posts.delete(tid);
  });
  panel.webview.onDidReceiveMessage(async ({ command, page }) => {
    page = parseInt(page);
    switch (command) {
      case 'prev':
        await buildPostDetailContent(panel, post, page - 1);
        break;
      case 'next':
        await buildPostDetailContent(panel, post, page + 1);
        break;
      case 'goto':
        await buildPostDetailContent(panel, post, page);
        break;
      default:
        showErrorMessage('错误指令');
        break;
    }
  });
  await buildPostDetailContent(panel, post);
}

async function buildPostDetailContent(panel: WebviewPanel, post: Post, pageNum = 1) {
  // get login page stylesheel path
  const bootstrapStyleSource = styles('bootstrap.min.css');
  const styleResource = styles('post_detail.css');
  // get login page script path
  const bootstrapJS = scripts('bootstrap_bundle.js');
  const script = scripts('post_detail.js');
  const style = panel.webview.asWebviewUri(styleResource);
  const bootstrapStyle = panel.webview.asWebviewUri(bootstrapStyleSource);
  const nonce = getNonce();
  const context = await fetchPostDetail(post.tid, pageNum);
  const defaultAvatarUri = panel.webview.asWebviewUri(defaultAvatar());
  context.threads.forEach(thread => {
    if (thread.author && thread.author.avatar === '') {
      thread.author.avatar = defaultAvatarUri;
    }
  });
  const templateHtml = getRawTemplateSource("post_detail.html");
  const handlebars = await getHandlebarsWithHelpers();
  console.log(`context: `, context);
  const page = handlebars.compile(templateHtml)({
    style, nonce, script, context, bootstrapJS, bootstrapStyle, cspSource: panel.webview.cspSource
  });
  panel.webview.html = page;
}