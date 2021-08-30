import { resources, styles, scripts } from '../utils';

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
