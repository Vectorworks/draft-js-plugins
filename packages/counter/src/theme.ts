import { css } from '@linaria/core';

export interface CounterPluginTheme {
  counter?: string;
  counterOverLimit?: string;
}

export const defaultTheme: CounterPluginTheme = {
  counter: css`
    color: inherit;
  `,
  counterOverLimit: css`
    color: #d86262;
  `,
};
