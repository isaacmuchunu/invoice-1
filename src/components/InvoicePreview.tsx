import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Download, Printer, Send, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ModernTemplate } from "./invoices/templates/modern";
import { MinimalTemplate } from "./invoices/templates/minimal";
import { TemplateType } from "./invoices/templates/types";

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoicePreviewProps {
  template?: TemplateType;
  onTemplateChange?: (template: TemplateType) => void;
  invoiceNumber?: string;
  date?: string;
  dueDate?: string;
  clientName?: string;
  clientEmail?: string;
  clientAddress?: string;
  items?: LineItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  notes?: string;
}

const InvoicePreview = ({
  template = "modern",
  onTemplateChange = () => {},
  invoiceNumber = "INV-2024-001",
  date = "2024-03-21",
  dueDate = "2024-04-21",
  clientName = "Acme Corporation",
  clientEmail = "billing@acme.com",
  clientAddress = "123 Business Ave, Suite 100, Business City, 12345",
  items = [
    {
      description: "Web Development Services",
      quantity: 40,
      rate: 150,
      amount: 6000,
    },
    {
      description: "UI/UX Design",
      quantity: 20,
      rate: 125,
      amount: 2500,
    },
  ],
  subtotal = 8500,
  tax = 850,
  total = 9350,
  notes = "Payment is due within 30 days. Please include the invoice number on your payment.",
}: InvoicePreviewProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    console.log("Downloading invoice...");
  };

  const handleSend = () => {
    // In a real app, this would open an email dialog
    console.log("Sending invoice...");
  };

  const TemplateComponent =
    template === "minimal" ? MinimalTemplate : ModernTemplate;

  return (
    <Card className="w-[500px] bg-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <CardTitle className="text-lg font-medium">Invoice Preview</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={template} onValueChange={onTemplateChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="modern">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Modern
                </div>
              </SelectItem>
              <SelectItem value="minimal">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Minimal
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <TemplateComponent
          invoiceNumber={invoiceNumber}
          date={date}
          dueDate={dueDate}
          clientName={clientName}
          clientEmail={clientEmail}
          clientAddress={clientAddress}
          items={items}
          subtotal={subtotal}
          tax={tax}
          total={total}
          notes={notes}
          companyName="HELIOS"
          companyDetails="123 Business Street\nCity, State 12345\ncontact@helios.com"
        />
      </CardContent>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#FF4545]">INVOICE</h1>
            <p className="text-sm text-gray-600 mt-1">#{invoiceNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Date: {date}</p>
            <p className="text-sm text-gray-600">Due Date: {dueDate}</p>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
          <p className="font-medium">{clientName}</p>
          <p className="text-gray-600">{clientEmail}</p>
          <p className="text-gray-600">{clientAddress}</p>
        </div>

        {/* Items */}
        <div className="mb-8">
          <div className="grid grid-cols-12 font-semibold text-sm text-gray-600 mb-2">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          <Separator className="mb-4" />
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 text-sm mb-2">
              <div className="col-span-6">{item.description}</div>
              <div className="col-span-2 text-right">{item.quantity}</div>
              <div className="col-span-2 text-right">${item.rate}</div>
              <div className="col-span-2 text-right">${item.amount}</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t pt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Tax (10%)</span>
            <span>${tax}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mt-4">
            <span>Total</span>
            <span>${total}</span>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8 text-sm text-gray-600">
          <p className="font-semibold mb-2">Notes:</p>
          <p>{notes}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicePreview;
