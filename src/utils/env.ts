import { env, Uri } from 'vscode';


export const openTopicPage = (fid: number) => {
  env.openExternal(Uri.parse(`https://ngabbs.com/thread.php?fid=${fid}`));
};

export const openPostPage = (tid: number) => {
  env.openExternal(Uri.parse(`https://ngabbs.com/read.php?tid=${tid}`));
}