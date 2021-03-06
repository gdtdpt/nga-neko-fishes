import * as vscode from 'vscode';
import { checkCookie } from './apis';
import { NGA_LOGIN_COMMAND, Post } from './models';
import { LoginPanel } from './panels';
import { createImageView } from './panels/image';
import { createPostDetailPanel } from './panels/post_detail';
import { PostProvider } from './providers/post_providers';
import { TopicProvider } from './providers/topic_providers';
import { Persistence } from './utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  Persistence.init(context);
  checkCookie();
  // posts
  const postProvider = new PostProvider();
  const postsView = vscode.window.createTreeView('postTree', { treeDataProvider: postProvider, showCollapseAll: true, canSelectMany: false });
  postProvider.setTreeView(postsView);
  // topics
  const topicTree = vscode.window.registerTreeDataProvider('topicTree', new TopicProvider(postProvider));
  context.subscriptions.push(topicTree);
  // login panel
  const loginCommand = vscode.commands.registerCommand(NGA_LOGIN_COMMAND, () => LoginPanel.init());
  context.subscriptions.push(loginCommand);

  context.subscriptions.push(
    vscode.commands.registerCommand('neko.show.post', (post: Post) => {
      createPostDetailPanel(post);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('neko.show.image', (link: string) => {
      createImageView(link);
    })
  );

}

// this method is called when your extension is deactivated
export function deactivate() { }

function getNonce() {
  throw new Error('Function not implemented.');
}

