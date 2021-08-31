import { ViewColumn, WebviewPanel, window } from 'vscode';
import * as handlebars from 'handlebars';
import { getRawTemplateSource, normalWebviewOptions } from '.';
import { fetchPostDetail } from '../apis';
import { Post } from '../models';
import { getNonce, resources, scripts, styles } from '../utils';
import { PostContext, PostDetail } from '../models/post_detail';

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
  await buildPostDetailContent(panel, post);
}

async function buildPostDetailContent(panel: WebviewPanel, post: Post) {
  // get login page stylesheel path
  const styleResource = styles('post_detail.css');
  // get login page script path
  const script = scripts('post_detail.js');
  const style = panel.webview.asWebviewUri(styleResource);
  const nonce = getNonce();
  const context = await fetchPostDetail(post.tid);
  const templateHtml = getRawTemplateSource("post_detail.html");
  console.log(`context: `, context);
  const page = handlebars.compile(templateHtml)({ style, nonce, script, context, cspSource: panel.webview.cspSource });
  panel.webview.html = page;
}