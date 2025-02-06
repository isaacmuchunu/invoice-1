import { supabase } from './supabase';
import type { Invoice, LineItem, Company, Client } from './supabase';

// Company APIs
export async function getCompanies(): Promise<Company[]> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error in getCompanies:', error);
    return [];
  }
}

export async function createCompany(company: Omit<Company, 'id' | 'created_at' | 'total_billed'>) {
  const { data, error } = await supabase
    .from('companies')
    .insert([company])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCompany(id: string, company: Partial<Company>) {
  const { error } = await supabase
    .from('companies')
    .update(company)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteCompany(id: string) {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Client APIs
export async function getClients() {
  const { data, error } = await supabase
    .from('clients')
    .select(`
      *,
      company:companies(*)
    `)
    .order('name');

  if (error) throw error;
  return data;
}

export async function createClient(client: Omit<Client, 'id' | 'created_at' | 'total_billed' | 'active_projects'>) {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClient(id: string, client: Partial<Client>) {
  const { error } = await supabase
    .from('clients')
    .update(client)
    .eq('id', id);

  if (error) throw error;
}

export async function deleteClient(id: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Invoice APIs
export async function createInvoice(invoice: Omit<Invoice, 'id' | 'created_at'>, lineItems: Omit<LineItem, 'id' | 'created_at' | 'invoice_id'>[]) {
  const { data: invoiceData, error: invoiceError } = await supabase
    .from('invoices')
    .insert([invoice])
    .select()
    .single();

  if (invoiceError) throw invoiceError;

  const { error: lineItemsError } = await supabase
    .from('line_items')
    .insert(
      lineItems.map(item => ({
        ...item,
        invoice_id: invoiceData.id
      }))
    );

  if (lineItemsError) throw lineItemsError;

  return invoiceData;
}

export async function getInvoices() {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients(*),
      company:companies(*),
      line_items(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getInvoiceById(id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients(*),
      company:companies(*),
      line_items(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateInvoice(id: string, invoice: Partial<Invoice>, lineItems?: Omit<LineItem, 'id' | 'created_at' | 'invoice_id'>[]) {
  const { error: invoiceError } = await supabase
    .from('invoices')
    .update(invoice)
    .eq('id', id);

  if (invoiceError) throw invoiceError;

  if (lineItems) {
    const { error: deleteError } = await supabase
      .from('line_items')
      .delete()
      .eq('invoice_id', id);

    if (deleteError) throw deleteError;

    const { error: lineItemsError } = await supabase
      .from('line_items')
      .insert(
        lineItems.map(item => ({
          ...item,
          invoice_id: id
        }))
      );

    if (lineItemsError) throw lineItemsError;
  }
}

export async function deleteInvoice(id: string) {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 