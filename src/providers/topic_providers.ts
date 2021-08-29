import { commands, Event, EventEmitter, TreeDataProvider, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { fetchTopicTree } from '../apis';
import { SubTopic, Topic, TopicCategoryContentItem } from '../models';
import { Persistence } from '../utils';

// type TopicTreeNode = TopicNode[] | SubTopicNode[] | TopicCategoryNode[]

export class TopicProvider implements TreeDataProvider<TreeItem> {

  public readonly REFRESH_COMMAND = 'topic.refresh';
  private _onDidChangeTreeData: EventEmitter<TreeItem | null> = new EventEmitter<TreeItem | null>();
  readonly onDidChangeTreeData: Event<TreeItem | null> = this._onDidChangeTreeData.event;
  topics: TopicNode[] = [];

  constructor() {
    const { subscriptions } = Persistence.context;
    if (subscriptions) {
      subscriptions.push(commands.registerCommand(this.REFRESH_COMMAND, this.refresh, this));
    }
  }

  getTreeItem(element: TreeItem): TreeItem | Thenable<TreeItem> {
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
  fid: number;
  constructor(category: TopicCategoryContentItem) {
    super(category.name);
    this.fid = category.fid;
    this.description = `${category.fid}`;
  }
}