import { env, Uri } from 'vscode';
import { HOST_URL } from '../apis';

export const openTopicPage = (fid: number) => {
  env.openExternal(Uri.parse(`${HOST_URL}/thread.php?fid=${fid}`));
};

export const openPostPage = (tid: number) => {
  env.openExternal(Uri.parse(`${HOST_URL}/read.php?tid=${tid}`));
};