import { BlockMap, ContentBlock, EditorState } from 'draft-js';
import { FileResult } from './file';

// Filter editorState's blockMap
export function getBlocksWhereEntityData(
  editorState: EditorState,
  filter: (block: FileResult | null) => boolean
): BlockMap {
  const contentState = editorState.getCurrentContent();
  return contentState.getBlockMap().filter((block: ContentBlock) => {
    const entityData = block.getEntityAt(0)
      ? contentState.getEntity(block.getEntityAt(0)).getData()
      : null;
    return entityData && filter(entityData);
  });
}
