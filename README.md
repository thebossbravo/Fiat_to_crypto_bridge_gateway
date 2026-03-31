# Bridge Gateway System

A comprehensive fiat-to-crypto bridge gateway that enables users to convert traditional currency to cryptocurrency seamlessly. Built with modern Go backend and React TypeScript frontend.

## Architecture

### Backend (Go)
- **Framework**: Standard library with custom routing
- **Database**: PostgreSQL with sqlc for type-safe queries
- **ORM**: sqlc (compile-time type safety)
- **Driver**: pgx/v5 with connection pooling
- **Authentication**: JWT-based with Google OAuth support
- **Payment Processing**: Stripe integration
- **Blockchain**: Blockradar API for crypto swaps
- **Webhooks**: Signature-verified webhook handlers

### Frontend (React TypeScript)
- **Framework**: React 19 with TypeScript
- **Routing**: React Router v7
- **State Management**: TanStack Query (React Query)
- **UI Components**: shadcn/ui with Tailwind CSS
- **HTTP Client**: Native Fetch API (no axios dependency)
- **Icons**: Hugeicons
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for analytics

## Features

### Core Functionality
- **User Authentication**: Email/password and Google OAuth
- **Fiat Payments**: Stripe integration for credit card payments
- **Crypto Swaps**: Blockradar-powered cryptocurrency exchanges
- **Transaction Management**: Real-time transaction tracking
- **Audit Logging**: Complete audit trail for all operations
- **Reconciliation**: Automated transaction reconciliation

### Advanced Features
- **Real-time Updates**: WebSocket-based transaction status updates
- **Analytics Dashboard**: Comprehensive financial analytics
- **Currency Conversion**: Live exchange rates with converter
- **Webhook Processing**: Secure webhook handling for payment/blockchain events
- **Multi-currency Support**: USD, EUR with extensible currency system

## Project Structure

```
bridge-gateway/
├── bridge-gateway-backend/          # Go backend API
│   ├── cmd/                         # Application entry points
│   ├── internal/                    # Private application code
│   │   ├── auth/                    # Authentication service
│   │   ├── audit/                   # Audit logging service
│   │   ├── database/                # Database connection management
│   │   ├── server/                  # HTTP server and handlers
│   │   ├── transactions/            # Transaction management
│   │   └── webhooks/                # Webhook handlers
│   ├── db/                          # Database files
│   │   ├── migrations/              # SQL migration files
│   │   └── sqlc/                    # sqlc generated code
│   └── pkg/                         # Public library code
├── bridge-frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utility libraries
│   │   ├── pages/                   # Page components
│   │   └── types/                   # TypeScript type definitions
│   └── public/                      # Static assets
└── README.md                         # This file
```

## Technology Stack

### Backend Dependencies
- **Database**: PostgreSQL 14+
- **Go Version**: 1.21+
- **Key Libraries**:
  - `github.com/jackc/pgx/v5` - PostgreSQL driver
  - `github.com/sqlc-dev/sqlc` - SQL code generator
  - `github.com/golang-jwt/jwt` - JWT tokens
  - `github.com/stripe/stripe-go` - Stripe API
  - `github.com/joho/godotenv` - Environment variables

### Frontend Dependencies
- **Node Version**: 18+
- **Key Libraries**:
  - `react: ^19.2.4` - React framework
  - `@tanstack/react-query: ^5.95.2` - State management
  - `react-router: ^7.13.2` - Routing
  - `shadcn/ui` - UI component library
  - `tailwindcss: ^4.2.1` - CSS framework
  - `react-hook-form: ^7.72.0` - Form handling

## Database Schema

### Core Tables
- **users** - User accounts and authentication
- **transactions** - Transaction records and state tracking
- **audit_log** - Complete audit trail
- **exchange_rates** - Currency exchange rate history

### Transaction States
```go
const (
    TransactionStatePending      TransactionState = "pending"
    TransactionStateFiatReceived TransactionState = "fiat_received"
    TransactionStateSwapping     TransactionState = "swapping"
    TransactionStateCompleted    TransactionState = "completed"
    TransactionStateFailed      TransactionState = "failed"
)
```

## Development Setup

### Prerequisites
- Go 1.21+
- Node.js 18+
- PostgreSQL 14+
- Stripe account (for payments)
- Blockradar API key (for crypto swaps)

### Backend Setup

1. **Clone and navigate**:
```bash
cd bridge-gateway-backend
```

