import { ObjectArray } from '.';

/**
 * 用于插件显示
 */
export interface Topic {
  id: string;
  name: string;
  children: SubTopic[];
}

export interface SubTopic {
  name: string;
  children: TopicCategoryContentItem[];
}

/**
 * Response的数据结构
 */
export interface TopicResponse {
  data: ObjectArray<TopicData>;
}

export interface TopicData {
  all: ObjectArray<TopicCategory>;
  __IMG_BASE: string;
  __IMGPATH: string;
  __IMG_STYLE: string;
  __COMMONRES_PATH: string;
  __COMMONIMG_PATH: string;
  __RES_PATH: string;
  __FORUM_ICON_PATH: string;
  iconBase: string;
  double: ObjectArray<ObjectArray<string>>;
  single: ObjectArray<ObjectArray<string>>;
}

// export interface TopicAll {
//   wow: TopicCategory;
//   other: TopicCategory;
//   bliz: TopicCategory;
//   esport: TopicCategory;
//   riot: TopicCategory;
//   valve: TopicCategory;
//   games: TopicCategory;
//   new: TopicCategory;
//   club: TopicCategory;
//   fast: TopicCategory;
//   follow: TopicCategory;
// }

export interface TopicCategory {
  id: string;
  name: string;
  content: ObjectArray<TopicCategoryContent>;
}

export interface TopicCategoryContent {
  name: string;
  content: ObjectArray<TopicCategoryContentItem>;
}

export interface TopicCategoryContentItem {
  fid: number;
  name: string;
  nameS?: string;
  info: string;
  infoS?: string;
  bit?: number;
}