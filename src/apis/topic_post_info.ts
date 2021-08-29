import { request } from '.';
import { NGAResponse, ObjectArray, Post, PostResponse, SubTopic, Topic, TopicCategory, TopicCategoryContent, TopicCategoryContentItem, TopicResponse } from '../models';



/**
 * 拿水区的帖子
 * 因为水区必须登录访问，也用于测试cookie的可用性
 */
export const checkCookie = () => {
  return request<PostResponse>(`https://ngabbs.com/thread.php?fid=-7&lite=js`);
};

/**
 * 拿具体板块的帖子列表
 * @param fid 板块的fid
 * @returns 返回NGA的原始数据Promise
 */
const fetchPosts = (fid: number) => {
  return request<PostResponse>(`https://ngabbs.com/thread.php?fid=${fid}&lite=js`);
};

/**
 * 拿具体板块的帖子列表
 * @param fid 板块的fid
 * @returns 返回处理过的规范数据Promise
 */
export const fetchPostList = (fid: number) => {
  return fetchPosts(fid)
    .then(res => composePost(res as PostResponse));
};

function composePost(response: PostResponse): Post[] {
  const postList: Post[] = [];
  const postRecords = response?.data?.__T;
  if (postRecords && Object.keys(postRecords).length) {
    for (const tKey of Object.keys(postRecords)) {
      const post = postRecords[tKey];
      postList.push(post);
    }
  }
  return postList;
}

/**
 * 拿板块列表
 */
const fetchTopics = (): Promise<NGAResponse<TopicResponse>> => {
  return request<TopicResponse>(`https://img4.nga.178.com/proxy/cache_attach/bbs_index_data.js?4226406`);
};

export const fetchTopicTree = (): Promise<Topic[]> => {
  return fetchTopics()
    .then(res => {
      const topicTrees: Topic[] = [];
      // remove follow and new properties
      const { follow, new: newTopic, esport, fast, ...topics } = (res as TopicResponse).data['0'].all;
      for (const key of Object.keys(topics)) {
        const topicInfo: TopicCategory = topics[key];
        if (topicInfo) {
          const topic: Topic = {
            id: topicInfo.id,
            name: topicInfo.name,
            children: []
          };
          if (topicInfo.content && Object.keys(topicInfo.content).length) {
            const subTopics = composeSubTopic(topicInfo.content);
            topic.children = subTopics || [];
          }
          topicTrees.push(topic);
        }
      }
      return topicTrees;
    });
};

function composeSubTopic(subTopics: ObjectArray<TopicCategoryContent>): SubTopic[] {
  const subTopicList: SubTopic[] = [];
  const generalName = `综合(无名分类)`;
  let generalIndex = 0;
  const getGeneralName = (): string => {
    if (generalIndex) {
      return `${generalName}${generalIndex++}`
    } else {
      generalIndex += 2;
      return generalName;
    }
  }
  for (const subTopicKey of Object.keys(subTopics)) {
    const subTopicInfo = subTopics[subTopicKey];
    const subTopic: SubTopic = {
      name: subTopicInfo.name || getGeneralName(),
      children: [],
    };
    const leafs = composeTopicCategoryLeaf(subTopicInfo.content);
    subTopic.children = leafs || [];
    subTopicList.push(subTopic);
  }
  return subTopicList;
}

function composeTopicCategoryLeaf(topicLeafs: ObjectArray<TopicCategoryContentItem>): TopicCategoryContentItem[] {
  const leafs: TopicCategoryContentItem[] = [];
  for (const leafKey of Object.keys(topicLeafs)) {
    const leafInfo = topicLeafs[leafKey];
    if (leafInfo) {
      leafs.push(leafInfo);
    }
  }
  return leafs;
}