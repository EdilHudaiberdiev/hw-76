'use client';
import styles from "./page.module.css";
import {IMessageForm} from "@/types";
import {FormEvent, useState} from "react";
import {Alert, Button, TextField} from "@mui/material";

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState<IMessageForm>({
        author: '',
        message: ''
    });

    const changeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const addNewMessageRequest = async (e: FormEvent) => {
      e.preventDefault();

        if (message.message.trim().length !== 0 && message.author.trim().length !== 0) {
            console.log(message);
            setError(false);
        } else {
            setError(true);
        }
    };


    return (
        <main className={styles.main}>
            <form onSubmit={addNewMessageRequest}>
                {error ? <Alert severity="error">Author and message must be field</Alert> : null}
                <hr/>
                <TextField
                    label="Author"
                    variant="filled"
                    name="author"
                    value={message.author}
                    onChange={changeForm}
                />
                <hr/>
                <TextField
                    label="Message"
                    variant="filled"
                    name="message"
                    value={message.message}
                    onChange={changeForm}
                />
                <hr/>
                <Button
                    disabled={message.message.trim().length === 0 && message.author.trim().length === 0}
                    variant="contained"
                    type="submit"
                >Send</Button>
            </form>
        </main>
    );
};

export default Home;
