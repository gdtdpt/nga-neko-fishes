import * as vscode from 'vscode';
import { fetchPost } from './apis';
import { NGA_LOGIN_COMMAND } from './models';
import { LoginPanel } from './panels';
import { createPostDetailPanel } from './panels/post_detail';
import { PostProvider } from './providers/post_providers';
import { TopicProvider } from './providers/topic_providers';
import { Persistence } from './utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  Persistence.init(context);
  let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
    fetchPost(28038961).then(res => {
      console.log(`test res: `, res);
    });
  });
  context.subscriptions.push(disposable);
  // posts
  const postProvider = new PostProvider();
  const postsView = vscode.window.createTreeView('posts', { treeDataProvider: postProvider });
  postProvider.setTreeView(postsView);
  // topics
  const topicTree = vscode.window.registerTreeDataProvider('topics', new TopicProvider(postProvider));
  context.subscriptions.push(topicTree);
  // login panel
  const loginCommand = vscode.commands.registerCommand(NGA_LOGIN_COMMAND, () => LoginPanel.init());
  context.subscriptions.push(loginCommand);

  context.subscriptions.push(
    vscode.commands.registerCommand('nga.show.post', () => createPostDetailPanel())
  );

}

// this method is called when your extension is deactivated
export function deactivate() { }

function getNonce() {
  throw new Error('Function not implemented.');
}

