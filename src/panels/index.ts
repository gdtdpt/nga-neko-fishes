import { Uri } from 'vscode';
import * as fs from 'fs';
import { resources, styles, scripts, templates } from '../utils';

export * from './login';

export const normalWebviewOptions = () => {
  return {
    enableScripts: true,
    localResourceRoots: [
      resources(),
      styles(),
      scripts(),
    ],
  };
};

export const getRawTemplateSource = (filename: string): string => {
  const templateFileUri: Uri = templates(filename);
  const rawSource = fs.readFileSync(templateFileUri.fsPath, 'utf8');
  return rawSource;
};