import React, { useState } from "react";
import InvoiceGrid from "./InvoiceGrid";
import InvoiceForm from "./InvoiceForm";
import InvoicePreview from "./InvoicePreview";
import CreateInvoiceFAB from "./CreateInvoiceFAB";
import { Dialog, DialogContent } from "./ui/dialog";
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

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

const Home = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      clientName: "Acme Corp",
      amount: 1500.0,
      dueDate: "2024-05-01",
      status: "pending",
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      clientName: "TechStart Inc",
      amount: 2500.0,
      dueDate: "2024-04-15",
      status: "paid",
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      clientName: "Global Solutions",
      amount: 3500.0,
      dueDate: "2024-03-30",
      status: "overdue",
    },
  ]);

  const handleCreateInvoice = () => {
    setIsCreateDialogOpen(true);
  };

  const handleEditInvoice = (id: string) => {
    setSelectedInvoiceId(id);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteInvoice = (id: string) => {
    setSelectedInvoiceId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDuplicateInvoice = (id: string) => {
    const invoiceToDuplicate = invoices.find((invoice) => invoice.id === id);
    if (invoiceToDuplicate) {
      const newInvoice = {
        ...invoiceToDuplicate,
        id: `${Date.now()}`,
        invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, "0")}`,
        status: "pending" as const,
      };
      setInvoices([...invoices, newInvoice]);
    }
  };

  const confirmDelete = () => {
    if (selectedInvoiceId) {
      setInvoices(
        invoices.filter((invoice) => invoice.id !== selectedInvoiceId),
      );
      setIsDeleteDialogOpen(false);
      setSelectedInvoiceId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF1F1]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-[#FF4545] mb-8">Invoices</h1>
        <InvoiceGrid
          invoices={invoices}
          onEdit={handleEditInvoice}
          onDelete={handleDeleteInvoice}
          onDuplicate={handleDuplicateInvoice}
        />

        <CreateInvoiceFAB onClick={handleCreateInvoice} />

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-[90vw] w-fit max-h-[90vh] overflow-y-auto">
            <div className="flex gap-6 p-4">
              <InvoiceForm
                onSubmit={(data) => {
                  console.log("Form submitted:", data);
                  setIsCreateDialogOpen(false);
                }}
              />
              <div className="hidden lg:block sticky top-0">
                <InvoicePreview />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                invoice and remove it from our servers.
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
      </div>
    </div>
  );
};

export default Home;
