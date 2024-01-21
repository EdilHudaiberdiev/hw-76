'use client';
import styles from "./page.module.css";
import {IMessage, IMessageForm} from "@/types";
import {Dispatch, FormEvent, SetStateAction, useEffect, useState} from "react";
import {Box, CircularProgress} from "@mui/material";
import {useMutation} from "@tanstack/react-query";
import axiosApi from "@/axiosApi";
import MessageCard from "@/components/MessageCard/MessageCard";
import MessageSendForm from "@/components/MessageSendForm/MessageSendForm";


const Home = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [lastDate, setLastDate] = useState('');


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



    const SendMessageReq  = useMutation( {
        mutationFn: async (formData: IMessageForm) => {
            if (formData.message.trim().length > 0 && formData.author.trim().length > 0) {
                try {
                    await axiosApi.post('/messages',{...formData});
                } catch (e) {
                    console.error(e);
                }
                setError(false);
            } else {
                setError(true);
            }
        }
    });

    const addNewMessageRequest = async (e: FormEvent, message: IMessageForm, setMessage: Dispatch<SetStateAction<IMessageForm>>) => {
      e.preventDefault();

        if (message.message.trim().length !== 0 && message.author.trim().length !== 0) {
            await SendMessageReq.mutateAsync(message);
            setMessage((prev) => ({
                ...prev,
                message: '',
                author: '',
            }));
            setError(false);
        } else {
            setError(true);
        }
    };

    return (
        <main className={styles.main}>
           <MessageSendForm error={error} addNewMessageRequest={addNewMessageRequest}/>

            <div>
                {loading ?  <CircularProgress/> :
                    <>
                        {messages.length === 0 ? <p>No messages yet</p> :
                            <Box sx={{height: 400, overflowY: 'auto', width: 320}}>
                                {messages.map(message => (
                                    <MessageCard key={message.id} message={message}/>
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
