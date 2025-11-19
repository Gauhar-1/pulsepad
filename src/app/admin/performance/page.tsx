
'use client';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { BarChart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Employee, DailyAssessment, AssessmentTemplate } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
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

const chartConfig = {
  averageScore: {
    label: "Average Score",
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
    
    const employeePerformance = employees.map(emp => {
        const validatedAssessments = assessments.filter(a => a.employeeId === emp.id && a.status === 'VALIDATED' && a.finalScore !== undefined);
        const avgScore = validatedAssessments.length > 0
            ? (validatedAssessments.reduce((acc, a) => acc + (a.finalScore! * 100), 0) / validatedAssessments.length)
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
                        <p className="text-muted-foreground">Review employee scores based on daily assessments.</p>
                    </div>
                </div>
            </header>

            <main>
                <Card className="rounded-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle>Employee Performance Scores</CardTitle>
                        <CardDescription>Average scores from all validated daily assessments, sorted by performance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-[500px] w-full" /> : (
                            <ChartContainer config={chartConfig} className="h-[500px] w-full">
                                <ResponsiveContainer>
                                    <RechartsBarChart
                                        layout="vertical"
                                        data={employeePerformance}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value}%`} />
                                        <YAxis dataKey="name" type="category" width={80} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                        <Tooltip
                                            cursor={{ fill: 'hsl(var(--muted))' }}
                                            content={<ChartTooltipContent
                                                labelFormatter={(label) => `Score for ${label}`}
                                                formatter={(value) => `${value}%`}
                                                indicator="dot"
                                            />}
                                        />
                                        <Bar dataKey="averageScore" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
