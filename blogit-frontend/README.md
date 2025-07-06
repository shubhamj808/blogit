# Blogit Frontend

A modern, responsive frontend for the Blogit social media platform built with React, Redux, and TailwindCSS.

## Features

### 1. Authentication
- Secure login and registration system
- JWT-based authentication
- Protected routes for authenticated users
- Persistent login state
- Password reset functionality

### 2. User Profile
- View and edit personal profile
- Profile picture upload
- Bio and personal information management
- View personal posts
- Track likes and comments on posts
- Follow/Unfollow other users
- View followers and following lists

### 3. Feed
- Infinite scrolling post feed
- View posts from followed users
- Like and comment on posts
- Rich text content support
- Image upload support
- Real-time updates

### 4. Post Management
- Create new posts
- Edit existing posts
- Delete posts
- Rich text editor
- Image upload support
- Post visibility settings
- Draft saving

### 5. Social Features
- Like posts and comments
- Comment on posts
- Reply to comments
- Follow/Unfollow users
- Share posts
- User mentions and notifications

### 6. Search
- Search for users
- Search for posts by content
- Search by hashtags
- Advanced filtering options

### 7. UI/UX Features
- Responsive design for all screen sizes
- Dark/Light mode toggle
- Loading states and animations
- Error handling and user feedback
- Toast notifications
- Infinite scrolling
- Skeleton loading states

## Tech Stack

- **React 18** - Frontend library
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - API communication
- **TailwindCSS** - Styling
- **Headless UI** - Accessible components
- **Heroicons** - Icons
- **Formik & Yup** - Form handling and validation
- **React Toastify** - Toast notifications
- **JWT Decode** - Token handling

## Getting Started

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/blogit-frontend.git
\`\`\`

2. Install dependencies:
\`\`\`bash
cd blogit-frontend
npm install
\`\`\`

3. Create a .env file:
\`\`\`env
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=5000
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## Project Structure

\`\`\`
src/
├── api/              # API integration
├── assets/           # Static assets
├── components/       # Reusable components
├── features/         # Feature-specific components
├── hooks/            # Custom hooks
├── layouts/          # Layout components
├── pages/            # Page components
├── redux/            # Redux store and slices
├── styles/           # Global styles
├── types/            # TypeScript types
└── utils/            # Utility functions
\`\`\`

## API Integration

The frontend communicates with three microservices:
- User Service (Authentication, Profile Management)
- Post Service (Post CRUD operations)
- Interaction Service (Likes, Comments)

All API requests are routed through NGINX for load balancing and security.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 