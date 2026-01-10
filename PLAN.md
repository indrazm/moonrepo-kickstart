# User Profile Edit Implementation Plan

## Overview
Implement user profile editing functionality with a sidebar navigation in the dashboard layout.

## Current State Analysis

### Backend (apps/api)
- **User Model** (apps/api/app/models/user.py):
  - Fields: id, email, username, is_active, role, hashed_password, refresh_token
  - Optional fields: oauth_provider, oauth_provider_id, avatar_url, full_name
  - ✅ Model supports profile fields (full_name, avatar_url)
  
- **Auth API** (apps/api/app/api/auth/api.py):
  - Has `/auth/me` endpoint (GET only)
  - ❌ Missing: PATCH endpoint for profile updates
  
- **Auth Serializers** (apps/api/app/api/auth/serializer.py):
  - Has UserResponse for reading user data
  - ❌ Missing: UserProfileUpdate schema for profile editing

### Frontend (apps/platform)
- **Layout** (src/routes/_dashboardLayout.tsx):
  - Current: Top header with horizontal nav
  - ❌ Missing: Sidebar navigation
  
- **Dashboard** (src/routes/_dashboardLayout/dashboard.tsx):
  - Displays user info in read-only cards
  - No edit functionality
  
- **Auth Types** (packages/core/src/types/auth.ts):
  - Has UserResponse interface
  - ❌ Missing: UserProfileUpdate interface
  
- **Auth API Client** (packages/core/src/api/auth.ts):
  - Has me() method for fetching user
  - ❌ Missing: updateProfile() method

### Available UI Components
✅ Card, Button, Input, Label, Avatar, Textarea
✅ Dialog, Toast (Sonner), Spinner
❌ No pre-built Sidebar component (need to create)

---

## Implementation Plan

### Phase 1: Backend - Profile Update API

#### 1.1 Add Profile Update Schema
**File**: `apps/api/app/api/auth/serializer.py`
- Add `UserProfileUpdate` schema
  - Fields: full_name (optional), avatar_url (optional)
  - Note: email and username updates require additional validation (unique constraints)
  - Keep it simple: only allow full_name and avatar_url for now

#### 1.2 Add Profile Update Service
**File**: `apps/api/app/modules/auth/service.py`
- Add `update_user_profile()` function
  - Takes: db, user_id, profile_data
  - Updates: full_name, avatar_url
  - Returns: updated User

#### 1.3 Add Profile Update Route
**File**: `apps/api/app/api/auth/api.py`
- Add `PATCH /auth/me` endpoint
  - Protected by `get_current_user` dependency
  - Uses `UserProfileUpdate` schema
  - Calls `update_user_profile()` service
  - Returns updated `UserResponse`

---

### Phase 2: Shared Types - Update API Contract

#### 2.1 Add Profile Update Type
**File**: `packages/core/src/types/auth.ts`
- Add `UserProfileUpdate` interface
  - full_name?: string | null
  - avatar_url?: string | null

#### 2.2 Update API Client
**File**: `packages/core/src/api/auth.ts`
- Add `updateProfile(data: UserProfileUpdate): Promise<UserResponse>`
  - PATCH request to `auth/me`
  - Returns updated user data

---

### Phase 3: Frontend - Sidebar Layout

#### 3.1 Create Sidebar Component
**File**: `apps/platform/src/components/sidebar.tsx`
- Sidebar with navigation items:
  - Dashboard (link to /dashboard)
  - Settings (link to /dashboard/settings)
- Responsive design:
  - Desktop: Fixed sidebar on left
  - Mobile: Collapsible/hamburger menu
- Highlight active route
- Include user info at bottom (avatar + username)

#### 3.2 Update Dashboard Layout
**File**: `apps/platform/src/routes/_dashboardLayout.tsx`
- Restructure layout:
  - Remove horizontal nav from header
  - Add Sidebar component
  - Main content area with Outlet
- Layout structure:
  ```
  <div className="flex h-screen">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <header>...</header>
      <main><Outlet /></main>
    </div>
  </div>
  ```

---

### Phase 4: Frontend - Settings Page

#### 4.1 Create Settings Module Structure
**Directories to create**:
- `apps/platform/src/modules/profile/`
- `apps/platform/src/modules/profile/components/`
- `apps/platform/src/modules/profile/hooks/`

#### 4.2 Create Profile Update Hook
**File**: `apps/platform/src/modules/profile/hooks/useUpdateProfile.ts`
- Use `useMutation` from TanStack Query
- Call `api.auth.updateProfile()`
- On success:
  - Invalidate `/auth/me` query (refresh useMe data)
  - Show success toast
