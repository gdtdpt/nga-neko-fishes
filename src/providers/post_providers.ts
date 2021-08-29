import { commands, Event, EventEmitter, TreeDataProvider, TreeItem, TreeView } from 'vscode';
import { fetchPostList } from '../apis';
import { Post, TopicCategoryContentItem } from '../models';
import { Persistence } from '../utils';
import { showInfoMessage } from '../utils/commands';

export class PostProvider implements TreeDataProvider<TreeItem> {

  public readonly REFRESH_COMMAND = 'posts.refresh';
  private _onDidChangeTreeData: EventEmitter<TreeItem | null> = new EventEmitter<TreeItem | null>();
  readonly onDidChangeTreeData?: Event<TreeItem | null> = this._onDidChangeTreeData.event;
  private treeView: TreeView<TreeItem> | null = null;
  posts: PostItem[] = [];
  category: TopicCategoryContentItem | null = null;

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

  async getChildren(_?: TreeItem): Promise<TreeItem[]> {
    if (!this.category) {
      showInfoMessage('请先选择板块');
      return [];
    }
    if (!this.posts.length) {
      const postList = await fetchPostList(this.category.fid);
      this.posts = this.buildPosts(postList);
      if (this.treeView) {
        this.treeView.title = '大漩涡';
      }
    }
    return this.posts;
  }

  private buildPosts(postList: Post[]): PostItem[] {
    return postList.map(post => {
      return new PostItem(post);
    });
  }

  public refresh() {
    this.posts = [];
    this._onDidChangeTreeData.fire(null);
  }

}

class PostItem extends TreeItem {
  post: Post;

  constructor(post: Post) {
    super(post.subject);
    this.post = post;
    this.description = post.author;
  }
}