import * as crypto from 'crypto';
import {Router} from 'express';
import * as fs from "fs";
import fileDb from "../fileDb";

const messageRouter = Router();
const path = './messages';

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

export default messageRouter