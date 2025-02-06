import React, { useEffect, useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Save, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getCompanies } from "@/lib/api";
import type { Company } from "@/lib/supabase";

// Schema definition (adjusted to your Supabase types)
export const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  company_id: z.string().uuid("Must be a valid company UUID"),
  pin_number: z
    .string()
    .regex(/^[A-Z][0-9]{9}[A-Z]$/, "Invalid PIN format. Example: A123456789Z")
    .optional()
    .nullable(),
  vat_registered: z.boolean().default(false),
  avatar: z.string().url().optional().nullable(),
});

interface AddClientDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof clientSchema>) => void;
}

const AddClientDialog = ({ open, onOpenChange, onSubmit = () => {} }: AddClientDialogProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companySearchOpen, setCompanySearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company_id: "",
      pin_number: "",
      vat_registered: false,
      avatar: "",
    },
  });

  // Load companies when the dialog opens
  useEffect(() => {
    // Reset state when dialog closes
    if (!open) {
      setCompanies([]);
      setSearch("");
      setIsLoading(false);
      return;
    }

    let mounted = true;
    const loadCompanies = async () => {
      setIsLoading(true);
      try {
        const data = await getCompanies();
        if (!mounted) return;
        
        const safeData = Array.isArray(data) ? data : [];
        setCompanies(safeData);
        
        if (safeData.length === 0) {
          toast.info("No companies found. Please add a company first.");
        }
      } catch (error) {
        if (!mounted) return;
        console.error("Failed to load companies:", error);
        toast.error("Failed to load companies");
        setCompanies([]);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadCompanies();
    
    return () => {
      mounted = false;
    };
  }, [open]);

  const filteredCompanies = useMemo(() => {
    if (!companies || !Array.isArray(companies)) return [];
    if (!search) return companies;

    const lowerCaseSearch = search.toLowerCase().trim();
    return companies.filter((company) => {
      if (!company || typeof company.name !== 'string') return false;
      return company.name.toLowerCase().includes(lowerCaseSearch);
    });
  }, [companies, search]);


  const handleSearchChange = (val: string | React.ChangeEvent<HTMLInputElement>) => {
    if (typeof val === 'string') {
      setSearch(val);
    } else if (val?.target && typeof val.target.value === 'string') { // Added null check
      setSearch(val.target.value);
    }
  };

  const handleSubmit = (values: z.infer<typeof clientSchema>) => {
    onSubmit(values);
    form.reset();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Fill in the client details below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone *</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Selection */}
            <FormField
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company *</FormLabel>
                  <Popover open={companySearchOpen} onOpenChange={setCompanySearchOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          type="button"
                          className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value
                            ? companies.find((company) => company.id === field.value)?.name
                            : isLoading
                            ? "Loading..."
                            : "Select company"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                          <Command>
                          <CommandInput
                            placeholder={isLoading ? "Loading..." : "Search companies..."}
                            value={search}
                            onValueChange={handleSearchChange}
                            disabled={isLoading}
                          />
                          <CommandList>
                            {isLoading ? (
                            <CommandEmpty>Loading companies...</CommandEmpty>
                            ) : filteredCompanies.length === 0 ? (
                            <CommandEmpty>
                              {companies.length === 0 
                              ? "No companies found. Please add a company first."
                              : "No matching companies found."}
                            </CommandEmpty>
                            ) : (
                            <CommandGroup>
                              {filteredCompanies.map((company) => (
                              company && (
                                <CommandItem
                                key={company.id}
                                value={company.id}
                                onSelect={(selectedValue) => {
                                  form.setValue("company_id", selectedValue);
                                  setCompanySearchOpen(false);
                                  setSearch("");
                                }}
                                >
                                <Check
                                  className={cn(
                                  "mr-2 h-4 w-4",
                                  company.id === form.getValues("company_id") ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {company.name}
                                </CommandItem>
                              )
                              ))}
                            </CommandGroup>
                            )}
                          </CommandList>
                          </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* KRA PIN Number */}
            <FormField
              control={form.control}
              name="pin_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KRA PIN Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="A123456789Z" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* VAT Registered */}
            <FormField
              control={form.control}
              name="vat_registered"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <FormLabel>VAT Registered</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

           {/* Avatar URL */}
           <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input {...field} type="url" placeholder="https://" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="col-span-2 flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange?.(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" /> Save Client
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;