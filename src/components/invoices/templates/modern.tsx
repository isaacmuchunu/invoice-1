import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InvoiceTemplateProps } from "./types";

export const ModernTemplate: React.FC<InvoiceTemplateProps> = ({
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
  companyLogo,
  companyName,
  companyDetails,
}) => {
  return (
    <Card className="w-full bg-white shadow-lg print:shadow-none">
      <CardContent className="p-8 print:p-4">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-2">
            {companyLogo && (
              <img
                src={companyLogo}
                alt="Company Logo"
                className="h-12 w-auto"
              />
            )}
            <h1 className="text-3xl font-bold text-[#FF4545]">{companyName}</h1>
            <div className="text-sm text-gray-600">{companyDetails}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold mb-2">INVOICE</div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>#{invoiceNumber}</div>
              <div>Issue Date: {date}</div>
              <div>Due Date: {dueDate}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
            <div className="space-y-1">
              <div className="font-medium">{clientName}</div>
              <div className="text-gray-600">{clientEmail}</div>
              <div className="text-gray-600 whitespace-pre-line">
                {clientAddress}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-12 font-semibold text-sm bg-gray-50 p-4 rounded-t-lg">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          <div className="border-x border-b rounded-b-lg divide-y">
            {items?.map((item, index) => (
              <div key={index} className="grid grid-cols-12 p-4 text-sm">
                <div className="col-span-6">{item.description}</div>
                <div className="col-span-2 text-right">{item.quantity}</div>
                <div className="col-span-2 text-right">${item.rate}</div>
                <div className="col-span-2 text-right">${item.amount}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>

        {notes && (
          <div className="text-sm text-gray-600 border-t pt-4">
            <div className="font-semibold mb-1">Notes:</div>
            <div>{notes}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
