# Invoice Management System - Product Requirements Document (PRD)

## Overview
The Invoice Management System is a web-based application designed to help businesses create, manage, and track invoices. The system provides a user-friendly interface for creating detailed invoices with support for multiple currencies, tax calculations, and various pricing models.

## Core Features

### 1. Invoice Creation
- Generate unique invoice numbers automatically (Format: INV-YYYY-XXX)
- Support for multiple currencies (KES, USD, EUR, GBP)
- Dynamic line item management
	- Add/remove line items
	- Item description, quantity, and rate
	- Per-item discount options (percentage or fixed amount)
- Invoice-level discount options
- Tax handling
	- VAT (16%)
	- Withholding Tax (5%)
- Due date management with validation
- Support for invoice notes and payment instructions

### 2. Client Management
- Client database with search functionality
- Client details storage
	- Name
	- Email
	- Phone number
	- Company association
	- VAT registration status
	- PIN number validation (Format: A123456789Z)

### 3. Company Management
- Company database with search functionality
- Company details storage
	- Name
	- Email
	- Phone
	- Website
	- Address
	- Logo
	- PIN number
	- VAT registration status
	- Employee count

### 4. Invoice Calculations
- Automatic calculation of:
	- Line item totals
	- Subtotals
	- Discounts (both line item and invoice level)
	- VAT (when applicable)
	- Withholding tax (when applicable)
	- Final total

### 5. Status Management
- Support for multiple invoice statuses:
	- Draft
	- Sent
	- Paid
	- Overdue
	- Cancelled

## Technical Requirements

### Frontend
- React-based user interface
- Form validation using Zod
- Real-time calculations and updates
- Responsive design for all screen sizes
- Modern UI components with shadcn/ui

### Backend
- Supabase for database and authentication
- RESTful API endpoints for:
	- Invoice CRUD operations
	- Client management
	- Company management
- Data validation and sanitization

### Data Models

#### Invoice
- Unique identifier
- Invoice number
- Client reference
- Company reference
- Issue date
- Due date
- Currency
- Line items
- Discount information
- Tax information
- Status
- Notes
- Payment terms

#### Client
- Unique identifier
- Name
- Email
- Phone
- Company association
- PIN number
- VAT status
- Avatar URL

#### Company
- Unique identifier
- Name
- Contact information
- Address
- Logo
- Financial details
- Tax information

## Database Schema

### Companies Table
```sql
CREATE TABLE companies (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE,
	deleted_at TIMESTAMP WITH TIME ZONE,
	name VARCHAR NOT NULL,
	email VARCHAR NOT NULL,
	phone VARCHAR NOT NULL,
	website VARCHAR,
	address TEXT,
	logo VARCHAR,
	pin_number VARCHAR,
	vat_registered BOOLEAN DEFAULT false,
	employee_count INTEGER DEFAULT 0,
	total_billed DECIMAL(15,2) DEFAULT 0
);
```

### Clients Table
```sql
CREATE TABLE clients (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE,
	deleted_at TIMESTAMP WITH TIME ZONE,
	name VARCHAR NOT NULL,
	email VARCHAR NOT NULL,
	phone VARCHAR NOT NULL,
	avatar VARCHAR,
	pin_number VARCHAR,
	vat_registered BOOLEAN DEFAULT false,
	company_id UUID REFERENCES companies(id),
	total_billed DECIMAL(15,2) DEFAULT 0,
	active_projects INTEGER DEFAULT 0
);
```

### Invoices Table
```sql
CREATE TABLE invoices (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE,
	deleted_at TIMESTAMP WITH TIME ZONE,
	invoice_number VARCHAR NOT NULL UNIQUE,
	client_id UUID REFERENCES clients(id),
	company_id UUID REFERENCES companies(id),
	payment_terms_id UUID,
	issue_date DATE NOT NULL,
	due_date DATE NOT NULL,
	payment_date DATE,
	currency VARCHAR(3) NOT NULL DEFAULT 'KES',
	notes TEXT,
	status VARCHAR NOT NULL DEFAULT 'draft',
	status_updated_at TIMESTAMP WITH TIME ZONE,
	reminder_sent_at TIMESTAMP WITH TIME ZONE,
	discount_type VARCHAR,
	discount_value DECIMAL(15,2) DEFAULT 0,
	discount_amount DECIMAL(15,2) DEFAULT 0,
	subtotal DECIMAL(15,2) NOT NULL,
	total_before_tax DECIMAL(15,2) NOT NULL,
	vat_amount DECIMAL(15,2) DEFAULT 0,
	withholding_tax_amount DECIMAL(15,2) DEFAULT 0,
	total DECIMAL(15,2) NOT NULL
);
```

