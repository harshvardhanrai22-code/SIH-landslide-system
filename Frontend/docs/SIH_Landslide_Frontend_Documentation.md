# SIH Landslide Prediction System — Frontend Documentation

> **Version:** 1.0  
> **Last Updated:** August 31, 2026  
> **Document Type:** Frontend Technical Specification & Development Guide  
> **Audience:** Frontend developers, new team members, project evaluators

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Frontend Responsibilities](#2-frontend-responsibilities)
3. [User Roles](#3-user-roles)
4. [Complete Frontend Page Structure](#4-complete-frontend-page-structure)
5. [Dashboard Page](#5-dashboard-page)
6. [Prediction Page](#6-prediction-page)
7. [Prediction Result UI](#7-prediction-result-ui)
8. [Live Risk Map](#8-live-risk-map)
9. [Alerts System](#9-alerts-system)
10. [Prediction History](#10-prediction-history)
11. [Analytics Page](#11-analytics-page)
12. [Location Details Page](#12-location-details-page)
13. [Authentication and Authorization](#13-authentication-and-authorization)
14. [React Routing Structure](#14-react-routing-structure)
15. [Frontend Architecture](#15-frontend-architecture)
16. [Detailed Folder Structure](#16-detailed-folder-structure)
17. [Component Architecture](#17-component-architecture)
18. [API Integration Architecture](#18-api-integration-architecture)
19. [Frontend State Management](#19-frontend-state-management)
20. [Loading, Error and Empty States](#20-loading-error-and-empty-states)
21. [UI/UX Design Guidelines](#21-uiux-design-guidelines)
22. [Recommended Frontend Technologies](#22-recommended-frontend-technologies)
23. [Complete User Flow](#23-complete-user-flow)
24. [Frontend-to-Backend-to-ML Flow](#24-frontend-to-backend-to-ml-flow)
25. [Security Considerations](#25-security-considerations)
26. [Performance Considerations](#26-performance-considerations)
27. [Development Roadmap](#27-development-roadmap)
28. [MVP vs Future Features](#28-mvp-vs-future-features)
29. [Frontend Team Responsibilities](#29-frontend-team-responsibilities)
30. [Final Frontend Architecture Diagram](#30-final-frontend-architecture-diagram)

---

## 1. Project Overview

### What Problem Does This System Solve?

Landslides are one of the most devastating natural disasters in India, especially in hilly and mountainous regions. They cause loss of life, destruction of property, and disruption of infrastructure. Currently, predicting landslides relies heavily on manual observation and delayed government reports, which means warnings often come too late.

The **SIH Landslide Prediction System** solves this problem by using **Machine Learning (ML)** to predict landslide risk based on environmental data such as rainfall, soil moisture, slope angle, elevation, and temperature. The system provides **real-time risk assessment** so that disaster management authorities and citizens can take timely action.

### Who Uses This System?

- **Normal Users / Citizens** — People living in or near landslide-prone areas who want to check the risk level for their location.
- **Disaster Management Authorities** — Government officials and disaster response teams who need to monitor multiple locations, track alerts, and make informed decisions.
- **System Administrators** — Technical staff who manage users, locations, and system configuration.

### Why Is the Frontend Important?

The ML model and backend do the heavy computational work, but the **frontend is the only part the user actually sees and interacts with**. Without a good frontend:

- Users cannot input location data or environmental parameters.
- Prediction results cannot be displayed in an understandable way.
- Risk maps, alerts, and historical data remain inaccessible.
- The entire system becomes unusable regardless of how accurate the ML model is.

The frontend transforms raw prediction data (e.g., `probability: 0.87`) into meaningful, actionable information (e.g., **HIGH RISK — 87% probability**).

### How the Frontend Fits Into the Complete System

```mermaid
flowchart TD
    A[👤 User] --> B[⚛️ React Frontend]
    B --> C[🔧 .NET Backend API]
    C --> D[🤖 ML Prediction Service]
    D --> E[📊 Prediction Result]
    E --> C
    C --> B
    B --> A

    style A fill:#e1f5fe
    style B fill:#fff3e0
    style C fill:#e8f5e9
    style D fill:#fce4ec
    style E fill:#f3e5f5
```

**Responsibility of each layer:**

| Layer | Responsibility |
|-------|---------------|
| **User** | Interacts with the system through a web browser |
| **React Frontend** | Provides the user interface, collects input, sends API requests, and displays results |
| **.NET Backend API** | Receives requests from the frontend, validates data, communicates with the ML service, manages authentication, and stores data in the database |
| **ML Prediction Service** | Takes environmental parameters as input, runs the trained ML model, and returns a prediction result (risk level, probability, confidence) |
| **Prediction Result** | The output from the ML model that flows back through the backend to the frontend |

The frontend developer does **not** need to understand how the ML model works internally. You only need to know:
1. What data to send to the backend.
2. What response format to expect back.
3. How to display that response to the user.

---

## 2. Frontend Responsibilities

### What the Frontend IS Responsible For

| Area | Description |
|------|-------------|
| **User Interaction** | Handling all clicks, form submissions, navigation, and user actions |
| **Data Input** | Providing forms for users to enter location coordinates, environmental parameters, and other inputs |
| **Prediction Requests** | Sending validated data to the backend API and waiting for the prediction response |
| **Displaying Prediction Results** | Converting raw ML output into human-readable risk information with visual indicators |
| **Risk Visualization** | Showing risk levels using colors, icons, progress bars, and charts |
| **Interactive Maps** | Rendering maps with risk markers, zones, popups, and location selection |
| **Alerts** | Displaying active alerts, alert history, and alert details |
| **Historical Predictions** | Showing past predictions with filtering, sorting, and search |
| **Analytics** | Visualizing trends and statistics using charts and graphs |
| **Authentication** | Login/logout UI, storing JWT tokens, and sending tokens with API requests |
| **Role-Based UI** | Showing or hiding features based on the logged-in user's role |
| **API Communication** | Making HTTP requests to the .NET backend and handling responses |
| **Loading/Error Handling** | Showing loading spinners, error messages, and empty states for every API-driven feature |
| **Responsive Design** | Making the UI work on desktop, tablet, and mobile screens |

### What the Frontend is NOT Responsible For

> **Important:** The following tasks are handled by the ML team and backend team, **not** the frontend team.

| Area | Owned By |
|------|----------|
| **Model Training** | ML Team |
| **Dataset Preprocessing** | ML Team |
| **Feature Engineering** | ML Team |
| **ML Algorithm Selection** | ML Team |
| **Model Evaluation** | ML Team |
| **Database Design** | Backend Team |
| **Business Logic Validation** | Backend Team |
| **API Authorization Enforcement** | Backend Team |
| **Data Storage & Retrieval** | Backend Team |

The frontend simply **consumes** the backend API. It sends data and displays what comes back.

---

## 3. User Roles

### Normal User

A regular citizen or researcher who wants to check landslide risk for a specific location.

**Can:**
- View the main dashboard
- Check landslide risk for a location
- Select a location on the map or enter coordinates manually
- Run a new prediction by providing environmental data
- View the interactive risk map
- View active alerts
- View their own prediction history

### Authority / Disaster Management User

A government official or disaster management team member who monitors multiple locations and makes decisions.

**Can:**
- Everything a Normal User can do, plus:
- Monitor multiple locations simultaneously
- View all high-risk areas across the system
- Monitor and manage alerts for their jurisdiction
- Analyze historical prediction data and trends
- View detailed risk maps with multiple layers
- Monitor real-time environmental conditions

### Admin

A system administrator who manages the platform itself.

**Can:**
- Everything an Authority User can do, plus:
- Manage user accounts (create, edit, deactivate)
- Manage monitored locations (add, edit, remove)
- Manage system-wide data and configuration
- View system-wide statistics and usage metrics

### Role → Feature Access Table

| Feature | Normal User | Authority | Admin |
|---------|:-----------:|:---------:|:-----:|
| Dashboard | ✅ | ✅ | ✅ |
| Run Prediction | ✅ | ✅ | ✅ |
| View Prediction Result | ✅ | ✅ | ✅ |
| Live Risk Map | ✅ | ✅ | ✅ |
| View Alerts | ✅ | ✅ | ✅ |
| Own Prediction History | ✅ | ✅ | ✅ |
| All Prediction History | ❌ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| Location Details | ✅ | ✅ | ✅ |
| Monitor Multiple Locations | ❌ | ✅ | ✅ |
| Manage Alerts | ❌ | ✅ | ✅ |
| Profile & Settings | ✅ | ✅ | ✅ |
| Admin Dashboard | ❌ | ❌ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| Location Management | ❌ | ❌ | ✅ |
| System Management | ❌ | ❌ | ✅ |

---

## 4. Complete Frontend Page Structure

### Authentication Pages

#### Login Page

| Aspect | Details |
|--------|---------|
| **Purpose** | Allow users to authenticate and access the system |
| **Access** | Public (unauthenticated users) |
| **Main UI Components** | Email/username input, password input, "Login" button, "Forgot Password" link, "Register" link |
| **Data Displayed** | Login form, validation errors |
| **User Actions** | Enter credentials, submit form, navigate to register/forgot password |
| **Backend APIs** | `POST /api/auth/login` |
| **Important States** | Idle, loading (submitting), success (redirect to dashboard), error (invalid credentials) |
| **Navigation** | On success → Dashboard. Links to Register, Forgot Password |

#### Register Page *(Optional)*

| Aspect | Details |
|--------|---------|
| **Purpose** | Allow new users to create an account |
| **Access** | Public |
| **Main UI Components** | Name, email, password, confirm password inputs, "Register" button |
| **Data Displayed** | Registration form, validation errors |
| **User Actions** | Fill form, submit registration |
| **Backend APIs** | `POST /api/auth/register` |
| **Important States** | Idle, loading, success (redirect to login), error (email already exists, validation failure) |
| **Navigation** | On success → Login page |

> **Note:** Registration may be restricted to admin-created accounts depending on project requirements. Mark this as optional during MVP.

#### Forgot Password Page *(Optional)*

| Aspect | Details |
|--------|---------|
| **Purpose** | Allow users to reset their password |
| **Access** | Public |
| **Main UI Components** | Email input, "Send Reset Link" button, confirmation message |
| **Data Displayed** | Form, success/error messages |
| **User Actions** | Enter email, submit |
| **Backend APIs** | `POST /api/auth/forgot-password` |
| **Important States** | Idle, loading, success (email sent), error (email not found) |
| **Navigation** | Back to Login |

---

### Main Application Pages

#### Dashboard

| Aspect | Details |
|--------|---------|
| **Purpose** | Provide an at-a-glance overview of the landslide situation |
| **Access** | All authenticated users |
| **Main UI Components** | Risk summary cards, environmental condition cards, mini risk map, recent alerts list, trend charts |
| **Data Displayed** | Total monitored locations, risk level counts, active alerts, current environmental conditions, recent alerts |
| **User Actions** | Click on a risk card to filter, click on a map marker, click on an alert, navigate to other pages |
| **Backend APIs** | `GET /api/dashboard/summary`, `GET /api/alerts/recent`, `GET /api/locations/risk-overview` |
| **Important States** | Loading (initial data fetch), success (data displayed), error (API failure), partial (some data loaded) |
| **Navigation** | To Prediction, Map, Alerts, History, Analytics, Location Details |

*(See [Section 5](#5-dashboard-page) for detailed dashboard breakdown.)*

#### Prediction

| Aspect | Details |
|--------|---------|
| **Purpose** | Allow users to run a new landslide risk prediction |
| **Access** | All authenticated users |
| **Main UI Components** | Location selector (map click or manual input), environmental parameter form, submit button, prediction result display |
| **Data Displayed** | Input form, validation messages, prediction result |
| **User Actions** | Select location, enter parameters, submit prediction, view result |
| **Backend APIs** | `POST /api/predictions` |
| **Important States** | Input (form filling), validating, loading (waiting for prediction), success (result displayed), error (API failure, invalid input) |
| **Navigation** | From Dashboard, Map. To Location Details, History |

*(See [Section 6](#6-prediction-page) and [Section 7](#7-prediction-result-ui) for details.)*

#### Live Risk Map

| Aspect | Details |
|--------|---------|
| **Purpose** | Visualize landslide risk across geographic areas |
| **Access** | All authenticated users |
| **Main UI Components** | Interactive map (Leaflet), risk markers, risk zones, popups, map controls, layer controls |
| **Data Displayed** | Location markers colored by risk level, risk zone overlays, popup details |
| **User Actions** | Pan, zoom, click markers, select locations, toggle layers, view risk details |
| **Backend APIs** | `GET /api/locations`, `GET /api/locations/:id/risk` |
| **Important States** | Loading (fetching locations), success (markers rendered), error (map data failure), selecting (user clicking) |
| **Navigation** | Click marker → Location Details. Click "Predict" → Prediction Page |

*(See [Section 8](#8-live-risk-map) for details.)*

#### Alerts

| Aspect | Details |
|--------|---------|
| **Purpose** | Display active and historical landslide alerts |
| **Access** | All authenticated users |
| **Main UI Components** | Alert list, alert cards, filter controls, alert detail modal/page |
| **Data Displayed** | Alert severity, location, risk probability, timestamp, trigger condition, recommended action |
| **User Actions** | View alerts, filter by severity/location/date, click alert for details |
| **Backend APIs** | `GET /api/alerts`, `GET /api/alerts/:id` |
| **Important States** | Loading, success, error, empty (no alerts), filtering |
| **Navigation** | From Dashboard. To Location Details |

*(See [Section 9](#9-alerts-system) for details.)*

#### Prediction History

| Aspect | Details |
|--------|---------|
| **Purpose** | View past predictions with search and filter capabilities |
| **Access** | All authenticated users (own history); Authority/Admin (all history) |
| **Main UI Components** | History table/list, search bar, filters (date, risk level, location), pagination, detail view |
| **Data Displayed** | Date, location, risk level, probability, environmental conditions, prediction status |
| **User Actions** | Search, filter, sort, paginate, view details |
| **Backend APIs** | `GET /api/history`, `GET /api/history/:id` |
| **Important States** | Loading, success, error, empty, filtering, paginating |
| **Navigation** | From Dashboard. To Location Details, Prediction |

*(See [Section 10](#10-prediction-history) for details.)*

#### Analytics *(Good to Have)*

| Aspect | Details |
|--------|---------|
| **Purpose** | Visualize historical trends and system-wide statistics |
| **Access** | Authority and Admin users |
| **Main UI Components** | Charts (line, bar, pie), date range picker, location selector, statistics cards |
| **Data Displayed** | Risk trends, rainfall trends, soil moisture trends, prediction counts, alert trends |
| **User Actions** | Select date range, select location, toggle chart types |
| **Backend APIs** | `GET /api/analytics/risk-trends`, `GET /api/analytics/predictions`, `GET /api/analytics/alerts` |
| **Important States** | Loading, success, error, empty, date-range-selected |
| **Navigation** | From Dashboard sidebar |

*(See [Section 11](#11-analytics-page) for details.)*

#### Location Details

| Aspect | Details |
|--------|---------|
| **Purpose** | Show comprehensive information about a specific monitored location |
| **Access** | All authenticated users |
| **Main UI Components** | Location info card, current risk display, environmental conditions, risk history chart, prediction history list, alert list, mini map, "Run Prediction" button |
| **Data Displayed** | Location name, coordinates, current risk, environmental conditions, historical data |
| **User Actions** | View details, run new prediction, view history, view alerts |
| **Backend APIs** | `GET /api/locations/:id`, `GET /api/locations/:id/predictions`, `GET /api/locations/:id/alerts` |
| **Important States** | Loading, success, error, not-found |
| **Navigation** | From Map (click marker), Dashboard, Alerts. To Prediction |

*(See [Section 12](#12-location-details-page) for details.)*

#### Profile

| Aspect | Details |
|--------|---------|
| **Purpose** | View and edit user profile information |
| **Access** | All authenticated users |
| **Main UI Components** | Profile info display, edit form, change password form |
| **Data Displayed** | Name, email, role, account creation date |
| **User Actions** | Edit profile, change password |
| **Backend APIs** | `GET /api/auth/profile`, `PUT /api/auth/profile`, `PUT /api/auth/change-password` |
| **Important States** | Viewing, editing, saving, success, error |
| **Navigation** | From navbar user menu |

#### Settings *(Optional)*

| Aspect | Details |
|--------|---------|
| **Purpose** | Configure user preferences |
| **Access** | All authenticated users |
| **Main UI Components** | Notification preferences, default location, theme toggle |
| **Data Displayed** | Current settings |
| **User Actions** | Toggle settings, save preferences |
| **Backend APIs** | `GET /api/settings`, `PUT /api/settings` |
| **Important States** | Loading, editing, saving, success, error |
| **Navigation** | From navbar user menu |

---

### Administration Pages

#### Admin Dashboard

| Aspect | Details |
|--------|---------|
| **Purpose** | System-wide overview for administrators |
| **Access** | Admin only |
| **Main UI Components** | System statistics cards, user count, location count, prediction count, recent activity log |
| **Data Displayed** | Total users, total locations, total predictions, system health metrics |
| **User Actions** | View stats, navigate to management pages |
| **Backend APIs** | `GET /api/admin/dashboard` |
| **Important States** | Loading, success, error |
| **Navigation** | To User Management, Location Management, System Management |

#### User Management

| Aspect | Details |
|--------|---------|
| **Purpose** | Manage system users |
| **Access** | Admin only |
| **Main UI Components** | User table, search, filters, create user modal, edit user modal, deactivate/activate toggle |
| **Data Displayed** | User name, email, role, status, creation date |
| **User Actions** | Search users, create user, edit user, change role, deactivate user |
| **Backend APIs** | `GET /api/admin/users`, `POST /api/admin/users`, `PUT /api/admin/users/:id`, `DELETE /api/admin/users/:id` |
| **Important States** | Loading, success, error, creating, editing, confirming-delete |
| **Navigation** | From Admin Dashboard |

#### Location Management

| Aspect | Details |
|--------|---------|
| **Purpose** | Manage monitored locations |
| **Access** | Admin only |
| **Main UI Components** | Location table, map for selecting coordinates, add location form, edit location modal |
| **Data Displayed** | Location name, coordinates, region, status, last prediction date |
| **User Actions** | Add location, edit location, remove location, view on map |
| **Backend APIs** | `GET /api/admin/locations`, `POST /api/admin/locations`, `PUT /api/admin/locations/:id`, `DELETE /api/admin/locations/:id` |
| **Important States** | Loading, success, error, creating, editing, confirming-delete |
| **Navigation** | From Admin Dashboard |

#### System Management *(Optional)*

| Aspect | Details |
|--------|---------|
| **Purpose** | View system configuration and health |
| **Access** | Admin only |
| **Main UI Components** | System info cards, configuration display, API health status |
| **Data Displayed** | System version, API status, database status, ML service status |
| **User Actions** | View system info, check health |
| **Backend APIs** | `GET /api/admin/system` |
| **Important States** | Loading, success, error |
| **Navigation** | From Admin Dashboard |

---

## 5. Dashboard Page

The Dashboard is the first page users see after logging in. It provides an **immediate, at-a-glance overview** of the current landslide situation.

### Dashboard Components

#### Risk Summary

A row of summary cards at the top of the dashboard showing:

| Card | Description | Example Value |
|------|-------------|---------------|
| **Total Monitored Locations** | Number of locations the system is tracking | 48 |
| **High-Risk Locations** | Locations currently classified as high risk | 5 |
| **Medium-Risk Locations** | Locations currently classified as medium risk | 12 |
| **Low-Risk Locations** | Locations currently classified as low risk | 31 |
| **Active Alerts** | Number of currently active alerts | 3 |

Each card should be color-coded:
- High Risk → Red
- Medium Risk → Orange/Yellow
- Low Risk → Green
- Active Alerts → Red badge

#### Environmental Conditions

A section showing current environmental readings from monitored locations:

| Parameter | Description | Example |
|-----------|-------------|---------|
| **Rainfall** | Recent rainfall in mm | 125 mm |
| **Soil Moisture** | Soil moisture percentage | 72% |
| **Slope** | Average slope angle in degrees | 35° |
| **Elevation** | Elevation in meters | 1,200 m |
| **Temperature** | Current temperature in °C | 24°C |
| **Other Parameters** | Any additional parameters required by the ML model | Varies |

> **Note:** The exact parameters depend on what the ML model requires. Coordinate with the ML team to confirm which parameters should be displayed.

#### Map (Mini Risk Map)

A smaller version of the Live Risk Map embedded in the dashboard. It shows:
- All monitored locations as colored markers (red/orange/green based on risk level)
- Clicking a marker navigates to the Location Details page

#### Recent Alerts

A list of the 5 most recent alerts showing:
- Alert severity icon (🔴 High, 🟡 Medium, 🟢 Low)
- Location name
- Brief description
- Timestamp
- "View All" link to the full Alerts page

#### Charts

One or two charts showing useful trends:
- **Risk Trend:** Line chart showing how many high/medium/low risk locations have changed over the past 7 or 30 days
- **Rainfall Trend:** Bar chart showing recent rainfall data

### Dashboard Layout (Text-Based Wireframe)

```
┌──────────────────────────────────────────────────────────────────┐
│  NAVBAR  [Logo]  Dashboard  Predict  Map  Alerts  History  [👤] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ Total   │ │ High    │ │ Medium  │ │ Low     │ │ Active  │  │
│  │ Locations│ │ Risk    │ │ Risk    │ │ Risk    │ │ Alerts  │  │
│  │   48    │ │   5     │ │   12    │ │   31    │ │   3     │  │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
│                                                                  │
│  ┌────────────────────────────┐  ┌───────────────────────────┐  │
│  │                            │  │  ENVIRONMENTAL CONDITIONS │  │
│  │      MINI RISK MAP         │  │                           │  │
│  │                            │  │  🌧️ Rainfall:    125 mm   │  │
│  │   [Colored markers on      │  │  💧 Soil Moist:  72%      │  │
│  │    map of monitored        │  │  ⛰️ Slope:       35°      │  │
│  │    locations]               │  │  🏔️ Elevation:   1200 m   │  │
│  │                            │  │  🌡️ Temperature: 24°C     │  │
│  └────────────────────────────┘  └───────────────────────────┘  │
│                                                                  │
│  ┌────────────────────────────┐  ┌───────────────────────────┐  │
│  │      RECENT ALERTS         │  │     RISK TREND CHART      │  │
│  │                            │  │                           │  │
│  │  🔴 Chamoli - High Risk    │  │     📈 [Line chart        │  │
│  │     2 hours ago            │  │         showing trends]   │  │
│  │  🟡 Tehri - Medium Risk    │  │                           │  │
│  │     5 hours ago            │  │                           │  │
│  │  🔴 Rudraprayag - High     │  │                           │  │
│  │     8 hours ago            │  │                           │  │
│  │                            │  │                           │  │
│  │  [View All Alerts →]       │  │                           │  │
│  └────────────────────────────┘  └───────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Dashboard Organization

- **Top row:** Risk summary cards — always visible, always the first thing the user sees.
- **Middle row:** Split between the mini map (left, ~60% width) and environmental conditions (right, ~40% width).
- **Bottom row:** Split between recent alerts (left) and trend charts (right).

On **mobile**, these sections stack vertically: summary cards → map → conditions → alerts → charts.

---

## 6. Prediction Page

The Prediction page is where users run a new landslide risk prediction. This is the **core feature** of the application.

### Input Parameters

The prediction form collects the following data:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **Latitude** | Number | Geographic latitude of the location | 30.0668 |
| **Longitude** | Number | Geographic longitude of the location | 79.0193 |
| **Location Name** | Text/Select | Human-readable location name (optional, can auto-fill) | Chamoli, Uttarakhand |
| **Rainfall** | Number | Recent rainfall in millimeters | 125 |
| **Soil Moisture** | Number | Soil moisture percentage (0-100) | 72 |
| **Slope** | Number | Slope angle in degrees | 35 |
| **Elevation** | Number | Elevation above sea level in meters | 1200 |
| **Temperature** | Number | Current temperature in Celsius | 24 |
| **Other Parameters** | Varies | Any additional parameters required by the ML model | Varies |

> **Important:** The exact fields in this form **must match** the final backend/ML API contract. Before building the final version, confirm with the backend and ML teams which fields are required, which are optional, and what the valid ranges are.

### Location Input Methods

Users can provide location in two ways:

1. **Map Click:** Click on an embedded map to select latitude/longitude. The coordinates auto-fill in the form.
2. **Manual Entry:** Type latitude and longitude directly into the form fields.
3. **Location Dropdown:** Select from a list of pre-configured monitored locations (coordinates auto-fill).

### User Flow

```mermaid
flowchart TD
    A[User opens Prediction page] --> B[Select location or enter coordinates]
    B --> C[Enter environmental parameters]
    C --> D{Form validation}
    D -->|Invalid| E[Show validation errors]
    E --> C
    D -->|Valid| F[Show loading state]
    F --> G[Send POST request to backend]
    G --> H{API Response}
    H -->|Success| I[Display Prediction Result]
    H -->|Error| J[Show error message]
    J --> K[User can retry]
    K --> C
    I --> L[User views risk level, probability, details]
```

### Frontend States for Prediction Page

| State | What the User Sees |
|-------|--------------------|
| **Input** | Empty form ready for user input |
| **Validating** | Inline validation messages (e.g., "Latitude must be between -90 and 90") |
| **Loading** | Spinner or skeleton with message "Generating prediction..." |
| **Success** | Prediction result component showing risk level, probability, and details |
| **Error** | Error message: "Unable to generate prediction. Please check your inputs and try again." |
| **Invalid Input** | Red-bordered form fields with specific validation messages |
| **Empty (no location)** | Prompt: "Select a location on the map or enter coordinates to get started" |

### Form Validation Rules

Validation happens **before** the API request is sent:

| Field | Validation |
|-------|-----------|
| Latitude | Required, must be a number between -90 and 90 |
| Longitude | Required, must be a number between -180 and 180 |
| Rainfall | Required, must be a non-negative number |
| Soil Moisture | Required, must be between 0 and 100 |
| Slope | Required, must be between 0 and 90 |
| Elevation | Required, must be a non-negative number |
| Temperature | Required, must be a reasonable temperature range (e.g., -50 to 60) |

> **Note:** Exact validation ranges should be confirmed with the backend/ML team.

---

## 7. Prediction Result UI

### The Problem with Raw ML Output

The ML model returns raw numbers like:

```json
{
  "prediction": 0.87,
  "confidence": 0.91
}
```

Showing this raw output to a citizen or government official is **not useful**. They need to immediately understand:
- **Is this location safe?**
- **How dangerous is it?**
- **What should I do?**

### How the Frontend Should Display Results

Instead of raw numbers, the frontend converts the prediction into a human-readable result:

```
┌──────────────────────────────────────────────┐
│                                              │
│          ⚠️  LANDSLIDE RISK                  │
│                                              │
│              🔴 HIGH                         │
│                                              │
│     ████████████████████░░░  87%             │
│     Risk Probability                         │
│                                              │
│     Confidence: 91%                          │
│                                              │
│  ──────────────────────────────────────────  │
│                                              │
│  📍 Location: Chamoli, Uttarakhand           │
│  📏 Coordinates: 30.0668°N, 79.0193°E       │
│                                              │
│  ──────────────────────────────────────────  │
│                                              │
│  Environmental Factors:                      │
│  🌧️ Rainfall:     125 mm  (Very High)        │
│  💧 Soil Moisture: 72%    (High)             │
│  ⛰️ Slope:         35°    (Steep)            │
│  🏔️ Elevation:     1200 m                    │
│  🌡️ Temperature:   24°C                      │
│                                              │
│  ──────────────────────────────────────────  │
│                                              │
│  ⚠️ Recommended Action:                      │
│  Evacuate area. Contact local disaster       │
│  management authority immediately.           │
│                                              │
│  [View on Map]  [View History]  [New Predict]│
│                                              │
└──────────────────────────────────────────────┘
```

### Risk Level Visualization

The frontend should visually distinguish risk levels:

| Risk Level | Color | Icon | Background | Text |
|-----------|-------|------|------------|------|
| **Low** | 🟢 Green | ✅ Shield/Check | Light green background | "LOW RISK" |
| **Medium** | 🟡 Orange/Amber | ⚠️ Warning | Light yellow background | "MEDIUM RISK" |
| **High** | 🔴 Red | 🚨 Alert/Danger | Light red background | "HIGH RISK" |

> **Accessibility Note:** Do **not** rely on color alone to communicate risk. Always include text labels ("HIGH", "MEDIUM", "LOW") and icons alongside colors so that colorblind users can understand the risk level.

### Risk Thresholds

| Probability Range | Risk Level |
|-------------------|-----------|
| 0% – 33% | Low |
| 34% – 66% | Medium |
| 67% – 100% | High |

> **Important:** These thresholds are **examples only**. The actual thresholds must come from the agreed backend/model specification. Do not hard-code these values; store them in a configuration file or constants file so they can be easily updated.

### Prediction Result Components

| Component | Description |
|-----------|-------------|
| **Risk Level Badge** | Large, colored badge showing HIGH/MEDIUM/LOW |
| **Probability Bar** | Visual progress bar showing the risk percentage |
| **Confidence Score** | Displayed if the ML model provides a confidence value |
| **Location Info** | Name, coordinates of the predicted location |
| **Environmental Factors** | The input parameters shown back to the user with qualitative labels |
| **Recommended Action** | If the backend provides action recommendations, display them prominently |
| **Warning Banner** | For HIGH risk, show a prominent warning banner at the top |
| **Action Buttons** | "View on Map", "View History", "Run New Prediction" |

---

## 8. Live Risk Map

The interactive map is one of the **core features** of the system. It allows users to see landslide risk geographically.

### Technology

Use **React Leaflet** (a React wrapper around the Leaflet.js mapping library). Leaflet is free, open-source, and works well for this type of application.

### Map Features

#### MVP Features (Must Have)

| Feature | Description |
|---------|-------------|
| **Map Rendering** | Display an interactive map of India (or the target region) using OpenStreetMap tiles |
| **Risk Markers** | Colored circle markers on each monitored location. Color = risk level (🔴🟡🟢) |
| **Popups** | When a user clicks a marker, a popup shows location name, risk level, probability, and a "View Details" link |
| **Zoom & Pan** | Standard map controls to zoom in/out and pan around |
| **Map Controls** | Zoom buttons, fullscreen toggle |
| **Current Location** | Button to center the map on the user's current GPS location |
| **Location Selection** | User can click on the map to select a point for prediction (fills latitude/longitude) |

#### Marker Popup Content

When a user clicks a risk marker, a popup shows:

```
┌─────────────────────────┐
│ 📍 Chamoli              │
│ Risk Level: 🔴 HIGH      │
│ Probability: 87%        │
│ Rainfall: 125 mm        │
│ Soil Moisture: 72%      │
│                         │
│ [View Details]          │
└─────────────────────────┘
```

The "View Details" button navigates to the Location Details page.

#### Future Features (Not Required for MVP)

| Feature | Description |
|---------|-------------|
| **Heatmaps** | Color-gradient overlay showing risk intensity across regions |
| **Historical Landslide Locations** | Markers showing past landslide events |
| **Rainfall Layer** | Toggle a rainfall data overlay on the map |
| **Satellite Layer** | Toggle satellite imagery instead of street map |
| **Administrative Boundaries** | Show district/state boundaries |
| **Risk Zones** | Polygon areas showing risk zones rather than just point markers |
| **Layer Controls** | Toggle different data layers on/off |

> Clearly mark these as **post-MVP features**. Do not build them during the initial development phase.

### Map Click Flow

```mermaid
flowchart TD
    A[User views map] --> B[Sees colored markers]
    B --> C{User clicks a marker?}
    C -->|Yes| D[Popup shows risk info]
    D --> E{User clicks 'View Details'?}
    E -->|Yes| F[Navigate to Location Details page]
    E -->|No| G[Close popup, continue browsing]
    C -->|No| H{User clicks empty area?}
    H -->|Yes| I[Capture lat/lng for prediction]
    I --> J[Navigate to Prediction page with coordinates]
    H -->|No| K[User pans/zooms map]
```

---

## 9. Alerts System

The Alerts system notifies users about locations that have crossed risk thresholds.

### Alert Data Structure

Each alert contains:

| Field | Description | Example |
|-------|-------------|---------|
| **Alert ID** | Unique identifier | `ALT-2026-0042` |
| **Severity** | HIGH / MEDIUM / LOW | HIGH |
| **Location** | Name and coordinates | Chamoli (30.0668, 79.0193) |
| **Risk Probability** | The prediction probability that triggered the alert | 87% |
| **Trigger Condition** | What caused the alert | "Rainfall exceeded 100mm threshold" |
| **Timestamp** | When the alert was generated | 2026-08-31 14:30 IST |
| **Environmental Conditions** | Conditions at the time of alert | Rainfall: 125mm, Soil Moisture: 72% |
| **Recommended Action** | What the user should do | "Monitor area, prepare evacuation plan" |
| **Status** | Active / Resolved / Expired | Active |

### Alert List Page

The main alerts page shows a filterable, sortable list of alerts.

**Filter Options:**

| Filter | Options |
|--------|---------|
| **Severity** | All, High, Medium, Low |
| **Location** | Dropdown of monitored locations |
| **Date Range** | Start date — End date |
| **Status** | Active, Resolved, All |

**Alert Card Layout:**

```
┌──────────────────────────────────────────────┐
│ 🔴 HIGH RISK ALERT                          │
│                                              │
│ 📍 Chamoli, Uttarakhand                      │
│ 📊 Risk Probability: 87%                     │
│ 🌧️ Trigger: Rainfall exceeded 100mm          │
│ 🕐 2 hours ago                               │
│                                              │
│ [View Details]                               │
└──────────────────────────────────────────────┘
```

### Alert Details (Modal or Separate Page)

When the user clicks "View Details" on an alert, they see:

- Full alert information (all fields from the data structure table above)
- A mini map showing the alert location
- Environmental conditions at the time of the alert
- Recommended actions
- Link to the location's full details page
- Link to the location's prediction history

### How Alerts Are Retrieved

Alerts come from the backend via REST API:

- **All alerts:** `GET /api/alerts` (with optional query parameters for filtering)
- **Single alert:** `GET /api/alerts/:id`

The frontend calls the API on page load and displays the results. Filtering is done either client-side (for small datasets) or by sending filter parameters to the backend API.

> **Future Enhancement:** For real-time alerts, consider implementing WebSocket connections so the frontend receives alerts instantly without polling. This is **not required for MVP**.

---

## 10. Prediction History

The History page shows all past predictions, allowing users to review and analyze previous risk assessments.

### History Data Fields

| Column | Description |
|--------|-------------|
| **Date & Time** | When the prediction was made |
| **Location** | Location name and coordinates |
| **Risk Level** | HIGH / MEDIUM / LOW (with color indicator) |
| **Probability** | Risk probability percentage |
| **Environmental Conditions** | Key parameters at time of prediction |
| **Status** | Completed / Failed |

### Features

| Feature | Description |
|---------|-------------|
| **Search** | Search by location name |
| **Date Filtering** | Filter by date range (start date — end date) |
| **Risk Filtering** | Filter by risk level (High, Medium, Low, All) |
| **Location Filtering** | Filter by specific location |
| **Sorting** | Sort by date (newest/oldest), risk level, or location |
| **Pagination** | Show 10/20/50 results per page with page navigation |
| **View Details** | Click a row to see the full prediction details |

### History Table Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  🔍 Search...    📅 Date Range    ⚠️ Risk: All ▼    📍 Location ▼   │
├──────────────────────────────────────────────────────────────────────┤
│  Date          │ Location    │ Risk     │ Probability │ Actions     │
├────────────────┼─────────────┼──────────┼─────────────┼─────────────┤
│  Aug 31, 14:30 │ Chamoli     │ 🔴 HIGH  │ 87%         │ [Details]   │
│  Aug 31, 10:15 │ Tehri       │ 🟡 MED   │ 52%         │ [Details]   │
│  Aug 30, 22:00 │ Rudraprayag │ 🔴 HIGH  │ 79%         │ [Details]   │
│  Aug 30, 16:45 │ Nainital    │ 🟢 LOW   │ 18%         │ [Details]   │
│  Aug 30, 09:30 │ Pithoragarh │ 🟡 MED   │ 44%         │ [Details]   │
├──────────────────────────────────────────────────────────────────────┤
│  ← Prev  Page 1 of 12  Next →             Showing 1-10 of 115      │
└──────────────────────────────────────────────────────────────────────┘
```

### How History Data Comes from the Backend

- **List predictions:** `GET /api/history?page=1&pageSize=10&riskLevel=HIGH&startDate=2026-08-01`
- **Single prediction:** `GET /api/history/:id`

The backend handles pagination and filtering. The frontend sends query parameters and displays the results.

---

## 11. Analytics Page

The Analytics page provides **visual insights** into historical data and system-wide trends. This helps Authority users understand patterns and make informed decisions.

### Chart Library

Use **Recharts** — a React-based charting library built on D3. It is easy to use, well-documented, and integrates naturally with React components.

### MVP Analytics

These charts should be built first:

| Chart | Type | Description | Why It's Useful |
|-------|------|-------------|----------------|
| **Risk Trend** | Line Chart | Number of high/medium/low risk predictions over time | Shows if risk is increasing or decreasing |
| **Rainfall Trend** | Bar Chart | Average rainfall over the past 30 days | Rainfall is a key landslide trigger |
| **Prediction Statistics** | Pie Chart | Percentage of predictions by risk level | Quick overview of prediction distribution |
| **Alert Trend** | Line Chart | Number of alerts generated per day/week | Shows if alert frequency is increasing |

### Advanced / Future Analytics

These charts are nice to have but **not required for MVP**:

| Chart | Type | Description |
|-------|------|-------------|
| **Soil Moisture Trend** | Line Chart | Soil moisture over time for a location |
| **Location-wise Risk Comparison** | Bar Chart | Compare risk levels across multiple locations |
| **Environmental Correlation** | Scatter Plot | Relationship between rainfall and risk probability |
| **Seasonal Analysis** | Area Chart | Risk patterns across different seasons |
| **Prediction Accuracy** | Line Chart | If actual landslide data is available, compare predictions vs reality |

### Analytics Page Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  📅 Date Range: [Last 30 Days ▼]    📍 Location: [All ▼]        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐ │
│  │    RISK TREND (Line Chart)   │  │  RAINFALL TREND (Bar)    │ │
│  │                              │  │                          │ │
│  │  📈 High ─── Med ─── Low    │  │  📊 ███ ██ ████ ███     │ │
│  │                              │  │                          │ │
│  └──────────────────────────────┘  └──────────────────────────┘ │
│                                                                  │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐ │
│  │  PREDICTION STATS (Pie)     │  │  ALERT TREND (Line)      │ │
│  │                              │  │                          │ │
│  │    🔴 35% High              │  │  📈 ───────────          │ │
│  │    🟡 40% Medium            │  │                          │ │
│  │    🟢 25% Low               │  │                          │ │
│  └──────────────────────────────┘  └──────────────────────────┘ │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 12. Location Details Page

This page shows everything about a **single monitored location** in one place.

### Page Content

| Section | Description |
|---------|-------------|
| **Location Info** | Name, coordinates (latitude/longitude), region, elevation |
| **Current Risk** | Current risk level badge (HIGH/MEDIUM/LOW) with probability |
| **Environmental Conditions** | Latest readings for rainfall, soil moisture, slope, temperature, etc. |
| **Risk History Chart** | Line chart showing how risk level has changed over time |
| **Prediction History** | Table of past predictions for this location |
| **Alerts** | List of alerts triggered for this location |
| **Mini Map** | Small map centered on this location with a marker |
| **Run New Prediction** | Button to navigate to the Prediction page with this location pre-filled |

### Navigation Flow

```mermaid
flowchart LR
    A[Map Page] -->|Click Marker| D[Location Details]
    B[Dashboard] -->|Click Location| D
    C[Alerts] -->|Click Alert Location| D
    D -->|Click 'Predict'| E[Prediction Page]
    D -->|Click 'History'| F[Prediction History filtered by location]
    D -->|Click 'Alerts'| G[Alerts filtered by location]
```

---

## 13. Authentication and Authorization

### Key Concepts

**Authentication** = "Who are you?"  
Verifying that the user is who they claim to be (e.g., by checking their email and password).

**Authorization** = "What are you allowed to do?"  
Determining what features and data a logged-in user can access based on their role (Normal User, Authority, Admin).

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant R as React Frontend
    participant B as .NET Backend

    U->>R: Enter email & password
    R->>R: Validate form inputs
    R->>B: POST /api/auth/login
    B->>B: Verify credentials
    B->>R: JWT Token + User info
    R->>R: Store token in localStorage
    R->>R: Set user in AuthContext
    R->>U: Redirect to Dashboard
```

### JWT (JSON Web Token) Authentication

JWT is a standard way to handle authentication in web applications. Here's how it works in our system:

1. **Login:** User submits credentials. Backend verifies and returns a JWT token.
2. **Store Token:** Frontend stores the JWT token in `localStorage` (or `sessionStorage`).
3. **Send Token:** Every API request includes the token in the `Authorization` header: `Authorization: Bearer <token>`.
4. **Verify Token:** Backend verifies the token on every request. If invalid or expired, it returns `401 Unauthorized`.
5. **Logout:** Frontend removes the token from storage and clears the authentication state.

### Token Storage

```javascript
// On login success
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));

// On logout
localStorage.removeItem('token');
localStorage.removeItem('user');

// Sending token with API requests (in Axios interceptor)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Protected Routes

Protected routes prevent unauthenticated users from accessing certain pages.

```jsx
// Example ProtectedRoute component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

// Usage in routes
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### Role-Based UI

Different users see different navigation items and features:

```jsx
// Example: conditionally rendering nav items
{user.role === 'admin' && (
  <NavLink to="/admin">Admin Dashboard</NavLink>
)}

{(user.role === 'authority' || user.role === 'admin') && (
  <NavLink to="/analytics">Analytics</NavLink>
)}
```

> **Critical Security Note:** Hiding a button or page in React is **NOT security**. A user can still call the API directly using tools like Postman or browser dev tools. **The backend must always enforce authorization** on every API endpoint. The frontend hides UI elements for **convenience and user experience**, not for security.

---

## 14. React Routing Structure

### Application Routes

| Path | Page | Access |
|------|------|--------|
| `/login` | Login | Public |
| `/register` | Register *(optional)* | Public |
| `/forgot-password` | Forgot Password *(optional)* | Public |
| `/dashboard` | Dashboard | All authenticated users |
| `/prediction` | Prediction | All authenticated users |
| `/map` | Live Risk Map | All authenticated users |
| `/alerts` | Alerts | All authenticated users |
| `/history` | Prediction History | All authenticated users |
| `/analytics` | Analytics | Authority, Admin |
| `/location/:id` | Location Details | All authenticated users |
| `/profile` | User Profile | All authenticated users |
| `/settings` | Settings *(optional)* | All authenticated users |
| `/admin` | Admin Dashboard | Admin only |
| `/admin/users` | User Management | Admin only |
| `/admin/locations` | Location Management | Admin only |
| `/admin/system` | System Management *(optional)* | Admin only |

### Route Configuration Example

```jsx
// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes - All Users */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/prediction" element={
        <ProtectedRoute><Prediction /></ProtectedRoute>
      } />
      <Route path="/map" element={
        <ProtectedRoute><MapPage /></ProtectedRoute>
      } />
      <Route path="/alerts" element={
        <ProtectedRoute><Alerts /></ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute><History /></ProtectedRoute>
      } />
      <Route path="/location/:id" element={
        <ProtectedRoute><LocationDetails /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      {/* Protected Routes - Authority & Admin */}
      <Route path="/analytics" element={
        <ProtectedRoute allowedRoles={['authority', 'admin']}>
          <Analytics />
        </ProtectedRoute>
      } />

      {/* Protected Routes - Admin Only */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <UserManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/locations" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <LocationManagement />
        </ProtectedRoute>
      } />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};
```

---

## 15. Frontend Architecture

### High-Level Architecture

```mermaid
graph TD
    A[App.jsx] --> B[Routes / AppRoutes.jsx]
    B --> C[Pages]
    C --> D[Components]
    D --> E[Services / API Layer]
    
    F[Context / State] --> C
    F --> D
    
    G[Custom Hooks] --> C
    G --> D
    
    H[Utils / Helpers] --> D
    H --> E

    style A fill:#e3f2fd
    style B fill:#fff3e0
    style C fill:#e8f5e9
    style D fill:#fce4ec
    style E fill:#f3e5f5
    style F fill:#fff9c4
    style G fill:#e0f7fa
    style H fill:#fbe9e7
```

### Folder Purpose

| Folder | Purpose |
|--------|---------|
| `src/components/` | Reusable UI components organized by feature. Each subfolder contains components related to a specific feature (dashboard, prediction, map, etc.) |
| `src/pages/` | Top-level page components. Each page corresponds to a route and assembles components to build the full page UI |
| `src/services/` | API service files. Each file contains functions to call specific backend endpoints using Axios |
| `src/hooks/` | Custom React hooks that encapsulate reusable logic (e.g., `useAuth`, `usePrediction`) |
| `src/context/` | React Context providers for global state management (authentication, app-wide settings) |
| `src/utils/` | Utility functions, constants, formatters, and validators |
| `src/assets/` | Static assets like images, icons, and fonts |
| `src/routes/` | Route configuration and protected route components |

---

## 16. Detailed Folder Structure

```
src/
│
├── assets/                          # Static assets
│   ├── images/                      # Images and logos
│   └── icons/                       # Custom icons (if any)
│
├── components/                      # Reusable UI components
│   │
│   ├── layout/                      # Layout components (used on every page)
│   │   ├── Navbar.jsx               # Top navigation bar
│   │   ├── Sidebar.jsx              # Side navigation menu
│   │   └── PageContainer.jsx        # Wrapper for consistent page padding/margins
│   │
│   ├── dashboard/                   # Dashboard-specific components
│   │   ├── RiskSummary.jsx          # Row of risk summary cards
│   │   ├── RiskCard.jsx             # Single summary card (e.g., "High Risk: 5")
│   │   ├── ConditionCard.jsx        # Environmental condition display card
│   │   ├── RecentAlerts.jsx         # List of recent alerts on dashboard
│   │   └── RiskMap.jsx              # Mini map for dashboard
│   │
│   ├── prediction/                  # Prediction-specific components
│   │   ├── PredictionForm.jsx       # Main prediction input form
│   │   ├── LocationSelector.jsx     # Map/dropdown for selecting location
│   │   ├── InputField.jsx           # Reusable form input field
│   │   └── PredictionResult.jsx     # Prediction result display
│   │
│   ├── map/                         # Map-specific components
│   │   ├── MapView.jsx              # Main Leaflet map component
│   │   ├── RiskMarker.jsx           # Single risk marker on the map
│   │   ├── RiskZone.jsx             # Risk zone polygon (future)
│   │   └── MapControls.jsx          # Custom map control buttons
│   │
│   ├── alerts/                      # Alert-specific components
│   │   ├── AlertCard.jsx            # Single alert card
│   │   ├── AlertList.jsx            # Filterable list of alerts
│   │   └── AlertDetails.jsx         # Alert detail view (modal or page)
│   │
│   ├── analytics/                   # Analytics-specific components
│   │   ├── RiskChart.jsx            # Risk trend line chart
│   │   ├── RainfallChart.jsx        # Rainfall bar chart
│   │   └── StatisticsCard.jsx       # Statistics summary card
│   │
│   └── common/                      # Shared components used everywhere
│       ├── Button.jsx               # Styled button component
│       ├── Modal.jsx                # Reusable modal dialog
│       ├── Loader.jsx               # Loading spinner/skeleton
│       ├── ErrorMessage.jsx         # Error message display
│       └── EmptyState.jsx           # Empty state placeholder
│
├── pages/                           # Page-level components (one per route)
│   ├── Login.jsx                    # Login page
│   ├── Dashboard.jsx                # Dashboard page
│   ├── Prediction.jsx               # Prediction page
│   ├── MapPage.jsx                  # Full map page
│   ├── Alerts.jsx                   # Alerts page
│   ├── History.jsx                  # Prediction history page
│   ├── Analytics.jsx                # Analytics page
│   ├── LocationDetails.jsx          # Location details page
│   ├── Profile.jsx                  # User profile page
│   ├── Settings.jsx                 # Settings page (optional)
│   ├── AdminDashboard.jsx           # Admin dashboard
│   ├── UserManagement.jsx           # Admin user management
│   └── LocationManagement.jsx       # Admin location management
│
├── services/                        # API service layer
│   ├── api.js                       # Axios instance with base URL and interceptors
│   ├── authService.js               # Login, register, profile API calls
│   ├── predictionService.js         # Prediction API calls
│   ├── alertService.js              # Alert API calls
│   ├── locationService.js           # Location API calls
│   └── historyService.js            # History API calls
│
├── hooks/                           # Custom React hooks
│   ├── useAuth.js                   # Authentication state and methods
│   ├── usePrediction.js             # Prediction form and result logic
│   ├── useAlerts.js                 # Alert fetching and filtering logic
│   └── useLocations.js              # Location data fetching logic
│
├── context/                         # React Context providers
│   ├── AuthContext.jsx              # Authentication context (user, token, role)
│   └── AppContext.jsx               # App-wide context (theme, notifications)
│
├── routes/                          # Route configuration
│   ├── AppRoutes.jsx                # Main route definitions
│   └── ProtectedRoute.jsx          # Protected route wrapper component
│
├── utils/                           # Utility functions
│   ├── constants.js                 # App-wide constants (API URLs, risk thresholds)
│   ├── formatters.js                # Data formatting functions (dates, numbers)
│   └── validators.js                # Form validation functions
│
├── App.jsx                          # Root app component
├── App.css                          # Global styles (if needed beyond Tailwind)
└── main.jsx                         # Entry point (renders App into DOM)
```

### Key Files Explained

| File | What It Does |
|------|-------------|
| `api.js` | Creates a configured Axios instance with the backend base URL, JWT token interceptor, and error response interceptor. All other service files import this instance. |
| `authService.js` | Functions like `login(email, password)`, `register(userData)`, `getProfile()`, `logout()`. |
| `predictionService.js` | Functions like `createPrediction(data)`, `getPrediction(id)`. |
| `AuthContext.jsx` | Provides `user`, `token`, `isAuthenticated`, `login()`, `logout()` to the entire app via React Context. |
| `useAuth.js` | Custom hook that wraps `useContext(AuthContext)` for convenient access to auth state. |
| `constants.js` | API base URL, risk level thresholds, color mappings, pagination defaults. |
| `formatters.js` | Functions like `formatDate(date)`, `formatProbability(0.87)` → `"87%"`, `getRiskLabel(0.87)` → `"HIGH"`. |
| `validators.js` | Functions like `validateLatitude(value)`, `validatePredictionForm(formData)`. |

---

## 17. Component Architecture

### Component Hierarchy

Components follow a **parent → child** structure. Pages assemble components, and components can contain smaller sub-components.

#### Dashboard Page Component Tree

```
Dashboard (page)
├── RiskSummary
│   ├── RiskCard (Total Locations)
│   ├── RiskCard (High Risk)
│   ├── RiskCard (Medium Risk)
│   ├── RiskCard (Low Risk)
│   └── RiskCard (Active Alerts)
├── ConditionCard (Rainfall)
├── ConditionCard (Soil Moisture)
├── ConditionCard (Slope)
├── ConditionCard (Temperature)
├── RiskMap (mini map)
│   ├── RiskMarker (per location)
│   └── MapControls
├── RecentAlerts
│   └── AlertCard (per alert)
└── RiskChart
```

#### Prediction Page Component Tree

```
Prediction (page)
├── PredictionForm
│   ├── LocationSelector
│   │   └── MapView (mini map for location picking)
│   ├── InputField (Latitude)
│   ├── InputField (Longitude)
│   ├── InputField (Rainfall)
│   ├── InputField (Soil Moisture)
│   ├── InputField (Slope)
│   ├── InputField (Elevation)
│   ├── InputField (Temperature)
│   └── Button (Submit)
├── Loader (while predicting)
├── ErrorMessage (if API fails)
└── PredictionResult
    ├── Risk Level Badge
    ├── Probability Bar
    ├── Environmental Factors List
    └── Action Buttons
```

### Component Design Principles

| Principle | Description | Example |
|-----------|-------------|---------|
| **Single Responsibility** | Each component should do one thing well | `RiskCard` only displays a single risk metric card |
| **Reusability** | Components should be reusable with different data | `RiskCard` accepts `title`, `value`, `color` as props and can show any metric |
| **Props Down** | Parent components pass data to children via props | `Dashboard` fetches data and passes it to `RiskSummary` via props |
| **State Up** | If two components need the same data, lift state to their common parent | Form state lives in `PredictionForm`, not in individual `InputField` components |
| **Small Components** | Break large components into smaller ones | Instead of one 500-line `Dashboard`, create 5 focused sub-components |

### Props Example

```jsx
// RiskCard receives data through props
<RiskCard
  title="High Risk"
  value={5}
  color="red"
  icon="🔴"
  onClick={() => navigate('/map?filter=high')}
/>

// RiskCard component definition
const RiskCard = ({ title, value, color, icon, onClick }) => {
  return (
    <div className={`card border-${color}-500`} onClick={onClick}>
      <span className="icon">{icon}</span>
      <h3>{title}</h3>
      <p className="value">{value}</p>
    </div>
  );
};
```

---

## 18. API Integration Architecture

### How React Communicates with the Backend

```mermaid
flowchart LR
    A[React Component] --> B[Service Layer]
    B --> C[Axios Instance]
    C --> D[.NET REST API]
    D --> E[Response]
    E --> C
    C --> B
    B --> F[React State]
    F --> G[UI Update]
```

**Step-by-step:**

1. A React component (e.g., `PredictionForm`) calls a service function (e.g., `predictionService.createPrediction(data)`).
2. The service function uses the configured Axios instance to make an HTTP request.
3. Axios sends the request to the .NET backend with the JWT token in the header.
4. The backend processes the request (possibly calling the ML model).
5. The backend returns a JSON response.
6. The service function returns the response data to the component.
7. The component updates its state with the new data.
8. React re-renders the UI to reflect the new state.

### Axios Instance Setup

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Proposed API Endpoints

> **Important:** These are **proposed endpoints**. The actual endpoint URLs, request formats, and response formats must be confirmed with the backend team. Replace these with the real API contract before finalizing the frontend.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/register` | User registration |
| `GET` | `/api/auth/profile` | Get current user profile |
| `POST` | `/api/predictions` | Create new prediction |
| `GET` | `/api/predictions/:id` | Get specific prediction |
| `GET` | `/api/locations` | Get all monitored locations |
| `GET` | `/api/locations/:id` | Get specific location details |
| `GET` | `/api/alerts` | Get alerts (with filters) |
| `GET` | `/api/alerts/:id` | Get specific alert details |
| `GET` | `/api/history` | Get prediction history (with filters) |
| `GET` | `/api/analytics/risk-trends` | Get risk trend data |
| `GET` | `/api/analytics/predictions` | Get prediction statistics |

### Example Request and Response

#### Create Prediction

**Request:**

```http
POST /api/predictions
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

```json
{
  "latitude": 30.0668,
  "longitude": 79.0193,
  "rainfall": 125,
  "soilMoisture": 72,
  "slope": 35,
  "elevation": 1200,
  "temperature": 24
}
```

**Response (Success — 200 OK):**

```json
{
  "id": "pred-2026-0042",
  "riskLevel": "HIGH",
  "probability": 0.87,
  "confidence": 0.91,
  "location": {
    "name": "Chamoli",
    "latitude": 30.0668,
    "longitude": 79.0193
  },
  "environmentalFactors": {
    "rainfall": 125,
    "soilMoisture": 72,
    "slope": 35,
    "elevation": 1200,
    "temperature": 24
  },
  "recommendedAction": "High risk detected. Monitor area closely and prepare evacuation plan.",
  "timestamp": "2026-08-31T14:30:00Z"
}
```

**Response (Error — 400 Bad Request):**

```json
{
  "error": "Validation failed",
  "details": {
    "latitude": "Latitude must be between -90 and 90",
    "rainfall": "Rainfall must be a non-negative number"
  }
}
```

### How the Frontend Handles the Response

```javascript
// In the Prediction page component
const handleSubmit = async (formData) => {
  try {
    setLoading(true);
    setError(null);

    const result = await predictionService.createPrediction(formData);

    setPredictionResult(result);
    setLoading(false);
  } catch (err) {
    setError(err.response?.data?.error || 'Unable to generate prediction. Please try again.');
    setLoading(false);
  }
};
```

### Service Layer Example

```javascript
// src/services/predictionService.js
import api from './api';

const predictionService = {
  createPrediction: async (data) => {
    const response = await api.post('/predictions', data);
    return response.data;
  },

  getPrediction: async (id) => {
    const response = await api.get(`/predictions/${id}`);
    return response.data;
  },
};

export default predictionService;
```

---

## 19. Frontend State Management

### Local State (Component-Level)

Local state is data that belongs to a **single component** and doesn't need to be shared across the app.

| State | Where | Example |
|-------|-------|---------|
| Form field values | `PredictionForm` | `{ latitude: '', longitude: '', rainfall: '' }` |
| Modal open/close | Any page | `isModalOpen: true/false` |
| Selected marker | `MapView` | `selectedMarkerId: 'loc-42'` |
| Loading state | Any API-driven component | `isLoading: true/false` |
| Error message | Any API-driven component | `error: 'Failed to load data'` |
| Pagination | `History` | `{ page: 1, pageSize: 10 }` |
| Filter values | `Alerts`, `History` | `{ severity: 'HIGH', location: 'all' }` |

**Use `useState` for local state:**

```javascript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
const [predictionResult, setPredictionResult] = useState(null);
```

**Use `useEffect` for side effects (API calls, subscriptions):**

```javascript
useEffect(() => {
  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch (err) {
      setError('Failed to load alerts');
    }
    setIsLoading(false);
  };

  fetchAlerts();
}, []); // Empty array = run once on mount
```

### Global State (App-Level)

Global state is data that **multiple components across different pages** need to access.

| State | Description | Accessed By |
|-------|-------------|-------------|
| Current user | Logged-in user's info (name, email, role) | Navbar, Sidebar, every protected route |
| JWT token | Authentication token | Every API service call |
| User role | User's role (user/authority/admin) | Protected routes, conditional UI rendering |
| Global notifications | Toast messages, system-wide alerts | Any page |

**Use React Context for global state:**

```jsx
// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const isAuthenticated = !!token;

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Use custom hooks to access context:**

```javascript
// src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
```

### When to Use What

| Scenario | Tool |
|----------|------|
| Form inputs, modal state, local UI toggles | `useState` |
| Fetching data on page load | `useEffect` |
| Sharing auth/user state across the entire app | Context API + `useContext` |
| Encapsulating reusable logic (fetch + loading + error) | Custom hooks |
| Very complex state with many actions | `useReducer` (built into React) |

### What About Redux?

**Do not introduce Redux** unless the application grows to the point where Context API becomes difficult to manage. For an SIH project with the scope described in this document, Context API and custom hooks are **sufficient**.

If the project grows significantly in the future (e.g., real-time data, complex caching, many interconnected states), consider **Redux Toolkit** as an upgrade path. Redux Toolkit simplifies Redux significantly compared to classic Redux.

---

## 20. Loading, Error and Empty States

Every page or component that fetches data from the backend **must handle four states**:

### 1. Loading State

Shown while the API request is in progress.

```
┌──────────────────────────────┐
│                              │
│       ⏳ Loading...           │
│                              │
│    [Spinner animation]       │
│                              │
│   Loading prediction data... │
│                              │
└──────────────────────────────┘
```

Use a spinner, skeleton screen, or loading text. Never leave the screen blank while loading.

### 2. Success State

Shown when data is successfully loaded and displayed.

```
┌──────────────────────────────┐
│                              │
│   ✅ Prediction Completed     │
│                              │
│   🔴 HIGH RISK — 87%         │
│                              │
│   [Full result details...]   │
│                              │
└──────────────────────────────┘
```

### 3. Error State

Shown when the API request fails.

```
┌──────────────────────────────┐
│                              │
│   ❌ Something went wrong     │
│                              │
│   Unable to generate         │
│   prediction.                │
│   Please try again.          │
│                              │
│   [Retry Button]             │
│                              │
└──────────────────────────────┘
```

Always provide a **Retry** button so the user can try again without refreshing the page.

### 4. Empty State

Shown when the API returns success but with no data.

```
┌──────────────────────────────┐
│                              │
│   📭 No data found           │
│                              │
│   No prediction history      │
│   found for this location.   │
│                              │
│   [Run New Prediction]       │
│                              │
└──────────────────────────────┘
```

### Why These States Matter

- **Loading:** Without a loading state, users think the app is broken or frozen.
- **Error:** Without error handling, users see a blank page or a cryptic JavaScript error in the console.
- **Empty:** Without an empty state, users see a blank table and don't know if data is still loading, if there's an error, or if there's genuinely no data.

### Reusable Components

Create reusable components for these states in `src/components/common/`:

```jsx
// Loader.jsx
const Loader = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center p-8">
    <div className="spinner" /> {/* CSS spinner animation */}
    <p className="mt-4 text-gray-500">{message}</p>
  </div>
);

// ErrorMessage.jsx
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center p-8 text-red-600">
    <span className="text-4xl">❌</span>
    <p className="mt-4">{message}</p>
    {onRetry && <button onClick={onRetry} className="mt-4 btn">Retry</button>}
  </div>
);

// EmptyState.jsx
const EmptyState = ({ message, actionLabel, onAction }) => (
  <div className="flex flex-col items-center p-8 text-gray-500">
    <span className="text-4xl">📭</span>
    <p className="mt-4">{message}</p>
    {onAction && <button onClick={onAction} className="mt-4 btn">{actionLabel}</button>}
  </div>
);
```

---

## 21. UI/UX Design Guidelines

### Color Scheme

| Color | Usage | Hex Code |
|-------|-------|----------|
| **Primary Blue** | Primary buttons, links, active navigation | `#2563EB` |
| **Dark Blue** | Navbar, sidebar, headers | `#1E3A5F` |
| **White** | Page background, cards | `#FFFFFF` |
| **Light Gray** | Secondary backgrounds, borders | `#F3F4F6` |
| **Dark Gray** | Body text | `#374151` |
| **Risk Red** | High risk indicators, danger alerts | `#DC2626` |
| **Risk Orange** | Medium risk indicators, warning alerts | `#F59E0B` |
| **Risk Green** | Low risk indicators, success states | `#16A34A` |
| **Error Red** | Error messages, validation errors | `#EF4444` |
| **Info Blue** | Informational messages | `#3B82F6` |

### Typography

| Element | Font Size | Weight | Usage |
|---------|-----------|--------|-------|
| Page Title | 24px / `text-2xl` | Bold | Main page headings |
| Section Title | 20px / `text-xl` | Semibold | Section headings within a page |
| Card Title | 16px / `text-base` | Semibold | Card component headings |
| Body Text | 14px / `text-sm` | Normal | General content text |
| Small Text | 12px / `text-xs` | Normal | Timestamps, secondary info |
| Button Text | 14px / `text-sm` | Medium | Button labels |

Use the system font stack or a clean sans-serif font like **Inter**.

### Spacing

Follow a consistent spacing scale based on Tailwind's defaults:

- **Card padding:** `p-4` (16px) or `p-6` (24px)
- **Section gaps:** `gap-6` (24px)
- **Card margins:** `mb-4` (16px)
- **Form field spacing:** `space-y-4` (16px between fields)

### Component Styling Guidelines

| Component | Guidelines |
|-----------|-----------|
| **Cards** | White background, subtle shadow (`shadow-sm`), rounded corners (`rounded-lg`), consistent padding |
| **Buttons** | Primary (filled blue), Secondary (outlined), Danger (filled red). Consistent height and padding |
| **Forms** | Labels above inputs, full-width inputs, clear validation messages below fields |
| **Tables** | Alternating row colors, hover effect, clear headers, responsive (horizontal scroll on mobile) |
| **Alerts** | Colored left border or background based on severity, icon + text |
| **Icons** | Use emoji icons for MVP or a library like React Icons for a polished look |

### Risk Indicators — Visual Hierarchy

| Risk Level | Color | Background | Icon | Text |
|-----------|-------|------------|------|------|
| **Low** | Green `#16A34A` | `bg-green-50` | ✅ or 🟢 | "LOW RISK" |
| **Medium** | Amber `#F59E0B` | `bg-yellow-50` | ⚠️ or 🟡 | "MEDIUM RISK" |
| **High** | Red `#DC2626` | `bg-red-50` | 🚨 or 🔴 | "HIGH RISK" |

> **Accessibility:** Always use **text labels** and **icons** alongside colors. Do not rely on color alone, as approximately 8% of men and 0.5% of women have some form of color blindness.

### Responsive Design

| Breakpoint | Screen Size | Layout |
|-----------|-------------|--------|
| **Desktop** | ≥1024px | Full sidebar + multi-column content |
| **Tablet** | 768px – 1023px | Collapsed sidebar (hamburger menu) + 2-column content |
| **Mobile** | <768px | No sidebar (bottom nav or hamburger) + single-column stacked content |

**Responsive behavior for key components:**

- **Dashboard cards:** 5 in a row (desktop) → 3 in a row (tablet) → 1 in a row, stacked (mobile)
- **Map + sidebar info:** Side by side (desktop) → Map on top, info below (mobile)
- **Tables:** Horizontal scroll on mobile, or convert to card layout
- **Charts:** Full width on all screens, reduced height on mobile
- **Navbar:** Full links (desktop) → Hamburger menu (mobile)

---

## 22. Recommended Frontend Technologies

| Technology | Purpose | Why We Use It |
|-----------|---------|---------------|
| **React 18+** | UI library | Industry-standard component-based library. Large ecosystem, great documentation, widely used in SIH projects |
| **Vite** | Build tool & dev server | Extremely fast development server with hot module replacement. Much faster than Create React App |
| **React Router v6** | Client-side routing | Standard routing library for React. Supports nested routes, protected routes, and dynamic parameters |
| **Tailwind CSS** | Utility-first CSS framework | Rapid UI development without writing custom CSS files. Consistent spacing, responsive design built-in |
| **Axios** | HTTP client | Clean API for making HTTP requests. Supports interceptors (for JWT), error handling, and request/response transformation |
| **React Leaflet** | Interactive maps | Free, open-source map library. Perfect for displaying location markers, risk zones, and interactive geographic data |
| **Recharts** | Charts & data visualization | React-native charting library built on D3. Easy to use for line charts, bar charts, pie charts |
| **JWT (jsonwebtoken)** | Authentication tokens | Industry standard for stateless authentication. Works well with .NET backend |
| **React Context API** | Global state management | Built into React, no extra library needed. Sufficient for auth state and app-wide settings |
| **ESLint** | Code quality | Catches common errors, enforces consistent code style across the team |
| **Git / GitHub** | Version control | Essential for team collaboration, code reviews, and deployment |

> Only install libraries you actually use. Do not add dependencies "just in case." Every dependency is a maintenance burden.

---

## 23. Complete User Flow

### Normal User Flow

```mermaid
flowchart TD
    A[Open Application] --> B[Login Page]
    B --> C[Enter Credentials]
    C --> D{Authentication}
    D -->|Success| E[Dashboard]
    D -->|Failure| F[Show Error, Retry]
    F --> C
    
    E --> G[View Risk Summary]
    E --> H[View Mini Map]
    E --> I[View Recent Alerts]
    
    G --> J[Select Location]
    H --> J
    
    J --> K[View Current Conditions]
    K --> L[Run Prediction]
    L --> M[View Risk Result]
    
    M --> N[View on Full Map]
    M --> O[View Prediction History]
    M --> P[Run Another Prediction]
    
    N --> Q[Click Map Markers]
    Q --> R[View Location Details]
    
    I --> S[View Alert Details]
    S --> R

    style E fill:#e8f5e9
    style M fill:#fff3e0
    style R fill:#e3f2fd
```

### Authority / Disaster Management Flow

```mermaid
flowchart TD
    A[Login] --> B[Dashboard]
    B --> C[Monitor Risk Map]
    C --> D[Identify High-Risk Areas]
    D --> E[Open Alert for Area]
    E --> F[View Location Details]
    F --> G[Analyze Historical Trends]
    G --> H[Open Analytics Page]
    H --> I[Review Risk Trends]
    I --> J[Review Rainfall Data]
    J --> K[Make Informed Decisions]
    
    B --> L[Monitor Active Alerts]
    L --> M[Filter by Severity]
    M --> N[View Alert Details]
    N --> F

    style B fill:#e8f5e9
    style K fill:#fff3e0
```

### Admin Flow

```mermaid
flowchart TD
    A[Login] --> B[Admin Dashboard]
    B --> C[View System Statistics]
    
    B --> D[Manage Users]
    D --> E[Create / Edit / Deactivate Users]
    D --> F[Assign Roles]
    
    B --> G[Manage Locations]
    G --> H[Add New Monitored Locations]
    G --> I[Edit Location Data]
    G --> J[Remove Locations]
    
    B --> K[Monitor System]
    K --> L[Check API Health]
    K --> M[View Usage Metrics]

    style B fill:#e8f5e9
```

---

## 24. Frontend-to-Backend-to-ML Flow

This is the most important flow to understand. It shows how user input travels through the entire system and comes back as a prediction result.

### Complete Data Flow

```mermaid
sequenceDiagram
    participant User
    participant React as React Frontend
    participant API as .NET Backend API
    participant ML as ML Prediction Service
    
    User->>React: Enters location & environmental data
    React->>React: Validates form inputs
    
    alt Validation fails
        React->>User: Shows validation errors
    end
    
    React->>React: Shows loading spinner
    React->>API: POST /api/predictions (JSON body)
    
    API->>API: Validates request data
    API->>API: Prepares model input format
    API->>ML: Sends data to ML model
    
    ML->>ML: Runs prediction algorithm
    ML->>API: Returns prediction result
    
    API->>API: Formats response (adds metadata, saves to DB)
    API->>React: Returns JSON response
    
    React->>React: Updates component state
    React->>React: PredictionResult component renders
    React->>User: Displays human-readable risk information
```

### Team Ownership

Each part of this flow is owned by a different team:

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  FRONTEND TEAM RESPONSIBILITY                                   │
│  ─────────────────────────────                                   │
│  ✅ Build the prediction form UI                                 │
│  ✅ Validate user input before sending                           │
│  ✅ Show loading state while waiting                             │
│  ✅ Call the backend API with correct JSON format                │
│  ✅ Handle success, error, and empty responses                   │
│  ✅ Convert raw prediction data into user-friendly display       │
│  ✅ Show risk level, probability, color coding, icons            │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  BACKEND TEAM RESPONSIBILITY                                    │
│  ─────────────────────────────                                   │
│  ✅ Create REST API endpoints                                    │
│  ✅ Validate incoming data (server-side)                         │
│  ✅ Transform data into ML model input format                    │
│  ✅ Call the ML prediction service                               │
│  ✅ Format the prediction result into API response               │
│  ✅ Save predictions to database                                 │
│  ✅ Enforce authentication and authorization                     │
│  ✅ Handle errors and return proper HTTP status codes             │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ML TEAM RESPONSIBILITY                                         │
│  ──────────────────────                                          │
│  ✅ Collect and preprocess training data                         │
│  ✅ Select and train the ML model                                │
│  ✅ Evaluate model accuracy                                      │
│  ✅ Define model input/output format                             │
│  ✅ Deploy model as a prediction service                         │
│  ✅ Provide prediction results when called by backend            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### What the Frontend Developer Needs from Other Teams

| From | What You Need |
|------|--------------|
| **Backend Team** | Exact API endpoint URLs, request JSON format, response JSON format, authentication mechanism, error response format |
| **ML Team** | List of required input parameters, valid ranges for each parameter, output format (risk level, probability, confidence), risk level thresholds |

> **Action Item:** Schedule a meeting between frontend, backend, and ML teams to finalize the API contract before building the prediction feature.

---

## 25. Security Considerations

### Frontend Security Checklist

| Practice | Description |
|----------|-------------|
| **JWT Token Handling** | Store tokens in `localStorage`. Send tokens in the `Authorization` header. Remove tokens on logout. Never expose tokens in URLs. |
| **Protected Routes** | Use `ProtectedRoute` component to prevent unauthenticated users from accessing pages. Redirect to `/login` if no valid token. |
| **Role-Based UI** | Show/hide navigation items and features based on user role. Admin features should only be visible to admins. |
| **Input Validation** | Validate all form inputs on the frontend before sending to the backend. This prevents unnecessary API calls and provides immediate feedback. |
| **No Secrets in Frontend** | Never put API keys, database passwords, or secret tokens in React code. They are visible to anyone using browser dev tools. |
| **Environment Variables** | Use `.env` files for configuration (API base URL). Prefix variables with `VITE_` in Vite projects. Never commit `.env` files to Git. |
| **HTTPS** | Always use HTTPS in production. This encrypts data between the user's browser and the server. |
| **XSS Prevention** | React automatically escapes content rendered with `{}`. Avoid using `dangerouslySetInnerHTML` unless absolutely necessary and the content is sanitized. |
| **Avoid Storing Sensitive Data** | Do not store sensitive information (like full API responses with personal data) in `localStorage` unnecessarily. |

### Critical Security Rule

> **⚠️ IMPORTANT:** Hiding a button or page in the React UI is **NOT** a security measure. Any user can open browser developer tools, inspect network requests, and call API endpoints directly.
>
> **Authorization must ALWAYS be enforced by the backend.**
>
> The frontend hides UI elements for **user experience** (so a normal user doesn't see an "Admin" button they can't use). The backend enforces **security** (so even if someone calls the admin API directly, they get a `403 Forbidden` response).

---

## 26. Performance Considerations

### Practical Performance Tips

| Technique | Description | When to Use |
|-----------|-------------|-------------|
| **Lazy Loading** | Load pages only when the user navigates to them using `React.lazy()` and `Suspense`. | All page components. Especially important for heavy pages like Map and Analytics. |
| **Code Splitting** | Vite automatically code-splits at dynamic `import()` boundaries. Combined with lazy loading. | Automatic with lazy loading. |
| **Image Optimization** | Compress images before adding to `assets/`. Use WebP format where possible. | All static images. |
| **Avoid Unnecessary Re-Renders** | Use `React.memo()` for components that receive the same props frequently. Use `useCallback` for event handlers passed as props. | Components that re-render often without their data changing (e.g., map markers). |
| **Memoization** | Use `useMemo()` to avoid recalculating expensive values on every render. | Filtering/sorting large lists, computing derived data. |
| **Pagination** | Never load all data at once. Use server-side pagination for history, alerts, and user lists. | Any list with potentially more than 50 items. |
| **Efficient API Requests** | Don't fetch the same data multiple times. Cache responses in state or context where appropriate. | Dashboard data, location lists. |
| **Map Performance** | Use marker clustering for many markers. Limit the number of markers rendered at once. | Map page with 50+ locations. |
| **Chart Performance** | Limit data points in charts. Aggregate data server-side before sending to the frontend. | Analytics charts with time-series data. |
| **Debouncing** | Add a 300ms delay before triggering search API calls as the user types. | Search inputs in history, alerts, user management. |
| **Caching** | Cache location lists and static data that doesn't change frequently. | Location dropdown, risk threshold configuration. |

### Lazy Loading Example

```jsx
import { lazy, Suspense } from 'react';
import Loader from './components/common/Loader';

const MapPage = lazy(() => import('./pages/MapPage'));
const Analytics = lazy(() => import('./pages/Analytics'));

// In routes
<Suspense fallback={<Loader message="Loading page..." />}>
  <Route path="/map" element={<MapPage />} />
  <Route path="/analytics" element={<Analytics />} />
</Suspense>
```

---

## 27. Development Roadmap

### Phase 1 — Project Setup (Days 1–2)

| Task | Description |
|------|-------------|
| Initialize React + Vite | `npm create vite@latest sih-landslide -- --template react` |
| Set up folder structure | Create all folders as described in Section 16 |
| Configure routing | Install React Router, set up basic routes |
| Install Tailwind CSS | Configure Tailwind with the project |
| Set up Git | Initialize repository, create `.gitignore`, push to GitHub |
| Configure ESLint | Set up linting rules for code consistency |
| Create environment files | `.env` with API base URL |

### Phase 2 — UI Shell & Layout (Days 3–5)

| Task | Description |
|------|-------------|
| Build Navbar | Logo, navigation links, user menu |
| Build Sidebar | Navigation menu for desktop |
| Build PageContainer | Consistent page wrapper |
| Build common components | Button, Loader, ErrorMessage, EmptyState, Modal |
| Create Dashboard layout | Grid layout with placeholder cards |
| Create card components | RiskCard, ConditionCard |
| Build form components | InputField, Button, LocationSelector |

### Phase 3 — Core Features (Days 6–10)

| Task | Description |
|------|-------------|
| Prediction form | Complete form with validation |
| Prediction result | Risk display component with color coding |
| Map integration | React Leaflet map with markers |
| Alert list | Alert cards with filtering |
| History page | Table with search, filter, pagination |
| Location details | Combined info page |

### Phase 4 — Backend Integration (Days 11–15)

| Task | Description |
|------|-------------|
| Set up Axios | Configure `api.js` with base URL and interceptors |
| Auth service | Login, register, token management |
| Prediction API | Connect prediction form to backend |
| Location API | Fetch locations for map and dropdown |
| Alert API | Fetch and filter alerts |
| History API | Fetch and paginate history |
| Error handling | Handle API errors gracefully everywhere |

### Phase 5 — Advanced Features (Days 16–20)

| Task | Description |
|------|-------------|
| Analytics page | Charts with Recharts |
| Role-based access | ProtectedRoute with role checking |
| Admin dashboard | System statistics |
| User management | CRUD for admin |
| Location management | CRUD for admin |
| Advanced map features | Popups, controls, layers |

### Phase 6 — Finalization (Days 21–25)

| Task | Description |
|------|-------------|
| Responsive design | Test and fix all pages on mobile/tablet |
| Loading/error states | Ensure every API page has all 4 states |
| Performance | Lazy loading, debouncing, optimization |
| Cross-browser testing | Test on Chrome, Firefox, Edge |
| Bug fixes | Fix all known issues |
| Final review | Code cleanup, documentation |
| Deployment | Deploy to hosting platform |

> **Note:** This is an **estimated** timeline. Adjust based on team size and experience.

---

## 28. MVP vs Future Features

### ✅ Must Have for SIH MVP

These features are **required** for the project to be functional and presentable:

| Feature | Priority |
|---------|----------|
| Login / Authentication | 🔴 Critical |
| Dashboard with risk summary | 🔴 Critical |
| Prediction form and submission | 🔴 Critical |
| Prediction result display (risk level, probability) | 🔴 Critical |
| Interactive risk map with markers | 🔴 Critical |
| Alerts list | 🔴 Critical |
| Prediction history | 🔴 Critical |
| API integration with .NET backend | 🔴 Critical |
| Responsive UI (works on mobile) | 🔴 Critical |
| Loading and error states | 🔴 Critical |

### 🟡 Good to Have

These features make the project **stronger** but are not strictly required for MVP:

| Feature | Priority |
|---------|----------|
| Analytics page with charts | 🟡 Important |
| Advanced filters (date, risk, location) | 🟡 Important |
| Authority/Disaster Management view | 🟡 Important |
| Location details page | 🟡 Important |
| Role-based access control (UI) | 🟡 Important |
| Profile page | 🟡 Important |
| Environmental condition cards | 🟡 Important |

### 🔵 Future / Post-MVP

These features are **aspirational** and should only be built after the MVP is complete:

| Feature | Priority |
|---------|----------|
| Real-time push notifications (WebSockets) | 🔵 Future |
| Advanced GIS layers (heatmaps, satellite) | 🔵 Future |
| Historical landslide location data overlay | 🔵 Future |
| Admin dashboard with full CRUD | 🔵 Future |
| Mobile application (React Native) | 🔵 Future |
| Advanced predictive analytics | 🔵 Future |
| Offline support (PWA) | 🔵 Future |
| Multi-language support (i18n) | 🔵 Future |
| Dark mode | 🔵 Future |
| Export reports (PDF/CSV) | 🔵 Future |

> **Team Advice:** Focus exclusively on the 🔴 Critical features first. Only move to 🟡 Important features after the MVP is working end-to-end with the backend. Do not attempt 🔵 Future features during the SIH competition unless you have extra time.

---

## 29. Frontend Team Responsibilities

### Task Distribution (3-Developer Team)

#### Developer 1 — Layout, Dashboard & Authentication

| Task | Details |
|------|---------|
| Navbar & Sidebar | Build the main navigation components |
| PageContainer | Create consistent page layout wrapper |
| Dashboard page | Assemble all dashboard components |
| RiskSummary, RiskCard, ConditionCard | Dashboard sub-components |
| Login page | Authentication UI |
| AuthContext & useAuth | Authentication state management |
| ProtectedRoute | Route protection component |
| Profile page | User profile |
| Common components | Button, Modal, Loader, ErrorMessage, EmptyState |

#### Developer 2 — Prediction, API & History

| Task | Details |
|------|---------|
| PredictionForm | Complete input form with validation |
| LocationSelector | Map/dropdown location input |
| PredictionResult | Risk result display component |
| API service layer | `api.js`, `authService.js`, `predictionService.js` |
| History page | Prediction history with table, filters, pagination |
| `historyService.js` | History API calls |
| `validators.js` | Form validation utilities |
| `formatters.js` | Data formatting utilities |
| `constants.js` | App-wide constants |

#### Developer 3 — Map, Alerts, Analytics & Visualization

| Task | Details |
|------|---------|
| MapView | Main Leaflet map component |
| RiskMarker & popups | Map markers with risk information |
| MapControls | Map control buttons |
| Alert list & AlertCard | Alert display components |
| AlertDetails | Alert detail modal/page |
| `alertService.js` | Alert API calls |
| `locationService.js` | Location API calls |
| Analytics page | Charts using Recharts |
| RiskChart, RainfallChart | Chart components |
| Location details page | Combined location info page |

### Shared Responsibilities (All Developers)

- Code reviews
- Git workflow (branching, pull requests)
- Testing their own components
- Responsive design for their pages
- Loading/error/empty states for their API calls
- Documentation of their components

> **Note:** Adjust this distribution based on your actual team size. For a 2-person team, Developer 1 takes authentication + dashboard + history, and Developer 2 takes prediction + map + alerts + analytics.

---

## 30. Final Frontend Architecture Diagram

```mermaid
graph TB
    subgraph User["👤 User (Browser)"]
        direction TB
        U[User Interaction]
    end

    subgraph React["⚛️ React Application"]
        direction TB
        
        subgraph Pages["📄 Pages"]
            P1[Dashboard]
            P2[Prediction]
            P3[Map]
            P4[Alerts]
            P5[History]
            P6[Analytics]
            P7[Location Details]
            P8[Admin Pages]
        end

        subgraph Components["🧩 Components"]
            C1[Layout - Navbar, Sidebar]
            C2[Dashboard - Cards, Charts]
            C3[Prediction - Form, Result]
            C4[Map - MapView, Markers]
            C5[Alerts - AlertCard, List]
            C6[Analytics - Charts]
            C7[Common - Button, Modal, Loader]
        end

        subgraph StateLayer["📦 State Management"]
            S1[AuthContext]
            S2[AppContext]
            S3[Local State - useState]
        end

        subgraph Hooks["🪝 Custom Hooks"]
            H1[useAuth]
            H2[usePrediction]
            H3[useAlerts]
            H4[useLocations]
        end

        subgraph Services["🔌 Service Layer"]
            SV1[api.js - Axios]
            SV2[authService]
            SV3[predictionService]
            SV4[alertService]
            SV5[locationService]
            SV6[historyService]
        end

        subgraph Routing["🛣️ Routing"]
            R1[AppRoutes]
            R2[ProtectedRoute]
        end
    end

    subgraph Backend["🔧 .NET Backend"]
        B1[Authentication]
        B2[Business Logic]
        B3[Database]
        B4[ML Integration]
    end

    subgraph ML["🤖 ML Prediction Model"]
        M1[Trained Model]
        M2[Prediction Engine]
    end

    U --> React
    Pages --> Components
    Pages --> Hooks
    Hooks --> Services
    StateLayer --> Pages
    StateLayer --> Components
    Routing --> Pages
    Services -->|REST API| Backend
    Backend --> ML
    ML -->|Prediction Result| Backend
    Backend -->|JSON Response| Services

    style User fill:#e1f5fe
    style React fill:#fff8e1
    style Backend fill:#e8f5e9
    style ML fill:#fce4ec
```

### Summary of the Architecture

1. The **User** interacts with the React application through their web browser.
2. **Routing** determines which **Page** to display based on the URL.
3. **Pages** are composed of reusable **Components**.
4. Components use **Custom Hooks** to encapsulate data-fetching logic.
5. Hooks call the **Service Layer** (Axios) to communicate with the backend.
6. **State Management** (Context API + useState) keeps the UI in sync with data.
7. The **Service Layer** sends HTTP requests to the **.NET Backend**.
8. The Backend processes requests, calls the **ML Model** when needed, and returns responses.
9. Responses flow back through Services → Hooks → State → Components → User.

This architecture keeps concerns **separated**, making the codebase **maintainable**, **testable**, and **scalable**.

---

## Appendix: Quick Reference

### Key Commands

```bash
# Create new Vite + React project
npm create vite@latest sih-landslide -- --template react

# Install dependencies
cd sih-landslide
npm install

# Install additional packages
npm install react-router-dom axios react-leaflet leaflet recharts

# Install Tailwind CSS
npm install -D tailwindcss @tailwindcss/vite

# Start development server
npm run dev

# Build for production
npm run build
```

### Key Files to Create First

1. `src/services/api.js` — Axios instance
2. `src/context/AuthContext.jsx` — Authentication state
3. `src/hooks/useAuth.js` — Auth hook
4. `src/routes/AppRoutes.jsx` — Route definitions
5. `src/routes/ProtectedRoute.jsx` — Route guard
6. `src/components/layout/Navbar.jsx` — Navigation
7. `src/utils/constants.js` — Configuration

### Environment Variables

```env
# .env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=SIH Landslide Prediction System
```

---

> **This document is a living guide.** Update it as the project evolves, APIs are finalized, and features are implemented. When in doubt, communicate with the backend and ML teams to confirm data formats and API contracts.
