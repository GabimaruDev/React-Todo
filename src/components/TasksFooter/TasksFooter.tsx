import "./tasksFooter.css";
import { activeTasks, allTasks, completedTasks, clearCompletedTasks } from "../../app/store/taskSlice";
import { useAppDispatch, useAppSelector } from "../../hook";

const TasksFooter = () => {
    const tasks = useAppSelector((state) => state.tasks.tasks);
    const dispatch = useAppDispatch();

    return (
        <div className="tasks__footer">
            <p>Active tasks left: {tasks.filter((task) => !task.checked).length}</p>
            <div className="buttons">
                <button className="button" onClick={() => dispatch(allTasks())}>
                    All
                </button>
                <button className="button" onClick={() => dispatch(activeTasks())}>
                    Active
                </button>
                <button className="button" onClick={() => dispatch(completedTasks())}>
                    Completed
                </button>
            </div>
            <button className="button" onClick={() => dispatch(clearCompletedTasks())}>
                Clear completed
            </button>
        </div>
    );
};

export default TasksFooter;
