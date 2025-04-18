import { useEffect, useState } from "react";
import "./app/styles/App.css";
import TasksFooter from "./components/TasksFooter/TasksFooter";
import AddTaskForm from "./components/AddTaskForm/AddTaskForm";
import SortableTasks from "./components/SortableTasks/SortableTasks";
import { pushTask, replaceTasks } from "./app/store/taskSlice";
import { useAppDispatch, useAppSelector } from "./hook";

function App() {
    const dispatch = useAppDispatch();
    const storedTasks = localStorage.getItem("tasks");
    const tasks = useAppSelector((state) => state.tasks.tasks);
    const activeTasks = useAppSelector((state) => state.tasks.activeTasks);
    const completedTasks = useAppSelector((state) => state.tasks.completedTasks);
    const [newTask, setNewTask] = useState({ id: maxId(), checked: false, text: "", isEditing: false });

    useEffect(() => {
        if (storedTasks) dispatch(replaceTasks(JSON.parse(storedTasks)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    function maxId() {
        return tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;
    }

    const addTask = () => {
        if (newTask.text.trim()) {
            dispatch(pushTask({ ...newTask, id: maxId() }));
            setNewTask({ id: maxId(), checked: false, text: "", isEditing: false });
        }
    };

    return (
        <div className="App">
            <h1 className="title">To-Do List</h1>
            <AddTaskForm newTask={newTask} setNewTask={setNewTask} addTask={addTask} />
            <ol className="tasks-wrapper">
                <p className="text">
                    {activeTasks ? "Active tasks" : completedTasks ? "Сompleted tasks" : "All tasks"}
                </p>
                <SortableTasks />
                <TasksFooter />
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
