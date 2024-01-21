import {promises as fs} from 'fs';
import * as crypto from 'crypto';
import {IMessages, MessageWithoutID} from "./types";
import {DiffieHellmanGroup} from "crypto";

const fileName = './db.json';
let data: IMessages[] = [];

const fileDb = {
    async init() {
        try {
            const fileContents = await fs.readFile(fileName);
            data = JSON.parse(fileContents.toString());
        } catch (e) {
            data = [];
        }
    },
    async getThirtyMessages(messagesArray: IMessages[]=data) {
        return messagesArray?.slice(-30);
    },
    async addMessageToJson(message: MessageWithoutID) {
        const id = crypto.randomUUID();
        const date = new Date().toISOString();
        const newMessage = {id, date, ...message}

        data.push(newMessage);
        await this.save();

        return newMessage;
    },
    getByQueryDatetime(datetime: Date): IMessages[] {
        let lastMessages: IMessages[] = [];

        data.forEach(message => {
           if (new Date(message.date) > datetime) {
               lastMessages.push(message);
           }
        });

        return lastMessages;
    },
    async save() {
        return fs.writeFile(fileName, JSON.stringify(data));
    }
};

export default fileDb;

