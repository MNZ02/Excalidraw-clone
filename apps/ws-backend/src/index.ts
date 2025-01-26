import { WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt, { JwtPayload } from 'jsonwebtoken'


const wss = new WebSocketServer({port:8080});


wss.on("connection", (ws, request) =>{

    const url = request.url;

    
    if(!url) return;


    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token');
    const decoded = jwt.verify(token as string,JWT_SECRET)


    if(!decoded || !(decoded as JwtPayload).userId) {
        ws.close();
        return;
    }

    ws.send('Connected')
    ws.on('message', (message) => {
        ws.send('Message received')
    })
})