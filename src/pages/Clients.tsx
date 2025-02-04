import React, { useState } from "react";
import ClientCard, { Client } from "@/components/clients/ClientCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddClientDialog from "@/components/clients/AddClientDialog";
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

const initialClients: Client[] = [
  {
    id: "1",
    name: "Sarah Wilson",
    email: "sarah@techstart.com",
    phone: "+1 (555) 123-4567",
    company: "TechStart Inc",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    totalBilled: 45000,
    activeProjects: 3,
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@acme.com",
    phone: "+1 (555) 987-6543",
    company: "Acme Corp",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    totalBilled: 72000,
    activeProjects: 2,
  },
  {
    id: "3",
    name: "Emma Thompson",
    email: "emma@global.com",
    phone: "+1 (555) 456-7890",
    company: "Global Solutions",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    totalBilled: 28000,
    activeProjects: 1,
  },
];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-[#FF4545]">Clients</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={(id) => setIsAddDialogOpen(true)}
            onDelete={(id) => {
              setSelectedClientId(id);
              setIsDeleteDialogOpen(true);
            }}
          />
        ))}
      </div>

      <AddClientDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={(data) => {
          const newClient = {
            id: `${Date.now()}`,
            ...data,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
            totalBilled: 0,
            activeProjects: 0,
          };
          setClients([...clients, newClient]);
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
              client and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedClientId) {
                  setClients(clients.filter((c) => c.id !== selectedClientId));
                  setIsDeleteDialogOpen(false);
                  setSelectedClientId(null);
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

export default Clients;
