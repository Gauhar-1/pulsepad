'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Shield, User, Briefcase } from 'lucide-react';
import type { User as UserType } from '@/lib/definitions';
import { useEffect, useState } from 'react';

const AdminReport = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield /> Admin Report
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p>This is where the Admin leaderboard, project analysis, and employee scorecards will be displayed.</p>
    </CardContent>
  </Card>
);

const EmployeeReport = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User /> Employee Report
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p>This is where your personal performance and task reports will be displayed.</p>
    </CardContent>
  </Card>
);

const ClientReport = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Briefcase /> Client Report
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p>This is where the project timeline and milestone overview will be displayed.</p>
    </CardContent>
  </Card>
);


export default function ReportsPage() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const renderReport = () => {
    if (!user) {
      return null;
    }
    switch (user.role) {
      case 'admin':
        return <AdminReport />;
      case 'employee':
        return <EmployeeReport />;
      case 'client':
        return <ClientReport />;
      default:
        return (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>No Report Available</AlertTitle>
            <AlertDescription>
              Reports are not available for your role at this time.
            </AlertDescription>
          </Alert>
        );
    }
  };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Reports</h1>
      </div>
      {renderReport()}
    </main>
  );
}
