import { FC, useEffect, useRef } from "react";
import "./task.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconTrash } from "../../assets/icons/IconTrash";
import { IconDragIndicator } from "../../assets/icons/IconDragIndicator";
import { IconEdit } from "../../assets/icons/IconEdit";
import { useAppDispatch } from "../../hook";
import { completeTask, editTask, removeTask, saveEditedTask } from "../../app/store/taskSlice";

interface TaskProps {
    id: number;
    checked: boolean;
    text: string;
    isEditing: boolean;
    drag?: boolean;
}

const Task: FC<TaskProps> = (props) => {
    const { id, checked, text, isEditing, drag } = props;
    const editRef = useRef<HTMLParagraphElement | null>(null);

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const styles = {
        transition,
        transform: CSS.Translate.toString(transform),
    };

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (isEditing && editRef.current) {
            editRef.current.focus();
        }
    }, [isEditing]);

    return (
        <li ref={setNodeRef} style={styles} className={`task ${drag ? "semi-transparent" : ""}`}>
            <div className="task__inner">
                <input
                    className="checkbox"
                    onChange={() => dispatch(completeTask(id))}
                    checked={checked}
                    type="checkbox"
                    name="checkbox"
                />
                <p
                    className="task__text"
                    dangerouslySetInnerHTML={{ __html: text }}
                    contentEditable={isEditing}
                    ref={editRef}
                    onBlur={() => dispatch(saveEditedTask(editRef.current?.innerText || ""))}
                />
            </div>
            <div className="task__buttons">
                <button className="icon-wrapper" onClick={() => dispatch(editTask(id))}>
                    <IconEdit className="icon" />
                </button>
                <button className="icon-wrapper" onClick={() => dispatch(removeTask(id))}>
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
