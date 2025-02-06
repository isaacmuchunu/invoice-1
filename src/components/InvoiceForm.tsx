import React, { useEffect, useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Plus, Minus, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { cn } from "@/lib/utils";
import { getClients, getCompanies } from "@/lib/api";
import type { Client, Company } from "@/lib/supabase";
import { toast } from "sonner";

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  rate: z.number().min(0, "Rate must be non-negative"),
  discount_type: z.enum(['percentage', 'fixed']).optional(),
  discount_value: z.number().default(0),
  vat_applicable: z.boolean().default(true),
  withholding_tax_applicable: z.boolean().default(false)
});

const formSchema = z
  .object({
    invoice_number: z.string().min(1, "Invoice number is required")
      .regex(/^INV-\d{4}-\d+$/, "Invalid invoice number format"),
    client_id: z.string().uuid("Must be a valid UUID"),
    company_id: z.string().uuid("Must be a valid UUID"),
    payment_terms_id: z.string().uuid("Must be a valid UUID").optional(),
    issue_date: z.string().min(1, "Issue date is required"),
    due_date: z.string().min(1, "Due date is required"),
    currency: z.enum(['KES', 'USD', 'EUR', 'GBP']).default('KES'),
    notes: z.string().optional(),
    status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).default('draft'),
    discount_type: z.enum(['percentage', 'fixed']).optional(),
    discount_value: z.number().default(0),
    line_items: z.array(lineItemSchema).min(1, "At least one line item is required"),
    taxRate: z.number().default(0),
    vat_applicable: z.boolean().default(true),
    withholding_tax_applicable: z.boolean().default(false),
    invoice_discount_type: z.enum(['percentage', 'fixed']).optional(),
    invoice_discount_value: z.number().default(0)
  })
  .superRefine((data, ctx) => {
    if (new Date(data.due_date) < new Date(data.issue_date)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Due date must be after issue date",
        path: ["due_date"]
      });
    }
  });

const defaultValues: z.infer<typeof formSchema> = {
  invoice_number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
  client_id: "",
  company_id: "",
  payment_terms_id: "",
  issue_date: new Date().toISOString().split("T")[0],
  due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  currency: "KES",
  notes: "Payment is due within 30 days",
  status: "draft",
  discount_type: undefined,
  discount_value: 0,
  taxRate: 0,
  vat_applicable: true,
  withholding_tax_applicable: false,
  invoice_discount_type: undefined,
  invoice_discount_value: 0,
  line_items: [{
    description: "Professional Services",
    quantity: 1,
    rate: 100,
    discount_type: undefined,
    discount_value: 0,
    vat_applicable: true,
    withholding_tax_applicable: false
  }]
};

interface InvoiceFormProps {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onChange: (data: z.infer<typeof formSchema>) => void;
  initialData?: z.infer<typeof formSchema>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDialog?: boolean;
}

