import { ObjectArray } from '.';

export interface PostContext {
  totalPage: number;
  currentPage: number;
  post: PostDetailT;
  threads: PostContextDetail[];
}

export interface PostContextDetail extends PostDetailR {
  author?: PostDetailU;
}

export interface PostDetailResponse {
  data: PostDetailData;
  encode: string;
  time: number;
}

export interface PostDetailData {
  __CU: PostDetailCU;
  __GLOBAL: PostDetailGlobal;
  __U: ObjectArray<PostDetailU>;
  __R: ObjectArray<PostDetailR>;
  __T: PostDetailT;
  __F: PostDetailF;
  __R__ROWS: number;
  __R__ROWS_PAGE: number;
  __ROWS: number;
  __PAGE: number;
}

export interface PostDetailGlobal {
  _ATTACH_BASE_VIEW: string;
}

export interface PostDetailCU {
  uid: number;
  group_bit: number;
  admincheck: string;
  rvrc: number;
}

export interface PostDetailF {
  custom_level: string;
  name: string;
}

export interface PostDetailT {
  fid: number;
  tid: number;
  topic_misc: string;
  subject: string;
  locked: number;
  recommend: number;
  quote_to: string;
  quote_from: number;
  type: number;
  replies: number;
  authorid: number;
  postdate: number;
  lastpost: number;
  author: string;
  lastposter: string;
  digest: number;
  lastmodify: number;
  tpid: number;
  topic_misc_var: ObjectArray<number>;
  post_misc_var: PostDetailPostMiscVar;
  this_visit_rows: number;
}

export interface PostDetailPostMiscVar {
  content_length: number;
  fid: number;
}

export interface PostDetailR {
  content: string;
  alterinfo: string;
  tid: number;
  score: number;
  score_2: number;
  postdate: string;
  authorid: number;
  subject: string;
  type: number;
  fid: number;
  pid: number;
  recommend: number;
  follow: number;
  lou: number;
  content_length: number;
  from_client: string;
  postdatetimestamp: number;
  hotreply_id?: ObjectArray<string>;          // 热门回复ID
  hotreply?: ObjectArray<PostDetailHotReply>; // 热门回复
  attachs?: ObjectArray<PostDetailAttach>;    // 附件
  comment_id?: ObjectArray<number>;           // 贴条ID
  comment?: ObjectArray<PostDetailComment>;   // 贴条
}

export interface PostDetailComment {
  pid: number;
  fid: number;
  tid: number;
  authorid: number;
  type: number;
  score: number;
  score_2: number;
  recommend: number;
  postdate: string;
  subject: string;
  alterinfo: string;
  content: string;
  lou: number;
  content_length: number;
  comment_to_id: number;
  from_client: string;
  postdatetimestamp: number;
}

export interface PostDetailAttach {
  attachurl: string;
  size: number;
  type: string;
  subid: number;
  url_utf8_org_name: string;
  dscp: string;
  path: string;
  name: string;
  ext: string;
  thumb: number;
}

export interface PostDetailHotReply {
  pid: number;
  fid: number;
  tid: number;
  authorid: number;
  type: number;
  score: number;
  score_2: number;
  recommend: number;
  postdate: string;
  subject: string;
  alterinfo: string;
  content: string;
  lou: number;
  content_length: number;
  from_client: string;
  postdatetimestamp: number;
}

export interface PostDetailU {
  uid: number;
  username: string;
  credit: number;
  medal: string;
  reputation: string;
  groupid: number;
  memberid: number;
  avatar: any;          // string | Uri
  yz: number;
  site: string;
  honor: string;
  regdate: number;
  mute_time: string;
  postnum: number;
  rvrc: number;
  money: number;
  thisvisit: number;
  signature: string;
  nickname: string;
  bit_data: number;
}