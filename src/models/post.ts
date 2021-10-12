import { ObjectArray } from '.';

export type Post = PostResponseDataT;

export interface PostResponse {
  data: PostResponseData;
  encode: string;
  time: number;
}

export interface PostResponseData {
  __CU: PostResponseDataCU;
  __GLOBAL: PostResponseDataGLOBAL;
  __ROWS: number;
  __T: ObjectArray<PostResponseDataT>;
  __T__ROWS: number;
  __T__ROWS_PAGE: number;
  __R__ROWS_PAGE: number;
  __F: PostResponseDataF;
}

export interface PostResponseDataCU {
  uid: number;
  group_bit: number;
  admincheck: number;
  rvrc: number;
}

export interface PostResponseDataGLOBAL {
  _ATTACH_BASE_VIEW: string;
}

export interface PostResponseDataT {
  tid: number;
  fid: number;
  quote_from?: number;
  quote_to?: string;
  icon?: number;
  topic_misc?: string;
  author?: string;
  authorid?: number;
  subject: string;
  type?: number;
  postdate?: number;
  lastpost?: number;
  lastposter?: string;
  replies?: number;
  lastmodify?: number;
  recommend?: number;
  tpcurl?: string;
}

export interface PostResponseDataF {
  fid: number;
  name: string;
  topped_topic: number;
  sub_forums: ObjectArray<ObjectArray<number | string>>;
}