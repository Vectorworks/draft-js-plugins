import { List, merge } from 'immutable';
import {
  ContentBlock,
  EditorState,
  BlockMapBuilder,
  genKey as generateRandomKey,
  ContentState,
  SelectionState,
} from 'draft-js';

const insertBlockAfterSelection = (
  contentState: ContentState,
  selectionState: SelectionState,
  newBlock: ContentBlock
): ContentState => {
  const targetKey = selectionState.getStartKey();
  const array: ContentBlock[] = [];
  contentState.getBlockMap().forEach((block, blockKey) => {
    array.push(block!);
    if (blockKey !== targetKey) return;
    array.push(newBlock);
  });
  return merge(contentState, {
    blockMap: BlockMapBuilder.createFromArray(array),
    selectionBefore: selectionState,
    selectionAfter: selectionState.merge({
      anchorKey: newBlock.getKey(),
      anchorOffset: newBlock.getLength(),
      focusKey: newBlock.getKey(),
      focusOffset: newBlock.getLength(),
      isBackward: false,
    }),
  });
};

export default function insertNewLine(editorState: EditorState): EditorState {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  // @ts-expect-error @types/draft-js does not model ContentBlock's Record initializer with Immutable v5.
  const newLineBlock = new ContentBlock({
    key: generateRandomKey(),
    type: 'unstyled',
    text: '',
    characterList: List(),
  });
  const withNewLine = insertBlockAfterSelection(
    contentState,
    selectionState,
    newLineBlock
  );
  const newContent = merge(withNewLine, {
    selectionAfter: withNewLine.getSelectionAfter().merge({ hasFocus: true }),
  }) as ContentState;
  return EditorState.push(editorState, newContent, 'insert-fragment');
}