2. **Install dependencies**:
```bash
go mod download
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up database**:
```bash
# Create database
createdb bridge_gateway

# Run migrations
go run cmd/migrate/main.go up

# Generate sqlc code
make sqlc
```

5. **Run the server**:
```bash
go run cmd/server/main.go
```

### Frontend Setup

1. **Clone and navigate**:
```bash
cd bridge-frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
# Edit .env with your API URLs
```

4. **Run development server**:
```bash
npm run dev
```

## Environment Variables

### Backend (.env)
```bash
# Database
BLUEPRINT_DB_HOST=localhost
BLUEPRINT_DB_PORT=5432
BLUEPRINT_DB_DATABASE=bridge_gateway
BLUEPRINT_DB_USERNAME=postgres
BLUEPRINT_DB_PASSWORD=password
BLUEPRINT_DB_SCHEMA=public

# JWT
JWT_SECRET=your-jwt-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Blockradar
BLOCKRADAR_API_KEY=your-blockradar-key
BLOCKRADAR_BASE_URL=https://api.blockradar.com
BLOCKRADAR_WEBHOOK_SECRET=your-webhook-secret

# Server
PORT=8080
ENVIRONMENT=development
```

### Frontend (.env)
```bash
# API
VITE_API_URL=http://localhost:8080

# Stripe (public)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Testing

### Backend Tests
```bash
# Run all tests
go test ./...

# Run with coverage
go test -cover ./...

# Run specific package
go test ./internal/transactions/...
```

### Frontend Tests
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build (production test)
npm run build
```

## Deployment

### Backend Deployment

1. **Build binary**:
```bash
go build -o bridge-gateway cmd/server/main.go
```

2. **Deploy with Docker**:
```dockerfile
FROM golang:1.26-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o bridge-gateway cmd/server/main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/bridge-gateway .
COPY --from=builder /app/db/migrations ./db/migrations
CMD ["./bridge-gateway"]
```

### Frontend Deployment

1. **Build for production**:
```bash
npm run build
```

2. **Deploy static files**:
```bash
# The dist/ folder contains production-ready static files
# Deploy to any static hosting service (Vercel, Netlify, etc.)
```

## API Documentation

### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/google` - Google OAuth
- `GET /auth/user` - Get user profile
- `POST /auth/logout` - User logout

### Transaction Endpoints
- `GET /api/transactions` - List user transactions
- `POST /api/transactions` - Create new transaction
- `POST /api/transactions/{id}/swap` - Initiate crypto swap
- `GET /api/wallet` - Get wallet information

### Analytics Endpoints
- `POST /api/metrics` - Get financial metrics
- `GET /api/exchange-rates` - Get current exchange rates
- `POST /api/convert` - Convert currency

### Webhook Endpoints
- `POST /webhooks/blockradar` - Blockradar webhooks
- `POST /webhooks/stripe` - Stripe webhooks

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Webhook Verification**: Cryptographic signature verification
- **SQL Injection Prevention**: sqlc compile-time type safety
- **HTTPS Enforcement**: Production HTTPS required
- **CORS Configuration**: Proper cross-origin resource sharing
- **Rate Limiting**: API rate limiting protection
- **Input Validation**: Comprehensive input validation

## Monitoring & Logging

### Backend Monitoring
- **Structured Logging**: JSON-formatted logs
- **Request Tracing**: Request ID tracking
- **Error Tracking**: Comprehensive error logging
- **Metrics**: Performance and business metrics
- **Health Checks**: `/health` endpoint

### Frontend Monitoring
- **Error Boundaries**: React error boundaries
- **Performance Monitoring**: Web Vitals tracking
- **User Analytics**: Usage analytics
- **Error Reporting**: Client-side error tracking

## CI/CD Pipeline

### GitHub Actions
- **Automated Testing**: Run tests on every push
- **Code Quality**: Linting and type checking
- **Security Scanning**: Dependency vulnerability scanning
- **Build Verification**: Production build testing
- **Deployment**: Automated deployment to staging/production


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## Roadmap

### Upcoming Features
- [ ] Mobile app (React Native)
- [ ] Additional cryptocurrency support
- [ ] Advanced analytics and reporting
- [ ] Multi-tenant support
- [ ] Advanced fraud detection
- [ ] International banking integration

### Technical Improvements
- [ ] GraphQL API
- [ ] Event-driven architecture
- [ ] Microservices decomposition
- [ ] Advanced caching strategies
- [ ] Real-time notifications

---
