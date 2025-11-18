
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import {
  Users,
  PlusCircle,
  Search,
  MoreVertical,
} from 'lucide-react';
import type { Employee } from '@/lib/definitions';
import { useState, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateEmployeeSheet } from '@/components/admin/create-employee-sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const fetchEmployees = async (): Promise<Employee[]> => {
    const res = await fetch('/api/admin/employees');
    if (!res.ok) {
        throw new Error('Failed to fetch employees');
    }
    return res.json();
}

const TableSkeleton = ({rows = 5}: {rows?: number}) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead><Skeleton className="h-5 w-48" /></TableHead>
                <TableHead><Skeleton className="h-5 w-16" /></TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {Array.from({length: rows}).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell className="flex gap-1">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-14 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

export default function AdminEmployeesPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const router = useRouter();

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: fetchEmployees
  });

  // In a real app, this would be a mutation to the backend
  const deactivateMutation = useMutation({
    mutationFn: async (employeeId: string) => {
        // Find the employee and update their status locally.
        // In a real app, you'd send a request to your API.
        const updatedEmployees = employees.map(e => e.id === employeeId ? { ...e, active: false } : e);
        return updatedEmployees;
    },
    onSuccess: (updatedData) => {
        queryClient.setQueryData(['employees'], updatedData);
        setIsDeactivateDialogOpen(false);
        setSelectedEmployee(null);
    }
  });

  const saveEmployeeMutation = useMutation({
     mutationFn: async ({ employeeData, id }: { employeeData: Omit<Employee, 'id' | 'projects' | 'sheetId'>, id?: string }) => {
        // This is optimistic update. In real app, you would post to API.
        let updatedEmployees: Employee[];
        if (id) {
            updatedEmployees = employees.map(e => e.id === id ? { ...e, ...employeeData } : e);
        } else {
            const newEmployee: Employee = {
                ...employeeData,
                id: `emp-${Date.now()}`,
                projects: [],
                sheetId: `sheet-${Date.now()}`
            };
            updatedEmployees = [newEmployee, ...employees];
        }
        return updatedEmployees;
    },
    onSuccess: (updatedData) => {
        queryClient.setQueryData(['employees'], updatedData);
        setIsSheetOpen(false);
    }
  });


  const filteredEmployees = useMemo(() => {
    return employees.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [employees, searchQuery]);
  
  const handleCreateClick = () => {
    setSelectedEmployee(null);
    setIsSheetOpen(true);
  };
  
  const handleEditClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsSheetOpen(true);
  };

  const handleViewClick = (employee: Employee) => {
    router.push(`/admin/employees/${employee.id}`);
  };

  const handleDeactivateClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeactivateDialogOpen(true);
  };

  const handleDeactivateConfirm = () => {
    if (selectedEmployee) {
      deactivateMutation.mutate(selectedEmployee.id);
    }
  };
  
  const handleSaveEmployee = (employeeData: Omit<Employee, 'id' | 'projects' | 'sheetId'>, id?: string) => {
    saveEmployeeMutation.mutate({ employeeData, id });
  };


  return (
    <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
       <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary"/>
          <div>
            <h1 className="text-2xl font-bold">Employee Management</h1>
            <p className="text-muted-foreground">View and maintain employee data.</p>
          </div>
        </div>
        <Button onClick={handleCreateClick}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </header>

      <main>
        <Card className="rounded-2xl shadow-lg">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>All Employees</CardTitle>
                        <CardDescription>
                            {employees.length} employees found.
                        </CardDescription>
                    </div>
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="Search employees..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    {isLoading ? <TableSkeleton /> : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Skills</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmployees.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell className="font-medium">{employee.name}</TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {employee.skills.map(skill => (
                                                    <Badge key={skill} variant="secondary">{skill}</Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    employee.active ? 'default' : 'outline'
                                                }
                                                 className={employee.active ? 'bg-green-100 text-green-800' : ''}
                                            >
                                                {employee.active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => handleEditClick(employee)}>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleViewClick(employee)}>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                      className="text-destructive"
                                                      onClick={() => handleDeactivateClick(employee)}
                                                    >
                                                      Deactivate
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </CardContent>
        </Card>
      </main>
       <CreateEmployeeSheet 
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSaveEmployee={handleSaveEmployee}
        employee={selectedEmployee}
      />
       <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark &quot;{selectedEmployee?.name}&quot; as inactive.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
