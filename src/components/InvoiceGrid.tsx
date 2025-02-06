import React from "react";
import InvoiceCard from "./InvoiceCard";

interface GridInvoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
}

interface InvoiceGridProps {
  invoices: GridInvoice[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

const InvoiceGrid = ({
  invoices = [],
  onEdit = () => {},
  onDelete = () => {},
  onDuplicate = () => {},
}: InvoiceGridProps) => {
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
        <p className="text-lg">No invoices found</p>
        <p className="text-sm">Create a new invoice to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {invoices.map((invoice) => (
        <InvoiceCard
          key={invoice.id}
          id={invoice.id}
          invoiceNumber={invoice.invoiceNumber}
          clientName={invoice.clientName}
          amount={invoice.amount}
          dueDate={invoice.dueDate}
          status={invoice.status}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
};

export default InvoiceGrid;
