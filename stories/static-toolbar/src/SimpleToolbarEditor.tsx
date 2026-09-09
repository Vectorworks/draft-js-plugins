import React, { ReactElement, useRef, useState } from 'react';
import Editor, {
  createEditorStateWithText,
} from '@vectorworks/draft-js-plugins';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import editorStyles from './editorStyles.css';

const inlineToolbarPlugin = createToolbarPlugin();
const { Toolbar } = inlineToolbarPlugin;
const plugins = [inlineToolbarPlugin];
const text =
  'The toolbar above the editor can be used for formatting text, as in conventional static editors  …';

const SimpleInlineToolbarEditor = (): ReactElement => {
  const [editorState, setEditorState] = useState(
    createEditorStateWithText(text)
  );
  const editor = useRef();

  const onChange = (value): void => {
    setEditorState(value);
  };

  const focus = (): void => {
    editor.current.focus();
  };

  return (
    <div>
      <div className={editorStyles.editor} onClick={focus}>
        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          ref={(element) => {
            editor.current = element;
          }}
        />
        <Toolbar />
      </div>
    </div>
  );
};

export default SimpleInlineToolbarEditor;
