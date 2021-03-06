import React from "react"
import ReactDOM from "react-dom"
import { Input, Button } from "reactstrap"
import { MessageSquare, Menu, Star, Send } from "react-feather"
import PerfectScrollbar from "react-perfect-scrollbar"
import { connect } from "react-redux"
import { togglePinned, sendMessage, getChats } from "../../redux/actions/chat/index"
import userImg from "../../assets/img/portrait/small/avatar-s-11.jpg"
import WebSocketInstance from '../../redux/services/WebSocket'

class ChatLog extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (
      props.activeUser !== state.activeChat ||
      props.activeChat !== state.activeChat
    ) {
      return {
        activeUser: props.activeUser,
        activeChat: props.activeChat
      }
    }
    // Return null if the state hasn't changed
    return null
  }

  constructor(props) {
    super(props);
    this.state = {
      msg: "",
      activeUser: null,
      activeChat: null,
    }
    console.log("inside constructor" )
    WebSocketInstance.connect();
    this.waitForSocketConnection(
      () => {
      WebSocketInstance.addCallbacks(
      this.new_message.bind(this),
      );
    }
    );
  }

  waitForSocketConnection(callback) {
    const component = this;
    setTimeout(
      function () {
        // Check if websocket state is OPEN
        if (WebSocketInstance.state() === 1) {
          console.log("Connection is made")
          callback();
          return;
        } else {
          console.log("wait for connection...")
          component.waitForSocketConnection(callback);
        }
    }, 100); // wait 100 milisecond for the connection...
  }

  new_message(friend_id){
    let context = JSON.parse(localStorage.getItem('context'))
    if (friend_id.includes(context.id)){
      this.props.getChats()
    }
  }

  handleSendMessage = (id, isPinned, text) => {
    if (text.length > 0) {
      // let newMsg = {
      //     textContent: text,
      //     isSent: true,
      //     isSeen: false,
      //     time: new Date().toString()
      //   }
        // let activeChat = this.state.activeChat
        let token = localStorage.getItem('authToken')
      //   if (activeChat && activeChat !== undefined && activeChat.msg){
      //     activeChat.msg.push(newMsg)
      //     this.setState({ activeChat:activeChat }, () => console.log('valueset.........', this.state.activeChat))
      //   }
      // this.props.sendMessage(id, isPinned, text)
      WebSocketInstance.newChatMessage(token, text, id);
      this.setState({
        msg: ""
      })
      // this.props.getChats()
    }
  }
  componentDidMount() {
    this.scrollToBottom()
  }
  componentDidUpdate() {
    this.scrollToBottom()
  }

  handleTime = (time_to, time_from) => {
    const date_time_to = new Date(Date.parse(time_to))
    const date_time_from = new Date(Date.parse(time_from))
    return (
      date_time_to.getFullYear() === date_time_from.getFullYear() &&
      date_time_to.getMonth() === date_time_from.getMonth() &&
      date_time_to.getDate() === date_time_from.getDate()
    )
  }

  scrollToBottom = () => {
    const chatContainer = ReactDOM.findDOMNode(this.chatArea)
    chatContainer.scrollTop = chatContainer.scrollHeight
  }

  render() {
    const { activeUser } = this.state
    let activeUserUid = activeUser && activeUser.uid ? activeUser.uid : null,
      activeChat =
        activeUser && activeUser.uid
          ? this.props.chat.chats[activeUserUid]
          : null

    let renderChats =
      activeChat && activeChat !== undefined && activeChat.msg
        ? activeChat.msg.map((chat, i) => {
            let renderSentTime = () => {
              if (
                i > 0 &&
                !this.handleTime(chat.time, activeChat.msg[i - 1].time)
              ) {
                return (
                  <div className="divider">
                    <div className="divider-text">
                      {new Date().getDate() +
                        " " +
                        new Date().toLocaleString("default", {
                          month: "short"
                        })}
                    </div>
                  </div>
                )
              }
            }
            let renderAvatar = () => {
              if (i > 0) {
                if (
                  chat.isSent === true &&
                  activeChat.msg[i - 1].isSent !== true
                ) {
                  return (
                    <div className="chat-avatar">
                      <div className="avatar m-0">
                        <img
                          src={require("../../assets/img/portrait/small/dummy-profile-pic.png")}
                          alt="chat avatar"
                          height="40"
                          width="40"
                        />
                      </div>
                    </div>
                  )
                } else if (chat.isSent !== true) {
                  return (
                    <div className="chat-avatar">
                      <div className="avatar m-0">
                        <img
                          src={require("../../assets/img/portrait/small/dummy-profile-pic.png")}
                          alt="chat avatar"
                          height="40"
                          width="40"
                        />
                      </div>
                    </div>
                  )
                } else {
                  return ""
                }
              } else {
                return (
                  <div className="chat-avatar">
                    <div className="avatar m-0">
                      <img
                        src={chat.isSent ? require("../../assets/img/portrait/small/dummy-profile-pic.png") : require("../../assets/img/portrait/small/dummy-profile-pic.png")}
                        alt="chat avatar"
                        height="40"
                        width="40"
                      />
                    </div>
                  </div>
                )
              }
            }
            return (
              <React.Fragment key={i}>
                {renderSentTime()}
                <div
                  className={`chat ${
                    chat.isSent !== true ? "chat-left" : "chat-right"
                  }`}>
                  {renderAvatar()}
                  <div className="chat-body">
                    <div className="chat-content">{chat.textContent}</div>
                  </div>
                </div>
              </React.Fragment>
            )
          })
        : null

    return (
      <div className="content-right">
        <div className="chat-app-window">
          <div
            className={`start-chat-area ${
              activeUser !== null ? "d-none" : "d-flex"
            }`}>
            <span className="mb-1 start-chat-icon">
              <MessageSquare size={50} />
            </span>
            <h4
              className="py-50 px-1 sidebar-toggle start-chat-text"
              onClick={() => {
                if (this.props.mql.matches === false) {
                  this.props.mainSidebar(true)
                } else {
                  return null
                }
              }}>
              Start Conversation
            </h4>
          </div>
          <div
            className={`active-chat ${
              activeUser === null ? "d-none" : "d-block"
            }`}>
            <div className="chat_navbar">
              <header className="chat_header d-flex justify-content-between align-items-center p-1">
                <div className="d-flex align-items-center">
                  <div
                    className="sidebar-toggle d-block d-lg-none mr-1"
                    onClick={() => this.props.mainSidebar(true)}>
                    <Menu size={24} />
                  </div>
                  <div
                    className="avatar user-profile-toggle m-0 m-0 mr-1"
                    onClick={() => this.props.handleReceiverSidebar("open")}>
                    <img
                      src={activeUser !== null ? require("../../assets/img/portrait/small/dummy-profile-pic.png") : ""}
                      alt={activeUser !== null ? activeUser.displayName : ""}
                      height="40"
                      width="40"
                    />
                    <span
                      className={`
                    ${
                      activeUser !== null &&
                      activeUser.status === "do not disturb"
                        ? "avatar-status-busy"
                        : activeUser !== null && activeUser.status === "away"
                        ? "avatar-status-away"
                        : activeUser !== null && activeUser.status === "offline"
                        ? "avatar-status-offline"
                        : "avatar-status-online"
                    }
                    `}
                    />
                  </div>
                  <h6 className="mb-0">
                    {activeUser !== null ? activeUser.displayName : ""}
                  </h6>
                </div>
                <span
                  className="favorite"
                  onClick={() => {
                    if (activeChat) {
                      this.props.togglePinned(
                        activeUser.uid,
                        !activeChat.isPinned
                      )
                    }
                  }}>
                  <Star
                    size={22}
                    stroke={
                      activeChat && activeChat.isPinned === true
                        ? "#FF9F43"
                        : "#626262"
                    }
                  />
                </span>
              </header>
            </div>
            <PerfectScrollbar
              className="user-chats"
              options={{
                wheelPropagation: false
              }}
              ref={el => {
                this.chatArea = el
              }}>
               
                <div className="chats">{renderChats}</div>
              
            </PerfectScrollbar>
            <div className="chat-app-form">
              <form
                className="chat-app-input d-flex align-items-center"
                onSubmit={e => {
                  e.preventDefault()
                  this.handleSendMessage(
                    activeUser.uid,
                    false,
                    this.state.msg,
                    activeUser
                  )
                }}>
                <Input
                  type="text"
                  className="message mr-1 ml-50"
                  placeholder="Type your message"
                  value={this.state.msg}
                  onChange={e => {
                    e.preventDefault()
                    this.setState({
                      msg: e.target.value
                    })
                  }}
                />
                <Button color="primary">
                  <Send className="d-lg-none" size={15} />
                  <span className="d-lg-block d-none">Send</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    ) 
  }
}
const mapStateToProps = state => {
  return {
    chat: state.chatApp.chats
  }
}
export default connect(mapStateToProps, { togglePinned, sendMessage, getChats })(ChatLog)
