# LPU Social Media App

DEPLOY LINK = [https://social-media-app-rfuc.onrender.com/]

Welcome to the LPU Social Media App! This platform is designed specifically for LPU students to connect, share content, and access various facilities all in one place. Our goal is to create a safe and engaging environment for students while also utilizing AI to analyze content and assist in academic performance.

## Problem Statement

The app addresses several key problems, including:

1. **Content Moderation**: Analyzing vulgar or inappropriate content from the platform using AI. We leverage the latest machine learning models to detect and filter out NSFW (Not Safe For Work) content in real time.
   
2. **Academic Assistance**: Providing suggestions for improving students' academic performance based on their CGPA and offering study tips and recommendations when needed.

## Features

- **Content Analysis**: All videos, messages, posts, threads, and pictures are analyzed using Hugging Face's NSFW and Gemini models to detect inappropriate content. The system tracks warnings and keeps a record of guideline violations.
  
- **CGPA Prediction**: The app can predict a student's CGPA based on their academic history and performance. It also offers suggestions for improving academic performance if the predicted CGPA is low.

- **Video Calling**: The app provides a seamless video calling feature for students to connect with each other in real-time.

- **Posts and Threads**: Students can post content, create threads, and engage with each other. Posts are automatically analyzed for inappropriate content to ensure a safe environment.

- **LPU UMS Integration**: Integrated with LPU's UMS (University Management System), providing easy access to academic records and related services.

## Tech Stack

- **Frontend**:
  - Next.js
  - React.js
  - Tailwind CSS
  - TypeScript

- **Backend**:
  - Node.js
  - Express.js

- **State management**:
  - Redux Toolkit
  - Zustand
   
- **External Frameworks**:
  - Clerk authentication 
  - Stream video calling 

- **AI and Machine Learning**:
  - Video anomaly detection using Hugging Face Models
  - NSFW Detection using npm package
  - Gemini AI for Content Analysis and CGPA analysis

- **Other Technologies**:
  - Web Scraped Repositories from GitHub
  - Real-Time Video Calling

### Prerequisites
  LPU UMS REPO - [https://github.com/choxxin/LPU_profile_dep]
  Meow Meet for video calling repo - [https://github.com/choxxin/Meow_meet]
  
