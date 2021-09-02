export * from './topic';
export * from './post';

export type Optional<T> = T | undefined;
export type ObjectArray<T> = { [key: string]: T };
export type NGAResponseError = {
  error: ObjectArray<string | number>,
  data: {
    __MESSAGE: ObjectArray<string | number>
  },
  encode: string,
  time: number
};

export type NGAResponse<T> = T | NGAResponseError;

export const NGA_LOGIN_COMMAND = 'neko.login';