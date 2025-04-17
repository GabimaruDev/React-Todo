import { useCallback, useEffect, useReducer, useState } from "react";
import "./app/styles/App.css";
import Task from "./components/Task/Task";
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
import { store } from "./app/store";
import TasksFooter from "./components/TasksFooter/TasksFooter";
import AddTask from "./components/AddTask/AddTask";

function App() {
    const storedTasks = localStorage.getItem("tasks");
    const [tasks, setTasks] = useState<ObjectTask[]>(storedTasks ? JSON.parse(storedTasks) : []);
    const [newTask, setNewTask] = useState<ObjectTask>({ id: maxId(), checked: false, text: "", isEditing: false });
    const [activeId, setActiveId] = useState<number | null>(null);
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    useEffect(() => {
        const unsubscribe = store.subscribe(() => {
            forceUpdate();
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    function maxId() {
        if (tasks.length > 0) {
            return tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
        } else {
            return 1;
        }
    }

    const handleChecked = useCallback((id: number) => {
        setTasks((tasks) => tasks.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
    }, []);

    const addTask = () => {
        if (newTask?.text.trim() !== "") {
            const updatedTasks = [...tasks, { ...newTask, id: maxId() }];
            setTasks(updatedTasks);
            setNewTask({ id: maxId(), checked: false, text: "", isEditing: false });
        }
    };

    const handleEdit = (id: number) => {
        setTasks((tasks) => {
            const taskToUpdate = [...tasks].find((task) => task.id === id);
            if (taskToUpdate) {
                taskToUpdate.isEditing = true;
            }

            return [...tasks];
        });
    };

    const saveEditTask = (text: string) => {
        const updatedTasks = tasks.map((task) => {
            if (task.isEditing) {
                if (text.trim() !== "") {
                    return { ...task, isEditing: false, text: text };
                }
                return { ...task, isEditing: false };
            } else {
                return task;
            }
        });

        setTasks(updatedTasks);
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter((i) => i.id !== id));
    };

    const getTaskPos = (id: number) => {
        return tasks.findIndex((task) => task.id === id);
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(Number(event.active.id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        if (active.id === over?.id) return;

        setTasks((tasks) => {
            const originalPos = getTaskPos(Number(active.id));
            const newPos = getTaskPos(Number(over?.id));
            const newTasks = arrayMove(tasks, originalPos, newPos);
            return newTasks;
        });
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
        <div className="App">
            <h1 className="title">To-Do List</h1>
            <AddTask newTask={newTask} setNewTask={setNewTask} addTask={addTask} />
            <ol className="tasks-wrapper">
                {store.getState().activeTasks ? (
                    <p className="text">Active tasks</p>
                ) : store.getState().completedTasks ? (
                    <p className="text">Сompleted tasks</p>
                ) : (
                    <p className="text">All tasks</p>
                )}
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
                                    if (store.getState().activeTasks) return !task.checked;
                                    else if (store.getState().completedTasks) return task.checked;
                                    else return task;
                                })
                                .map((task) => (
                                    <Task
                                        key={task.id}
                                        id={task.id}
                                        checked={task.checked}
                                        handleChecked={handleChecked}
                                        text={task.text}
                                        isEditing={task.isEditing}
                                        handleEdit={handleEdit}
                                        saveEditTask={saveEditTask}
                                        deleteTask={deleteTask}
                                        active={!!activeId && activeId === task.id}
                                    />
                                ))}
                        </div>
                    </SortableContext>
                    <DragOverlay className="low-transparent">
                        {activeId ? (
                            <>
                                {tasks
                                    .filter(({ id }) => id === activeId)
                                    .map((task) => (
                                        <Task
                                            key={task.id}
                                            id={task.id}
                                            checked={task.checked}
                                            handleChecked={handleChecked}
                                            text={task.text}
                                            isEditing={task.isEditing}
                                            handleEdit={handleEdit}
                                            saveEditTask={saveEditTask}
                                            deleteTask={deleteTask}
                                        />
                                    ))}
                            </>
                        ) : null}
                    </DragOverlay>
                </DndContext>
                <TasksFooter setTasks={setTasks} tasks={tasks} />
            </ol>
            <p className="developer">
                <span>Developer: </span>
                <a className="link" href="https://github.com/GabimaruDev">
                    GabimaruDev
                </a>
            </p>
        </div>
    );
}

export default App;
