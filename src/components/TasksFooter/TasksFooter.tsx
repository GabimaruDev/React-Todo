import { FC } from "react";
import { store } from "../../app/store";
import "./tasksFooter.css";

interface TasksFooter {
    tasks: ObjectTask[];
    setTasks(tasks: ObjectTask[]): void;
}

const TasksFooter: FC<TasksFooter> = (props) => {
    const { tasks, setTasks } = props;

    return (
        <div className="tasks__footer">
            <p>Active tasks left: {tasks.filter((task) => !task.checked).length}</p>
            <div className="buttons">
                <button
                    className="button"
                    onClick={() => {
                        store.dispatch({ type: "ALL_TASKS" });
                    }}
                >
                    All
                </button>
                <button
                    className="button"
                    onClick={() => {
                        store.dispatch({ type: "ACTIVE_TASKS" });
                    }}
                >
                    Active
                </button>
                <button
                    className="button"
                    onClick={() => {
                        store.dispatch({ type: "COMPLETED_TASKS" });
                    }}
                >
                    Completed
                </button>
            </div>
            <button
                className="button"
                onClick={() => {
                    setTasks(tasks.filter((task) => !task.checked));
                }}
            >
                Clear completed
            </button>
        </div>
    );
};

export default TasksFooter;
