# OrbitX Website

A comprehensive space exploration organization website built with Next.js 14, featuring a public website and admin dashboard for managing content.

## 🚀 Features

### Public Website
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Space Theme**: Dark theme with animated stars and cosmic effects
- **Home Page**: Hero section with animated elements and preview cards
- **About Page**: Mission, vision, and organizational values
- **Teams Page**: Interactive team cards with detailed modals
- **Projects Page**: Searchable project gallery with detailed pages
- **Events Page**: Event listings with filtering and individual event pages
- **Members Page**: Team member directory with search and filtering
- **Contact Page**: Contact form with social media links
- **Blogs Page**: Blog posts with like and comment system

### Admin Dashboard
- **Secure Authentication**: Firebase Auth integration
- **Dashboard Overview**: Statistics and quick actions
- **Content Management**: CRUD operations for events, projects, members, and blogs
- **Member Management**: Badge system and participation tracking
- **Message Management**: View and manage contact form submissions
- **Real-time Updates**: Live data synchronization
- **Responsive Admin Panel**: Works on all devices

### Technical Features
- **Next.js 14**: App Router with server-side rendering
- **Firebase Integration**: Firestore database and authentication
- **Framer Motion**: Smooth animations and transitions
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Hook Form**: Form validation and handling
- **Hot Toast**: User-friendly notifications
- **Performance Optimized**: Caching system and image optimization

## 🛠️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/orbitx-website.git
   cd orbitx-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Firebase configuration in `.env.local`

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/orbitx-website)

## 📁 Project Structure

```
orbitx-website/
├── app/                    # Next.js 14 App Router
├── components/            # Reusable components
├── lib/                   # Utilities and configurations
├── public/                # Static assets
├── .env.example          # Environment variables template
├── vercel.json           # Vercel deployment config
└── DEPLOYMENT.md         # Deployment guide
```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore Database, Authentication, and Storage
3. Create collections: `events`, `projects`, `members`, `messages`, `blogs`
4. Add your domain to authorized domains

## 🎨 Features

- **Advanced Navbar**: Scroll effects, animations, and responsive design
- **Team Management**: Real member data with photos and badges
- **Like & Comment System**: Interactive engagement on posts
- **Member Portal**: Personal dashboard for members
- **Admin Controls**: Comprehensive content management
- **Performance Optimized**: Caching and image optimization

## 📱 Responsive Design

Optimized for all devices:
- Mobile (320px+)
- Tablet (768px+) 
- Desktop (1024px+)
- Large screens (1280px+)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ by the OrbitX Tech Team**
