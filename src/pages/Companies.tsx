import React, { useState } from "react";
import CompanyCard, { Company } from "@/components/companies/CompanyCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddCompanyDialog from "@/components/companies/AddCompanyDialog";
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

const initialCompanies: Company[] = [
  {
    id: "1",
    name: "TechStart Inc",
    email: "contact@techstart.com",
    phone: "+1 (555) 123-4567",
    website: "www.techstart.com",
    address: "123 Innovation Ave, San Francisco, CA 94105",
    employeeCount: 50,
    totalBilled: 145000,
  },
  {
    id: "2",
    name: "Acme Corp",
    email: "info@acme.com",
    phone: "+1 (555) 987-6543",
    website: "www.acme.com",
    address: "456 Enterprise St, New York, NY 10001",
    employeeCount: 200,
    totalBilled: 372000,
  },
  {
    id: "3",
    name: "Global Solutions",
    email: "contact@globalsolutions.com",
    phone: "+1 (555) 456-7890",
    website: "www.globalsolutions.com",
    address: "789 Business Blvd, Chicago, IL 60601",
    employeeCount: 100,
    totalBilled: 228000,
  },
];

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
          <CompanyCard
            key={company.id}
            company={company}
            onEdit={(id) => setIsAddDialogOpen(true)}
            onDelete={(id) => {
              setSelectedCompanyId(id);
              setIsDeleteDialogOpen(true);
            }}
          />
        ))}
      </div>

      <AddCompanyDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={(data) => {
          const newCompany = {
            id: `${Date.now()}`,
            ...data,
            totalBilled: 0,
          };
          setCompanies([...companies, newCompany]);
        }}
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
              onClick={() => {
                if (selectedCompanyId) {
                  setCompanies(
                    companies.filter((c) => c.id !== selectedCompanyId),
                  );
                  setIsDeleteDialogOpen(false);
                  setSelectedCompanyId(null);
                }
              }}
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
