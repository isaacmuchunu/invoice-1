import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InvoiceGrid from "./InvoiceGrid";
import CreateInvoiceFAB from "./CreateInvoiceFAB";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { getInvoices, deleteInvoice } from "@/lib/api";
import { toast } from "sonner";
import type { Invoice } from "@/lib/supabase";

const Home = () => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error("Failed to load invoices:", error);
      toast.error("Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditInvoice = (id: string) => {
    setSelectedInvoiceId(id);
    navigate(`/invoices/${id}/edit`);
  };

  const handleDeleteInvoice = async (id: string) => {
    setSelectedInvoiceId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedInvoiceId) return;

    try {
      await deleteInvoice(selectedInvoiceId);
      setInvoices(invoices.filter((invoice) => invoice.id !== selectedInvoiceId));
      toast.success("Invoice deleted successfully");
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast.error("Failed to delete invoice");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedInvoiceId(null);
    }
  };

  const handleDuplicateInvoice = async (id: string) => {
    const invoiceToDuplicate = invoices.find((invoice) => invoice.id === id);
    if (invoiceToDuplicate) {
      try {
        // Create a new invoice with the same data but a new number
        const newInvoiceNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`;
        const { id: _, created_at: __, ...invoiceData } = invoiceToDuplicate;
        
        // TODO: Implement duplicate invoice API call
        toast.success("Invoice duplicated successfully");
        await loadInvoices(); // Reload invoices to get the new one
      } catch (error) {
        console.error("Failed to duplicate invoice:", error);
        toast.error("Failed to duplicate invoice");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <InvoiceGrid
        invoices={invoices.map(invoice => ({
          id: invoice.id,
          invoiceNumber: invoice.invoice_number,
          clientName: invoice.client?.name || "Unknown Client",
          amount: invoice.total,
          dueDate: invoice.due_date,
          status: invoice.status
        }))}
        onEdit={handleEditInvoice}
        onDelete={handleDeleteInvoice}
        onDuplicate={handleDuplicateInvoice}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              invoice and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="fixed bottom-8 right-8">
        <CreateInvoiceFAB onClick={() => navigate("/invoices/create")} />
      </div>
    </div>
  );
};

export default Home;