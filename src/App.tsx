import { useEffect, useState } from "react";
import "./styles/App.css";
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

interface ObjectTask {
    id: number;
    checked: boolean;
    text: string;
    isEditing: boolean;
}

function App() {
    const storedTasks = localStorage.getItem("tasks");
    const [tasks, setTasks] = useState<ObjectTask[]>(storedTasks ? JSON.parse(storedTasks) : []);
    const [newTask, setNewTask] = useState<ObjectTask>({ id: maxId(), checked: false, text: "", isEditing: false });
    const [activeId, setActiveId] = useState<number | null>(null);
    const [activeTasks, setActiveTasks] = useState(false);
    const [completedTasks, setCompletedTasks] = useState(false);

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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTask({ ...newTask, text: event.target.value });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            addTask();
        }
    };

    const handleChecked = (index: number) => {
        const updatedTasks = tasks.map((item) => {
            if (item.id === index) {
                return { ...item, checked: !item.checked };
            } else {
                return item;
            }
        });

        setTasks(updatedTasks);
    };

    const addTask = () => {
        if (newTask && newTask.text.trim() !== "") {
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

    const deleteTask = (index: number) => {
        const updatedTasks = tasks.filter((i) => i.id !== index);
        setTasks(updatedTasks);
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
            <div className="add-task-wrapper">
                <input
                    id="newTask"
                    className="input"
                    type="text"
                    placeholder="Task text"
                    autoComplete="off"
                    autoFocus={true}
                    value={newTask.text}
                    onKeyDown={handleKeyDown}
                    onChange={handleInputChange}
                />
                <button className="button" onClick={addTask}>
                    Add Task
                </button>
            </div>
            <ol className="tasks">
                <DndContext
                    sensors={sensors}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCorners}
                >
                    <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                        {tasks
                            .filter((task) => {
                                if (activeTasks) {
                                    return !task.checked;
                                } else if (completedTasks) return task.checked;
                                else {
                                    return task;
                                }
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
                    </SortableContext>
                    <DragOverlay className="transparent">
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
                <div className="buttons">
                    <button
                        className="button"
                        onClick={() => {
                            setActiveTasks(false);
                            setCompletedTasks(false);
                        }}
                    >
                        All
                    </button>
                    <button
                        className="button"
                        onClick={() => {
                            setActiveTasks(true);
                            setCompletedTasks(false);
                        }}
                    >
                        Active
                    </button>
                    <button
                        className="button"
                        onClick={() => {
                            setCompletedTasks(true);
                            setActiveTasks(false);
                        }}
                    >
                        Completed
                    </button>
                </div>
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
