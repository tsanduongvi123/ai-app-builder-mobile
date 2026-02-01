# AI App Builder Mobile

🚀 **AI-powered mobile app builder** - Create games, apps, and utilities with AI in minutes!

## Overview

AI App Builder Mobile is a cutting-edge React Native application that leverages Google Gemini AI to automatically generate complete, production-ready mobile applications. Users can describe their app idea, and the AI will generate the entire project structure, code, and dependencies.

### Key Features

- **🤖 AI-Powered Generation**: Uses Google Gemini 2.0 Flash with automatic model fallback
- **📝 Conversation History**: Maintains context across multiple interactions
- **👁️ Real-time Preview**: See your app come to life instantly
- **📦 APK Building**: Build and download your app as APK
- **✏️ Code Editor**: Edit generated code with syntax highlighting
- **🎨 Beautiful UI**: iOS-aligned design following Apple HIG
- **🔄 Model Fallback**: Automatically switches between Gemini models if rate-limited
- **💾 Project Management**: Save, organize, and manage multiple projects

## Tech Stack

### Frontend
- **React Native** 0.81.5
- **Expo** 54.0.29
- **Expo Router** - File-based routing
- **NativeWind** 4.2.1 - Tailwind CSS for React Native
- **React Query** (@tanstack/react-query) - Data fetching & caching
- **tRPC** - Type-safe API communication

### Backend
- **Express.js** - Web server
- **tRPC** - RPC framework
- **MySQL** - Database
- **Drizzle ORM** - Type-safe database queries

### AI Integration
- **Google Generative AI** (@google/generative-ai)
- **Gemini 2.0 Flash** - Primary model
- **Gemini 1.5 Pro/Flash** - Fallback models

## Project Structure

```
ai-app-builder-mobile/
├── app/                          # Expo Router screens
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── index.tsx            # Home screen
│   │   ├── projects.tsx         # Projects list
│   │   ├── create-app.tsx       # Create new app
│   │   ├── code-editor.tsx      # Code editor
│   │   └── settings.tsx         # Settings
│   ├── _layout.tsx              # Root layout
│   └── oauth/                   # OAuth callbacks
├── server/                       # Backend
│   ├── routers.ts               # tRPC routes
│   ├── db.ts                    # Database operations
│   ├── gemini-service.ts        # Gemini API integration
│   ├── gemini-service-advanced.ts # Advanced features (history, fallback)
│   └── _core/                   # Framework code
├── drizzle/                      # Database schema
│   ├── schema.ts                # Table definitions
│   └── migrations/              # Database migrations
├── components/                   # React components
├── hooks/                        # Custom React hooks
├── lib/                          # Utilities
├── design.md                     # UI/UX design document
├── todo.md                       # Development checklist
└── package.json                  # Dependencies
```

## Installation

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Expo CLI
- MySQL database

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/tsanduongvi123/ai-app-builder-mobile.git
cd ai-app-builder-mobile
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup environment variables**
```bash
# Create .env file
echo "GROQ_API_KEY=your_gemini_api_key_here" > .env
echo "DATABASE_URL=mysql://user:password@localhost:3306/ai_app_builder" >> .env
```

4. **Setup database**
```bash
pnpm db:push
```

5. **Start development server**
```bash
pnpm dev
```

The app will be available at:
- **Web**: http://localhost:8081
- **Mobile**: Scan QR code with Expo Go app

## Usage

### Creating an App

1. **Open the app** and tap "Create New App"
2. **Describe your idea** - Be specific about features and functionality
3. **Select app type** - Game, Utility, Social, Productivity, or Other
4. **Let AI generate** - Watch as the AI creates your complete app
5. **Review & Edit** - Check the generated code in the Code Editor
6. **Build APK** - Package your app for distribution

### Example Prompts

- "A todo list app with categories, due dates, and notifications"
- "A simple weather app that shows current temperature and forecast"
- "A calculator app with history and different calculation modes"
- "A note-taking app with rich text editing and cloud sync"

