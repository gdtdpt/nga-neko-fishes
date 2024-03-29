import { commands, Event, EventEmitter, TreeDataProvider, TreeItem, TreeItemCollapsibleState, env, window } from 'vscode';
import { fetchTopicTree, HOST_URL } from '../apis';
import { SubTopic, Topic, TopicCategoryContentItem } from '../models';
import { Persistence } from '../utils';
import { openPostPage, openTopicPage } from '../utils/env';
import { PostItem, PostProvider } from './post_providers';

type TopicTreeNode = TopicNode | SubTopicNode | TopicCategoryNode;

export class TopicProvider implements TreeDataProvider<TreeItem> {

  public static readonly REFRESH_COMMAND = 'neko.topic.refresh';
  public static readonly TOPIC_SELECT = 'neko.topic.select';
  public static readonly OPEN_IN_BROWSER = 'neko.open.browser';
  public static readonly SHARE_POST = 'neko.share.clipboard';
  private _onDidChangeTreeData: EventEmitter<TreeItem | null> = new EventEmitter<TreeItem | null>();
  readonly onDidChangeTreeData: Event<TreeItem | null> = this._onDidChangeTreeData.event;
  topics: TopicNode[] = [];
  postProvider: PostProvider;

  constructor(postProvider: PostProvider) {
    this.postProvider = postProvider;
    const { subscriptions } = Persistence.context;
    if (subscriptions) {
      subscriptions.push(commands.registerCommand(TopicProvider.REFRESH_COMMAND, this.refresh, this));
      subscriptions.push(commands.registerCommand(TopicProvider.TOPIC_SELECT, this.selectTopic, this));
      subscriptions.push(commands.registerCommand(TopicProvider.OPEN_IN_BROWSER, this.openInBrowser, this));
      subscriptions.push(commands.registerCommand(TopicProvider.SHARE_POST, this.shareToClipboard, this));
    }
  }

  getTreeItem(element: TopicTreeNode): TreeItem | Thenable<TreeItem> {
    if (element instanceof TopicCategoryNode && element.category.fid === -7) { // 永远的大漩涡
      element.label = '大漩涡';
    }
    return element;
  }

  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (!this.topics.length) {
      const topics = await fetchTopicTree();
      const nodes = this.buildTreeNodes(topics);
      this.topics = nodes;
    }
    if (element instanceof TopicNode) {
      return element.subTopics;
    } else if (element instanceof SubTopicNode) {
      return element.categories;
    } else if (element instanceof TopicCategoryNode) {
      return [];
    }
    if (!element) {
      if (this.topics) {
        return this.topics;
      }
    }
    return [];
  }

  public refresh() {
    this.topics = [];
    this._onDidChangeTreeData.fire(null);
  }

  private shareToClipboard(node: PostItem) {
    const { tid, subject } = node.post;
    const postLink = `${HOST_URL}/read.php?tid=${tid}`;
    env.clipboard.writeText(`《${subject}》 ${postLink}`);
    const statusBarDispose = window.setStatusBarMessage(`《${subject}》已复制`);
    setTimeout(() => statusBarDispose.dispose(), 2000);
  }

  private openInBrowser(node: TopicCategoryNode | PostItem) {
    if (node instanceof TopicCategoryNode) {
      openTopicPage(node.category.fid);
    } else if (node instanceof PostItem) {
      openPostPage(node.post.tid);
    }
  }

  private selectTopic(node: TopicCategoryNode) {
    this.postProvider.category = node.category;
    if (node.category.fid === -7) { // 永远的大漩涡
      this.postProvider.category.name = '大漩涡';
    }
    this.postProvider.refresh();
  }

  private buildTreeNodes(topics: Topic[]): TopicNode[] {
    const topicNodes: TopicNode[] = [];
    for (const topic of topics) {
      const topicNode = new TopicNode(topic);
      const subTopicNodes = this.buildSubTopicTreeNodes(topic);
      topicNode.addSubTopics(...subTopicNodes);
      topicNodes.push(topicNode);
    }
    return topicNodes;
  }

  private buildSubTopicTreeNodes(topic: Topic): SubTopicNode[] {
    const subTopicNodes: SubTopicNode[] = [];
    for (const subTopic of topic.children) {
      const subTopicNode = new SubTopicNode(subTopic);
      const categoryNodes = this.buildCategoryNodes(subTopic);
      subTopicNode.addCategory(...categoryNodes);
      subTopicNodes.push(subTopicNode);
    }
    return subTopicNodes;
  }

  private buildCategoryNodes(subTopic: SubTopic): TopicCategoryNode[] {
    const categoryNodes: TopicCategoryNode[] = [];
    for (const category of subTopic.children) {
      const categoryNode = new TopicCategoryNode(category);
      categoryNodes.push(categoryNode);
    }
    return categoryNodes;
  }
}

export class TopicNode extends TreeItem {
  subTopics: SubTopicNode[] = [];
  id: string;
  constructor(topic: Topic) {
    super(topic.name, TreeItemCollapsibleState.Collapsed);
    this.id = topic.id;
  }

  addSubTopics(...subTopic: SubTopicNode[]) {
    this.subTopics.push(...subTopic);
  }
}

export class SubTopicNode extends TreeItem {
  categories: TopicCategoryNode[] = [];
  constructor(subTopic: SubTopic) {
    super(subTopic.name, TreeItemCollapsibleState.Collapsed);
  }

  addCategory(...category: TopicCategoryNode[]) {
    this.categories.push(...category);
  }
}

export class TopicCategoryNode extends TreeItem {
  category: TopicCategoryContentItem;
  constructor(category: TopicCategoryContentItem) {
    super(category.name);
    this.category = category;
    // this.description = `${category.fid}`; // 显示fid在末尾，测试用
    this.contextValue = 'topicCategoryNode';
    this.command = {
      title: '打开',
      command: TopicProvider.TOPIC_SELECT,
      arguments: [this]
    };
  }
}