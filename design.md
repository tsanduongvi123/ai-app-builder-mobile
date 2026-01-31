# AI App Builder Mobile - Design Document

## Overview
AI App Builder Mobile là một ứng dụng di động cho phép người dùng tự động tạo các tựa game, ứng dụng thông qua AI, xem trước kết quả, và đóng gói thành file APK để sử dụng.

## Design Principles
- **Mobile-First**: Thiết kế cho portrait orientation (9:16), tối ưu cho sử dụng một tay
- **iOS-Aligned**: Tuân theo Apple Human Interface Guidelines
- **Intuitive**: Giao diện đơn giản, dễ hiểu, không cần hướng dẫn phức tạp
- **Fast Feedback**: Hiển thị kết quả nhanh chóng, streaming AI responses

## Screen List

### 1. Home Screen (Trang chủ)
**Purpose**: Điểm vào chính, hiển thị các tùy chọn tạo ứng dụng
**Content**:
- Header: "AI App Builder" với logo
- Quick Actions (3 nút chính):
  - "Create New App" (tạo ứng dụng mới)
  - "My Projects" (danh sách dự án đã tạo)
  - "Templates" (các mẫu sẵn có)
- Recent Projects (danh sách 3-5 dự án gần đây)
- Feature highlights: "AI-Powered", "Fast Preview", "APK Build"

**Functionality**:
- Điều hướng đến các màn hình khác
- Xem nhanh dự án gần đây
- Xóa/khôi phục dự án

---

### 2. Create App Screen (Tạo ứng dụng)
**Purpose**: Nhập yêu cầu cho AI tạo ứng dụng
**Content**:
- Input field: "Describe your app idea" (mô tả ý tưởng)
- Dropdown: "App Type" (loại ứng dụng):
  - Game (trò chơi)
  - Utility (tiện ích)
  - Social (mạng xã hội)
  - Productivity (năng suất)
  - Other (khác)
- Toggle: "Advanced Options" (tùy chọn nâng cao)
  - Technology Stack
  - Design Style
  - Features List
- Button: "Generate with AI" (tạo bằng AI)
- Button: "Use Template" (sử dụng mẫu)

**Functionality**:
- Validate input
- Show loading state với streaming AI response
- Lưu draft tự động

---

### 3. AI Generation Screen (Quá trình tạo)
**Purpose**: Hiển thị quá trình AI tạo code và project structure
**Content**:
- Header: "Generating Your App..."
- Progress indicator (streaming text):
  - Analyzing requirements
  - Designing architecture
  - Generating code
  - Creating assets
- Real-time output display (scrollable text area)
- Cancel button
- Status: "In Progress" / "Completed" / "Error"

**Functionality**:
- Stream AI responses từ Groq API
- Hiển thị real-time progress
- Lưu generated code
- Error handling & retry

---

### 4. Project Detail Screen (Chi tiết dự án)
**Purpose**: Xem và quản lý một dự án cụ thể
**Content**:
- Header: Project name + timestamp
- Tabs:
  - **Overview**: Mô tả, loại ứng dụng, status
  - **Code**: Hiển thị file structure + code preview
  - **Preview**: Xem trước ứng dụng
  - **Build**: Tùy chọn build APK
- Action buttons:
  - "Edit" (chỉnh sửa)
  - "Preview" (xem trước)
  - "Build APK" (build)
  - "Download" (tải xuống)
  - "Delete" (xóa)

**Functionality**:
- Hiển thị project metadata
- Code editor/viewer
- Live preview
- Build management

---

### 5. Code Editor Screen (Chỉnh sửa code)
**Purpose**: Cho phép người dùng chỉnh sửa code được AI tạo
**Content**:
- File tree (sidebar trái):
  - Danh sách file trong project
  - Có thể thêm/xóa file
- Code editor (chính):
  - Syntax highlighting
  - Line numbers
  - Search/replace
- Bottom panel:
  - Save button
  - Undo/Redo
  - Format code

**Functionality**:
- Edit code
- Add/remove files
- Save changes
- Syntax highlighting
- Auto-save

---

### 6. Preview Screen (Xem trước)
**Purpose**: Xem trước ứng dụng được tạo
**Content**:
- Device frame (iPhone mockup)
- App preview (web-based)
- Controls:
  - Refresh button
  - Rotate device
  - Full screen button
- Error display (nếu có)

**Functionality**:
- Render app preview
- Hot reload
- Error logging
- Device rotation

---

### 7. Build Screen (Xây dựng APK)
**Purpose**: Build và đóng gói ứng dụng thành APK
**Content**:
- Build configuration:
  - App name
  - Package name
  - Version
  - Icon upload
- Build status:
  - "Ready to build"
  - "Building..." (progress)
  - "Build completed"
  - "Download APK"
- Build logs (scrollable)
- Buttons:
  - "Start Build"
  - "Download"
  - "Share"

**Functionality**:
- Validate build configuration
- Trigger build process
- Show progress
- Download APK
- Share build link

---

### 8. My Projects Screen (Danh sách dự án)
**Purpose**: Quản lý tất cả dự án của người dùng
**Content**:
- Search bar
- Filter options:
  - All / Games / Utilities / etc.
  - Sort by: Recent / Name / Status
- Project list (cards):
  - Thumbnail/preview
  - Project name
  - Type
  - Last modified
  - Status (draft/completed/built)
