import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TasksState = {
    tasks: ObjectTask[];
    activeTasks: boolean;
    completedTasks: boolean;
};

const initialState: TasksState = {
    tasks: [],
    activeTasks: false,
    completedTasks: false,
};

const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        replaceTasks(state, action: PayloadAction<ObjectTask[]>) {
            state.tasks = action.payload;
        },
        pushTask(state, action: PayloadAction<ObjectTask>) {
            state.tasks.push(action.payload);
        },
        completeTask(state, action: PayloadAction<number>) {
            state.tasks = state.tasks.map((item) =>
                item.id === action.payload ? { ...item, checked: !item.checked } : item
            );
        },
        editTask(state, action: PayloadAction<number>) {
            state.tasks = state.tasks.map((item) => (item.id === action.payload ? { ...item, isEditing: true } : item));
        },
        saveEditedTask(state, action: PayloadAction<string>) {
            state.tasks = state.tasks.map((task) => {
                if (task.isEditing) {
                    if (action.payload.trim()) {
                        return { ...task, isEditing: false, text: action.payload };
                    }
                    return { ...task, isEditing: false };
                } else {
                    return task;
                }
            });
        },
        removeTask(state, action: PayloadAction<number>) {
            state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        },
        allTasks(state) {
            state.activeTasks = false;
            state.completedTasks = false;
        },
        activeTasks(state) {
            state.activeTasks = true;
            state.completedTasks = false;
        },
        completedTasks(state) {
            state.activeTasks = false;
            state.completedTasks = true;
        },
        clearCompletedTasks(state) {
            state.tasks = state.tasks.filter((task) => !task.checked);
        },
    },
});

export const {
    replaceTasks,
    pushTask,
    editTask,
    saveEditedTask,
    removeTask,
    completeTask,
    allTasks,
    activeTasks,
    completedTasks,
    clearCompletedTasks,
} = slice.actions;

export default slice.reducer;
