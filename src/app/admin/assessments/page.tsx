
'use client';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { CheckCheck, Send } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Employee, AssessmentTemplate } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const fetchEmployees = async (): Promise<Employee[]> => {
    const res = await fetch('/api/admin/employees');
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
}
const fetchAssessmentTemplates = async (): Promise<AssessmentTemplate[]> => {
    const res = await fetch('/api/admin/assessments');
    if (!res.ok) throw new Error('Failed to fetch assessments');
    const data = await res.json();
    return data.templates;
}

interface CombinedData {
    employees: Employee[];
    templates: AssessmentTemplate[];
}

export default function AdminAssessmentsPage() {
    const { data, isLoading } = useQuery<CombinedData>({
        queryKey: ['admin-assessments-assignment'],
        queryFn: async () => {
            const [employees, templates] = await Promise.all([
                fetchEmployees(),
                fetchAssessmentTemplates()
            ]);
            return { employees, templates };
        }
    });

    const { employees = [], templates = [] } = data || {};
    
    return (
        <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CheckCheck className="h-8 w-8 text-primary"/>
                    <div>
                        <h1 className="text-2xl font-bold">Assessments</h1>
                        <p className="text-muted-foreground">Assign daily tasks to employees.</p>
                    </div>
                </div>
            </header>

            <main>
                 <Card className="rounded-2xl shadow-lg max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Assignment Creation</CardTitle>
                        <CardDescription>Select a template and employee to create an assignment.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
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
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}

