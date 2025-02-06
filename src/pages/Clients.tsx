import React, { useState, useEffect } from "react";
import ClientCard, { Client } from "@/components/clients/ClientCard";
import { Button } from "@/components/ui/button";
import { Plus, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import AddClientDialog, { clientSchema } from "@/components/clients/AddClientDialog";
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
import { getClients, createClient, deleteClient } from "@/lib/api";
import { toast } from "sonner";
import { z } from "zod";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error("Failed to load clients:", error);
      toast.error("Failed to load clients");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClient = async (data: z.infer<typeof clientSchema>) => {
    try {
      const newClient = await createClient({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company_id: data.company_id,
        pin_number: data.pin_number || null,
        vat_registered: data.vat_registered,
        avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      });
      setClients([...clients, newClient]);
      toast.success("Client created successfully");
    } catch (error) {
      console.error("Failed to create client:", error);
      toast.error("Failed to create client");
    }
  };

  const handleDeleteClient = async () => {
    if (!selectedClientId) return;

    try {
      await deleteClient(selectedClientId);
      setClients(clients.filter((c) => c.id !== selectedClientId));
      toast.success("Client deleted successfully");
    } catch (error) {
      console.error("Failed to delete client:", error);
      toast.error("Failed to delete client");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedClientId(null);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Client ID copied to clipboard");
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.company && client.company.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          <div key={client.id} className="relative">
            <div className="absolute top-2 right-2 z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyId(client.id)}
                className="hover:bg-white/50"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy ID
              </Button>
            </div>
            <ClientCard
              client={client}
              onEdit={(id) => setIsAddDialogOpen(true)}
              onDelete={(id) => {
                setSelectedClientId(id);
                setIsDeleteDialogOpen(true);
              }}
            />
          </div>
        ))}
      </div>

      <AddClientDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleCreateClient}
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
              onClick={handleDeleteClient}
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
