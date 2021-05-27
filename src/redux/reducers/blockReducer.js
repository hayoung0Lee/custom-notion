import { ADD_BLOCK, REMOVE_BLOCK, EDIT_BLOCK } from "../actionTypes";
// {
// blockIds
// blockById
//     block_id_1 : {contents: "something", blocks: [block_id_2]}
//     block_id_2: ..
// }

const initialState = {
  blockIds: [0, 1],
  blockById: {
    0: { contents: "block1", blocks: [] },
    1: { contents: "block2", blocks: [] },
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
