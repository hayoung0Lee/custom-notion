export const getPageState = (state) => {
  return state.pages;
};

export const getPageList = (state) => {
  const pageState = getPageState(state);
  return pageState ? pageState.pageIds : [];
};

export const getPageTitle = (state, pageId) => {
  return state[pageId];
};

export const getEveryPages = (state) => {
  const pageState = getPageState(state);
  return getPageList(state).map((id) => ({ ...pageState.pageById[id], id }));
};

export const getBlockState = (state) => {
  return state.blocks;
};

export const getBlockList = (state) => {
  const blockState = getBlockState(state);
  return blockState ? blockState.blockIds : [];
};

export const getBlockContents = (state) => {
  const blockState = getBlockState(state);
  return getBlockList(state).map((id) => ({ ...blockState.blockById[id], id }));
};

export const getThisPage = (state, pageId) => {
  const pageState = getPageState(state);
  const currentPageData = pageState.pageById[pageId];
  const currentPageDataWithBlockData = {
    ...currentPageData,
    blocks: currentPageData.blocks.map((id) => ({
      id,
      ...state.blocks.blockById[id],
    })),
  };
  return currentPageDataWithBlockData;
};
