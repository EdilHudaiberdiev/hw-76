import {Router} from 'express';
import fileDb from "../fileDb";
import {IMessages} from "../types";
const messageRouter = Router();
messageRouter.post('/', async (req, res) => {

    if (!req.body.author || !req.body.message) {
        res.status(404).send({"error": "Author and message must be present in the request"});
    }

    let newMessage = {
        message: req.body.message,
        author: req.body.author,
    };

    newMessage = await fileDb.addMessageToJson(newMessage);
    res.send(newMessage);
});

messageRouter.get('/', async (req, res) => {
    let messages: IMessages[] = [];

    if (req.query.datetime) {
        const queryDate = req.query.datetime as string;
        const date = new Date(queryDate);

        if (isNaN(date.getDate())) {
            res.status(400).send({"error": "Datetime is not correct"});
        } else {
            let messagesByQuery = await fileDb.getByQueryDatetime(date);
            messages = await fileDb.getThirtyMessages(messagesByQuery);
        }

    } else {
        messages = await fileDb.getThirtyMessages();
    }

    res.send(messages);
});

export default messageRouter