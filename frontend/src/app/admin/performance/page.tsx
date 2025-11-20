
'use client';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { BarChart, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Employee, DailyAssessment, AssessmentTemplate } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, getMonth, getYear, parseISO } from 'date-fns';
import { apiFetch } from '@/lib/api';


const fetchEmployees = async (): Promise<Employee[]> => {
    const res = await apiFetch('/admin/employees');
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
}
const fetchAssessmentsData = async (): Promise<{assessments: DailyAssessment[], templates: AssessmentTemplate[]}> => {
    const res = await apiFetch('/admin/assessments');
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

const getMonthsFromAssessments = (assessments: DailyAssessment[]) => {
    const monthSet = new Set<string>();
    assessments.forEach(a => {
        const date = parseISO(a.date);
        monthSet.add(format(date, 'yyyy-MM'));
    });
    return Array.from(monthSet).sort().reverse();
}

export default function AdminPerformancePage() {
    const [selectedMonth, setSelectedMonth] = useState<string>('all');

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
    
    const availableMonths = useMemo(() => getMonthsFromAssessments(assessments), [assessments]);

    const employeePerformance = useMemo(() => {
        const filteredAssessments = selectedMonth === 'all'
            ? assessments
            : assessments.filter(a => format(parseISO(a.date), 'yyyy-MM') === selectedMonth);

        return employees.map(emp => {
            const validatedAssessments = filteredAssessments.filter(a => a.employeeId === emp.id && a.status === 'VALIDATED' && a.finalScore !== undefined);
            const avgScore = validatedAssessments.length > 0
                ? (validatedAssessments.reduce((acc, a) => acc + (a.finalScore! * 100), 0) / validatedAssessments.length)
                : 0;
            return { name: emp.name, averageScore: parseFloat(avgScore.toFixed(2)) };
        }).sort((a,b) => b.averageScore - a.averageScore);
    }, [employees, assessments, selectedMonth]);


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
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle>Employee Performance Scores</CardTitle>
                                <CardDescription>Average scores from validated daily assessments, sorted by performance.</CardDescription>
                            </div>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Filter by month" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Time</SelectItem>
                                    {availableMonths.map(month => (
                                        <SelectItem key={month} value={month}>{format(parseISO(`${month}-01`), 'MMMM yyyy')}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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
                                                labelFormatter={(label) => `${label}`}
                                                formatter={(value) => [`${value}%`, "Average Score"]}
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
