import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import {
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface Company {
  id: string;
  name: string;
  logo?: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  employee_count: number;
  total_billed: number;
  pin_number: string;
  vat_registered: boolean;
}

interface CompanyCardProps {
  company: Company;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const CompanyCard = ({
  company,
  onEdit = () => {},
  onDelete = () => {},
}: CompanyCardProps) => {
  return (
    <Card className="w-full max-w-md bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.name}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <span className="text-xl font-bold text-gray-400">
                {company.name[0]}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{company.name}</h3>
            <p className="text-sm text-muted-foreground">
              {company.employee_count} employees
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(company.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(company.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            {company.email}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            {company.phone}
          </div>
          <div className="flex items-center text-sm">
            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
            {company.website}
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            {company.address}
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium mr-2">PIN:</span>
            {company.pin_number}
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium mr-2">VAT Status:</span>
            {company.vat_registered ? (
              <span className="text-green-600">Registered</span>
            ) : (
              <span className="text-gray-500">Not Registered</span>
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">Total Billed</p>
            <p className="text-lg font-semibold">
              ${company.total_billed.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;
