import { useState, useEffect, useRef } from "react";
import { getRootBlocks } from "../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import EditableBlock from "./EditableBlock";
import MainStore from "../utils/store";
import { updateOrder } from "../redux/actions";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",

  // change background colour if dragging
  background: isDragging ? "#9CA3AF" : null,

  // styles we need to apply on draggables
  ...draggableStyle,
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

    // +result.type: 부모 번호(여기서 순서를 바꾸면된다), +result.draggableId

    if (result.source.index === result.destination.index) {
      return;
    }

    const ids = result.draggableId.split("_");
    const parentId = +ids[0];
    // const currentID = +ids[1];
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    dispatch(updateOrder(pageId, parentId, sourceIndex, destinationIndex));
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
              className="col-span-10 bg-indigo-50 min-h-screen p-10"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {rootBlock.map((blockId, index) => {
                return (
                  <Draggable
                    key={`-1_${blockId}`}
                    draggableId={`-1_${blockId}`}
                    index={index}
                  >
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
