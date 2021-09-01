import { requestPostDetail, requestJSON } from '.';
import {
  NGAResponse, ObjectArray, Post, PostResponse, SubTopic, Topic,
  TopicCategory, TopicCategoryContent, TopicCategoryContentItem, TopicResponse
} from '../models';
import { PostContext, PostContextDetail, PostDetailResponse } from '../models/post_detail';

/**
 * 拿水区的帖子
 * 因为水区必须登录访问，也用于测试cookie的可用性
 */
export const checkCookie = () => {
  return requestJSON<PostResponse>(`https://ngabbs.com/thread.php?fid=-7&lite=js`);
};

export const fetchPost = (tid: number, page = 1) => {
  return requestPostDetail(`https://ngabbs.com/read.php?tid=${tid}&lite=js&page=${page}`);
};

export const fetchPostDetail = (tid: number, pageNum = 1): Promise<PostContext> => {
  return fetchPost(tid, pageNum)
    .then(res => composePostDetail(res));
};

function composePostDetail(response: PostDetailResponse): PostContext {
  const { __U, __R, __T, __R__ROWS_PAGE, __ROWS, __PAGE } = response.data;
  const totalPage = Math.floor(__ROWS / __R__ROWS_PAGE) + 1;
  const postContext: PostContext = { post: __T, threads: [], totalPage, currentPage: __PAGE };
  for (const key of Object.keys(__R)) {
    let replay = __R[key];
    if (__U[replay.authorid]) {
      const userInfo = __U[replay.authorid];
      if (userInfo.avatar) {  // fuck zeg
        if (userInfo.avatar['0']) {
          if (userInfo.avatar['0'].length > 1) { // multiple avatar urls with fucking map by fucking string sequence number
            userInfo.avatar = userInfo.avatar['0'];
          } else if (userInfo.avatar.indexOf('|') > -1) { // multiple avatar urls with fucking '|' sign
            userInfo.avatar = userInfo.avatar.substr(0, userInfo.avatar.indexOf('|'));
          }
        }
      }
      (replay as PostContextDetail).author = userInfo;
    }
    postContext.threads.push(replay);
  }
  return postContext;
}

/**
 * 拿具体板块的帖子列表
 * @param fid 板块的fid
 * @returns 返回NGA的原始数据Promise
 */
const fetchPosts = (fid: number) => {
  return requestJSON<PostResponse>(`https://ngabbs.com/thread.php?fid=${fid}&lite=js`);
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
  return requestJSON<TopicResponse>(`https://img4.nga.178.com/proxy/cache_attach/bbs_index_data.js?4226406`);
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
      return `${generalName}${generalIndex++}`;
    } else {
      generalIndex += 2;
      return generalName;
    }
  };
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