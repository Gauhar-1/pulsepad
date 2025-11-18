
'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Mail,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

type Notification = {
    id: string;
    subject: string;
    message: string;
    timestamp: string;
    read: boolean;
};

const fetchNotifications = async (): Promise<Notification[]> => {
    const res = await fetch('/api/employee/notifications');
    if (!res.ok) {
        throw new Error('Failed to fetch notifications');
    }
    return res.json();
};

const NotificationSkeleton = () => (
    <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        </CardHeader>
        <CardContent>
            <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-2/3 mt-2" />
        </CardContent>
    </Card>
);

export default function NotificationsPage() {
    const { data: notifications, isLoading } = useQuery<Notification[]>({
        queryKey: ['notifications'],
        queryFn: fetchNotifications,
    });

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
             <div className="flex items-center">
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Notifications</h1>
            </div>
            <div className="grid gap-6">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <NotificationSkeleton key={i} />)
                ) : (
                    notifications?.map((notification) => (
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
                    ))
                )}
            </div>
        </main>
    );
}
