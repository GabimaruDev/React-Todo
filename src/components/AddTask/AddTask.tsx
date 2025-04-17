import { FC } from "react";

interface AddTaskProps {
    newTask: ObjectTask;
    setNewTask(newTask: ObjectTask): void;
    addTask(): void;
}

const AddTask: FC<AddTaskProps> = (props) => {
    const { newTask, setNewTask, addTask } = props;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTask({ ...newTask, text: event.target.value });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            addTask();
        }
    };

    return (
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
    );
};

export default AddTask;
