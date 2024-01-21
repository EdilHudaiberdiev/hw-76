'use client';
import styles from "./page.module.css";
import {IMessage, IMessageForm} from "@/types";
import {FormEvent, useEffect, useState} from "react";
import {Alert, Box, Button, Card, CardContent, CircularProgress, Grid, TextField, Typography} from "@mui/material";
import {useMutation} from "@tanstack/react-query";
import axiosApi from "@/axiosApi";
import dayjs from "dayjs";
import {auto} from "@popperjs/core";


const Home = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [lastDate, setLastDate] = useState('');
    const [message, setMessage] = useState<IMessageForm>({
        author: '',
        message: ''
    });

    const getMessagesInterval  = useMutation({
        mutationFn: async () => {
            try {
                const response = await axiosApi.get(`messages?datetime=${lastDate}`);
                setLastDate(response.data[response.data.length - 1].date);
                setMessages((prevState) => [...response.data, ...prevState,]);
            } catch (e) {
                console.error(e);
            }
        },
    });

    const getMessages  = useMutation({
        mutationFn: async () => {
            setLoading(true);
            try {
                const response = await axiosApi.get('/messages');
                setLastDate(response.data[response.data.length - 1].date);
                setMessages(response.data.reverse());
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        },
    });

    useEffect( () => {
        const run = async () => {
            if (messages.length === 0) {
                await getMessages.mutateAsync();
            }
        };

        void run();
    }, []);

    useEffect( () => {
        if (lastDate !== '') {
            const interval = setInterval(async () => {
                await getMessagesInterval.mutateAsync();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [lastDate]);

    const changeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const SendMessageReq  = useMutation( {
        mutationFn: async (formData: IMessageForm) => {
            if (formData.message.trim().length > 0 && formData.author.trim().length > 0) {
                try {
                    const response = await axiosApi.post('/messages',{...formData});
                    setMessage((prev) => ({
                        ...prev,
                        message: message.message,
                        author: message.author,
                    }));
                } catch (e) {
                    console.error(e);
                }
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

            <div>
                {loading ?  <CircularProgress/> :
                    <>
                        {messages.length === 0 ? <p>No messages yet</p> :
                            <Box sx={{height: 400, overflowY: 'auto', width: 320}}>
                                {messages.map(message => (
                                    <Card sx={{ minWidth: 275, mt: 2 }}>
                                        <CardContent>
                                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                                {dayjs(message.date).format('MMMM D, YYYY h:mm A')}
                                            </Typography>
                                            <Typography variant="h5" component="div">
                                                {message.author}
                                            </Typography>
                                            <Typography variant="body2">
                                                {message.message}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        }
                    </>
                }
            </div>
        </main>
    );
};

export default Home;
