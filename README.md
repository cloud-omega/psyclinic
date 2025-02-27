# PsychCare Platform

A comprehensive platform for psychologists to manage clients, appointments, payments, and communications.

## Features

- **Client Management**: Store and manage client information securely
- **Appointment Scheduling**: Schedule, reschedule, and cancel appointments
- **Payment Processing**: Integrated with Mercado Pago for secure transactions
- **Messaging System**: Internal messaging and email notifications
- **Calendar Integration**: Import from Google Calendar
- **Reports and Analytics**: Track practice performance
- **Role-Based Access Control**: Separate interfaces for psychologists and patients

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Zustand for state management
- Socket.io for real-time features

### Backend
- Node.js with Express
- MariaDB for relational data
- Redis for caching and session management
- JWT for authentication
- OAuth integration (Google, Facebook, LinkedIn)

### Infrastructure
- Docker for containerization
- HashiCorp Vault for secrets management
- Separate environments (development, staging, production)

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/psychcare-platform.git
   cd psychcare-platform
   ```

2. Create environment files
   ```
   cp .env.example .env
   ```

3. Start the development environment
   ```
   docker-compose up -d
   ```

4. Access the application
   - Frontend: http://localhost
   - API: http://localhost:3000
   - Vault UI: http://localhost:8200

## Development

### Project Structure
```
psychcare-platform/
├── frontend/           # React frontend application
├── backend/            # Node.js API server
├── database/           # Database initialization scripts
├── docker-compose.yml  # Docker Compose configuration
└── .env                # Environment variables
```

### Running Tests
```
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## Security

This platform implements several security measures:
- Data encryption in transit and at rest
- OWASP Top 10 compliance
- Role-based access control
- Secure authentication with JWT and OAuth
- Regular security audits

## License

This project is licensed under the MIT License - see the LICENSE file for details.