// const API_PATH = "ws://localhost:8000/ws/chat"
const API_PATH = "ws://159.65.154.37:8000/ws/chat"

class WebSocketService {
  static instance = null;
  callbacks = {};
  maincallback = {}

  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    console.log(WebSocketService.instance);

    return WebSocketService.instance;
  }

  constructor() {
    this.socketRef = null;
  }

  connect() {
    const path = API_PATH;
    console.log(path)
    this.socketRef = new WebSocket(path);
    this.socketRef.onopen = () => {
      console.log('WebSocket open');
    };
    this.socketRef.onmessage = e => {
      this.socketNewMessage(e.data);
    };

    this.socketRef.onerror = e => {
      console.log(e.message);
    };
    this.socketRef.onclose = () => {
      console.log("WebSocket closed let's reopen");
      this.connect();
    };
  }

  socketNewMessage(data) {
    const parsedData = JSON.parse(data);
    const command = parsedData.command;

    console.log(command)
      
    if (command === 'messages') {
      this.callbacks[command](parsedData.messages);
    }
    
    if (command === 'new_message') {
      this.callbacks[command](parsedData.friend_id);
    }
   

  }

  initChatUser(username) {
    this.sendMessage({ command: 'init_chat', username: username });
  }

  fetchMessages(username, userid1) {
    this.sendMessage({ command: 'fetch_messages', username: username, userid1: userid1 });
  }

  newChatMessage(token, message, friend) {
    this.sendMessage({ command: 'new_message', token: token, message: message, friend: friend }); 
  }


  addCallbacks(newMessageCallback) {
    this.callbacks['new_message'] = newMessageCallback;

  }
  
  sendMessage(data) {
    console.log(data)
    try {
      this.socketRef.send(JSON.stringify({ ...data }));
    }
    catch(err) {
      console.log(err.message);
    }  
  }

  state() {
    return this.socketRef.readyState;
  }

   waitForSocketConnection(callback){
    const socket = this.socketRef;
    const recursion = this.waitForSocketConnection;
    setTimeout(
      function () {
        if (socket.readyState === 1) {
          console.log("Connection is made")
          if(callback != null){
            callback();
          }
          return;

        } else {
          console.log("wait for connection...")
          recursion(callback);
        }
      }, 1); // wait 5 milisecond for the connection...
  }

}

const WebSocketInstance = WebSocketService.getInstance();

export default WebSocketInstance;
