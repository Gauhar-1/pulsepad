
'use client';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from '@/components/ui/card';
import { CheckCheck, Send, User, ChevronDown, Check, Circle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Employee, DailyAssessment, AssessmentTemplate } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const fetchEmployees = async (): Promise<Employee[]> => {
    const res = await fetch('/api/admin/employees');
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
}
const fetchAssessmentsData = async (): Promise<{assessments: DailyAssessment[], templates: AssessmentTemplate[]}> => {
    const res = await fetch('/api/admin/assessments');
    if (!res.ok) throw new Error('Failed to fetch assessments');
    return res.json();
}

interface CombinedData {
    employees: Employee[];
    assessments: DailyAssessment[];
    templates: AssessmentTemplate[];
}

const statusVariant: { [key: string]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
  SUBMITTED: 'secondary',
  VALIDATED: 'default',
  ASSIGNED: 'outline',
};

const statusIcon = {
  SUBMITTED: Circle,
  VALIDATED: Check,
  ASSIGNED: Circle,
};

const statusColor = {
  SUBMITTED: 'text-blue-500',
  VALIDATED: 'text-green-500',
  ASSIGNED: 'text-muted-foreground',
};


export default function AdminAssessmentsPage() {
    const [selectedSubmission, setSelectedSubmission] = useState<DailyAssessment | null>(null);

    const { data, isLoading } = useQuery<CombinedData>({
        queryKey: ['admin-assessments'],
        queryFn: async () => {
            const [employees, {assessments, templates}] = await Promise.all([
                fetchEmployees(),
                fetchAssessmentsData()
            ]);
            return { employees, assessments, templates };
        }
    });

    const { employees = [], assessments = [], templates = [] } = data || {};
    
    const submittedAssessments = assessments.filter(a => a.status === 'SUBMITTED');

    const getEmployeeName = (id: string) => employees.find(e => e.id === id)?.name || 'Unknown';

    if (selectedSubmission) {
      const template = templates.find(t => t.id === selectedSubmission.templateId);
      if (!template) return <p>Template not found</p>;

      return (
        <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
            <header className="mb-8">
                <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                    Back to Validation Dashboard
                </Button>
                <h1 className="text-2xl font-bold mt-4">Validate Submission</h1>
                <p className="text-muted-foreground">
                    Employee: {getEmployeeName(selectedSubmission.employeeId)} | Template: {template.name}
                </p>
            </header>
            <main>
                <Card>
                    <CardHeader>
                        <CardTitle>Grading Interface</CardTitle>
                        <CardDescription>Review the employee's responses and make corrections if necessary.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {template.checklist.map(item => {
                                const response = selectedSubmission.responses.find(r => r.checklistItemId === item.id);
                                return (
                                <div key={item.id} className="grid grid-cols-3 items-center gap-4 p-4 border rounded-lg">
                                    <p className="col-span-1">{item.text}</p>
                                    <div className="col-span-1 flex items-center gap-2">
                                        <span>Employee says:</span>
                                        <Badge variant={response?.answer ? 'default' : 'destructive'}>
                                            {response?.answer ? 'YES' : 'NO'}
                                        </Badge>
                                    </div>
                                    <div className="col-span-1 flex items-center justify-end gap-4">
                                        <Label htmlFor={`correction-${item.id}`}>Admin Agrees:</Label>
                                        <Switch id={`correction-${item.id}`} defaultChecked={true} />
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="ml-auto">Save & Calculate Score</Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
      )
    }

    return (
        <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CheckCheck className="h-8 w-8 text-primary"/>
                    <div>
                        <h1 className="text-2xl font-bold">Assessments</h1>
                        <p className="text-muted-foreground">Assign daily tasks and validate employee submissions.</p>
                    </div>
                </div>
            </header>

            <main>
                 <Card className="rounded-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle>Assignment & Validation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="validation">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="assignment">Assignment Manager</TabsTrigger>
                                <TabsTrigger value="validation">Validation Dashboard</TabsTrigger>
                            </TabsList>
                            <TabsContent value="assignment" className="mt-6">
                                <div className="grid gap-6 max-w-2xl mx-auto">
                                     <div className="space-y-2">
                                        <Label>1. Select Master Template</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a template..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {templates.map(template => (
                                                    <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>2. Select Employee</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select an employee..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Employees</SelectItem>
                                                {employees.map(employee => (
                                                    <SelectItem key={employee.id} value={employee.id}>{employee.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button size="lg">
                                        <Send className="mr-2 h-4 w-4" /> Assign for Today
                                    </Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="validation" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Pending Submissions</CardTitle>
                                        <CardDescription>Review and validate assessments submitted by employees.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {isLoading ? <Skeleton className="h-40 w-full" /> : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Employee</TableHead>
                                                    <TableHead>Assessment</TableHead>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {submittedAssessments.map(item => {
                                                    const template = templates.find(t => t.id === item.templateId);
                                                    const Icon = statusIcon[item.status];
                                                    return (
                                                    <TableRow key={item.id}>
                                                        <TableCell>{getEmployeeName(item.employeeId)}</TableCell>
                                                        <TableCell>{template?.name}</TableCell>
                                                        <TableCell>{item.date}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={statusVariant[item.status]} className="flex items-center gap-2">
                                                                <Icon className={`h-3 w-3 ${statusColor[item.status]}`} />
                                                                <span>{item.status}</span>
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button variant="outline" onClick={() => setSelectedSubmission(item)}>
                                                                Validate
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}