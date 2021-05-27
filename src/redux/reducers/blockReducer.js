import { ADD_BLOCK, REMOVE_BLOCK, EDIT_BLOCK } from "../actionTypes";
// {
// blockIds
// blockById
//     block_id_1 : {contents: "something", blocks: [block_id_2]}
//     block_id_2: ..
// }

const initialState = {
  blockIds: [0, 1, 2, 3, 4, 5, 6, 7],
  blockById: {
    0: { contents: "block1", blocks: [2, 3] },
    1: { contents: "block2", blocks: [] },
    2: { contents: "block1's nested block 2", blocks: [4, 5] },
    3: { contents: "block1's nested block 3", blocks: [] },
    4: { contents: "block2's nested block 4", blocks: [6, 7] },
    5: { contents: "block2's nested block 5", blocks: [] },
    6: { contents: "block4's nested block 6", blocks: [] },
    7: { contents: "block4's nested block 7", blocks: [] },
  },
};

const blockReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BLOCK: {
      const { blockId, contents, isRoot, parentId } = action.payload;
      if (isRoot) {
        return {
          ...state,
          blockIds: [...state.blockIds, blockId],
          blockById: {
            ...state.blockById,
            [blockId]: { contents, blocks: [] },
          },
        };
      } else {
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
      console.log("EditBlock", updatedValue);
      return {
        ...state,
        blockById: {
          ...state.blockById,
          [blockId]: { ...state.blockById[blockId], contents: updatedValue },
        },
      };
    }
    default:
      return state;
  }
};

export default blockReducer;
