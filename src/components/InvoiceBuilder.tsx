import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import { TemplateType } from "./invoices/templates/types";
import { createInvoice, getClients, getCompanies } from "@/lib/api";
import { toast } from "sonner";
import type { Client, Company } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

const InvoiceBuilder = () => {
  const navigate = useNavigate();
  const [template, setTemplate] = useState<TemplateType>("modern");
  const [clients, setClients] = useState<Client[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [createdInvoiceData, setCreatedInvoiceData] = useState<any>(null);

  const [formData, setFormData] = useState({
    invoice_number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    client_id: "",
    company_id: "",
    payment_terms_id: "",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    currency: "KES" as const,
    notes: "",
    status: "draft" as const,
    discount_type: undefined as "percentage" | "fixed" | undefined,
    discount_value: 0,
    line_items: [{
      description: "Professional Services",
      quantity: 1,
      rate: 100,
      discount_type: undefined as "percentage" | "fixed" | undefined,
      discount_value: 0,
      vat_applicable: true,
      withholding_tax_applicable: false
    }]
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, companiesData] = await Promise.all([
          getClients(),
          getCompanies()
        ]);
        setClients(clientsData);
        setCompanies(companiesData);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load clients and companies");
      }
    };
    loadData();
  }, []);

  const handleFormChange = useCallback((data: typeof formData) => {
    const client = data.client_id ? clients.find(c => c.id === data.client_id) : null;
    const company = data.company_id ? companies.find(c => c.id === data.company_id) : null;
    
    setSelectedClient(client);
    setSelectedCompany(company);
    setFormData(data);
  }, [clients, companies]);

  const handleFormSubmit = async (data: typeof formData) => {
    try {
      const subtotal = data.line_items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
      const discount_amount = data.discount_type === 'percentage'
        ? subtotal * (data.discount_value / 100)
        : data.discount_type === 'fixed' ? data.discount_value : 0;
      const total_before_tax = subtotal - discount_amount;
      const vat_amount = data.line_items.reduce((sum, item) => 
        sum + (item.vat_applicable ? item.quantity * item.rate * 0.16 : 0), 0);
      const withholding_tax_amount = data.line_items.reduce((sum, item) => 
        sum + (item.withholding_tax_applicable ? item.quantity * item.rate * 0.05 : 0), 0);
      const total = total_before_tax + vat_amount - withholding_tax_amount;

      const result = await createInvoice({
        ...data,
        subtotal,
        discount_amount,
        total_before_tax,
        vat_amount,
        withholding_tax_amount,
        total
      }, data.line_items.map(item => {
        const amount = item.quantity * item.rate;
        const discount_amount = item.discount_type === 'percentage'
          ? amount * (item.discount_value / 100)
          : item.discount_type === 'fixed' ? item.discount_value : 0;
        return {
          ...item,
          amount,
          discount_amount
        };
      }));
      
      const previewData = {
        invoiceNumber: data.invoice_number,
        date: data.issue_date,
        dueDate: data.due_date,
        clientName: selectedClient?.name || "",
        clientEmail: selectedClient?.email || "",
        clientAddress: selectedClient?.phone || "",
        items: data.line_items,
        subtotal: result.subtotal,
        tax: result.vat_amount,
        total: result.total,
        notes: data.notes,
        companyName: selectedCompany?.name || "",
        companyDetails: selectedCompany ? 
          `${selectedCompany.address}\n${selectedCompany.phone}\n${selectedCompany.email}\nPIN: ${selectedCompany.pin_number}` : 
          ""
      };

      setCreatedInvoiceData(previewData);
      setShowPreview(true);
      toast.success("Invoice created successfully");
    } catch (error) {
      console.error("Failed to create invoice:", error);
      toast.error("Failed to create invoice");
      throw error;
    }
  };

  const handlePreviewClose = () => {
    setShowPreview(false);
    navigate("/invoices");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <InvoiceForm
            onSubmit={handleFormSubmit}
            onChange={handleFormChange}
            initialData={formData}
            open={true}
            onOpenChange={() => {}}
            isDialog={false}
          />
        </div>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Invoice Created Successfully</DialogTitle>
              <DialogDescription>
                Your invoice has been created. You can now print, download, or send it.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <InvoicePreview
                template={template}
                onTemplateChange={setTemplate}
                {...createdInvoiceData}
                printCopies={["CUSTOMER COPY", "COMPANY COPY", "TAX COPY"]}
              />
            </div>

            <DialogFooter className="mt-6 flex justify-end space-x-4">
              <Button variant="outline" onClick={handlePreviewClose}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default InvoiceBuilder;