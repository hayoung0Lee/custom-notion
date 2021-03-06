import {
  ADD_BLOCK,
  REMOVE_BLOCK,
  EDIT_BLOCK,
  TAB_BLOCK,
  REORDER_BLOCK,
} from "../actionTypes";
// {
// blockIds
// blockById
//     block_id_1 : {contents: "something", blocks: [block_id_2]}
//     block_id_2: ..
// }

const initialState = {
  blockIds: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  blockById: {
    0: { contents: "block1", blocks: [2, 3] },
    1: { contents: "block2", blocks: [] },
    2: { contents: "block1's nested block 2", blocks: [4, 5] },
    3: { contents: "block1's nested block 3", blocks: [] },
    4: { contents: "block2's nested block 4", blocks: [6, 7] },
    5: { contents: "block2's nested block 5", blocks: [] },
    6: { contents: "block4's nested block 6", blocks: [] },
    7: { contents: "block4's nested block 7", blocks: [] },
    8: { contents: "Target Block", blocks: [] },
  },
};

const blockReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BLOCK: {
      const {
        pageId,
        parentId, // -1이면 root에다 추가하는 것
        blockId, // 현재 추가될 blockId
        contents,
      } = action.payload;

      if (parentId === -1) {
        // root에 추가
        return {
          ...state,
          blockIds: [...state.blockIds, blockId],
          blockById: {
            ...state.blockById,
            [blockId]: { contents, blocks: [] },
          },
        };
      } else {
        // 현재 parentId의 마지막 원소로 추가
        return {
          ...state,
          blockIds: [...state.blockIds, blockId],
          blockById: {
            ...state.blockById,
            [parentId]: {
              ...state.blockById[parentId],
              blocks: [...state.blockById[parentId].blocks, blockId],
            },
            [blockId]: { contents, blocks: [] },
          },
        };
      }
    }
    case EDIT_BLOCK: {
      const { blockId, updatedValue } = action.payload;
      return {
        ...state,
        blockById: {
          ...state.blockById,
          [blockId]: { ...state.blockById[blockId], contents: updatedValue },
        },
      };
    }
    case TAB_BLOCK: {
      const { pageId, targetBlockId, currentBlockId, parentId } =
        action.payload;
      if (parentId === -1) {
        return {
          ...state,
          blockById: {
            ...state.blockById,
            [targetBlockId]: {
              ...state.blockById[targetBlockId],
              blocks: [
                ...state.blockById[targetBlockId].blocks,
                currentBlockId,
              ],
            },
          },
        };
      } else {
        return {
          ...state,
          blockById: {
            ...state.blockById,
            [parentId]: {
              ...state.blockById[parentId],
              blocks: state.blockById[parentId].blocks.filter(
                (b) => b !== currentBlockId
              ),
            },
            [targetBlockId]: {
              ...state.blockById[targetBlockId],
              blocks: [
                ...state.blockById[targetBlockId].blocks,
                currentBlockId,
              ],
            },
          },
        };
      }
    }
    case REORDER_BLOCK: {
      const { pageId, parentId, sourceIndex, destinationIndex } =
        action.payload;

      if (parentId === -1) {
        return state;
      } else {
        const sourceValue = state.blockById[parentId]?.blocks[sourceIndex];

        const newOrder = [...state.blockById[parentId].blocks];
        if (sourceIndex < destinationIndex) {
          // 원래 위치보다 뒤로 추가
          newOrder.splice(destinationIndex + 1, 0, sourceValue);
          newOrder.splice(sourceIndex, 1);
        } else if (sourceIndex > destinationIndex) {
          // 원래 위치보다 앞에 추가
          newOrder.splice(destinationIndex, 0, sourceValue);
          newOrder.splice(sourceIndex + 1, 1);
        }
        return {
          ...state,
          blockById: {
            ...state.blockById,
            [parentId]: {
              ...state.blockById[parentId],
              blocks: newOrder,
            },
          },
        };
      }
    }
    case REMOVE_BLOCK: {
      const { pageId, parentId, blockId } = action.payload;
      if (parentId === -1) {
        return state;
      } else {
        return {
          ...state,
          blockById: {
            ...state.blockById,
            [parentId]: {
              ...state.blockById[parentId],
              blocks: state.blockById[parentId].blocks.filter(
                (b) => b !== blockId
              ),
            },
          },
        };
      }
    }
    default:
      return state;
  }
};

export default blockReducer;
