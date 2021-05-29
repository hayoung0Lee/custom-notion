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

// 사용중
export const getPageState = (state) => {
  return state.pages;
};

export const getBlockState = (state) => {
  return state.blocks;
};

export const getRootBlocks = (state, pageId) => {
  const pageState = getPageState(state);
  return pageState.pageById[pageId] ? pageState.pageById[pageId].blocks : [];
};

export const getCurrentBlockInfo = (state, blockId) => {
  const blockState = getBlockState(state);
  return blockState.blockById[blockId] ? blockState.blockById[blockId] : {};
};

export const getBlockOrder = (state, pageId) => {
  const orderedList = [];
  const recursive = (blockList) => {
    for (let i = 0; i < blockList.length; i++) {
      orderedList.push(blockList[i]);
      const getSubBlock = getCurrentBlockInfo(state, blockList[i]).blocks;
      if (getSubBlock.length > 0) {
        recursive(getSubBlock);
      }
    }
  };

  recursive(getPageState(state).pageById[pageId].blocks);

  const toIndex = new Map();
  for (let i = 0; i < orderedList.length; i++) {
    toIndex.set(orderedList[i], i);
  }

  return toIndex;
};
