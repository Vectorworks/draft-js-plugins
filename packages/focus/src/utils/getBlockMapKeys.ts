import { ContentState } from 'draft-js';
import { Collection } from 'immutable';

export default (
  contentState: ContentState,
  startKey: string,
  endKey: string
): Collection.Indexed<string> => {
  const blockMapKeys = contentState.getBlockMap().keySeq();
  return blockMapKeys
    .skipUntil((key) => key === startKey)
    .takeUntil((key) => key === endKey)
    .concat([endKey]);
};
