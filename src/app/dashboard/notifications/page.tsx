'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Bell,
  Mail,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const mockNotifications = [
    {
        id: 'notif-001',
        subject: 'Project Assignment: QuantumLeap CRM',
        message: "You have been assigned as the Project Leader for QuantumLeap CRM. Please review the project details and connect with the team.",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        read: false,
    },
    {
        id: 'notif-002',
        subject: 'Daily Update Reminder',
        message: "This is a friendly reminder to submit your daily updates for all active projects before the end of the day.",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        read: false,
    },
    {
        id: 'notif-003',
        subject: 'Deadline Approaching: Nova E-commerce',
        message: "The deadline for the 'Development Sprint 1' milestone for the Nova E-commerce Platform is in 3 days. Please ensure all tasks are on track.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
    },
     {
        id: 'notif-004',
        subject: 'New Company-wide Training Module',
        message: "A new training module, 'Advanced TypeScript Techniques', has been assigned to you. Please complete it by the end of next week.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
    },
];


export default function NotificationsPage() {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
             <div className="flex items-center">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Notifications</h1>
            </div>
            <div className="grid gap-6">
                {mockNotifications.map((notification) => (
                    <Card key={notification.id} className={!notification.read ? 'border-primary' : ''}>
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                             <div className={`p-3 rounded-full ${!notification.read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                <Mail className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-lg">{notification.subject}</CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{notification.message}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </main>
    );
}
