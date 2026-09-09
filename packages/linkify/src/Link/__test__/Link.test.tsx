/* eslint-disable jsx-a11y/anchor-has-content,react/no-children-prop */

import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import LinkifyIt from 'linkify-it';
import Link from '../Link';

describe('Link', () => {
  it('applies the className based on the theme property `link` and property', () => {
    const theme = { link: 'custom-class-name' };
    const { container } = render(
      <Link theme={theme} className="link">
        Link
      </Link>
    );
    const link = container.querySelector('a');
    expect(link).toHaveClass('custom-class-name');
    expect(link).toHaveClass('link');
    expect(link).toHaveAttribute('target', '_self');
  });

  it('applies any custom passed prop', () => {
    const { container } = render(<Link data-custom="unicorn">Link</Link>);
    expect(container.querySelector('a')).toHaveAttribute(
      'data-custom',
      'unicorn'
    );
  });

  it('renders the passed in children', () => {
    const { container } = render(
      <Link>https://www.draft-js-plugins.com/</Link>
    );
    expect(container.querySelector('a')).toHaveTextContent(
      'https://www.draft-js-plugins.com/'
    );
  });

  it('uses the decoratedText prop as href', () => {
    const { container } = render(
      <Link decoratedText="https://www.draft-js-plugins.com/">Link</Link>
    );
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      'https://www.draft-js-plugins.com/'
    );
  });

  it('applies http prefix when none is supplied', () => {
    const { container } = render(
      <Link decoratedText="draft-js-plugins.com/">Link</Link>
    );
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      'http://draft-js-plugins.com/'
    );
  });

  it('does not apply a prefix when one is already supplied', () => {
    const { container } = render(
      <Link decoratedText="ftp://draft-js-plugins.com/">Link</Link>
    );
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      'ftp://draft-js-plugins.com/'
    );
  });

  it('generates correct href to localhost with port', () => {
    const { container } = render(
      <Link decoratedText="http://localhost:8000">Link</Link>
    );
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      'http://localhost:8000'
    );
  });

  it('generates mailto href when supplied with email', () => {
    const { container } = render(
      <Link decoratedText="name@example.com">Link</Link>
    );
    expect(container.querySelector('a')).toHaveAttribute(
      'href',
      'mailto:name@example.com'
    );
  });

  it('generates the correct href when using a custom exreactLinks funcation', () => {
    const { container } = render(
      <Link
        decoratedText="example@me.com"
        customExtractLinks={() =>
          LinkifyIt().set({ fuzzyEmail: false }).match('example@me.com')
        }
      >
        Link
      </Link>
    );
    expect(container.querySelector('a')).toHaveAttribute('href', '');
  });

  it('applies custom target value', () => {
    const { container } = render(<Link target="_blank">Link</Link>);
    expect(container.querySelector('a')).toHaveAttribute('target', '_blank');
  });
});
