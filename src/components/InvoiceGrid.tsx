import React from "react";
import InvoiceCard from "./InvoiceCard";

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

interface InvoiceGridProps {
  invoices?: Invoice[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

const InvoiceGrid = ({
  invoices = [
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
  ],
  onEdit = () => {},
  onDelete = () => {},
  onDuplicate = () => {},
}: InvoiceGridProps) => {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-8 place-items-center">
        {invoices.map((invoice) => (
          <InvoiceCard
            key={invoice.id}
            {...invoice}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        ))}
      </div>
    </div>
  );
};

export default InvoiceGrid;
