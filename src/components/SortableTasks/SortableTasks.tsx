import Task from "../Task/Task";
import {
    closestCorners,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    MouseSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { replaceTasks } from "../../app/store/taskSlice";
import { useAppDispatch, useAppSelector } from "../../hook";
import { useState } from "react";

const SortableTasks = () => {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector((state) => state.tasks.tasks);
    const activeTasks = useAppSelector((state) => state.tasks.activeTasks);
    const completedTasks = useAppSelector((state) => state.tasks.completedTasks);
    const [dragId, setDragId] = useState<number | null>(null);

    const getTaskPos = (id: number) => {
        return tasks.findIndex((task) => task.id === id);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setDragId(Number(event.active.id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setDragId(null);
        const { active, over } = event;
        if (active.id === over?.id) return;

        const originalPos = getTaskPos(Number(active.id));
        const newPos = getTaskPos(Number(over?.id));
        const newTasks = arrayMove(tasks, originalPos, newPos);
        dispatch(replaceTasks(newTasks));
    };

    const sensorSettings = {
        distance: 10,
    };

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: sensorSettings,
        }),
        useSensor(PointerSensor, {
            activationConstraint: sensorSettings,
        }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    return (
        <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
        >
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                <div className="tasks">
                    {tasks
                        .filter((task) => {
                            if (activeTasks) return !task.checked;
                            else if (completedTasks) return task.checked;
                            else return task;
                        })
                        .map((task) => (
                            <Task
                                key={task.id}
                                id={task.id}
                                checked={task.checked}
                                text={task.text}
                                isEditing={task.isEditing}
                                drag={dragId === task.id}
                            />
                        ))}
                </div>
            </SortableContext>
            <DragOverlay className="low-transparent">
                {dragId ? (
                    <>
                        {tasks
                            .filter(({ id }) => id === dragId)
                            .map((task) => (
                                <Task
                                    key={task.id}
                                    id={task.id}
                                    checked={task.checked}
                                    text={task.text}
                                    isEditing={task.isEditing}
                                />
                            ))}
                    </>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default SortableTasks;
