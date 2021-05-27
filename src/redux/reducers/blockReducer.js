import { ADD_BLOCK, REMOVE_BLOCK, EDIT_BLOC } from "../actionTypes";
// {
// blockIds
// blockById
//     block_id_1 : {contents: "something", blocks: [block_id_2]}
//     block_id_2: ..
// }

const initialState = {
  blockIds: [],
  blockById: {},
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
    default:
      return state;
  }
};

export default blockReducer;
