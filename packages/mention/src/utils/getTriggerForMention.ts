import { EditorState } from 'draft-js';
import { Map } from 'immutable';
import decodeOffsetKey from './decodeOffsetKey';

interface TriggerForMentionResult {
  activeOffsetKey: string;
  activeTrigger: string;
}

interface Leaf {
  start: number;
  end: number;
}

const isLeaf = (value: unknown): value is Leaf => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const { start, end } = value as Record<string, unknown>;
  return typeof start === 'number' && typeof end === 'number';
};

function filterUndefineds<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export default function getTriggerForMention(
  editorState: EditorState,
  searches: Map<string, string>,
  mentionTriggers: string[]
): TriggerForMentionResult | null {
  // get the current selection
  const selection = editorState.getSelection();
  const anchorKey = selection.getAnchorKey();
  const anchorOffset = selection.getAnchorOffset();
  // the list should not be visible if a range is selected or the editor has no focus
  if (!selection.isCollapsed() || !selection.getHasFocus()) {
    return null;
  }

  // identify the start & end positon of each search-text
  const offsetDetails = searches.map((offsetKey) =>
    decodeOffsetKey(offsetKey!)
  );

  // a leave can be empty when it is removed due event.g. using backspace
  // do not check leaves, use full decorated portal text
  const leaves = offsetDetails.reduce<Map<string, Leaf>>(
    (result, offsetDetail, offsetKey) => {
      if (!offsetDetail || offsetDetail.blockKey !== anchorKey) {
        return result;
      }

      const leaf = editorState
        .getBlockTree(offsetDetail.blockKey)
        .getIn([offsetDetail.decoratorKey]);
      return isLeaf(leaf) ? result.set(offsetKey, leaf) : result;
    },
    Map()
  );

  // if all leaves are undefined the popover should be removed
  if (leaves.isEmpty()) {
    return null;
  }
  // Checks that the cursor is after the @ character but still somewhere in
  // the word (search term). Setting it to allow the cursor to be left of
  // the @ causes troubles due selection confusion.
  const blockText = editorState
    .getCurrentContent()
    .getBlockForKey(anchorKey)
    .getText();
  const triggerForSelectionInsideWord = leaves
    .map(
      ({ start, end }) =>
        mentionTriggers
          .map((trigger) =>
            // @ is the first character
            (start === 0 &&
              anchorOffset >= start + trigger.length && //should not trigger if the cursor is before the trigger
              blockText.substr(0, trigger.length) === trigger &&
              anchorOffset <= end) ||
            // @ is in the text or at the end, multi triggers
            (mentionTriggers.length > 1 &&
              anchorOffset >= start + trigger.length &&
              (blockText.substr(start + 1, trigger.length) === trigger ||
                blockText.substr(start, trigger.length) === trigger) &&
              anchorOffset <= end) ||
            // @ is in the text or at the end, single trigger
            (mentionTriggers.length === 1 &&
              anchorOffset >= start + trigger.length &&
              anchorOffset <= end)
              ? trigger
              : undefined
          )
          .filter(filterUndefineds)[0]
    )
    .filter(filterUndefineds);

  if (triggerForSelectionInsideWord.isEmpty()) {
    return null;
  }

  const activeSearch = triggerForSelectionInsideWord.entrySeq().first();
  if (!activeSearch) {
    return null;
  }

  const [activeOffsetKey, activeTrigger] = activeSearch;

  return {
    activeOffsetKey,
    activeTrigger,
  };
}
