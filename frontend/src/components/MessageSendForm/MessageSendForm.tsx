import React, {Dispatch, FormEvent, SetStateAction, useState} from 'react';
import {Alert, Button, TextField} from "@mui/material";
import {IMessageForm} from "@/types";


interface Props {
    error: boolean;
    addNewMessageRequest: (e: FormEvent, message: IMessageForm, setMessage: Dispatch<SetStateAction<IMessageForm>>) => void;
}

const MessageSendForm: React.FC<Props> = ({error, addNewMessageRequest}) => {
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

    return (
        <form onSubmit={e => addNewMessageRequest(e, message, setMessage)}>
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
    );
};

export default MessageSendForm;