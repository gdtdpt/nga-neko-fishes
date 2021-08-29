import { commands, Event, EventEmitter, TreeDataProvider, TreeItem, TreeView } from 'vscode';
import { Persistence } from '../utils';

export class PostProvider implements TreeDataProvider<TreeItem> {

  public readonly REFRESH_COMMAND = 'posts.refresh';
  private _onDidChangeTreeData: EventEmitter<TreeItem | null> = new EventEmitter<TreeItem | null>();
  readonly onDidChangeTreeData?: Event<TreeItem | null> = this._onDidChangeTreeData.event;
  private treeView: TreeView<TreeItem> | null = null;

  constructor() {
    const { subscriptions } = Persistence.context;
    if (subscriptions) {
      subscriptions.push(commands.registerCommand(this.REFRESH_COMMAND, this.refresh, this));
    }
  }

  setTreeView(treeView: TreeView<TreeItem>) {
    this.treeView = treeView;
  }

  getTreeView(): TreeView<TreeItem> | null {
    return this.treeView;
  }

  getTreeItem(element: TreeItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    return [];
  }

  public refresh() {
    console.log(`posts.refresh command`);
  }

}