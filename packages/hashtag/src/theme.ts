import { css } from '@linaria/core';

export interface HashtagPluginTheme {
  hashtag?: string;
}

export const defaultTheme: HashtagPluginTheme = {
  hashtag: css`
    color: #5e93c5;
  `,
};
