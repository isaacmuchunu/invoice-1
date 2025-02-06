import React, { useState, useEffect } from "react";
import CompanyCard, { Company } from "@/components/companies/CompanyCard";
import { Button } from "@/components/ui/button";
import { Plus, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddCompanyDialog, { companySchema } from "@/components/companies/AddCompanyDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getCompanies, createCompany, deleteCompany } from "@/lib/api";
import { toast } from "sonner";
import { z } from "zod";

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Failed to load companies:", error);
      toast.error("Failed to load companies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCompany = async (data: z.infer<typeof companySchema>) => {
    try {
      const newCompany = await createCompany({
        name: data.name,
        email: data.email,
        phone: data.phone,
        website: data.website,
        address: data.address,
        pin_number: data.pin_number,
        vat_registered: data.vat_registered,
        employee_count: data.employee_count,
        logo: data.logo || undefined,
      });
      setCompanies([...companies, newCompany]);
      toast.success("Company created successfully");
    } catch (error) {
      console.error("Failed to create company:", error);
      toast.error("Failed to create company");
    }
  };

  const handleDeleteCompany = async () => {
    if (!selectedCompanyId) return;

    try {
      await deleteCompany(selectedCompanyId);
      setCompanies(companies.filter((c) => c.id !== selectedCompanyId));
      toast.success("Company deleted successfully");
    } catch (error) {
      console.error("Failed to delete company:", error);
      toast.error("Failed to delete company");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedCompanyId(null);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Company ID copied to clipboard");
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-[#FF4545]">Companies</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Company
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="relative">
            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyId(company.id)}
                className="hover:bg-white/50"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy ID
              </Button>
            </div>
            <CompanyCard
              company={company}
              onEdit={(id) => setIsAddDialogOpen(true)}
              onDelete={(id) => {
                setSelectedCompanyId(id);
                setIsDeleteDialogOpen(true);
              }}
            />
          </div>
        ))}
      </div>

      <AddCompanyDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleCreateCompany}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              company and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCompany}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Companies;
