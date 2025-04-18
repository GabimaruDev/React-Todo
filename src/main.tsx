import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./app/styles/reset.css";
import "./app/styles/normalize.css";
import "./app/styles/main.css";
import App from "./App";
import store from "./app/store/store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);
