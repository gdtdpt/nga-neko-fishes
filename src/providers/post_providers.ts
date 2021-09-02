import { commands, Event, EventEmitter, TreeDataProvider, TreeItem, TreeView } from 'vscode';
import { fetchPostList } from '../apis';
import { Post, TopicCategoryContentItem } from '../models';
import { Persistence } from '../utils';
import { showInfoMessage } from '../utils/commands';

export class PostProvider implements TreeDataProvider<TreeItem> {

  public static readonly REFRESH_COMMAND = 'neko.posts.refresh';
  public static readonly POST_SELECT = 'neko.post.select';
  private _onDidChangeTreeData: EventEmitter<TreeItem | null> = new EventEmitter<TreeItem | null>();
  readonly onDidChangeTreeData?: Event<TreeItem | null> = this._onDidChangeTreeData.event;
  private treeView: TreeView<TreeItem> | null = null;
  posts: PostItem[] = [];
  category: TopicCategoryContentItem | null = null;

  constructor() {
    const { subscriptions } = Persistence.context;
    if (subscriptions) {
      subscriptions.push(commands.registerCommand(PostProvider.REFRESH_COMMAND, this.refresh, this));
      subscriptions.push(commands.registerCommand(PostProvider.POST_SELECT, this.selctPost, this));
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
      // showInfoMessage('请先选择板块');
      return [];
    }
    if (!this.posts.length) {
      const postList = await fetchPostList(this.category.fid);
      this.posts = this.buildPosts(postList);
      if (this.treeView) {
        this.treeView.title = this.category.name;
      }
    }
    return this.posts;
  }

  private buildPosts(postList: Post[]): PostItem[] {
    return postList.map(post => {
      return new PostItem(post);
    });
  }

  private selctPost(post: PostItem) {
    commands.executeCommand('neko.show.post', post.post);
  }

  public refresh() {
    this.posts = [];
    this._onDidChangeTreeData.fire(null);
  }

}

export class PostItem extends TreeItem {
  post: Post;

  constructor(post: Post) {
    super(post.subject);
    this.post = post;
    this.description = post.author;
    this.contextValue = "postItem";
    this.command = {
      title: '打开',
      command: PostProvider.POST_SELECT,
      arguments: [this]
    };
  }
}