import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InvoiceTemplateProps } from "./types";

export const MinimalTemplate: React.FC<InvoiceTemplateProps> = ({
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
  companyName,
  companyDetails,
}) => {
  return (
    <Card className="w-full bg-white shadow-lg print:shadow-none">
      <CardContent className="p-8 print:p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-wide mb-2">
            {companyName}
          </h1>
          <div className="text-sm text-gray-600">{companyDetails}</div>
        </div>

        <div className="text-center mb-8">
          <div className="text-2xl font-light mb-2">
            INVOICE #{invoiceNumber}
          </div>
          <div className="text-sm text-gray-600">
            {date} · Due by {dueDate}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center mb-8">
          <div className="font-medium">{clientName}</div>
          <div className="text-sm text-gray-600">{clientEmail}</div>
          <div className="text-sm text-gray-600 whitespace-pre-line">
            {clientAddress}
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-12 font-medium text-sm py-2 border-b">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
          {items?.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 text-sm py-3 border-b last:border-b-0"
            >
              <div className="col-span-6">{item.description}</div>
              <div className="col-span-2 text-right">{item.quantity}</div>
              <div className="col-span-2 text-right">${item.rate}</div>
              <div className="col-span-2 text-right">${item.amount}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${tax}</span>
            </div>
            <div className="flex justify-between font-medium text-lg pt-3 border-t">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>

        {notes && (
          <div className="text-sm text-gray-600 text-center mt-8 pt-8 border-t">
            {notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