### Line Items Table
```sql
CREATE TABLE line_items (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
	updated_at TIMESTAMP WITH TIME ZONE,
	invoice_id UUID REFERENCES invoices(id),
	description TEXT NOT NULL,
	quantity DECIMAL(15,2) NOT NULL,
	rate DECIMAL(15,2) NOT NULL,
	discount_type VARCHAR,
	discount_value DECIMAL(15,2) DEFAULT 0,
	discount_amount DECIMAL(15,2) DEFAULT 0,
	amount DECIMAL(15,2) NOT NULL,
	vat_applicable BOOLEAN DEFAULT true,
	withholding_tax_applicable BOOLEAN DEFAULT false
);
```

## API Endpoints

### Companies
- `GET /api/companies` - List all companies
- `POST /api/companies` - Create a new company
- `GET /api/companies/:id` - Get company details
- `PUT /api/companies/:id` - Update company details
- `DELETE /api/companies/:id` - Delete a company

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create a new client
- `GET /api/clients/:id` - Get client details
- `PUT /api/clients/:id` - Update client details
- `DELETE /api/clients/:id` - Delete a client

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create a new invoice
- `GET /api/invoices/:id` - Get invoice details
- `PUT /api/invoices/:id` - Update invoice details
- `DELETE /api/invoices/:id` - Delete an invoice
- `PUT /api/invoices/:id/status` - Update invoice status
- `POST /api/invoices/:id/send` - Send invoice to client
- `GET /api/invoices/:id/pdf` - Generate PDF for invoice

### Line Items
- `GET /api/invoices/:id/line-items` - List line items for an invoice
- `POST /api/invoices/:id/line-items` - Add line items to an invoice
- `PUT /api/invoices/:id/line-items/:itemId` - Update a line item
- `DELETE /api/invoices/:id/line-items/:itemId` - Delete a line item

## User Interface Requirements

### Invoice Form
- Clean, intuitive layout
- Real-time total calculations
- Easy line item management
- Clear display of all calculations
- Form validation with error messages
- Responsive design for all screen sizes

### Search and Filter
- Quick search for clients and companies
- Filter by status, date range, and amount
- Sort by various fields

## Security Requirements
- User authentication
- Role-based access control
- Data validation
- Secure API endpoints
- Input sanitization

## Performance Requirements
- Page load time < 2 seconds
- Real-time calculations
- Smooth user interactions
- Efficient data loading
- Optimized database queries

## Future Enhancements
- PDF export
- Email integration
- Payment gateway integration
- Multi-currency conversion
- Recurring invoices
- Bulk operations
- Advanced reporting

## UI/UX Specifications

### Layout
1. Navigation
   - Side navigation with clear icons and labels
   - Quick access to create new invoice, clients, and companies
   - Dashboard overview link
   - Settings access

2. Dashboard
   - Key metrics display
	 - Total invoices
	 - Pending payments
	 - Overdue invoices
	 - Monthly revenue
   - Recent activity feed
   - Quick action buttons
   - Revenue charts

3. Invoice List View
   - Sortable columns
   - Status indicators with colors
   - Quick actions (view, edit, delete)
   - Bulk selection options
   - Filter panel
   - Search functionality

4. Invoice Creation/Edit Form
   - Multi-step form layout
   - Real-time validation
   - Auto-save functionality
   - Preview mode
   - Dynamic calculations
   - Responsive design

### Color Scheme
- Primary: #FF4545 (Red)
- Secondary: #ff6b6b (Light Red)
- Background: #f8f9fa
- Text: #1a1a1a
- Success: #10b981
- Warning: #f59e0b
- Error: #ef4444
- Border: #e5e7eb

### Typography
- Primary Font: Inter
- Headings: Semi-bold
- Body: Regular
- Monospace: For numbers and codes

