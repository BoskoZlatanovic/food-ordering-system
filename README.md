# Food Ordering System

A web application for food ordering built with Spring Boot and Angular. The system allows users to place and track food orders, with different permissions for regular users and administrators.

## Technologies Used

### Backend
- Spring Boot 3
- Kotlin
- Spring Security with JWT
- WebSocket for real-time order status updates
- MySQL Database
- JPA/Hibernate

### Frontend
- Angular 16
- Bootstrap 5
- WebSocket Client (STOMP)
- RxJS

## Features

### User Management
- JWT-based authentication
- Role-based authorization (Admin/User)
- User CRUD operations
- Permission-based access control

### Order Management
- Create orders
- Schedule orders for later
- Real-time order status tracking via WebSocket
- Order filtering and pagination
- Maximum concurrent orders limit (3)

### Order Statuses
- ORDERED
- PREPARING (after 10 seconds)
- IN_DELIVERY (after 15 seconds)
- DELIVERED (after 20 seconds)
- CANCELED

### Admin Features
- View all users and orders
- Search orders by user ID
- View error logs
- Full system access

### Regular User Features
- View own orders
- Place new orders
- Track order status
- Cancel orders in ORDERED status

### Architecture Features
- DTO pattern for efficient data transfer
- Clear separation of concerns
- Entity-DTO mapping for secure data exposure

## Project Structure

### Backend
```plaintext
src/
├── main/
│   ├── kotlin/
│   │   └── raf.rs.nwp_project_kotlin/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── model/
|   |            └── dto/      
│   │       ├── repository/
│   │       ├── service/
│   │       └── util/
│   └── resources/
        └── application.properties
```
### Frontend
```plaintext
src/
├── app/
│   ├── components/
|   |   ├── errors/
|   |   ├── login/
│   │   ├── orders/
│   │   ├── users/
│   │   └── shared/
│   ├── services/
│   ├── models/
│   ├── guards/
|   └── interceptors/
└── assets/
```
## Getting Started

### Prerequisites
- JDK 17+
- Node.js and npm
- MySQL

### Backend Setup
1. Clone the repository
2. Configure MySQL connection in `application.properties`
3. Run the Spring Boot application

### Frontend Setup
1. Navigate to the frontend directory
2. Run `npm install`
3. Run `ng serve`
4. Access the application at `http://localhost:4200`

## System Features

### Order Creation
- Select dishes from menu
- Option to schedule for later
- Real-time status updates
- Automatic status progression

### Order Filtering
- By status
- By date range
- By user (admin only)

### Error Handling
- Tracks scheduled order errors
- Maximum concurrent orders limit
- Optimistic locking for concurrent modifications

## Security
- JWT-based authentication
- Permission-based authorization
- Protected API endpoints
- Secure WebSocket connections

## Concurrency Control
- Optimistic locking for handling concurrent order modifications
- Version-based conflict detection
- Prevents data inconsistencies during simultaneous updates

## API Endpoints

### Authentication
- POST `/api/auth/login`

### Users
- GET `/api/users`
- POST `/api/users`
- PUT `/api/users/{id}`
- DELETE `/api/users/{id}`

### Orders
- GET `/api/orders`
- POST `/api/orders`
- PUT `/api/orders/{id}/cancel`
- GET `/api/orders/{id}/track`
- POST `/api/orders/schedule`

## WebSocket Endpoints
- `/ws` - Main WebSocket endpoint
- `/topic/orders/{orderId}` - Order status updates

