/**
 * Creates a composite decorator based on the provided plugins
 */

import { CompositeDecorator, DraftDecorator, EditorState } from 'draft-js';
import { List } from 'immutable';
import React, { ReactElement } from 'react';

export default function createCompositeDecorator(
  decorators: List<DraftDecorator>,
  getEditorState: () => EditorState,
  setEditorState: (state: EditorState) => void
): CompositeDecorator {
  const convertedDecorators: DraftDecorator[] = decorators
    .toArray()
    .map((decorator): DraftDecorator => {
      const Component = decorator.component as React.ComponentType<
        Record<string, unknown>
      >;
      const DecoratedComponent = (
        props: Record<string, unknown>
      ): ReactElement => (
        <Component
          {...props}
          getEditorState={getEditorState}
          setEditorState={setEditorState}
        />
      );
      return {
        strategy: decorator.strategy,
        component: DecoratedComponent,
        props: decorator.props,
      };
    });

  return new CompositeDecorator(convertedDecorators);
}
