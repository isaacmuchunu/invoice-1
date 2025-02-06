// InvoicePreview.js
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
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

interface InvoicePreviewProps {
  template?: TemplateType;
  onTemplateChange?: (t: TemplateType) => void;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  companyName?: string;
  companyDetails?: string;
  printCopies?: string[];
}

const InvoicePreview = ({
  template = "modern",
  onTemplateChange = (t: TemplateType) => {},
  invoiceNumber,
  date,
  dueDate,
  clientName,
  clientEmail,
  clientAddress,
  items,
  subtotal,
  tax,
  total,
  notes,
  companyName = "HELIOS",
  companyDetails = "123 Business Street\nCity, State 12345\ncontact@helios.com",
  printCopies = ["CUSTOMER COPY", "COMPANY COPY"],
}: InvoicePreviewProps) => {
  const printRef = React.useRef(null);

  const handlePrint = React.useCallback(() => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <link rel="stylesheet" href="${window.location.origin}/src/index.css">
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              .print-content { width: 100%; page-break-after: always; }
              .copy-label { font-size: 14px; color: #666; margin-bottom: 10px; }
              @page { margin: 0.5cm; }
            }
          </style>
        </head>
        <body>
          ${printCopies.map((copyLabel, index) => `
            <div class="print-content">
              <div class="copy-label">${copyLabel}</div>
              ${printContent.outerHTML}
            </div>
            ${index < printCopies.length - 1 ? '<div style="page-break-after: always;"></div>' : ''}
          `).join('')}
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }, [printCopies]);

  const handleDownload = React.useCallback(async () => {
    try {
      const printContent = printRef.current;
      if (!printContent) return;

      const htmlContent = printCopies.map((copyLabel, index) => `
        <div style="${index > 0 ? 'page-break-before: always;' : ''}">
          <div style="color: #666; margin-bottom: 10px;">${copyLabel}</div>
          ${printContent.outerHTML}
        </div>
      `).join('');

      const response = await fetch("https://api.pdfshift.io/v3/convert/html", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("api:sk_842e2e28a0edc595a2cdd3f3d53eb294e35922f5"), // Replace with your actual API key
        },
        body: JSON.stringify({
          source: htmlContent,
          landscape: false,
          use_print: false,
          filename: `invoice-${invoiceNumber}.pdf`,
        }),
      });

      if (!response.ok) throw new Error("PDF generation failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  }, [invoiceNumber, printCopies]);

  const handleSend = React.useCallback(() => {
    const subject = `Invoice ${invoiceNumber} from ${companyName}`;
    const body = `Dear ${clientName},\n\nPlease find attached invoice ${invoiceNumber}.\n\nBest regards,\n${companyName}`;
    window.location.href = `mailto:${clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [invoiceNumber, clientName, clientEmail]);

  const TemplateComponent = React.useMemo(() => {
    switch (template) {
      case "minimal":
        return MinimalTemplate;
      case "modern":
      default:
        return ModernTemplate;
    }
  }, [template]);

  return (
    <>
    <Card className="w-[800px] bg-white shadow-lg">
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
        <div ref={printRef}>
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
            companyName={companyName}
            companyDetails={companyDetails}
          />
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default InvoicePreview;