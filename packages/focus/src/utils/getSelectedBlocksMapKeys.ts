import { EditorState } from 'draft-js';
import { Collection } from 'immutable';
import getBlockMapKeys from './getBlockMapKeys';

export default (
  editorState: EditorState
): Collection.Indexed<string> => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  return getBlockMapKeys(
    contentState,
    selectionState.getStartKey(),
    selectionState.getEndKey()
  );
};
