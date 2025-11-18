
'use client';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    History,
    User,
    Edit3,
    PlusCircle,
    Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const iconMap = {
    Edit3,
    User,
    PlusCircle,
    Trash2
};

type AuditLog = {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    action: string;
    project: string;
    details: { from: string; to: string } | { coder: string } | null;
    timestamp: string;
    icon: keyof typeof iconMap;
}

const AuditLogSkeleton = () => (
    <div className="relative pl-6">
        <div className="absolute left-[22px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
        {Array.from({length: 5}).map((_, i) => (
            <div key={i} className="mb-8 flex items-start gap-4">
                <Skeleton className="z-10 h-10 w-10 rounded-full" />
                <div className="flex-1 pt-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </div>
        ))}
    </div>
);


export default function AdminAuditLogsPage() {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAuditLogs() {
            setLoading(true);
            const res = await fetch('/api/admin/audit-logs');
            const data = await res.json();
            setAuditLogs(data);
            setLoading(false);
        }
        fetchAuditLogs();
    }, []);

    return (
        <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <History className="h-8 w-8 text-primary"/>
                    <div>
                        <h1 className="text-2xl font-bold">Audit Logs</h1>
                        <p className="text-muted-foreground">A record of all project-related activities.</p>
                    </div>
                </div>
            </header>

            <main>
                <Card className="rounded-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                        <CardDescription>
                            {loading ? 'Loading recent events...' : `Showing the last ${auditLogs.length} recorded events.`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? <AuditLogSkeleton /> : (
                           <div className="relative pl-6">
                                <div className="absolute left-[22px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                                {auditLogs.map(log => {
                                    const Icon = iconMap[log.icon];
                                    return (
                                    <div key={log.id} className="mb-8 flex items-start gap-4">
                                            <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 border-primary">
                                                <Icon className="h-5 w-5 text-primary"/>
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <div className="flex flex-wrap items-center gap-x-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={log.user.avatar} />
                                                        <AvatarFallback>{log.user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-semibold">{log.user.name}</span>
                                                    <span className="text-muted-foreground">{log.action} on</span>
                                                    <Badge variant="secondary">{log.project}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>

        </div>
    )
}
