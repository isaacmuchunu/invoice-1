import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Save, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const settingsSchema = z.object({
  // Company Details
  companyName: z.string().min(1, "Company name is required"),
  companyLogo: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().url().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  vatNumber: z.string().optional(),
  registrationNumber: z.string().optional(),

  // Invoice Settings
  currency: z.string(),
  taxRate: z.string(),
  invoicePrefix: z.string(),
  defaultPaymentTerms: z.number().min(0),
  defaultNotes: z.string(),
  emailSignature: z.string(),

  // Notification Settings
  notifyOnPayment: z.boolean(),
  notifyOnOverdue: z.boolean(),
  notifyOnDueSoon: z.boolean(),
  dueSoonThreshold: z.number().min(1).max(30),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
});

const Settings = () => {
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: "HELIOS",
      email: "billing@helios.com",
      phone: "+1 (555) 123-4567",
      website: "https://helios.com",
      address: "123 Business Street",
      city: "San Francisco",
      country: "United States",
      postalCode: "94105",
      currency: "USD",
      taxRate: "10",
      invoicePrefix: "INV",
      defaultPaymentTerms: 30,
      defaultNotes: "Payment is due within the specified terms.",
      emailSignature: "Thank you for your business!",
      notifyOnPayment: true,
      notifyOnOverdue: true,
      notifyOnDueSoon: true,
      dueSoonThreshold: 7,
      emailNotifications: true,
      pushNotifications: true,
    },
  });

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    console.log(values);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-[#FF4545]">Settings</h1>

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Company Details Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Company Details</h2>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                    {form.getValues("companyLogo") ? (
                      <img
                        src={form.getValues("companyLogo")}
                        alt="Company Logo"
                        className="h-20 w-20 object-contain"
                      />
                    ) : (
                      <div className="text-gray-400">No logo</div>
                    )}
                  </div>
                  <Button type="button" variant="outline">
                    <Upload className="w-4 h-4 mr-2" /> Upload Logo
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} type="url" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vatNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VAT Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="registrationNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Invoice Settings Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Invoice Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">
                              GBP - British Pound
                            </SelectItem>
                            <SelectItem value="JPY">
                              JPY - Japanese Yen
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Tax Rate (%)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="invoicePrefix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Number Prefix</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          E.g., INV for INV-2024-001
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultPaymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Payment Terms (days)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="defaultNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Invoice Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emailSignature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Signature</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Notification Settings Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">
                  Notification Settings
                </h2>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notifyOnPayment"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Payment Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications when invoices are paid
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notifyOnOverdue"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Overdue Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications for overdue invoices
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notifyOnDueSoon"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Due Soon Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications for invoices due soon
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueSoonThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Soon Threshold (days)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="1" max="30" />
                        </FormControl>
                        <FormDescription>
                          Number of days before due date to send notifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Email Notifications
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pushNotifications"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Push Notifications
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" /> Save Settings
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
