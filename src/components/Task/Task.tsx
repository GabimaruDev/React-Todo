import { FC, useEffect, useRef } from "react";
import "./task.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconTrash } from "../../assets/icons/IconTrash";
import { IconDragIndicator } from "../../assets/icons/IconDragIndicator";
import { IconEdit } from "../../assets/icons/IconEdit";

interface TaskProps {
    id: number;
    checked: boolean;
    handleChecked: (id: number) => void;
    text: string;
    isEditing: boolean;
    handleEdit: (id: number) => void;
    saveEditTask: (text: string) => void;
    deleteTask: (id: number) => void;
    active?: boolean;
}

const Task: FC<TaskProps> = (props) => {
    const { id, checked, handleChecked, text, isEditing, handleEdit, saveEditTask, deleteTask, active } = props;
    const editRef = useRef<HTMLParagraphElement | null>(null);

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const styles = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    useEffect(() => {
        if (editRef.current) {
            editRef.current.focus();
        }
    }, [isEditing]);

    return (
        <li ref={setNodeRef} style={styles} className={`task ${active ? "semi-transparent" : ""}`}>
            <div className="task__inner">
                <input
                    className="checkbox"
                    onChange={() => handleChecked(id)}
                    checked={checked}
                    type="checkbox"
                    name="checkbox"
                />
                <p
                    className="task__text"
                    dangerouslySetInnerHTML={{ __html: text }}
                    contentEditable={isEditing}
                    ref={editRef}
                    onBlur={() => saveEditTask(editRef.current?.innerText || "")}
                />
            </div>
            <div className="task__buttons">
                <button className="icon-wrapper" onClick={() => handleEdit(id)}>
                    <IconEdit className="icon" />
                </button>
                <button
                    className="icon-wrapper"
                    onClick={() => {
                        deleteTask(id);
                    }}
                >
                    <IconTrash className="icon" />
                </button>
                <button {...attributes} {...listeners} className="icon-wrapper">
                    <IconDragIndicator className="icon" />
                </button>
            </div>
        </li>
    );
};

export default Task;
