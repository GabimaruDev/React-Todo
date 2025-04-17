import { configureStore } from "@reduxjs/toolkit";

export const initialState = {
    activeTasks: false,
    completedTasks: false,
};

const reducer = (state = initialState, action: { type: string; payload: never }) => {
    switch (action.type) {
        case "ALL_TASKS":
            return { ...state, activeTasks: false, completedTasks: false };
        case "ACTIVE_TASKS":
            return { ...state, activeTasks: true, completedTasks: false };
        case "COMPLETED_TASKS":
            return { ...state, activeTasks: false, completedTasks: true };
        default:
            return state;
    }
};

export const store = configureStore({
    reducer: reducer,
});