const InvoiceForm = React.forwardRef<HTMLFormElement, InvoiceFormProps>((props, ref) => {
  const { onSubmit, onChange, initialData, open, onOpenChange, isDialog = false } = props;
  const [clients, setClients] = useState<Client[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [clientOpen, setClientOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "line_items",
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
        console.error("Error loading data:", error);
        toast.error("Failed to load clients and companies");
      }
    };
    loadData();
  }, []);

  const calculateLineItemTotal = (item: z.infer<typeof lineItemSchema>) => {
    const subtotal = item.quantity * item.rate;
    if (!item.discount_type || !item.discount_value) {
      return subtotal;
    }
    const discount = item.discount_type === 'percentage' 
      ? (subtotal * item.discount_value / 100)
      : item.discount_value;
    return subtotal - discount;
  };

  const calculateInvoiceTotal = (data: z.infer<typeof formSchema>) => {
    const subtotal = data.line_items.reduce((acc, item) => acc + calculateLineItemTotal(item), 0);
    let total = subtotal;

    // Apply invoice-level discount
    if (data.invoice_discount_type && data.invoice_discount_value) {
      const invoiceDiscount = data.invoice_discount_type === 'percentage'
        ? (subtotal * data.invoice_discount_value / 100)
        : data.invoice_discount_value;
      total -= invoiceDiscount;
    }

    // Apply tax
    if (data.vat_applicable && data.taxRate) {
      total += total * (data.taxRate / 100);
    }

    // Apply withholding tax if applicable
    if (data.withholding_tax_applicable) {
      total -= total * 0.05; // 5% withholding tax
    }

    return {
      subtotal,
      total: Math.round(total * 100) / 100 // Round to 2 decimal places
    };
  };

  const watchedValues = form.watch();
  const { subtotal, total } = useMemo(() => calculateInvoiceTotal(watchedValues), [watchedValues]);
  
  const memoizedOnChange = useMemo(() => onChange, [onChange]);
  
  useEffect(() => {
    if (watchedValues) {
      memoizedOnChange(watchedValues);
    }
  }, [watchedValues, memoizedOnChange]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await onSubmit(data);
      if (isDialog) {
        onOpenChange(false);
      }
      toast.success("Invoice created successfully");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit invoice");
      throw error; // Re-throw to let the form handle the error state
    }
  };

  const FormWrapper = isDialog ? Dialog : React.Fragment;
  const FormContent = isDialog ? DialogContent : "div";

  const formContent = (
    <Form {...form}>
      <form ref={ref} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1 space-y-6">
            {/* Left column fields */}
            <FormField
              control={form.control}
              name="invoice_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Popover open={clientOpen} onOpenChange={setClientOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={clientOpen}
                        className="w-full justify-between"
                      >
                        {field.value
                          ? clients.find((client) => client.id === field.value)?.name
                          : "Select client..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search clients..." />
                        <CommandList>
                          <CommandEmpty>No clients found.</CommandEmpty>
                          <CommandGroup>
                            {clients.map((client) => (
                                <CommandItem
                                key={client.id}
                                value={client.id}
                                onSelect={(selectedValue) => {
                                  form.setValue("client_id", selectedValue);
                                  if (client.company) {
                                  form.setValue("company_id", client.company.id);
                                  }
                                  setClientOpen(false);
                                }}
                                >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    client.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {client.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={companyOpen}
                        className="w-full justify-between"
                      >
                        {field.value
                          ? companies.find((company) => company.id === field.value)?.name
                          : "Select company..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search companies..." />
                        <CommandList>
                          <CommandEmpty>No companies found.</CommandEmpty>
                          <CommandGroup>
                            {companies.map((company) => (
                                <CommandItem
                                key={company.id}
                                value={company.id}
                                onSelect={(selectedValue) => {
                                  form.setValue("company_id", selectedValue);
                                  setCompanyOpen(false);
                                }}
                                >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    company.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {company.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-1 space-y-6">
            {/* Right column fields */}
            <FormField
              control={form.control}
              name="issue_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="KES">KES</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Line Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({
                description: "",
                quantity: 1,
                rate: 0,
                discount_type: undefined,
                discount_value: 0,
                vat_applicable: true,
                withholding_tax_applicable: false
              })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-4 items-end">
              <div className="col-span-4">
                <FormField
                  control={form.control}
                  name={`line_items.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name={`line_items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name={`line_items.${index}.rate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name={`line_items.${index}.discount_type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Type</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        >
                          <option value="">None</option>
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {form.watch(`line_items.${index}.discount_type`) && (
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name={`line_items.${index}.discount_value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Value</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{watchedValues.currency} {subtotal.toFixed(2)}</span>
            </div>
            {watchedValues.invoice_discount_type && watchedValues.invoice_discount_value > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Invoice Discount ({watchedValues.invoice_discount_type === 'percentage' ? `${watchedValues.invoice_discount_value}%` : 'Fixed'}):</span>
                <span>- {watchedValues.currency} {(
                  watchedValues.invoice_discount_type === 'percentage'
                    ? subtotal * watchedValues.invoice_discount_value / 100
                    : watchedValues.invoice_discount_value
                ).toFixed(2)}</span>
              </div>
            )}
            {watchedValues.vat_applicable && watchedValues.taxRate > 0 && (
              <div className="flex justify-between text-sm">
                <span>VAT ({watchedValues.taxRate}%):</span>
                <span>{watchedValues.currency} {(subtotal * watchedValues.taxRate / 100).toFixed(2)}</span>
              </div>
            )}
            {watchedValues.withholding_tax_applicable && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Withholding Tax (5%):</span>
                <span>- {watchedValues.currency} {(subtotal * 0.05).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-lg border-t pt-2">
              <span>Total:</span>
              <span>{watchedValues.currency} {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-1 space-y-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Enter any additional notes or payment instructions"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="invoice_discount_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Discount Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="">None</option>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("invoice_discount_type") && (
              <FormField
                control={form.control}
                name="invoice_discount_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice Discount Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="col-span-1 space-y-6">
            <FormField
              control={form.control}
              name="taxRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vat_applicable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>VAT Applicable</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="withholding_tax_applicable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Withholding Tax Applicable</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          {isDialog && (
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            Save Invoice
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <FormWrapper {...(isDialog ? { open, onOpenChange } : {})}>
      {isDialog ? (
        <FormContent>
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new invoice.
            </DialogDescription>
          </DialogHeader>
          {formContent}
        </FormContent>
      ) : (
        formContent
      )}
    </FormWrapper>
  );
});

InvoiceForm.displayName = "InvoiceForm";

export default InvoiceForm; 