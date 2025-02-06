import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

// Ensure the URL is properly formatted
const formattedUrl = supabaseUrl.startsWith('http') ? supabaseUrl : `https://${supabaseUrl}`

export const supabase = createClient(formattedUrl, supabaseKey)

export type TaxType = {
  id: string
  created_at: string
  updated_at?: string
  name: string
  description?: string
  rate: number
  is_active: boolean
}

export type Company = {
  id: string
  created_at: string
  updated_at?: string
  deleted_at?: string
  name: string
  email: string
  phone: string
  website: string
  address: string
  logo?: string
  pin_number: string
  vat_registered: boolean
  employee_count: number
  total_billed: number
}

export type Client = {
  id: string
  created_at: string
  updated_at?: string
  deleted_at?: string
  name: string
  email: string
  phone: string
  avatar?: string
  pin_number?: string
  vat_registered: boolean
  company_id: string
  company?: Company
  total_billed: number
  active_projects: number
}

export type PaymentTerms = {
  id: string
  created_at: string
  updated_at?: string
  name: string
  days: number
  description?: string
}

export type Invoice = {
  id: string
  created_at: string
  updated_at?: string
  deleted_at?: string
  invoice_number: string
  client_id: string
  company_id: string
  payment_terms_id?: string
  issue_date: string
  due_date: string
  payment_date?: string
  currency: 'KES' | 'USD' | 'EUR' | 'GBP'
  notes?: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  status_updated_at?: string
  reminder_sent_at?: string
  subtotal: number
  discount_type?: 'percentage' | 'fixed'
  discount_value: number
  discount_amount: number
  total_before_tax: number
  vat_amount: number
  withholding_tax_amount: number
  total: number
  client?: Client
  company?: Company
  payment_terms?: PaymentTerms
}

export type LineItem = {
  id: string
  created_at: string
  updated_at?: string
  invoice_id: string
  description: string
  quantity: number
  rate: number
  discount_type?: 'percentage' | 'fixed'
  discount_value: number
  discount_amount: number
  amount: number
  vat_applicable: boolean
  withholding_tax_applicable: boolean
}

export type InvoiceTax = {
  id: string
  created_at: string
  updated_at?: string
  invoice_id: string
  tax_type_id: string
  tax_rate: number
  tax_amount: number
  tax_type?: TaxType
}