### Components
1. Buttons
   - Primary: Solid red background
   - Secondary: Outlined style
   - Danger: Red variant
   - Icon buttons: Square with rounded corners

2. Forms
   - Floating labels
   - Inline validation
   - Helper text
   - Error states
   - Loading states

3. Tables
   - Striped rows
   - Hover states
   - Sortable headers
   - Pagination
   - Row actions

4. Modals
   - Centered layout
   - Backdrop blur
   - Close button
   - Action buttons aligned right

## Testing and Quality Assurance

### Unit Testing
- Component testing with React Testing Library
- API endpoint testing
- Form validation testing
- Calculation accuracy testing
- State management testing

### Integration Testing
- End-to-end flows
- API integration testing
- Database operations
- Authentication flows
- File operations (PDF generation)

### User Acceptance Testing
1. Invoice Management
   - Create, edit, delete invoices
   - Add/remove line items
   - Apply discounts and taxes
   - Preview and download PDF
   - Email functionality

2. Client Management
   - Add, edit, delete clients
   - Search and filter clients
   - Client-company associations
   - Validation rules

3. Company Management
   - Company profile creation
   - Company settings
   - User permissions
   - Branding customization

### Performance Testing
1. Load Testing
   - Concurrent user simulation
   - Multiple invoice creation
   - Search and filter operations
   - PDF generation

2. Stress Testing
   - Large data sets
   - Multiple concurrent requests
   - Resource intensive operations
   - Recovery testing

### Security Testing
1. Authentication Testing
   - Login/logout flows
   - Password policies
   - Session management
   - Role-based access

2. Authorization Testing
   - Permission checks
   - Data access controls
   - API endpoint security
   - File access security

3. Data Security
   - Input validation
   - SQL injection prevention
   - XSS prevention
   - CSRF protection

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation
- Color contrast
- ARIA attributes
- Focus management

## Deployment Requirements

### Infrastructure
1. Production Environment
   - Vercel for frontend hosting
   - Supabase for database and authentication
   - Custom domain with SSL

2. Development Environment
   - Local development setup
   - Development database
   - Environment variables management

3. CI/CD Pipeline
   - GitHub Actions for automated testing
   - Automated deployments
   - Code quality checks
   - Type checking

### Monitoring
1. Application Monitoring
   - Error tracking
   - Performance metrics
   - User analytics
   - API usage statistics

2. Database Monitoring
   - Query performance
   - Connection pooling
   - Backup management
   - Data integrity checks

3. Security Monitoring
   - Auth logs
   - API access logs
   - Rate limiting
   - Security alerts

### Backup Strategy
1. Database Backups
   - Daily automated backups
   - Point-in-time recovery
   - Backup encryption
   - Retention policy

2. Application Backups
   - Configuration backups
   - User data exports
   - System state snapshots

### Documentation
1. Technical Documentation
   - API documentation
   - Database schema
   - Component library
   - Setup guides

2. User Documentation
   - User manual
   - Video tutorials
   - FAQs
   - Troubleshooting guide

## Implementation Timeline

### Phase 1: Core Features (Week 1-2)
- Basic project setup
- Database schema implementation
- Authentication setup
- Basic CRUD operations for companies and clients

### Phase 2: Invoice Management (Week 3-4)
- Invoice creation form
- Line item management
- Tax calculations
- Basic invoice listing and filtering

### Phase 3: Enhanced Features (Week 5-6)
- Advanced search and filtering
- Invoice preview
- PDF generation
- Email notifications

### Phase 4: Polish and Launch (Week 7-8)
- UI/UX refinements
- Performance optimizations
- Testing and bug fixes
- Documentation
- Production deployment

## Success Metrics

### User Engagement
- Number of active users
- Number of invoices created per user
- Average time spent creating an invoice
- Feature usage statistics

### Performance Metrics
- Page load time < 2s
- API response time < 200ms
- Form submission success rate > 99%
- Search response time < 500ms

### Business Metrics
- Number of registered companies
- Number of active clients
- Total invoice value processed
- Average invoice processing time

### Technical Metrics
- Code coverage > 80%
- Zero critical security vulnerabilities
- API uptime > 99.9%
- Database query performance < 100ms