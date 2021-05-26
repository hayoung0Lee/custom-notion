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
    case ADD_BLOCK:
      const { blockId, isRoot, contents } = action.payload;
      // TODO: 중첩될수 있도록 구조화
      return {
        ...state,
        blockIds: [...state.blockIds, blockId],
        blockById: { ...state.blockById, [blockId]: { contents } },
      };
    default:
      return state;
  }
};

export default blockReducer;
