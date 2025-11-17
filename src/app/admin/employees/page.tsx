
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
import { mockEmployeeData } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';


export default function AdminEmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployeeData);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const router = useRouter();

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
      setEmployees(prev => prev.map(e => e.id === selectedEmployee.id ? { ...e, active: false } : e));
      setIsDeactivateDialogOpen(false);
      setSelectedEmployee(null);
    }
  };
  
  const handleSaveEmployee = (employeeData: Omit<Employee, 'id' | 'projects' | 'sheetId'>, id?: string) => {
    if (id) {
        setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...employeeData } : e));
    } else {
        const newEmployee: Employee = {
            ...employeeData,
            id: `emp-${Date.now()}`,
            projects: [],
            sheetId: `sheet-${Date.now()}`
        };
        setEmployees(prev => [newEmployee, ...prev]);
    }
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
