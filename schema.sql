-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    website TEXT NOT NULL,
    address TEXT NOT NULL,
    logo TEXT,
    employee_count INTEGER NOT NULL DEFAULT 0,
    total_billed NUMERIC NOT NULL DEFAULT 0
);

-- Clients table
CREATE TABLE clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    avatar TEXT,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    total_billed NUMERIC NOT NULL DEFAULT 0,
    active_projects INTEGER NOT NULL DEFAULT 0
);

-- Invoices table
CREATE TABLE invoices (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    invoice_number TEXT NOT NULL UNIQUE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    tax_rate NUMERIC NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    subtotal NUMERIC NOT NULL DEFAULT 0,
    tax NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    CONSTRAINT valid_status CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
    CONSTRAINT valid_dates CHECK (due_date >= issue_date)
);

-- Line items table
CREATE TABLE line_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity NUMERIC NOT NULL,
    rate NUMERIC NOT NULL,
    amount NUMERIC GENERATED ALWAYS AS (quantity * rate) STORED,
    CONSTRAINT positive_quantity CHECK (quantity > 0),
    CONSTRAINT positive_rate CHECK (rate >= 0)
);

-- Create indexes for better query performance
CREATE INDEX idx_clients_company_id ON clients(company_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_company_id ON invoices(company_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_line_items_invoice_id ON line_items(invoice_id);

-- Create a function to update invoice totals
CREATE OR REPLACE FUNCTION update_invoice_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE invoices
    SET 
        subtotal = (
            SELECT COALESCE(SUM(amount), 0)
            FROM line_items
            WHERE invoice_id = NEW.invoice_id
        ),
        tax = (
            SELECT COALESCE(SUM(amount), 0) * (tax_rate / 100)
            FROM line_items
            WHERE invoice_id = NEW.invoice_id
        )
    WHERE id = NEW.invoice_id;
    
    UPDATE invoices
    SET total = subtotal + tax
    WHERE id = NEW.invoice_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to maintain invoice totals
CREATE TRIGGER update_invoice_totals_insert
    AFTER INSERT ON line_items
    FOR EACH ROW
    EXECUTE FUNCTION update_invoice_totals();

CREATE TRIGGER update_invoice_totals_update
    AFTER UPDATE ON line_items
    FOR EACH ROW
    EXECUTE FUNCTION update_invoice_totals();

CREATE TRIGGER update_invoice_totals_delete
    AFTER DELETE ON line_items
    FOR EACH ROW
    EXECUTE FUNCTION update_invoice_totals(); 