- On error:
  - Show error toast with message

#### 4.3 Create Profile Edit Form Component
**File**: `apps/platform/src/modules/profile/components/ProfileEditForm.tsx`
- Form fields:
  - Full Name (Input)
  - Avatar URL (Input)
  - Email (Input, disabled/read-only - display only)
  - Username (Input, disabled/read-only - display only)
- Form state: React state or useForm hook
- Submit handler:
  - Calls `useUpdateProfile` mutation
  - Shows loading spinner during update
- Cancel button: Resets form to current user data

#### 4.4 Create Settings Route
**File**: `apps/platform/src/routes/_dashboardLayout/settings.tsx`
- Route: `/dashboard/settings`
- Page title: "Settings"
- Tabs or sections:
  - Profile (default tab)
    - Shows ProfileEditForm component
  - (Future: Account, Security, etc.)

---

### Phase 5: Testing & Polish

#### 5.1 Manual Testing
- [ ] Test profile update with valid data
- [ ] Test validation errors (if any)
- [ ] Test loading states
- [ ] Test toast notifications
- [ ] Test sidebar navigation
- [ ] Test responsive design (mobile/desktop)
- [ ] Test OAuth users (avatar_url pre-filled)

#### 5.2 Polish
- Add avatar preview for URL changes
- Add form validation (optional)
- Improve error messages
- Add confirmation dialog for destructive actions (if any)

---

## File Structure After Implementation

```
apps/
  api/
    app/
      api/auth/
        api.py                    # + PATCH /auth/me endpoint
        serializer.py             # + UserProfileUpdate schema
      modules/auth/
        service.py                # + update_user_profile() function
        
  platform/
    src/
      components/
        sidebar.tsx               # NEW: Sidebar component
      modules/
        profile/                  # NEW: Profile module
          components/
            ProfileEditForm.tsx   # NEW: Profile edit form
          hooks/
            useUpdateProfile.ts   # NEW: Profile update mutation
      routes/
        _dashboardLayout.tsx      # MODIFIED: Add sidebar layout
        _dashboardLayout/
          dashboard.tsx           # EXISTING: Keep as is
          settings.tsx            # NEW: Settings page
          
packages/
  core/
    src/
      types/
        auth.ts                   # + UserProfileUpdate interface
      api/
        auth.ts                   # + updateProfile() method
```

---

## Implementation Order

1. **Backend First** (Phase 1)
   - Serializer → Service → Route
   - Test with curl/Postman: `PATCH /auth/me`

2. **Shared Types** (Phase 2)
   - Update type definitions
   - Update API client

3. **Frontend Layout** (Phase 3)
   - Create Sidebar component
   - Update dashboard layout
   - Test navigation

4. **Frontend Settings** (Phase 4)
   - Create profile hooks
   - Create profile form
   - Create settings route
   - Wire everything together

5. **Testing & Polish** (Phase 5)

---

## API Contract

### Request
```http
PATCH /auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

### Response
```json
{
  "id": "01HQ...",
  "email": "user@example.com",
  "username": "john",
  "is_active": true,
  "role": "USER",
  "oauth_provider": null,
  "avatar_url": "https://example.com/avatar.jpg",
  "full_name": "John Doe"
}
```

---

## Design Decisions

### Why only full_name and avatar_url?
- **Email/Username changes** require:
  - Unique constraint validation
  - Email verification flow
  - Potential security implications
- Keep Phase 1 simple, add advanced features later

### Why Sidebar instead of Tabs?
- Better scalability for adding more sections
- Standard pattern for dashboard UIs
- Easier navigation hierarchy

### Why no form library?
- Keep dependencies minimal
- Simple form with 2 fields
- React state is sufficient
- Can add react-hook-form later if needed

### Why PATCH instead of PUT?
- PATCH = partial update (only changed fields)
- PUT = full replacement (all fields required)
- PATCH is more flexible for profile updates

---

## Future Enhancements (Out of Scope)

- [ ] Email change with verification
- [ ] Username change with validation
- [ ] Password change form
- [ ] Account deletion
- [ ] Profile picture upload (not just URL)
- [ ] Form validation library integration
- [ ] Optimistic UI updates
- [ ] Profile sections: Account, Security, Preferences
- [ ] Admin user management UI

---

## Notes

- Follow AGENTS.md rules throughout
- Use Jotai for client state if needed (not for profile form - server state)
- Use TanStack Query for all API calls
- Show toast notifications for all actions
- No prop drilling - use hooks for shared state
- Keep backend 3-layer architecture: api → modules → models
- Migration not needed (no schema changes)
