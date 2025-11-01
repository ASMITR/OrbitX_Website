# OrbitX Website

A comprehensive space exploration organization website built with Next.js 14, featuring a public website and advanced admin dashboard for complete content management.

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
- **Merchandise Store**: Product catalog with shopping cart functionality

### Enhanced Admin Dashboard
- **Secure Authentication**: Firebase Auth with role-based access
- **3D Navigation**: Advanced horizontal navigation with dynamic animations
- **Dashboard Overview**: Real-time statistics and analytics
- **Content Management**: Full CRUD operations for all content types
- **Member Management**: Advanced badge system and participation tracking
- **Message Management**: Contact form submissions with status tracking
- **Merchandise Management**: Product inventory and order processing
- **Order Management**: Complete e-commerce order handling
- **Blog Management**: Rich text editor with media support
- **Settings Panel**: Comprehensive configuration management
- **Real-time Updates**: Live data synchronization across all modules
- **Responsive Design**: Optimized for all devices with mobile-first approach

### Technical Features
- **Next.js 14**: App Router with server-side rendering and static generation
- **Firebase Integration**: Firestore database, authentication, and storage
- **Framer Motion**: Advanced 3D animations and micro-interactions
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Utility-first styling with custom design system
- **React Hook Form**: Advanced form validation and handling
- **Hot Toast**: Real-time user notifications and feedback
- **Performance Optimized**: Advanced caching, lazy loading, and image optimization
- **PWA Ready**: Progressive Web App capabilities
- **SEO Optimized**: Meta tags, structured data, and sitemap generation

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
3. Create collections: `events`, `projects`, `members`, `messages`, `blogs`, `merchandise`, `orders`, `settings`
4. Add your domain to authorized domains
5. Configure Firebase security rules for admin access

### Admin Settings
The admin panel includes a comprehensive settings system:
- **Profile Management**: Admin profile customization
- **Site Configuration**: Contact info, social links, and branding
- **Notification Settings**: Email alerts and system notifications
- **Appearance Customization**: Theme colors and UI preferences
- **SEO Management**: Meta tags, keywords, and search optimization
- **Security Controls**: Password management and access controls
- **Maintenance Mode**: Site maintenance and backup tools
- **Database Monitoring**: Real-time database health and statistics

## 🎨 Advanced Features

### Animation & UX
- **3D Navigation**: Multi-axis rotations and dynamic hover effects
- **Micro-interactions**: Smooth transitions and feedback animations
- **Loading States**: Skeleton screens and progressive loading
- **Gesture Support**: Touch-friendly interactions for mobile devices

### Content Management
- **Rich Text Editor**: WYSIWYG editor for blogs and content
- **Media Management**: Image upload, optimization, and gallery
- **Bulk Operations**: Mass edit and delete functionality
- **Version Control**: Content history and rollback capabilities

### E-commerce Integration
- **Product Catalog**: Merchandise management with variants
- **Shopping Cart**: Persistent cart with local storage
- **Order Processing**: Complete order lifecycle management
- **Inventory Tracking**: Stock levels and availability monitoring

### Analytics & Monitoring
- **Real-time Analytics**: Live visitor and engagement metrics
- **Performance Monitoring**: Page load times and optimization insights
- **Error Tracking**: Automated error reporting and debugging
- **User Behavior**: Interaction patterns and usage statistics

## 📱 Responsive Design

Optimized for all devices with breakpoint-specific features:
- **Mobile (320px+)**: Touch-optimized navigation, swipe gestures
- **Tablet (768px+)**: Adaptive grid layouts, hover states
- **Desktop (1024px+)**: Full sidebar navigation, keyboard shortcuts
- **Large screens (1280px+)**: Enhanced spacing, multi-column layouts
- **Ultra-wide (1536px+)**: Optimized for large displays

## 🛡️ Security Features

- **Firebase Authentication**: Secure user management
- **Role-based Access**: Admin and member permission levels
- **Data Validation**: Server-side input sanitization
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API endpoint protection
- **Secure Headers**: XSS and clickjacking protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper TypeScript types
4. Test thoroughly across all breakpoints
5. Follow the existing code style and conventions
6. Update documentation if needed
7. Submit a pull request with detailed description

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing component structure
- Implement responsive design for all features
- Add proper error handling and loading states
- Write meaningful commit messages
- Test on multiple devices and browsers

## 📊 Current Statistics

- **Events**: 6 active events
- **Projects**: 6 ongoing projects
- **Members**: 12 registered members
- **Blog Posts**: 0 published articles
- **Admin Features**: 8 management modules
- **Responsive Breakpoints**: 5 device categories

## 🔄 Recent Updates

### v2.0.0 - Enhanced Admin Experience
- ✅ Complete admin settings overhaul
- ✅ 3D navigation animations
- ✅ Real-time database integration
- ✅ Merchandise management system
- ✅ Advanced responsive design
- ✅ Performance optimizations

## 📄 License

MIT License - see LICENSE file for details.

## 🌟 Acknowledgments

- **Next.js Team** for the amazing framework
- **Firebase** for backend infrastructure
- **Framer Motion** for animation capabilities
- **Tailwind CSS** for the design system
- **Lucide Icons** for the icon library

---

**Built with ❤️ by the OrbitX Tech Team**

*Exploring Beyond Horizons* 🚀
