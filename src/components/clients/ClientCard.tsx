import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { MoreHorizontal, Mail, Phone, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatar?: string;
  totalBilled: number;
  activeProjects: number;
}

interface ClientCardProps {
  client: Client;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ClientCard = ({
  client,
  onEdit = () => {},
  onDelete = () => {},
}: ClientCardProps) => {
  return (
    <Card className="w-full max-w-md bg-white shadow-lg hover:shadow-xl transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={client.avatar} />
            <AvatarFallback>
              {client.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{client.name}</h3>
            <p className="text-sm text-muted-foreground">{client.company}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(client.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(client.id)}
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
            {client.email}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            {client.phone}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Total Billed</p>
              <p className="text-lg font-semibold">
                ${client.totalBilled.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <p className="text-lg font-semibold">{client.activeProjects}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientCard;
