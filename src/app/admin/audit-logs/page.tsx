
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

const mockAuditLogs = [
    {
        id: 'log-001',
        user: { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=admin' },
        action: 'updated the status',
        project: 'QuantumLeap CRM',
        details: { from: 'Active', to: 'On Hold' },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        icon: Edit3,
    },
    {
        id: 'log-002',
        user: { name: 'David Chen', avatar: 'https://i.pravatar.cc/150?u=emp-008' },
        action: 'assigned a new coder',
        project: 'Nova E-commerce Platform',
        details: { coder: 'Kenji Tanaka' },
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        icon: User,
    },
    {
        id: 'log-003',
        user: { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=admin' },
        action: 'created a new project',
        project: 'Internal Onboarding Portal',
        details: null,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        icon: PlusCircle,
    },
    {
        id: 'log-004',
        user: { name: 'Alex Doe', avatar: 'https://i.pravatar.cc/150?u=emp-001' },
        action: 'changed the end date',
        project: 'Project Phoenix',
        details: { from: '2024-10-31', to: '2024-11-15' },
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        icon: Edit3,
    },
    {
        id: 'log-005',
        user: { name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=admin' },
        action: 'deleted a project',
        project: 'Legacy System Support',
        details: null,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        icon: Trash2,
    }
];


export default function AdminAuditLogsPage() {
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
                        <CardDescription>Showing the last {mockAuditLogs.length} recorded events.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="relative pl-6">
                        <div className="absolute left-[22px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                        {mockAuditLogs.map(log => {
                            const Icon = log.icon;
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
                    </CardContent>
                </Card>
            </main>

        </div>
    )
}
