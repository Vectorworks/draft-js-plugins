import { once } from 'lodash';

export const warning = once((text: string): void => {
  if (process.env.NODE_ENV === 'development') {
    // biome-ignore lint/suspicious/noConsole: Development-only warning.
    console.warn(text);
  }
});
