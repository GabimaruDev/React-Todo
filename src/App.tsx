import { useEffect, useState } from "react";
import { pushTask, replaceTasks } from "./app/store/taskSlice";
import "./app/styles/App.css";
import AddTaskForm from "./components/AddTaskForm/AddTaskForm";
import SortableTasks from "./components/SortableTasks/SortableTasks";
import TasksFooter from "./components/TasksFooter/TasksFooter";
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
        <main className="App">
            <section className="section">
                <h1 className="title">To-Do List</h1>
                <AddTaskForm newTask={newTask} setNewTask={setNewTask} addTask={addTask} />
            </section>
            <section className="tasks-wrapper">
                <h2 className="text">
                    {activeTasks ? "Active tasks" : completedTasks ? "Сompleted tasks" : "All tasks"}
                </h2>
                <SortableTasks />
                <TasksFooter />
            </section>
            <p className="developer">
                <span>Developer: </span>
                <a className="link" href="https://github.com/GabimaruDev">
                    GabimaruDev
                </a>
            </p>
        </main>
    );
}

export default App;
