import * as vscode from 'vscode';
import { fetchTopics, fetchTopicTree } from './apis';
import { NGA_LOGIN_COMMAND } from './models';
import { LoginPanel } from './panels';
import { PostProvider } from './providers/post_providers';
import { TopicProvider } from './providers/topic_providers';
import { Persistence } from './utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  Persistence.init(context);
  let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
    fetchTopicTree().then(res => {
      console.log(`test res: `, res);
    });
  });
  context.subscriptions.push(disposable);
  // topics
  const topicTree = vscode.window.registerTreeDataProvider('topics', new TopicProvider());
  context.subscriptions.push(topicTree);
  // posts
  const postProvider = new PostProvider();
  const postsView = vscode.window.createTreeView('posts', { treeDataProvider: postProvider });
  postProvider.setTreeView(postsView);
  // login panel
  const loginCommand = vscode.commands.registerCommand(NGA_LOGIN_COMMAND, () => LoginPanel.init());
  context.subscriptions.push(loginCommand);

}

// this method is called when your extension is deactivated
export function deactivate() { }
