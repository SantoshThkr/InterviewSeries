import { useRef, useState } from "react"

export default function Toast() {

    const [toasts, setToasts] = useState([]);
    const timerRef = useRef({})

    const handleAdd = (message, type) => {
        const id = new Date().getTime();
        const newToast = [...toasts, { id, message, type }]
        setToasts(newToast);
        timerRef.current[id] = setTimeout(() => handleClose(id), 5000)
    }

    const handleClose = (id) => {

        clearTimeout(timerRef.current[id])
        delete timerRef.current[id];

        setToasts((prevToasts) => {
            const filterArr = prevToasts.filter((toast) => {
                return toast.id !== id;
            })
            return filterArr;
        })
    }
    return (
        <div className="conatiner-toast">
            <div className="toast-message-conatiner">
                {
                    toasts.map(({ id, message, type }) => (
                        <div className={`toast-message ${type}`} key={id}>
                            {message}
                            <span onClick={() => handleClose(id)}>X</span>
                        </div>
                    ))
                }
            </div>

            <div className="toast-button-container">
                <button onClick={() => handleAdd("Success", "success")}>Sucess</button>
                <button onClick={() => handleAdd("Info", "info")}>Info</button>
                <button onClick={() => handleAdd("Warning", "warning")}>Warning</button>
                <button onClick={() => handleAdd("Error", "error")}>Error</button>
            </div>
        </div>
    )
}