- Swipe actions:
  - Edit
  - Delete
  - Duplicate

**Functionality**:
- List projects
- Search & filter
- Sort
- Quick actions
- Bulk operations

---

### 9. Templates Screen (Mẫu)
**Purpose**: Hiển thị các mẫu sẵn có để tạo nhanh
**Content**:
- Template grid (2 columns):
  - Template thumbnail
  - Template name
  - Description
  - "Use Template" button
- Template categories:
  - Games
  - Utilities
  - Social
  - Productivity

**Functionality**:
- Browse templates
- Filter by category
- Use template (tạo project từ mẫu)
- Preview template

---

### 10. Settings Screen (Cài đặt)
**Purpose**: Quản lý cài đặt ứng dụng
**Content**:
- Account section:
  - Profile
  - Logout
- API Configuration:
  - Groq API Key (nếu cần)
  - Model selection
- Preferences:
  - Theme (Light/Dark)
  - Language
  - Notifications
- About:
  - Version
  - Help
  - Feedback

**Functionality**:
- Update settings
- Manage API keys
- Theme switching
- Logout

---

## Key User Flows

### Flow 1: Create App from Scratch
1. User taps "Create New App" on Home
2. Enters app description (e.g., "A simple to-do list app")
3. Selects app type (Utility)
4. Taps "Generate with AI"
5. AI streams code generation (real-time display)
6. Project created automatically
7. User can preview, edit, or build immediately

### Flow 2: Preview and Edit
1. User opens a project
2. Taps "Preview" tab
3. Sees live preview of app
4. Taps "Edit" to modify code
5. Makes changes in code editor
6. Saves changes
7. Preview updates automatically

### Flow 3: Build and Download APK
1. User opens a project
2. Taps "Build APK"
3. Configures build settings (app name, version, etc.)
4. Taps "Start Build"
5. Build process runs (shows progress)
6. APK ready for download
7. User can download or share

### Flow 4: Use Template
1. User taps "Templates" on Home
2. Browses available templates
3. Selects a template
4. Taps "Use Template"
5. Project created from template
6. User can customize and build

---

## Color Scheme

### Primary Colors
- **Primary**: `#3B82F6` (Blue) - Main actions, buttons
- **Secondary**: `#8B5CF6` (Purple) - Accent, highlights
- **Success**: `#10B981` (Green) - Success states, build complete
- **Warning**: `#F59E0B` (Amber) - Warnings, in progress
- **Error**: `#EF4444` (Red) - Errors, delete actions

### Neutral Colors
- **Background**: `#FFFFFF` (Light) / `#0F172A` (Dark)
- **Surface**: `#F8FAFC` (Light) / `#1E293B` (Dark)
- **Border**: `#E2E8F0` (Light) / `#334155` (Dark)
- **Text**: `#0F172A` (Light) / `#F8FAFC` (Dark)
- **Muted**: `#64748B` (Light) / `#94A3B8` (Dark)

### Semantic Colors
- **AI Generation**: Gradient from `#3B82F6` to `#8B5CF6`
- **Build Status**: `#10B981` (completed), `#F59E0B` (in progress), `#EF4444` (failed)

---

## Typography

- **Display**: SF Pro Display (iOS) / Roboto (Android)
- **Body**: SF Pro Text (iOS) / Roboto (Android)
- **Monospace**: Menlo / Roboto Mono (for code)

### Font Sizes
- **Heading 1**: 32pt, Bold
- **Heading 2**: 24pt, Semibold
- **Heading 3**: 18pt, Semibold
- **Body**: 16pt, Regular
- **Caption**: 12pt, Regular
- **Code**: 12pt, Monospace

---

## Spacing & Layout

- **Padding**: 16px (standard), 24px (large), 8px (small)
- **Gap**: 12px (between elements), 16px (between sections)
- **Border Radius**: 12px (standard), 8px (small), 16px (large)
- **Safe Area**: Respect notch/safe area on all screens

---

## Interactions & Animations

- **Tap Feedback**: Opacity change (0.7)
- **Loading**: Spinner animation (2s rotation)
- **Transitions**: 300ms ease-in-out
- **Streaming Text**: Typewriter effect for AI responses
- **Swipe**: Left/right swipe for quick actions
- **Pull-to-Refresh**: Refresh project list

---

## Accessibility

- **Contrast Ratio**: WCAG AA minimum (4.5:1 for text)
- **Touch Targets**: Minimum 44x44pt
- **Font Scaling**: Support system font size settings
- **VoiceOver**: All interactive elements labeled
- **Dark Mode**: Full support with proper contrast

---

## Performance Considerations

- **Lazy Loading**: Load projects on demand
- **Code Splitting**: Split large components
- **Image Optimization**: Compress previews/thumbnails
- **Streaming**: Stream AI responses for perceived speed
- **Caching**: Cache project data locally

---

## Technical Stack

- **Frontend**: React Native + Expo
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: React Query (tRPC)
- **AI Integration**: Groq API (gpt-oss-120b)
- **Backend**: Express.js + tRPC
- **Database**: MySQL (optional, for user projects)
- **Build**: EAS Build (Expo)

---

## Success Metrics

- Time to create first app: < 2 minutes
- Preview load time: < 3 seconds
- Build time: < 5 minutes
- User retention: > 70% after 7 days
- App stability: > 99% uptime
