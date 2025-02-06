// InvoiceCard.tsx
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { MoreHorizontal, Copy, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

interface InvoiceCardProps {
  id?: string;
  invoiceNumber?: string;
  clientName?: string;
  amount?: number;
  dueDate?: string;
  status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

const InvoiceCard = ({
  id = "001",
  invoiceNumber = "INV-2024-001",
  clientName = "Acme Corp",
  amount = 1500.0,
  dueDate = "2024-05-01",
  status = "pending",
  onEdit = () => {},
  onDelete = () => {},
  onDuplicate = () => {},
}: InvoiceCardProps) => {
  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
    cancelled: "bg-purple-100 text-purple-800",
  };

  return (
    <Card className="w-full max-w-sm bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg">{invoiceNumber}</h3>
          <p className="text-sm text-muted-foreground">{clientName}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(id)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mt-2">
          <div className="text-2xl font-bold">
            ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
          <Badge className={statusColors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Due:{" "}
        {new Date(dueDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </CardFooter>
    </Card>
  );
};

export default InvoiceCard;
