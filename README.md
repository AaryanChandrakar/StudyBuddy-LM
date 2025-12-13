# ThinkLM

<div align="center">

**Chat with Your Documents & Data**

_Transform your documents into an intelligent, searchable knowledge base powered by advanced AI_

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-green.svg)](https://expressjs.com/)

[Live Demo](https://thinklm.milindsahu.com/) • [Report Bug](https://github.com/milindkusahu/ThinkLM/issues) • [Request Feature](https://milindsahu.com/#contact)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

ThinkLM is a powerful AI-powered document analysis and chat platform that transforms your documents, websites, and multimedia content into an intelligent, searchable knowledge base. Built with modern web technologies and advanced AI capabilities, ThinkLM enables users to upload various content types and interact with them through natural language queries.

### Key Capabilities

- **Multi-Source Data Ingestion**: Support for PDFs, websites, YouTube videos, and text input
- **Advanced AI Processing**: Powered by OpenAI's GPT-4.1 and text-embedding-3-large models
- **Semantic Search**: Vector-based similarity search using Qdrant vector database
- **Intelligent Chat Interface**: Natural language queries with source citations
- **Organized Workspace**: Notebook-based organization system
- **Real-time Processing**: Lightning-fast document processing and response generation

---

## Features

### Core Features

- **Multiple Data Sources**

  - PDF document upload and processing
  - Website content extraction and analysis
  - YouTube video transcription and analysis
  - Direct text input and processing
  - Support for multiple content formats (PDFs, text files, markdown, web pages, YouTube videos)

- **AI-Powered Chat Interface**

  - Natural language question answering
  - Source citation and reference tracking
  - Context-aware responses
  - Multi-document query capabilities

- **Advanced Search Capabilities**

  - Semantic vector search
  - Cross-document information retrieval
  - Relevance scoring and ranking
  - Intelligent content matching

- **Organized Workspace**

  - Unlimited notebook creation
  - Project-based content organization
  - User-specific content isolation
  - Hierarchical content management

- **Security & Privacy**

  - User authentication and authorization
  - Encrypted data storage
  - Private content isolation
  - Secure API endpoints

- **Usage Tracking & Analytics**
  - Credit-based usage system (1 credit ≈ 1,000 tokens)
  - Real-time usage statistics and monitoring
  - Performance metrics and efficiency insights
  - Account activity monitoring and logs
  - Personalized usage recommendations and tips
  - Credit consumption tracking per query

### Technical Features

- **Modern Architecture**

  - RESTful API design
  - Microservices-ready structure
  - Scalable database design
  - Real-time processing capabilities

- **Performance Optimizations**
  - Efficient document chunking
  - Optimized vector embeddings
  - Caching mechanisms
  - Background processing

---

## Screenshots

### Landing Page

![Landing Page](https://github.com/milindkusahu/ThinkLM/blob/main/images/landing-page.png?raw=true)

_Modern, responsive landing page featuring the hero section with gradient backgrounds and animated elements_

### Dashboard

![Dashboard](https://github.com/milindkusahu/ThinkLM/blob/main/images/dashboard.png?raw=true)

_Clean dashboard interface showing user notebooks, recent activity, and quick access to features_

### Statistics Page

![Statistics](https://github.com/milindkusahu/ThinkLM/blob/main/images/statistics.png?raw=true)

_Comprehensive statistics page showing credit usage, data sources, performance metrics, and account activity_

### Notebook Interface

![Notebook](https://github.com/milindkusahu/ThinkLM/blob/main/images/notebook.png?raw=true)

_Interactive notebook interface with chat panel, document sources, and content management tools_

### Chat Interface

![Chat Interface](https://github.com/milindkusahu/ThinkLM/blob/main/images/chat-interface.png?raw=true)

_AI-powered chat interface displaying intelligent responses with source citations and references_

### Document Upload

![Document Upload](https://github.com/milindkusahu/ThinkLM/blob/main/images/document-upload.png?raw=true)

_Multi-source document upload interface supporting PDFs, URLs, YouTube videos, and text input_

### Authentication

![Authentication](https://github.com/milindkusahu/ThinkLM/blob/main/images/authentication.png?raw=true)

_Secure authentication system with login, registration, and password recovery functionality_

---

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (React)       │◄──►│   (Express)     │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • React Router  │    │ • REST API      │    │ • OpenAI API    │
│ • Zustand Store │    │ • JWT Auth      │    │ • Qdrant DB     │
│ • Tailwind CSS  │    │ • LangChain     │    │ • MongoDB       │
│ • Vite Build    │    │ • File Upload   │    │ • Email Service │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Backend Architecture

```
src/
├── app.js                 # Main application entry point
├── controller/            # Request handlers
│   ├── chat.controller.js
│   ├── content.controller.js
│   ├── notebook.controller.js
│   └── user.controller.js
├── middleware/            # Custom middleware
│   ├── auth.middleware.js    # JWT authentication
│   └── upload.middleware.js  # File upload handling
├── model/                 # Database models
│   ├── Content.model.js
│   ├── Notebook.model.js
│   └── User.model.js
├── routes/                # API routes
│   ├── chat.routes.js
│   ├── content.routes.js
│   ├── notebook.routes.js
│   └── user.routes.js
├── services/              # Business logic
│   ├── chat.service.js
│   ├── document.processor.service.js
│   ├── embeddings.service.js
│   ├── qdrant.service.js
│   └── web.service.js
└── utils/                 # Utility functions
    └── db.js
```

### Frontend Architecture

```
src/
├── App.jsx                # Main application component
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── landing/           # Landing page components
│   ├── layout/            # Layout components
│   ├── notebook/          # Notebook-specific components
│   └── ui/                # UI component library
├── pages/                 # Page components
│   ├── auth/              # Authentication pages
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── VerifyPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   └── ResetPasswordPage.jsx
│   ├── DashboardPage.jsx
│   ├── NotebookPage.jsx
│   ├── ProfilePage.jsx
│   └── StatsPage.jsx
├── stores/                # State management
│   ├── authStore.js
│   ├── chatStore.js
│   └── notebookStore.js
└── lib/                   # Utility libraries
    └── utils.js
```

### Frontend Routes

- **`/`** - Landing page with features and pricing
- **`/login`** - User login page
- **`/register`** - User registration page
- **`/verify/:token`** - Email verification page
- **`/forgot-password`** - Password reset request page
- **`/reset-password/:token`** - Password reset page
- **`/app/dashboard`** - User dashboard (protected)
- **`/app/notebook/:id`** - Notebook interface (protected)
- **`/app/profile`** - User profile page (protected)
- **`/app/stats`** - Usage statistics page (protected)

---

## Application Flow

### System Interaction Overview

ThinkLM follows a sophisticated multi-layered architecture where each component plays a crucial role in the document processing and AI-powered chat experience.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                USER INTERFACE                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Landing   │  │   Auth      │  │  Dashboard  │  │  Notebook   │             │
│  │    Page     │  │   Pages     │  │    Page     │  │   Interface │             │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   React     │  │   Zustand   │  │   Axios     │  │   Router    │             │
│  │ Components  │  │   Store     │  │   Client    │  │   Handler   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Express   │  │   CORS      │  │   JWT       │  │   Multer    │             │
│  │   Server    │  │   Handler   │  │   Auth      │  │   Upload    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            BUSINESS LOGIC LAYER                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   User      │  │  Notebook   │  │  Content    │  │    Chat     │             │
│  │ Controller  │  │ Controller  │  │ Controller  │  │ Controller  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SERVICE LAYER                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Document    │  │ Embeddings  │  │   Qdrant    │  │    Web      │             │
│  │ Processor   │  │  Service    │  │  Service    │  │  Service    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   MongoDB   │  │   Qdrant    │  │   OpenAI    │  │   Email     │             │
│  │  Database   │  │   Vector    │  │    API      │  │  Service    │             │
│  │             │  │   Database  │  │             │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Application Flow

#### 1. **User Authentication Flow**

```
User Registration/Login
         │
         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Backend       │───▶│   MongoDB       │
│   Auth Form     │    │   Auth Route    │    │   User Model    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   JWT Token     │◀───│   JWT Sign      │◀───│   User Created  │
│   Storage       │    │   & Hash        │    │   & Verified    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### 2. **Document Upload & Processing Flow**

```
Document Upload
         │
         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Backend       │───▶│   File Storage  │
│   Upload UI     │    │   Multer        │    │   (Local/Cloud) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Progress      │◀───│   Document      │───▶│   Text          │
│   Indicator     │    │   Processor     │    │   Extraction    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Text          │───▶│   OpenAI        │
                       │   Chunking      │    │   Embeddings    │
                       └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Vector        │◀───│   Embeddings    │
                       │   Storage       │    │   Generation    │
                       │   (Qdrant)      │    │                 │
                       └─────────────────┘    └─────────────────┘
```

#### 3. **Chat Query Processing Flow**

```
User Query
         │
         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Backend       │───▶│   Qdrant        │
│   Chat Input    │    │   Chat Route    │    │   Vector Search │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Loading       │◀───│   Similarity    │───▶│   Relevant      │
│   State         │    │   Search        │    │   Documents     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Context       │───▶│   OpenAI        │
                       │   Assembly      │    │   GPT-4.1       │
                       └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   AI Response   │◀───│   Response      │
                       │   with Sources  │    │   Generation    │
                       └─────────────────┘    └─────────────────┘
```

#### 4. **Multi-Source Content Integration Flow**

```
Content Sources
         │
         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PDF Files     │    │   Web URLs      │    │   YouTube       │
│   Upload        │    │   Scraping      │    │   Videos        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PDF-Parse     │    │   Cheerio       │    │   YouTube       │
│   Processing    │    │   Web Scraping  │    │   Transcript    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
                       ┌─────────────────┐
                       │   Unified       │
                       │   Text          │
                       │   Processing    │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Vector        │
                       │   Embeddings    │
                       │   & Storage     │
                       └─────────────────┘
```

#### 5. **Credit System & Usage Tracking Flow**

```
User Action
         │
         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Backend       │───▶│   Credit        │
│   Action        │    │   Service       │    │   Calculation   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Usage         │◀───│   Token         │───▶│   MongoDB       │
│   Update        │    │   Estimation    │    │   User Stats    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Real-time     │    │   Usage         │    │   Analytics     │
│   Statistics    │    │   Tracking      │    │   & Reports     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Interaction Details

#### **Frontend to Backend Communication**

1. **Authentication Flow**

   - User submits login/register form
   - Frontend sends credentials via Axios
   - Backend validates and returns JWT token
   - Frontend stores token in Zustand store
   - All subsequent requests include JWT in headers

2. **Document Upload Flow**

   - User selects file via React Dropzone
   - Frontend sends multipart form data via Axios
   - Backend processes file with Multer middleware
   - Real-time progress updates via WebSocket (if implemented)

3. **Chat Interaction Flow**
   - User types query in chat interface
   - Frontend sends query with selected content IDs
   - Backend processes query through LangChain
   - Response streamed back to frontend
   - Chat history stored in Zustand store

#### **Backend Service Interactions**

1. **Document Processing Pipeline**

   ```
   File Upload → Text Extraction → Chunking → Embedding → Vector Storage
   ```

2. **Query Processing Pipeline**

   ```
   User Query → Vector Search → Context Retrieval → AI Generation → Response
   ```

3. **Database Operations**
   - **MongoDB**: User data, notebooks, content metadata
   - **Qdrant**: Vector embeddings for semantic search
   - **File System**: Uploaded documents storage

#### **External Service Integration**

1. **OpenAI API Integration**

   - **Embeddings**: text-embedding-3-large for vector generation
   - **Chat**: GPT-4.1 for response generation
   - **Rate Limiting**: Implemented to manage API costs

2. **Email Service Integration**

   - **Nodemailer**: User verification and password reset
   - **SMTP Configuration**: Mailtrap for development

3. **Vector Database Integration**
   - **Qdrant**: High-performance vector similarity search
   - **Collection Management**: Per-content collections for isolation

### Error Handling & Recovery

```
Error Occurrence
         │
         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Backend       │───▶│   Error         │
│   Error         │    │   Error         │    │   Logging       │
│   Boundary      │    │   Middleware    │    │   & Monitoring  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User          │    │   Graceful      │    │   Error         │
│   Notification  │    │   Degradation   │    │   Recovery      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Performance Optimization Flow

1. **Caching Strategy**

   - Frontend: Zustand store for state management
   - Backend: Response caching for frequent queries
   - Database: Indexed queries for fast retrieval

2. **Lazy Loading**

   - Component-based code splitting
   - Dynamic imports for heavy components
   - Progressive image loading

3. **Background Processing**
   - Document processing in background
   - Vector embedding generation
   - Email sending queue

This comprehensive flow ensures that ThinkLM provides a seamless, efficient, and scalable document analysis and chat experience.

---

## Technology Stack

### Backend Technologies

| Technology                   | Version | Purpose                          |
| ---------------------------- | ------- | -------------------------------- |
| **Node.js**                  | 18+     | Runtime environment              |
| **Express.js**               | 5.1.0   | Web framework                    |
| **MongoDB**                  | Latest  | Primary database                 |
| **Mongoose**                 | 8.17.2  | ODM for MongoDB                  |
| **LangChain**                | 0.3.31  | AI/ML framework                  |
| **OpenAI**                   | Latest  | AI model integration             |
| **Qdrant**                   | Latest  | Vector database                  |
| **JWT**                      | 9.0.2   | Authentication                   |
| **Multer**                   | 2.0.2   | File upload handling             |
| **Cheerio**                  | 1.1.2   | Web scraping and HTML parsing    |
| **PDF-Parse**                | 1.1.1   | PDF document processing          |
| **YouTube-Transcript**       | 1.2.1   | YouTube video transcription      |
| **YouTubei.js**              | 15.0.1  | YouTube API integration          |
| **Nodemailer**               | 7.0.5   | Email services                   |
| **Bcryptjs**                 | 3.0.2   | Password hashing                 |
| **Cookie Parser**            | 1.4.7   | Cookie handling                  |
| **CORS**                     | 2.8.5   | Cross-origin resource sharing    |
| **Dotenv**                   | 17.2.1  | Environment variable management  |
| **Nodemon**                  | 3.1.10  | Development server auto-restart  |
| **LangChain Community**      | 0.3.53  | Community integrations           |
| **LangChain Core**           | 0.3.72  | Core LangChain functionality     |
| **LangChain OpenAI**         | 0.6.9   | OpenAI integration for LangChain |
| **LangChain Qdrant**         | 0.1.3   | Qdrant integration for LangChain |
| **LangChain Text Splitters** | 0.1.0   | Text chunking utilities          |
| **LangChain**                | 0.3.31  | Main LangChain framework         |
| **Express**                  | 5.1.0   | Web application framework        |
| **MongoDB**                  | Latest  | NoSQL database                   |
| **Qdrant**                   | Latest  | Vector database for embeddings   |
| **OpenAI**                   | Latest  | AI model integration             |
| **JWT**                      | 9.0.2   | JSON Web Token authentication    |
| **Multer**                   | 2.0.2   | File upload middleware           |
| **Cheerio**                  | 1.1.2   | HTML parsing and web scraping    |
| **PDF-Parse**                | 1.1.1   | PDF document processing          |
| **YouTube-Transcript**       | 1.2.1   | YouTube video transcription      |

### Frontend Technologies

| Technology                      | Version | Purpose                           |
| ------------------------------- | ------- | --------------------------------- |
| **React**                       | 19.1.1  | UI framework                      |
| **Vite**                        | 7.1.2   | Build tool                        |
| **Tailwind CSS**                | 4.1.12  | Styling framework                 |
| **React Router**                | 7.8.2   | Client-side routing               |
| **Zustand**                     | 5.0.8   | State management                  |
| **Axios**                       | 1.11.0  | HTTP client                       |
| **Radix UI**                    | Latest  | Component primitives              |
| **Lucide React**                | 0.541.0 | Icon library                      |
| **React Hook Form**             | 7.62.0  | Form handling                     |
| **React Dropzone**              | 14.3.8  | File upload UI                    |
| **Sonner**                      | 2.0.7   | Toast notifications               |
| **Next Themes**                 | 0.4.6   | Theme management                  |
| **Zod**                         | 4.1.1   | Schema validation                 |
| **Class Variance Authority**    | 0.7.1   | Component styling                 |
| **Tailwind Merge**              | 3.3.1   | Tailwind CSS utility merging      |
| **CLSX**                        | 2.1.1   | Conditional class names           |
| **Hookform Resolvers**          | 5.2.1   | Form validation resolvers         |
| **ESLint**                      | 9.33.0  | Code linting and formatting       |
| **Vite Plugin React**           | 5.0.0   | React plugin for Vite             |
| **TypeScript Types**            | Latest  | TypeScript type definitions       |
| **Tailwind Animate CSS**        | 1.3.7   | Animation utilities for Tailwind  |
| **Globals**                     | 16.3.0  | Global ESLint configuration       |
| **React Hooks ESLint Plugin**   | 5.2.0   | ESLint rules for React hooks      |
| **React Refresh ESLint Plugin** | 0.4.20  | ESLint rules for React refresh    |
| **ESLint JS**                   | 9.33.0  | ESLint JavaScript configuration   |
| **Tailwind CSS Vite**           | 4.1.12  | Tailwind CSS integration for Vite |
| **Vite**                        | 7.1.2   | Build tool and development server |
| **React**                       | 19.1.1  | UI framework                      |
| **React DOM**                   | 19.1.1  | React DOM rendering               |
| **React Router DOM**            | 7.8.2   | Client-side routing               |

### External Services

- **OpenAI API**: GPT-4.1 for chat, text-embedding-3-large for embeddings
- **Qdrant**: Vector database for semantic search
- **MongoDB Atlas**: Cloud database hosting
- **Email Service**: Nodemailer with SMTP configuration

### Credit System

ThinkLM uses a credit-based system to manage usage and costs:

- **1 Credit ≈ 1,000 tokens** processed
- **Document upload**: 2-10 credits (depending on size)
- **Chat query**: 1-3 credits (depending on complexity)
- **Unused credits roll over** to the next month
- **Real-time tracking** of credit consumption
- **Usage analytics** and efficiency recommendations

---

## Prerequisites

Before running ThinkLM, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for cloning the repository)

### Optional Prerequisites

- **Docker** (for containerized deployment)
- **Docker Compose** (for multi-service orchestration)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/milindkusahu/ThinkLM.git
cd ThinkLM
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit environment variables (see Environment Variables section)
nano .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit environment variables
nano .env
```

### 4. Database Setup

#### Option A: Local MongoDB

```bash
# Install MongoDB locally
# macOS (using Homebrew)
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Add the connection string to your `.env` file

### 5. Vector Database Setup

#### Using Docker (Recommended)

```bash
# From the backend directory
docker-compose up -d qdrant
```

#### Manual Installation

```bash
# Install Qdrant locally
# Follow instructions at: https://qdrant.tech/documentation/quick-start/
```

### 6. Start the Application

#### Development Mode

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

#### Production Mode

```bash
# Build frontend
cd frontend
npm run build

# Start backend
cd backend
npm start
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

---

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGO_URI=mongodb://localhost:27017/thinklm
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/thinklm

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRY=7d

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Qdrant Configuration
QDRANT_HOST=localhost
QDRANT_PORT=6333
QDRANT_API_KEY=your-qdrant-api-key-optional

# Email Configuration (for user verification)
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USERNAME=your-mailtrap-username
MAILTRAP_PASSWORD=your-mailtrap-password
MAILTRAP_SENDEREMAIL=noreply@thinklm.com

# Credit System Configuration
CHARACTERS_PER_TOKEN=4
TOKENS_PER_CREDIT=1000
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1

# Application Configuration
VITE_APP_NAME=ThinkLM
VITE_APP_VERSION=1.0.0
```

### Environment Variable Descriptions

| Variable               | Description                    | Required | Default   |
| ---------------------- | ------------------------------ | -------- | --------- |
| `PORT`                 | Backend server port            | No       | 3000      |
| `MONGO_URI`            | MongoDB connection string      | Yes      | -         |
| `JWT_SECRET`           | Secret key for JWT tokens      | Yes      | -         |
| `OPENAI_API_KEY`       | OpenAI API key for AI features | Yes      | -         |
| `QDRANT_HOST`          | Qdrant vector database host    | No       | localhost |
| `QDRANT_PORT`          | Qdrant vector database port    | No       | 6333      |
| `MAILTRAP_HOST`        | SMTP server host for emails    | Yes      | -         |
| `MAILTRAP_USERNAME`    | SMTP username                  | Yes      | -         |
| `MAILTRAP_PASSWORD`    | SMTP password                  | Yes      | -         |
| `CHARACTERS_PER_TOKEN` | Characters per token estimate  | No       | 4         |
| `TOKENS_PER_CREDIT`    | Tokens per credit conversion   | No       | 1000      |

---

## Usage

### Getting Started

1. **Create an Account**

   - Visit the application URL
   - Click "Get Started Free"
   - Complete the registration process
   - Verify your email address

2. **Create Your First Notebook**

   - Log in to your dashboard
   - Click "Create New Notebook"
   - Give your notebook a name and description
   - Click "Create Notebook"

3. **Add Content**

   - Open your notebook
   - Click "Add Content"
   - Choose your content type:
     - **Upload PDF**: Drag and drop or select PDF files
     - **Add Website**: Enter a URL to extract content
     - **YouTube Video**: Paste a YouTube URL for transcription
     - **Text Input**: Paste or type text directly

4. **Chat with Your Content**

   - Wait for content processing to complete
   - Use the chat interface to ask questions
   - Get intelligent answers with source citations

5. **Monitor Your Usage**
   - Visit the Statistics page to track your usage
   - Monitor credit consumption and data source limits
   - View performance metrics and get usage insights

### Advanced Features

#### Multi-Source Queries

- Select multiple content sources for comprehensive answers
- Cross-reference information across different documents
- Get aggregated insights from multiple sources

#### Content Organization

- Create multiple notebooks for different projects
- Organize content by topic, subject, or project
- Manage content permissions and sharing

#### Export and Sharing

- Export chat conversations
- Share notebooks with team members
- Generate reports from your content

#### Usage Analytics

- Track credit consumption in real-time
- Monitor data source usage and limits
- View performance metrics and efficiency scores
- Get personalized usage recommendations
- Access detailed account activity logs

---

## API Documentation

### Authentication

All API endpoints (except registration and login) require authentication via JWT tokens.

```bash
# Login to get token
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Use token in subsequent requests
curl -X GET http://localhost:3000/api/v1/notebooks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Core Endpoints

#### User Management

- `POST /api/v1/users/register` - User registration
- `GET /api/v1/users/verify/:token` - Verify user email
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/logout` - User logout
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/stats` - Get user statistics
- `POST /api/v1/users/forgot-password` - Request password reset
- `POST /api/v1/users/reset-password/:token` - Reset password with token
- `POST /api/v1/users/change-password` - Change password (authenticated)
- `DELETE /api/v1/users/delete-account` - Delete user account

#### Notebook Management

- `GET /api/v1/notebooks` - Get user notebooks
- `POST /api/v1/notebooks` - Create new notebook
- `GET /api/v1/notebooks/:id` - Get specific notebook
- `PUT /api/v1/notebooks/:id` - Update notebook
- `DELETE /api/v1/notebooks/:id` - Delete notebook

#### Content Management

- `POST /api/v1/content/upload` - Upload PDF file
- `POST /api/v1/content/text` - Add text content
- `POST /api/v1/content/url` - Add website content from URL
- `POST /api/v1/content/youtube` - Add YouTube video content
- `GET /api/v1/content/:id` - Get specific content details
- `PUT /api/v1/content/:id` - Update content (title only)
- `DELETE /api/v1/content/:id` - Delete content

#### Chat Interface

- `POST /api/v1/chat/query` - Send chat query

#### System Health

- `GET /api/health` - API health check

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Handling

Error responses include detailed information:

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

---

## Contributing

We welcome contributions to ThinkLM! Please follow these guidelines:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style

- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for functions
- Follow React best practices

### Pull Request Process

1. Update documentation for new features
2. Add or update tests as needed
3. Ensure the build passes
4. Request review from maintainers
5. Address any feedback promptly

---

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## Contact

**Milind Kumar Sahu** - [@milindkusahu](https://github.com/milindkusahu)

Project Link: [https://github.com/milindkusahu/ThinkLM](https://github.com/milindkusahu/ThinkLM)

---

<div align="center">

**Built with ❤️ using modern web technologies**

_Transform your documents into intelligent conversations_

</div>
