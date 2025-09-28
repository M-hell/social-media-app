# 🛡️ AI-Screened Social Media Platform

> **A next-generation social media application with intelligent content moderation powered by AI and real-time community features**

<div align="center">

## 🌐 **Live Application**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Application-FF6B35?style=for-the-badge&logo=render&logoColor=white)](https://social-media-app-rfuc.onrender.com/)

**Experience the platform:** [https://social-media-app-rfuc.onrender.com/](https://social-media-app-rfuc.onrender.com/)

[![GitHub Repository](https://img.shields.io/badge/📚_Repository-View_Source-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/M-hell/social-media-app)

</div>

---

## 📋 **Project Description**

The **AI-Screened Social Media Platform** is a modern, intelligent social networking application that combines traditional social media features with cutting-edge AI-powered content moderation. Built with a focus on creating safe, inclusive online communities, this platform automatically screens posts, comments, and media content for hate speech, NSFW material, and harmful content using custom-trained AI models.

The platform features **real-time messaging**, **community management**, **video conferencing**, **advanced content filtering**, and **intelligent post screening**. What sets it apart is the integration of **Google Cloud Platform's Vertex AI** for fine-tuning custom hate speech detection models, ensuring a safer user experience through proactive content moderation.

**🤖 AI-Powered Safety**: Enhanced with **fine-tuned models using GCP Vertex AI** for hate speech detection and **NSFW.js** for inappropriate content filtering.

---

## ✨ **Key Features**

### 🛡️ **AI Content Moderation**
- **Hate Speech Detection** using custom fine-tuned models on GCP Vertex AI
- **NSFW Content Filtering** with real-time image/video analysis
- **Automated Content Screening** before post publication
- **Smart Content Flagging** with confidence scoring

### 💬 **Social Media Core**
- **User Authentication & Profiles** with secure JWT sessions
- **Post Creation & Management** with rich media support
- **Comment System** with nested threading
- **Real-time Notifications** for user interactions

### 🌐 **Community Features**
- **Community Creation & Management** with role-based permissions
- **Community-specific Posts** and discussions
- **Member Management** with admin controls
- **Community Analytics** and insights

### 🎥 **Real-time Communication**
- **Live Chat Messaging** with Socket.io integration
- **Video Conferencing** powered by ZegoCloud
- **Group Conversations** with multimedia sharing
- **Online Status Tracking** for users

### 📱 **Modern User Experience**
- **Responsive Design** optimized for all devices
- **Infinite Scroll** for seamless content browsing
- **Dark/Light Theme** support
- **Progressive Web App** capabilities

---

## 🏗️ **System Architecture**

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                               CLIENT LAYER                                      │
├─────────────────────┬─────────────────────┬─────────────────────────────────────┤
│  📱 React Frontend  │  🎨 UI Components   │  📡 Real-time Features              │
│  (Vite + Tailwind)  │  (DaisyUI)          │  (Socket.io Client)                 │
│                     │                     │                                      │
└──────────┬──────────┴──────────┬──────────┴──────────┬──────────────────────────┘
           │                     │                     │
           ▼                     ▼                     ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                               API LAYER                                         │
├─────────────────────┬─────────────────────┬─────────────────────────────────────┤
│  🚀 Express.js      │  🔐 JWT Auth        │  📡 Socket.io Server                │
│  REST API           │  Middleware         │  Real-time Events                   │
│                     │                     │                                      │
└──────────┬──────────┴──────────┬──────────┴──────────┬──────────────────────────┘
           │                     │                     │
           ▼                     ▼                     ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           BUSINESS LOGIC                                        │
├─────────────────────┬─────────────────────┬─────────────────────────────────────┤
│  📝 Post            │  👥 Community       │  💬 Chat & Video                   │
│  Controllers        │  Management         │  Controllers                        │
│                     │                     │                                      │
└──────────┬──────────┴──────────┬──────────┴──────────┬──────────────────────────┘
           │                     │                     │
           ▼                     ▼                     ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             AI LAYER                                            │
├─────────────────────┬─────────────────────┬─────────────────────────────────────┤
│  🤖 GCP Vertex AI   │  🔍 NSFW.js         │  ⏰ Cron Jobs                      │
│  Hate Speech Model  │  Content Filter     │  Scheduled Tasks                    │
│                     │                     │                                      │
└──────────┬──────────┴──────────┬──────────┴──────────┬──────────────────────────┘
           │                     │                     │
           ▼                     ▼                     ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                           │
├─────────────────────┬─────────────────────┬─────────────────────────────────────┤
│  🗄️ MongoDB         │  📊 Collections     │  🔄 Real-time Sync                 │
│  Database           │  (Users, Posts,     │  Change Streams                     │
│                     │   Communities)      │                                      │
└─────────────────────┴─────────────────────┴─────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                        │
├─────────────────────┬─────────────────────┬─────────────────────────────────────┤
│  ☁️ Google Cloud    │  📹 ZegoCloud       │  📤 Cloudinary                     │
│  Vertex AI          │  Video Conferencing │  Media Storage & CDN                │
└─────────────────────┴─────────────────────┴─────────────────────────────────────┘
```

## 📁 **Project Structure**

```
📦 ai-screened-social-media/
├── 📁 client/                           # 🎨 React Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 components/              # 🧩 Reusable UI Components
│   │   │   ├── 📄 Header.jsx           # 🎯 Navigation header
│   │   │   ├── 📄 PostCard.jsx         # 📝 Individual post display
│   │   │   ├── 📄 CommentSection.jsx   # 💬 Comments interface
│   │   │   ├── 📄 ChatWindow.jsx       # 💬 Chat interface
│   │   │   └── 📄 VideoCall.jsx        # 📹 Video conferencing
│   │   ├── 📁 pages/                   # 📄 Main Application Pages
│   │   │   ├── 📄 HomePage.jsx         # 🏠 Social feed
│   │   │   ├── 📄 ProfilePage.jsx      # 👤 User profiles
│   │   │   ├── 📄 CommunityPage.jsx    # 👥 Community dashboard
│   │   │   ├── 📄 ChatPage.jsx         # 💬 Messaging interface
│   │   │   └── 📄 VideoMeetPage.jsx    # 📹 Video meetings
│   │   ├── 📁 redux/                   # 🔄 Redux Toolkit State Management
│   │   │   ├── 📄 store.js             # 🗄️ Redux Toolkit store config
│   │   │   ├── 📄 authSlice.js         # 🔐 Authentication state slice
│   │   │   ├── 📄 postSlice.js         # 📝 Post management slice
│   │   │   └── 📄 chatSlice.js         # 💬 Chat state slice
│   │   ├── 📁 helpers/                 # 🛠️ Utility Functions
│   │   │   ├── 📄 api.js               # 🔗 API configuration
│   │   │   ├── 📄 formatters.js        # 📊 Data formatters
│   │   │   └── 📄 validation.js        # ✅ Form validation
│   │   ├── 📁 assets/                  # 🎨 Static Assets
│   │   ├── 📄 App.jsx                  # 🎯 Main App component
│   │   ├── 📄 main.jsx                 # 🚀 Application entry
│   │   └── 📄 index.css                # 🎨 Global styles
│   ├── 📄 index.html                   # 🌐 HTML template
│   ├── 📄 vite.config.js               # ⚙️ Vite configuration
│   ├── 📄 tailwind.config.js           # 🎨 Tailwind config
│   └── 📄 package.json                 # 📦 Frontend dependencies
├── 📁 server/                          # 🚀 Node.js Backend Server
│   ├── 📁 controllers/                 # 🎛️ Business Logic
│   │   ├── 📄 authController.js        # 🔐 Authentication logic
│   │   ├── 📄 postController.js        # 📝 Post management
│   │   ├── 📄 commentController.js     # 💬 Comment system
│   │   ├── 📄 communityController.js   # 👥 Community features
│   │   ├── 📄 chatController.js        # 💬 Chat management
│   │   └── 📄 aiController.js          # 🤖 AI content screening
│   ├── 📁 models/                      # 🗄️ Database Models
│   │   ├── 📄 UserModel.js             # 👤 User schema
│   │   ├── 📄 PostModel.js             # 📝 Post schema
│   │   ├── 📄 CommentsModel.js         # 💬 Comment schema
│   │   ├── 📄 CommunityModel.js        # 👥 Community schema
│   │   ├── 📄 ConversationModel.js     # 💬 Chat schema
│   │   ├── 📄 CommunityMessage.js      # 📨 Community messages
│   │   └── 📄 MeetingModel.js          # 📹 Video meeting schema
│   ├── 📁 routes/                      # 🛣️ API Route Definitions
│   │   ├── 📄 authRoutes.js            # 🔐 Authentication endpoints
│   │   ├── 📄 postRoutes.js            # 📝 Post CRUD endpoints
│   │   ├── 📄 communityRoutes.js       # 👥 Community endpoints
│   │   ├── 📄 chatRoutes.js            # 💬 Chat endpoints
│   │   └── 📄 aiRoutes.js              # 🤖 AI screening endpoints
│   ├── 📁 socket/                      # 📡 Real-time Communication
│   │   ├── 📄 socketHandler.js         # 🔄 Socket event handling
│   │   ├── 📄 chatSocket.js            # 💬 Chat events
│   │   └── 📄 notificationSocket.js    # 🔔 Notification events
│   ├── 📁 helpers/                     # 🛠️ Server Utilities
│   │   ├── 📄 aiHelper.js              # 🤖 AI integration helper
│   │   ├── 📄 uploadHelper.js          # 📤 File upload handler
│   │   └── 📄 validationHelper.js      # ✅ Input validation
│   ├── 📁 db/                          # 🗄️ Database Configuration
│   │   └── 📄 connection.js            # 🔗 MongoDB connection
│   ├── 📄 index.js                     # 🎯 Server entry point
│   ├── 📄 cron.js                      # ⏰ Scheduled tasks
│   ├── 📄 service-account-key.json     # 🔑 GCP credentials
│   └── 📄 package.json                 # 📦 Backend dependencies
├── 📁 ai-training/                     # 🤖 AI Model Training
│   ├── 📄 HateSpeechDataset1.csv       # 📊 Training dataset
│   ├── 📄 HateSpeechDataset1.jsonl     # 📄 JSONL format data
│   ├── 📄 sample fine tune data.jsonl  # 🎯 Fine-tuning samples
│   └── 📄 csvtojsonlconverter.py       # 🔄 Data converter script
├── 📄 .gitignore                       # 🚫 Git ignore rules
└── 📄 README.md                        # 📖 Project documentation
```

---

## 🛠️ **Technology Stack**

### 🎨 **Frontend Technologies**
| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) | **18.3.1** | UI Library | [docs](https://react.dev/) |
| ![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E) | **5.4.1** | Build Tool | [docs](https://vitejs.dev/) |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | **3.4.17** | CSS Framework | [docs](https://tailwindcss.com/) |
| ![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0EF8?style=flat&logo=daisyui&logoColor=white) | **4.12.22** | UI Components | [docs](https://daisyui.com/) |
| ![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-593D88?style=flat&logo=redux&logoColor=white) | **2.2.7** | State Management | [docs](https://redux-toolkit.js.org/) |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white) | **12.23.6** | Animation Library | [docs](https://www.framer.com/motion/) |
| ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white) | **4.7.5** | Real-time Client | [docs](https://socket.io/) |

### 🚀 **Backend Technologies**
| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) | **Latest** | Runtime Environment | [docs](https://nodejs.org/) |
| ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express) | **4.19.2** | Web Framework | [docs](https://expressjs.com/) |
| ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) | **Latest** | NoSQL Database | [docs](https://www.mongodb.com/) |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat&logo=mongoose&logoColor=white) | **8.6.1** | ODM Library | [docs](https://mongoosejs.com/) |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=JSON%20web%20tokens&logoColor=white) | **9.0.2** | Authentication | [docs](https://jwt.io/) |
| ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socket.io&logoColor=white) | **4.7.5** | Real-time Server | [docs](https://socket.io/) |
| ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white) | **Latest** | Media Storage & CDN | [docs](https://cloudinary.com/) |

### 🤖 **AI & Cloud Technologies**
| Technology | Purpose | Integration |
|------------|---------|-------------|
| **Google Cloud Vertex AI** | Fine-tuned Hate Speech Detection | Custom model training & inference |
| **NSFW.js** | NSFW Content Detection | Client-side image filtering |
| **Google Generative AI** | Content Analysis & Moderation | Smart content understanding |
| **ZegoCloud** | Video Conferencing | Real-time video/audio communication |
| **Cloudinary** | Media Storage & Processing | Image/video upload, optimization & CDN |

### 🛠️ **Development Tools**
- **![Nodemon](https://img.shields.io/badge/Nodemon-76D04B?style=flat&logo=nodemon&logoColor=white)** - Development server with auto-restart
- **![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=flat&logo=eslint&logoColor=white)** - Code linting and quality
- **![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=flat&logo=postcss&logoColor=white)** - CSS processing
- **![Cron](https://img.shields.io/badge/Cron-4B3263?style=flat&logo=cron&logoColor=white)** - Task scheduling

---

## 🔄 **Application Flow**

```
🌐 User Opens Application
            │
            ▼
    ┌───────────────────┐
    │ 🔐 Authentication │
    │     Check         │
    └─────────┬─────────┘
              │
        ┌─────▼─────┐
        │    No     │
        ▼           ▼
📝 Login/Register   🏠 Home Feed
       Page              │
        │           ┌─────┼─────┬─────┐
        ▼           │     │     │     │
🛡️ JWT Auth         │     │     │     │
Validation         ▼     ▼     ▼     ▼
        │      📝 Create 👥 Join 💬 Chat 📹 Video
        ▼      Post    Community     Call
🍪 Token Storage    │     │     │     │
        │           ▼     ▼     ▼     ▼
        └────────► 🤖 AI Content 📡 Socket.io
                  Screening    Events
                      │         │
                      ▼         ▼
               ┌─────────────────────┐
               │  Content Analysis   │
               ├─────────┬───────────┤
               │         │           │
               ▼         ▼           ▼
          🔍 Hate    🚫 NSFW    ✅ Safe
          Speech    Content    Content
          Model       Filter      │
               │         │        ▼
               ▼         ▼   🗄️ MongoDB
          ❌ Block   ❌ Block   Storage
          Content   Content       │
               │         │        ▼
               └─────────┼──► 📤 Real-time
                         │    Updates
                         ▼
                    🔔 User
                   Notification
```

---

## 🚀 **Installation & Setup Guide**

### 📋 **Prerequisites**

| Requirement | Minimum Version | Download Link |
|-------------|-----------------|---------------|
| **Node.js** | v16+ | [Download](https://nodejs.org/) |
| **npm** | v8+ | Included with Node.js |
| **MongoDB** | v5+ | [Download](https://www.mongodb.com/try/download/community) |
| **Git** | Latest | [Download](https://git-scm.com/downloads) |
| **GCP Account** | - | [Google Cloud](https://cloud.google.com/) |

### 🔧 **Step-by-Step Installation**

#### **1️⃣ Repository Setup**
```bash
# Clone the repository
git clone https://github.com/M-hell/social-media-app.git
cd ai-screened-social-media

# Verify project structure
dir  # Windows PowerShell
```

#### **2️⃣ Backend Setup**
```powershell
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Verify packages
npm list --depth=0
```

#### **3️⃣ Frontend Setup**
```powershell
# Navigate to client directory
cd ../client

# Install frontend dependencies
npm install

# Return to root directory
cd ..
```

#### **4️⃣ Environment Configuration**

**Backend Environment** (`server/.env`):
```env
# 🗄️ Database Configuration
MONGODB_URI=mongodb://localhost:27017/social-media-ai
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/social-media-ai

# 🔐 Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# 🚀 Server Configuration  
PORT=5000
NODE_ENV=development

# 🤖 AI Services
GOOGLE_AI_API_KEY=your-google-ai-api-key
GCP_PROJECT_ID=your-gcp-project-id
GCP_VERTEX_AI_LOCATION=us-central1

# 📹 Video Conferencing
ZEGO_APP_ID=your-zego-app-id
ZEGO_SERVER_SECRET=your-zego-server-secret

# 📤 File Upload
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

**Frontend Environment** (`client/.env`):
```env
# 🔗 API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# 📹 Video Services
VITE_ZEGO_APP_ID=your-zego-app-id
VITE_ZEGO_SERVER_SECRET=your-zego-server-secret

# 🤖 Client-side AI
VITE_NSFW_MODEL_URL=https://cdn.jsdelivr.net/npm/nsfwjs@2.4.2/dist/
```

#### **5️⃣ GCP Vertex AI Setup**
```powershell
# Install Google Cloud CLI
# Download from: https://cloud.google.com/sdk/docs/install

# Authenticate with GCP
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com

# Create service account
gcloud iam service-accounts create social-media-ai

# Download service account key
gcloud iam service-accounts keys create service-account-key.json \
    --iam-account=social-media-ai@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

---

## ▶️ **Running the Application**

### 🔧 **Development Mode**

**Option 1: Separate Terminals**
```powershell
# Terminal 1: Backend Server
cd server
npm run dev

# Terminal 2: Frontend Development Server  
cd client
npm run dev
```

**Option 2: Concurrent Execution**
```powershell
# Install concurrently globally
npm install -g concurrently

# From root directory
concurrently "cd server && npm run dev" "cd client && npm run dev"
```

### 🌐 **Access Points**
| Service | URL | Purpose |
|---------|-----|---------|
| **🚀 Live Demo** | [social-media-app-rfuc.onrender.com](https://social-media-app-rfuc.onrender.com/) | **Production Application** |
| **Frontend App** | http://localhost:5173 | Main user interface (Development) |
| **Backend API** | http://localhost:5000 | Server endpoints (Development) |
| **Socket.io** | ws://localhost:5000 | Real-time communication (Development) |

### 📦 **Production Build**
```powershell
# Build entire application
cd server
npm run build

# Start production server
npm start
```

---

## 🎯 **Feature Walkthrough**

### 🔐 **User Authentication**
- 🆕 **Registration**: Create account with email verification
- 🔑 **Login**: Secure JWT-based authentication
- 👤 **Profile Management**: Update personal information and avatar
- 🔒 **Session Persistence**: Stay logged in across browser sessions

### 📝 **Content Creation & Moderation**
- ✍️ **Post Creation**: Rich text editor with media upload
- 🤖 **AI Screening**: Automatic hate speech and NSFW detection
- 📊 **Confidence Scoring**: Smart content filtering with thresholds
- 🔄 **Review Queue**: Manual moderation for borderline content

### 👥 **Community Features**
- 🏗️ **Community Creation**: Build topic-specific communities
- 👑 **Role Management**: Admin, moderator, and member roles
- 📊 **Community Analytics**: Member growth and engagement metrics
- 🎯 **Content Filtering**: Community-specific moderation rules

### 💬 **Real-time Communication**
- 💬 **Instant Messaging**: Direct user-to-user chat
- 👥 **Group Conversations**: Multi-user chat rooms
- 📹 **Video Calls**: High-quality video conferencing with ZegoCloud
- 🔔 **Live Notifications**: Real-time updates for all interactions

### 📱 **Mobile Experience**
- 📱 **Responsive Design**: Perfect on mobile, tablet, and desktop
- 🌓 **Theme Support**: Dark and light mode preferences
- ⚡ **PWA Features**: Offline capability and app-like experience
- 🔄 **Infinite Scroll**: Seamless content browsing

---

## 📊 **API Endpoints**

### 🔐 **Authentication Endpoints**
```javascript
POST   /api/auth/register     // User registration
POST   /api/auth/login        // User login  
POST   /api/auth/logout       // User logout
GET    /api/auth/me           // Get current user
PUT    /api/auth/profile      // Update user profile
```

### 📝 **Post Management**
```javascript
GET    /api/posts             // Get all posts (with pagination)
POST   /api/posts             // Create new post (with AI screening)
GET    /api/posts/:id         // Get single post
PUT    /api/posts/:id         // Update post
DELETE /api/posts/:id         // Delete post
POST   /api/posts/:id/like    // Like/unlike post
```

### 💬 **Comment System**
```javascript
GET    /api/posts/:id/comments    // Get post comments
POST   /api/posts/:id/comments    // Add comment (with AI screening)
PUT    /api/comments/:id          // Update comment
DELETE /api/comments/:id          // Delete comment
POST   /api/comments/:id/like     // Like/unlike comment
```

### 👥 **Community Management**
```javascript
GET    /api/communities           // Get all communities
POST   /api/communities           // Create community
GET    /api/communities/:id       // Get community details
PUT    /api/communities/:id       // Update community
DELETE /api/communities/:id       // Delete community
POST   /api/communities/:id/join  // Join community
POST   /api/communities/:id/leave // Leave community
```

### 💬 **Chat & Video**
```javascript
GET    /api/conversations         // Get user conversations
POST   /api/conversations         // Start new conversation
GET    /api/conversations/:id     // Get conversation messages
POST   /api/conversations/:id/messages // Send message
POST   /api/meetings              // Create video meeting
GET    /api/meetings/:id          // Get meeting details
```

### 🤖 **AI Content Screening**
```javascript
POST   /api/ai/screen-text        // Screen text for hate speech
POST   /api/ai/screen-image       // Screen image for NSFW content
GET    /api/ai/moderation-stats   // Get moderation statistics
```

---

## 🔒 **Security & Privacy**

### 🛡️ **Security Measures**
- **🔐 JWT Authentication**: Secure token-based auth with refresh tokens
- **🍪 HTTP-Only Cookies**: Secure cookie storage for sensitive data
- **🛡️ Input Validation**: Comprehensive request validation and sanitization
- **🚫 Rate Limiting**: API rate limiting to prevent abuse
- **🔒 CORS Protection**: Configured CORS for secure cross-origin requests
- **🔑 Environment Secrets**: All sensitive data stored in environment variables

### 🤖 **AI Safety Features**
- **📊 Confidence Thresholds**: Multi-level content filtering (Block/Review/Allow)
- **🔄 Continuous Learning**: Model improvement through user feedback
- **👤 Human Oversight**: Manual review queue for borderline content
- **📈 Analytics Dashboard**: Moderation statistics and trends
- **⚠️ Appeal System**: User appeals for incorrectly flagged content

### 🔍 **Privacy Protection**
- **📊 Data Minimization**: Collect only necessary user data
- **🔒 Encryption**: All sensitive data encrypted at rest and in transit
- **🗑️ Data Deletion**: Complete user data removal on account deletion
- **📋 Transparency**: Clear privacy policy and data usage guidelines

---

## 🚀 **Deployment Guide**

### ☁️ **Recommended: Render Deployment**

**Backend Deployment:**
```bash
# Connect your GitHub repository to Render
# Set environment variables in Render dashboard
# Deploy automatically on push to main branch

# Build Command:
npm install

# Start Command:
npm start
```

**Frontend Deployment:**
```bash
# Build Command:
npm install && npm run build

# Publish Directory:
dist
```

### 🐳 **Docker Deployment**

**Dockerfile (Backend):**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/social-media-ai
    depends_on:
      - mongo
  
  frontend:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - backend
      
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
```

---

## 🤝 **Contributing Guidelines**

### 📋 **How to Contribute**

1. **🍴 Fork the Repository**: [Fork on GitHub](https://github.com/M-hell/social-media-app/fork)
2. **🌟 Create Feature Branch**: `git checkout -b feature/amazing-feature`  
3. **💻 Make Changes**: Follow coding standards and best practices
4. **🧪 Test Changes**: Ensure all tests pass and features work correctly
5. **📝 Commit Changes**: `git commit -m 'feat: add amazing feature'`
6. **🚀 Push Branch**: `git push origin feature/amazing-feature`
7. **🔄 Create Pull Request**: Submit PR with detailed description

### 📏 **Development Standards**
- **📋 ESLint Configuration**: Follow project linting rules
- **📝 Commit Messages**: Use conventional commit format
- **🧪 Test Coverage**: Add tests for new features  
- **📚 Documentation**: Update README for significant changes
- **🔍 Code Review**: All PRs require review approval

### 🐛 **Bug Reports & Feature Requests**
- **🐛 Bug Reports**: Use GitHub Issues with bug template
- **✨ Feature Requests**: Submit enhancement proposals
- **📚 Documentation**: Help improve documentation
- **🌍 Translations**: Contribute to internationalization

---

## 📊 **Dataset & AI Training**

### 📄 **Hate Speech Dataset**
- **Source**: [Kaggle Hate Speech Detection Dataset](https://www.kaggle.com/datasets/waalbannyantudre/hate-speech-detection-curated-dataset/data)
- **Size**: 50,000+ labeled samples
- **Categories**: Hate Speech, Offensive Language, Clean Text
- **Format**: CSV converted to JSONL for fine-tuning

### 🤖 **Model Training Process**
```
1. 📊 Data Preprocessing
   ├── Text normalization
   ├── Label encoding
   └── Train/test split (80/20)

2. ☁️ GCP Vertex AI Setup
   ├── Custom training job
   ├── Hyperparameter tuning
   └── Model validation

3. 🚀 Model Deployment
   ├── Endpoint creation
   ├── API integration
   └── Performance monitoring
```

---

## 📞 **Support & Contact**

### 💬 **Get Help**
- 📧 **Email**: support@social-media-ai.com
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/M-hell/social-media-app/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/M-hell/social-media-app/discussions)
- 📚 **Documentation**: [Project Wiki](https://github.com/M-hell/social-media-app/wiki)

### 🌐 **Community**
- 💬 **Discord**: [Join our community](https://discord.gg/social-media-ai)
- 🐦 **Twitter**: [@SocialMediaAI](https://twitter.com/socialmedia-ai)
- 📱 **LinkedIn**: [Company Page](https://linkedin.com/company/social-media-ai)

---

## 📄 **License & Legal**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### 📋 **License Summary**
- ✅ **Commercial Use** - Use in commercial projects
- ✅ **Modification** - Modify and distribute  
- ✅ **Distribution** - Distribute copies
- ✅ **Private Use** - Use privately
- ❗ **License Notice** - Include license in distributions

---

## 🙏 **Acknowledgments**

### 🎉 **Special Thanks**
- **☁️ Google Cloud Platform** - Vertex AI fine-tuning capabilities
- **⚛️ React Team** - Amazing frontend library ecosystem  
- **🍃 MongoDB Team** - Flexible and scalable database solution
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **📡 Socket.io** - Real-time communication library
- **📹 ZegoCloud** - Video conferencing infrastructure
- **🤖 NSFW.js** - Client-side content filtering

### 🌟 **Open Source Community**
All third-party libraries and their respective maintainers who made this project possible.

---

<div align="center">

## 🚀 **Ready to Build Safer Online Communities?**

### **Built with ❤️ using Modern AI & Web Technologies**

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/)

---

### **🛡️ The future of social media with AI-powered safety and intelligent content moderation**

**⭐ Star this repository if you found it helpful!**

</div>
```

---

## 🤖 **AI Content Moderation System**

### 🎯 **Hate Speech Detection Model**

```
📊 Training Data Pipeline
          │
          ▼
┌─────────────────────────┐
│  📄 Dataset Collection  │
│  • Hate Speech Dataset │
│  • 50K+ labeled samples│
│  • Multi-category tags │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   🔄 Data Processing    │
│  • CSV to JSONL        │
│  • Text normalization  │
│  • Label encoding      │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  ☁️ GCP Vertex AI       │
│  • Fine-tuning Setup   │
│  • Custom Model Train  │
│  • Validation Testing  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   🚀 Model Deployment   │
│  • API Integration     │
│  • Real-time Inference │
│  • Confidence Scoring  │
└─────────────────────────┘

Detection Categories:
├── 💢 Hate Speech    (High Priority)
├── 🚫 Toxic Content  (Medium Priority)
├── 🎯 Harassment     (High Priority)
├── 🌍 Discrimination (High Priority)
└── ⚠️ Spam Content   (Low Priority)

Confidence Thresholds:
├── 🔴 Block (≥90%)   - Immediate removal
├── 🟡 Review (70-89%) - Manual review queue
└── 🟢 Allow (<70%)   - Published with monitoring
```

### 🔍 **NSFW Content Filtering**

```
📸 Media Upload
      │
      ▼
┌─────────────────────┐
│  🖼️ Image/Video     │
│  Processing         │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  🧠 NSFW.js Model   │
│  Analysis           │
└─────────┬───────────┘
          │
    ┌─────▼─────┐
    │ Safe? │
    └─────┬─────┘
          │
    ┌─────▼─────┐
    │    No     │
    ▼           ▼
❌ Block       ✅ Allow
Content      Publishing
    │             │
    ▼             ▼
🔔 Notify    📤 Upload to
User         Storage
```