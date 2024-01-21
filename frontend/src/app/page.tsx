'use client';
import styles from "./page.module.css";
import { IMessageForm} from "@/types";
import {FormEvent, useState} from "react";
import {Alert, Button, TextField} from "@mui/material";
import {useMutation} from "@tanstack/react-query";
import axiosApi from "@/axiosApi";


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

    const SendMessageReq  = useMutation( {
        mutationFn: async (formData: IMessageForm) => {
            if (formData.message.trim().length > 0 && formData.author.trim().length > 0) {
                setLoading(true);
                try {
                    const response = await axiosApi.post('/messages', {...formData});
                    setMessage((prev) => ({
                        ...prev,
                        message: message.message,
                        author: message.author,
                    }));
                } catch (e) {
                    console.error(e);
                }
                setLoading(false);
                setError(false);
            } else {
                setError(true);
            }
        }
    });

    const addNewMessageRequest = async (e: FormEvent) => {
      e.preventDefault();

        if (message.message.trim().length !== 0 && message.author.trim().length !== 0) {
            await SendMessageReq.mutateAsync(message);
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