## API Integration

### Gemini API Setup

1. **Get API Key**
   - Visit https://makersuite.google.com/app/apikey
   - Create or copy your API key

2. **Configure**
   - Set `GROQ_API_KEY` environment variable
   - The app automatically handles model fallback

### Model Fallback Strategy

The app uses this priority order:
1. **gemini-2.0-flash** - Fastest, most capable
2. **gemini-1.5-pro** - More powerful, slower
3. **gemini-1.5-flash** - Balanced
4. **gemini-pro** - Legacy fallback

If a model is rate-limited (429 error), the system automatically tries the next model.

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
# Web
pnpm build

# Mobile (requires EAS Build)
eas build --platform ios
eas build --platform android
```

### Database Migrations
```bash
# Generate migration
pnpm db:push

# View migrations
ls drizzle/migrations/
```

## Project Architecture

### Screens

| Screen | Purpose | Features |
|--------|---------|----------|
| Home | Entry point | Quick actions, feature highlights |
| Projects | Project management | List, search, filter projects |
| Create App | App generation | Form, AI generation, streaming |
| Code Editor | Code editing | File tree, syntax highlighting |
| Settings | Configuration | Theme, notifications, about |

### Data Flow

```
User Input (Create App Screen)
    ↓
tRPC Endpoint (ai.generateApp)
    ↓
Gemini Service (with fallback)
    ↓
Parse Generated Code
    ↓
Save to Database
    ↓
Display in Projects
    ↓
Edit in Code Editor
    ↓
Build APK
```

### Conversation History

The app maintains conversation history per project:
- Stores all user prompts and AI responses
- Enables context-aware refinements
- Allows users to iterate on generated code
- Persists in memory (can be extended to database)

## Features in Development

- [ ] APK building and download
- [ ] Code syntax highlighting
- [ ] Project templates
- [ ] Cloud storage integration
- [ ] Collaborative editing
- [ ] Version control
- [ ] Deployment automation

## Performance Optimization

- **Lazy Loading**: Components load on demand
- **Code Splitting**: Large modules are split
- **Image Optimization**: Compressed assets
- **Streaming**: AI responses stream in real-time
- **Caching**: React Query caches API responses

## Security

- **API Key Protection**: Never exposed to client
- **Environment Variables**: Sensitive data in .env
- **HTTPS Only**: All API calls encrypted
- **Input Validation**: Zod schemas validate all inputs
- **SQL Injection Prevention**: Drizzle ORM parameterized queries

## Troubleshooting

### "API Key not found"
- Ensure `GROQ_API_KEY` is set in `.env`
- Restart dev server after changing environment variables

### "Database connection failed"
- Check `DATABASE_URL` is correct
- Ensure MySQL server is running
- Run `pnpm db:push` to initialize schema

### "Model rate limited"
- The app automatically falls back to another model
- Check Gemini API quota at https://makersuite.google.com/app/apikey

### "Build fails on mobile"
- Clear cache: `pnpm expo start --clear`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

- 📧 Email: tsanduongvi123@gmail.com
- 🐛 Issues: https://github.com/tsanduongvi123/ai-app-builder-mobile/issues
- 💬 Discussions: https://github.com/tsanduongvi123/ai-app-builder-mobile/discussions

## Roadmap

### Q1 2026
- [x] Core AI generation
- [x] Project management
- [ ] APK building
- [ ] Code editor

### Q2 2026
- [ ] Cloud storage
- [ ] Collaborative editing
- [ ] Advanced templates
- [ ] Performance improvements

### Q3 2026
- [ ] Web version
- [ ] Desktop app
- [ ] Plugin system
- [ ] Community marketplace

## Acknowledgments

- Google Gemini AI for powerful code generation
- Expo for mobile development framework
- React Native community for amazing libraries
- All contributors and users

---

**Made with ❤️ by AI App Builder Team**

[GitHub](https://github.com/tsanduongvi123/ai-app-builder-mobile) | [Website](#) | [Documentation](#)
