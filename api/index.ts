import express from 'express';
const cors = require('cors');
import messageRouter from "./Routers/messages";
import fileDb from "./fileDb";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

app.use('/messages', messageRouter);

const run = async () => {
    await fileDb.init();

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

void run ();

