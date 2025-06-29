# Real-Time Chat Application

A web-based chat application that enables users to communicate in real-time. It supports secure authentication, persistent messaging, and file sharing. Built using **Node.js**, **Express**, **MongoDB**, and **Socket.IO**.


##  Features

-  User Registration & Login with JWT Authentication
-  Real-time Messaging using WebSockets (Socket.IO)
-  Message Persistence with MongoDB
-  File Sharing (Images, Documents)
-  Secure Passwords with Bcrypt
-  Scalable to handle multiple users
-  View previous chat history on login


##  Tech Stack

| Technology | Purpose                                 |
|-------------|-----------------------------------------|
| Node.js     | Backend runtime                        |
| Express.js  | Backend framework for API handling     |
| MongoDB     | NoSQL database                         |
| Mongoose    | MongoDB object modeling (ORM)          |
| Socket.IO   | Real-time communication (WebSockets)   |
| Bcrypt.js   | Password hashing                       |
| JWT         | User authentication and session management |
| Multer      | File upload handling (images/docs)     |
| HTML, CSS, JS | Frontend                             |


##  Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Steps

1. **Clone the repository**
   
   ```bash
   git clone https://github.com/karranavya/chat-application.git
   cd chat-application
   
2. **Install dependencies**
   ```bash
   npm install
   
3. **Configure environment variables**
- Create a .env file in the root directory and add:
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

4. **Start the server**
   ```bash
   npm start

5. **Open the app in your browser at**
   ```bash
   http://localhost:5000

##  Project Workflow

###  User Authentication
- Register users with hashed passwords.
- Login with JWT-based authentication for session management.

###  Real-Time Messaging
- Users join a group chat.
- Messages are exchanged instantly via WebSockets.
- All messages are saved in MongoDB for persistence.

###  File Sharing
- Upload and share images and documents within the chat.


##  Author

**K Sree Navya**  
GitHub: [@KarraNavya](https://github.com/karranavya)



