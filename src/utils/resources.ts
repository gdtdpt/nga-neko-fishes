import { Uri } from 'vscode';
import { Persistence } from './persistence';

export const defaultAvatar = (): Uri => {
  return resources('avatar.png');
};

const buildUri = (...paths: string[]): Uri => {
  return Uri.joinPath(Persistence.context.extensionUri, ...paths);
};

export const resources = (filename = ""): Uri => {
  return buildUri("resources", filename);
};

export const styles = (filename = ""): Uri => {
  return buildUri("styles", filename);
};

export const scripts = (filename = ""): Uri => {
  return buildUri("scripts", filename).with({ 'scheme': 'vscode-resource' });
};

export const templates = (filename = ""): Uri => {
  return buildUri("templates", filename);
};

export const getNonce = () => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};