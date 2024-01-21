import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import dayjs from "dayjs";
import {IMessage} from "@/types";

interface  Props {
    message: IMessage;
}

const MessageCard: React.FC<Props> = ({message}) => {
    return (
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
    );
};

export default MessageCard;