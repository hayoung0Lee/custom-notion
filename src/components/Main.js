import { useState, useEffect, useRef } from "react";
import { getRootBlocks } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import EditableBlock from "./EditableBlock";
import MainStore from "../utils/store";
import { updateOrder } from "../redux/actions";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "lightgreen" : null,

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  // background: isDraggingOver ? "lightblue" : null,
});

const Main = ({ pageId }) => {
  const [lastAction, setLastAction] = useState({ action: "" });

  useEffect(() => {
    window.history.replaceState(null, null, `pageID_${pageId}`);
  });

  const rootBlock = useSelector((state) => getRootBlocks(state, pageId));
  const dispatch = useDispatch();

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    // +result.type: 부모 번호, +result.draggableId
    console.log("result", result);
    // const items = reorder(
    //   rootBlock,
    //   result.source.index,
    //   result.destination.index
    // );

    // for (let i = 0; i < items.length; i++) {
    //   if (items[i] !== rootBlock) {
    //     dispatch(updateOrder(pageId, items));
    //     return;
    //   }
    // }
  };

  return (
    <MainStore.Provider
      value={{
        pageId: pageId,
        lastAction: lastAction,
        setLastAction: setLastAction,
      }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={`droppable`} type={`-1`}>
          {(provided, snapshot) => (
            <main
              className="col-span-10 bg-pink-100 min-h-screen p-10"
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {rootBlock.map((blockId, index) => {
                return (
                  <Draggable key={index} draggableId={`${index}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <EditableBlock
                          key={blockId}
                          depth={1} // tab횟수 제한용
                          blockId={blockId} // 현재의 blockId
                          parentId={-1} // -1은 root에서 호출했다는 뜻
                          isLast={index === rootBlock.length - 1} // 한 loop의 마지막 노드에는 일단 마지막일지도 모르니까 isLast를 true로 넘긴다.
                          forHandle={{ ...provided.dragHandleProps }}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </main>
          )}
        </Droppable>
      </DragDropContext>
    </MainStore.Provider>
  );
};

export default Main;
