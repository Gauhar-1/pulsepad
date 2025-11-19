
'use client';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { BarChart, Check, Circle, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Employee, DailyAssessment, AssessmentTemplate } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';


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


const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function AdminPerformancePage() {
    const { data, isLoading } = useQuery<CombinedData>({
        queryKey: ['admin-performance'],
        queryFn: async () => {
            const [employees, {assessments, templates}] = await Promise.all([
                fetchEmployees(),
                fetchAssessmentsData()
            ]);
            return { employees, assessments, templates };
        }
    });

    const { employees = [], assessments = [] } = data || {};
    
    const validatedAssessments = assessments
        .filter(a => a.status === 'VALIDATED' && a.finalScore !== undefined)
        .map(a => ({
            ...a,
            employeeName: employees.find(e => e.id === a.employeeId)?.name || 'Unknown',
            score: a.finalScore! * 100
        }))
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const employeePerformance = employees.map(emp => {
        const empAssessments = validatedAssessments.filter(a => a.employeeId === emp.id);
        const avgScore = empAssessments.length > 0
            ? empAssessments.reduce((acc, a) => acc + a.score, 0) / empAssessments.length
            : 0;
        return { name: emp.name, averageScore: parseFloat(avgScore.toFixed(2)) };
    }).sort((a,b) => b.averageScore - a.averageScore);


    return (
        <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <BarChart className="h-8 w-8 text-primary"/>
                    <div>
                        <h1 className="text-2xl font-bold">Performance Dashboard</h1>
                        <p className="text-muted-foreground">Review employee scores and assessment history.</p>
                    </div>
                </div>
            </header>

            <main className="grid gap-8 lg:grid-cols-3">
                 <div className="lg:col-span-2">
                    <Card className="rounded-2xl shadow-lg">
                        <CardHeader>
                            <CardTitle>Employee Performance Scores</CardTitle>
                             <CardDescription>Average scores from all validated assessments.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {isLoading ? <Skeleton className="h-80 w-full" /> : (
                                <ChartContainer config={chartConfig} className="h-80 w-full">
                                    <ResponsiveContainer>
                                        <RechartsBarChart data={employeePerformance} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                                            <Tooltip
                                                cursor={false}
                                                content={<ChartTooltipContent
                                                    labelFormatter={(label) => `Score for ${label}`}
                                                    formatter={(value) => `${value}%`}
                                                    indicator="dot"
                                                />}
                                            />
                                            <Bar dataKey="averageScore" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                        </RechartsBarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                             )}
                        </CardContent>
                    </Card>
                </div>
                <div>
                     <Card className="rounded-2xl shadow-lg">
                        <CardHeader>
                            <CardTitle>Recent Validations</CardTitle>
                            <CardDescription>Latest assessments that have been graded.</CardDescription>
                        </CardHeader>
                        <CardContent className="max-h-[25.5rem] overflow-y-auto">
                            {isLoading ? <Skeleton className="h-80 w-full" /> : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Employee</TableHead>
                                        <TableHead>Score</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {validatedAssessments.slice(0, 10).map(item => {
                                        return (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.employeeName}</TableCell>
                                            <TableCell>
                                                <Badge>{item.score.toFixed(0)}%</Badge>
                                            </TableCell>
                                        </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

    