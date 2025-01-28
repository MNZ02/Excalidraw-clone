import { WebSocketServer, WebSocket } from 'ws'
import { JWT_SECRET } from '@repo/backend-common/config'
import jwt, { JwtPayload } from 'jsonwebtoken'

const wss = new WebSocketServer({ port: 8080 })


interface User {
  userId: string;
  ws: WebSocket
  rooms: string[]
}


const users: User[] = [];




const checkUser = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    if (typeof decoded === 'string') {
      return null
    }

    if (!decoded || !decoded.userId) {
      return null
    }
    return decoded.userId
  } catch (error) {
    console.log('Error decoding token', error)
    return null
  }

}

wss.on('connection', (ws, request) => {


  const url = request.url

  if (!url) return

  const queryParams = new URLSearchParams(url.split('?')[1])
  const token = queryParams.get('token')
  const userId = checkUser(token as string)

  if (!userId) {
    ws.close();
    return;
  }


  users.push({
    userId,
    ws: ws,
    rooms: []
  })

  ws.send('Connected')
  ws.on('message', (message) => {
    const parsedData = JSON.parse(message as unknown as string)


    if (parsedData.type === 'join_room') {
      const user = users.find((user) => user.ws === ws);
      user?.rooms.push(parsedData.roomId)
    }


    if (parsedData.type === 'leave_room') {
      const user = users.find(user => user.ws === ws)
      if (!user) {
        return
      }
      user.rooms = user.rooms.filter(room => room === parsedData.room)
    }


    if (parsedData.type === 'chat') {

      const roomId = parsedData.roomId;
      const message = parsedData.message;


      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(JSON.stringify({
            type: "chat",
            message: message,
            roomId
          }))
        }
      })
    }
    ws.send(JSON.stringify(message));
  })
})
