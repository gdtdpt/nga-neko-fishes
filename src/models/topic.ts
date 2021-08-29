import { ObjectArray } from '.';

/**
 * 用于插件显示
 */
export interface Topic {
  id: string,
  name: string,
  children: SubTopic[]
}

export interface SubTopic {
  name: string,
  children: TopicCategoryContentItem[]
}

/**
 * Response的数据结构
 */
export interface TopicResponse {
  data: ObjectArray<TopicData>
}

export interface TopicData {
  all: ObjectArray<TopicCategory>,
  __IMG_BASE: string,
  __IMGPATH: string,
  __IMG_STYLE: string,
  __COMMONRES_PATH: string,
  __COMMONIMG_PATH: string,
  __RES_PATH: string,
  __FORUM_ICON_PATH: string,
  iconBase: string,
  double: ObjectArray<ObjectArray<string>>
  single: ObjectArray<ObjectArray<string>>
}

// export interface TopicAll {
//   wow: TopicCategory,
//   other: TopicCategory,
//   bliz: TopicCategory,
//   esport: TopicCategory,
//   riot: TopicCategory,
//   valve: TopicCategory,
//   games: TopicCategory,
//   new: TopicCategory,
//   club: TopicCategory,
//   fast: TopicCategory,
//   follow: TopicCategory,
// }

export interface TopicCategory {
  id: string,
  name: string,
  content: ObjectArray<TopicCategoryContent>
}

export interface TopicCategoryContent {
  name: string,
  content: ObjectArray<TopicCategoryContentItem>
}

export interface TopicCategoryContentItem {
  fid: number,
  name: string,
  nameS?: string,
  info: string,
  infoS?: string,
  bit?: number,
}

export interface PostResponse {
  data: PostResponseData,
  encode: string,
  time: number,
}

export interface PostResponseData {
  __CU: PostResponseDataCU,
  __GLOBAL: PostResponseDataGLOBAL,
  __ROWS: number,
  __T: ObjectArray<PostResponseDataT>,
  __T__ROWS: number,
  __T__ROWS_PAGE: number,
  __R__ROWS_PAGE: number,
  __F: PostResponseDataF,
}

export interface PostResponseDataCU {
  uid: number,
  group_bit: number,
  admincheck: number,
  rvrc: number,
}

export interface PostResponseDataGLOBAL {
  _ATTACH_BASE_VIEW: string,
}

export interface PostResponseDataT {
  tid: number,
  fid: number,
  quote_from: number,
  quote_to: string,
  icon: number,
  topic_misc: string,
  author: string,
  authorid: number,
  subject: string,
  type: number,
  postdate: number,
  lastpost: number,
  lastposter: string,
  replies: number,
  lastmodify: number,
  recommend: number,
  tpcurl: string,
}

export interface PostResponseDataF {
  fid: number,
  name: string,
  topped_topic: number,
  sub_forums: ObjectArray<ObjectArray<number | string>>
}