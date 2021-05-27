import {
  ADD_PAGE,
  REMOVE_PAGE,
  EDIT_PAGE,
  ADD_BLOCK,
  REMOVE_BLOCK,
  EDIT_BLOCk,
  EDIT_BLOCK,
  TAB_BLOCK,
} from "./actionTypes";

let nextPageId = 1;

export const addPage = (pageName) => ({
  type: ADD_PAGE,
  payload: { pageId: nextPageId++, pageName, blocks: [] },
});

let blockId = 8;

export const addBlock = (pageId, isRoot, contents, parentId, groupParent) => ({
  type: ADD_BLOCK,
  payload: {
    pageId,
    isRoot,
    contents,
    blockId: blockId++,
    parentId,
    groupParent,
  },
});

export const updateCurrentBlock = (blockId, updatedValue) => ({
  type: EDIT_BLOCK,
  payload: { blockId, updatedValue },
});

export const addTab = (pageId, isRoot, previousBlockId, currentBlockId) => ({
  type: TAB_BLOCK,
  payload: {
    pageId,
    isRoot,
    previousBlockId,
    currentBlockId,
  },
});
