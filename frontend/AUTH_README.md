# Solbright Authentication System

## Overview
A comprehensive multi-role authentication system with three distinct user types: Customer, Maintenance, and Retailer. Each role has its own dedicated dashboard and access controls.

## Features

### 🔐 Authentication
- **Role-based login system** with separate forms for each user type
- **Protected routes** with role-based access control
- **Session persistence** using localStorage
- **Form validation** with real-time error handling
- **Responsive design** with dark theme UI

### 👥 User Roles

#### Customer (User)
- **Login**: `user@solbright.com` / `user123`
- **Dashboard**: `/user/dashboard`
- **Features**: Solar system monitoring, energy analytics, savings tracking

#### Maintenance
- **Login**: `admin@solbright.com` / `admin123`
- **Dashboard**: `/admin/dashboard`
- **Features**: Platform management, user administration, system monitoring

#### Retailer
- **Login**: `retailer@solbright.com` / `retailer123`
- **Dashboard**: `/retailer/dashboard`
- **Features**: Product management, sales analytics, order tracking

## Routes

### Public Routes
- `/` - Homepage
- `/about` - About page
- `/calculator` - Solar calculator
- `/contact` - Contact page
- `/login` - Login role selection
- `/login/:role` - Role-specific login forms

### Protected Routes
- `/user/dashboard` - Customer dashboard (User role only)
- `/admin/dashboard` - Maintenance dashboard (Maintenance role only)
- `/retailer/dashboard` - Retailer dashboard (Retailer role only)
- `/unauthorized` - Access denied page

## Usage

### Login Process
1. Navigate to `/login` to see role selection
2. Choose your role (Customer/Maintenance/Retailer)
3. Enter credentials on the role-specific login form
4. Successfully authenticated users are redirected to their respective dashboards

### Demo Credentials
```
Customer:
Email: user@solbright.com
Password: user123

Maintenance:
Email: admin@solbright.com
Password: admin123

Retailer:
Email: retailer@solbright.com
Password: retailer123
```

### Logout
- Click the "Logout" button in the navigation bar
- Session is cleared and user is redirected to the homepage

## Technical Implementation

### Components
- `AuthContext` - Authentication state management
- `ProtectedRoute` - Route protection wrapper
- `LoginSelection` - Role selection page
- `Login` - Universal login form
- Role-specific dashboards for each user type

### Security Features
- **Role validation** on protected routes
- **Session management** with automatic logout
- **Form validation** with error handling
- **Access control** preventing unauthorized route access

### Responsive Design
- **Mobile-first** approach
- **Dark theme** for login pages
- **Professional UI** with gradient backgrounds
- **Accessible** form inputs and navigation

## Development

### Adding New Roles
1. Add role to `UserRole` type in `AuthContext.tsx`
2. Add mock user data to `mockUsers` object
3. Create new dashboard component
4. Add protected route in `App.tsx`
5. Update navigation logic if needed

### Extending Authentication
- Replace mock authentication with real API calls
- Add password hashing for security
- Implement JWT tokens for better session management
- Add password reset functionality
- Integrate with backend authentication service

## File Structure
```
src/
├── contexts/
│   └── AuthContext.tsx          # Authentication state management
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx   # Route protection
├── pages/
│   ├── auth/
│   │   ├── LoginSelection.tsx   # Role selection page
│   │   ├── Login.tsx           # Universal login form
│   │   └── Unauthorized.tsx    # Access denied page
│   └── dashboards/
│       ├── UserDashboard.tsx   # Customer dashboard
│       ├── AdminDashboard.tsx  # Maintenance dashboard
│       └── RetailerDashboard.tsx # Retailer dashboard
└── App.tsx                      # Main routing configuration
```

## Running the Application
```bash
cd frontend
npm install
npm run dev
```

Access the application at `http://localhost:8081`