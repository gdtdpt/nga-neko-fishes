import { commands, Event, EventEmitter, TreeDataProvider, TreeItem, TreeView, window } from 'vscode';
import { fetchPost, fetchPostDetail, fetchPostList } from '../apis';
import { Post, TopicCategoryContentItem } from '../models';
import { Persistence } from '../utils';

export class PostProvider implements TreeDataProvider<TreeItem> {

  public static readonly REFRESH_COMMAND = 'neko.posts.refresh';
  public static readonly PREV_PAGE_COMMAND = 'neko.posts.prev';
  public static readonly NEXT_PAGE_COMMAND = 'neko.posts.next';
  public static readonly POST_SELECT = 'neko.post.select';
  public static readonly POST_OPEN = 'neko.post.open';
  private _onDidChangeTreeData: EventEmitter<TreeItem | null> = new EventEmitter<TreeItem | null>();
  readonly onDidChangeTreeData?: Event<TreeItem | null> = this._onDidChangeTreeData.event;
  private treeView: TreeView<TreeItem> | null = null;
  posts: PostItem[] = [];
  category: TopicCategoryContentItem | null = null;
  pageNumber: number = 1;

  constructor() {
    const { subscriptions } = Persistence.context;
    if (subscriptions) {
      subscriptions.push(commands.registerCommand(PostProvider.REFRESH_COMMAND, this.refresh, this));
      subscriptions.push(commands.registerCommand(PostProvider.PREV_PAGE_COMMAND, this.prevPage, this));
      subscriptions.push(commands.registerCommand(PostProvider.NEXT_PAGE_COMMAND, this.nextPage, this));
      subscriptions.push(commands.registerCommand(PostProvider.POST_SELECT, this.selectPost, this));
      subscriptions.push(commands.registerCommand(PostProvider.POST_OPEN, this.openPost, this));
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
    // if (!this.posts.length) {
    const postList = await fetchPostList(this.category.fid, this.pageNumber);
    this.posts = this.buildPosts(postList);
    if (this.treeView) {
      this.treeView.title = `${this.category.name}: P${this.pageNumber}`;
    }
    // }
    return this.posts;
  }

  private buildPosts(postList: Post[]): PostItem[] {
    return postList.map(post => {
      return new PostItem(post);
    });
  }

  private selectPost(post: PostItem) {
    commands.executeCommand('neko.show.post', post.post);
  }

  public refresh() {
    this.posts = [];
    this.pageNumber = 1;
    this._onDidChangeTreeData.fire(null);
  }

  public prevPage() {
    if (this.pageNumber <= 1) {
      this.pageNumber = 1;
      return;
    }
    this.pageNumber--;
    this._onDidChangeTreeData.fire(null);
  }

  public nextPage() {
    this.pageNumber++;
    this._onDidChangeTreeData.fire(null);
  }

  public async openPost() {
    let intputTid = await window.showInputBox({
      placeHolder: 'tid/url',
      prompt: '输入完整的URL或者帖子的tid'
    });
    if (intputTid === undefined || intputTid === null) {
      return;
    }
    const reg = /(?<=tid\=)(.[^&])+/;
    if (reg.test(intputTid)) {
      const matchResult = intputTid.match(reg);
      if (matchResult && matchResult.length) {
        intputTid = matchResult[0];
      }
    }
    const postContext = await fetchPostDetail(parseInt(intputTid));
    const { tid, subject, fid } = postContext.post;
    this.selectPost(new PostItem({ tid, subject, fid }));
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