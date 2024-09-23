# Social Media App

A modern social media application built with the MERN stack (MongoDB, Express, React, Node.js) and Redux Toolkit for state management. This app integrates AI for content moderation and ensures a safe user experience.
- [visit site](https://social-media-app-rfuc.onrender.com)

## Features

- **User Authentication & Authorization:** Secure user registration and login using JWT.
- **Profile Management:** Users can create, update, and view profiles. Follow and unfollow other users.
- **Posts & Comments:** Users can create, view, edit, and delete posts. They can also like, dislike, and comment on posts.
- **Content Moderation:** AI integration using Gemini for text moderation to detect inappropriate or harmful content.
- **Image Moderation:** NSFW package integration for automatic image moderation to detect and prevent inappropriate images.
- **Real-Time Notifications:** Users receive real-time updates for activities such as likes, comments, and follows.
- **Responsive Design:** The application is fully responsive and optimized for all devices using Tailwind CSS.
- **Efficient State Management:** The application uses Redux Toolkit for managing application state seamlessly.

## Tech Stack

- **Frontend:**
  - [React](https://reactjs.org/)
  - [Redux Toolkit](https://redux-toolkit.js.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  
- **Backend:**
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)
  - [MongoDB](https://www.mongodb.com/)
  - [Socket.IO](https://socket.io/) (for real-time notifications)
  
- **AI Integration:**
  - [Gemini AI]([https://example.com/gemini](https://ai.google.dev/aistudio)) (for content moderation) 
  - [NSFWJS](https://github.com/infinitered/nsfwjs) (for image moderation)

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed or access to a MongoDB cloud instance.

### Installation
  **Setup the envs and run the following commands**
   ```bash
   git clone https://github.com/username/social-media-app.git](https://github.com/M-hell/social-media-app.git
   cd server
   npm i
   npm run dev
   cd client
   npm i
   npm run dev

