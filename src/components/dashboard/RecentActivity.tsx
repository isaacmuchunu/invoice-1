import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const activities = [
  {
    id: 1,
    type: "invoice_created",
    user: "Sarah Wilson",
    userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    description: "Created new invoice for Acme Corp",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "payment_received",
    user: "Michael Chen",
    userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    description: "Received payment for INV-2024-003",
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    type: "client_added",
    user: "Emma Thompson",
    userImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    description: "Added new client TechStart Inc",
    timestamp: "1 day ago",
  },
];

const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-4 rounded-lg p-3 hover:bg-accent transition-colors"
            >
              <Avatar>
                <AvatarImage src={activity.userImage} />
                <AvatarFallback>
                  {activity.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.description}</p>
                <p className="text-sm text-muted-foreground">
                  by {activity.user} · {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
