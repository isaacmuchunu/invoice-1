export interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceTemplateProps {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items?: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  companyLogo?: string;
  companyName: string;
  companyDetails: string;
}

export type TemplateType = "modern" | "minimal" | "professional";
