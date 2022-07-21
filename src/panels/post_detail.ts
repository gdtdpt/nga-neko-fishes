import { commands, ViewColumn, WebviewPanel, window, workspace } from 'vscode';
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
      enableFindWidget: true,
    }, normalWebviewOptions())
  );
  panel.iconPath = resources('favicon.ico');
  posts.set(post.tid, panel);
  panel.onDidDispose(() => {
    const tid = post.tid;
    posts.delete(tid);
  });
  panel.webview.onDidReceiveMessage(async (params) => {
    switch (params.command) {
      case 'prev':
        await buildPostDetailContent(panel, post, parseInt(params.page) - 1);
        break;
      case 'next':
        await buildPostDetailContent(panel, post, parseInt(params.page) + 1);
        break;
      case 'goto':
        await buildPostDetailContent(panel, post, parseInt(params.page));
        break;
      case 'image':
        commands.executeCommand('neko.show.image', params.link);
        break;
      default:
        showErrorMessage('错误指令');
        break;
    }
  });
  await buildPostDetailContent(panel, post);
}

async function buildPostDetailContent(panel: WebviewPanel, post: Post, pageNum = 1) {
  panel.webview.html = '';
  // get login page stylesheel path
  const bootstrapStyleSource = styles('bootstrap.min.css');
  const styleResource = styles('post_detail.css');
  // get login page script path
  const bootstrapJS = scripts('bootstrap_bundle.js');
  // const script = scripts('post_detail.js');  不知道怎么回事加载报404，上面的bundle.js就没事，内容移动到html里了
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
  const page = handlebars.compile(templateHtml)({
    style, nonce, /*script,*/ context, bootstrapJS, bootstrapStyle, cspSource: panel.webview.cspSource
  });
  const config = workspace.getConfiguration('neko')
  const postFontSize = config.get('postFontSize')
  const titleFontSize = config.get('titleFontSize')
  panel.webview.postMessage({postFontSize, titleFontSize});
  panel.webview.html = page;
}