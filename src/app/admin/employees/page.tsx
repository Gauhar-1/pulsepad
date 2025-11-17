
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

const mockEmployeeData: Employee[] = [
    { id: 'emp-001', name: 'Alex Doe', skills: ['React', 'Node.js', 'TypeScript'], projects: ['QuantumLeap CRM', 'Odyssey Mobile App'], email: 'alex.doe@example.com', sheetId: 'sheet-001', active: true, type: 'Lead' },
    { id: 'emp-002', name: 'Maria Garcia', skills: ['Next.js', 'GraphQL', 'Prisma'], projects: ['Nova E-commerce Platform'], email: 'maria.garcia@example.com', sheetId: 'sheet-002', active: true, type: 'Core' },
    { id: 'emp-003', name: 'Sam Wilson', skills: ['Data Viz', 'D3.js', 'Python'], projects: ['Project Phoenix'], email: 'sam.wilson@example.com', sheetId: 'sheet-003', active: false, type: 'Core' },
    { id: 'emp-004', name: 'Li Wei', skills: ['Angular', 'Java', 'Spring Boot'], projects: [], email: 'li.wei@example.com', sheetId: 'sheet-004', active: true, type: 'VA' },
    { id: 'emp-005', name: 'Fatima Ahmed', skills: ['Vue.js', 'Firebase', 'UX/UI'], projects: ['Titan Analytics Dashboard'], email: 'fatima.ahmed@example.com', sheetId: 'sheet-005', active: true, type: 'Core' },
    { id: 'emp-006', name: 'Kenji Tanaka', skills: ['React Native', 'Swift', 'Kotlin'], projects: ['Odyssey Mobile App'], email: 'kenji.tanaka@example.com', sheetId: 'sheet-006', active: true, type: 'Coder' },
    { id: 'emp-007', name: 'Isabella Rossi', skills: ['PHP', 'Laravel', 'MySQL'], projects: [], email: 'isabella.rossi@example.com', sheetId: 'sheet-007', active: false, type: 'Core' },
    { id: 'emp-008', name: 'David Chen', skills: ['Go', 'Docker', 'Kubernetes'], projects: ['QuantumLeap CRM'], email: 'david.chen@example.com', sheetId: 'sheet-008', active: true, type: 'Lead' },
    { id: 'emp-009', name: 'Aisha Khan', skills: ['Flutter', 'Dart', 'Firebase'], projects: [], email: 'aisha.khan@example.com', sheetId: 'sheet-009', active: true, type: 'VA' },
    { id: 'emp-010', name: 'Carlos Gomez', skills: ['C#', '.NET', 'Azure'], projects: ['Titan Analytics Dashboard'], email: 'carlos.gomez@example.com', sheetId: 'sheet-010', active: true, type: 'Coder' },
    { id: 'emp-011', name: 'Olivia Martinez', skills: ['Svelte', 'Sapper', 'PostgreSQL'], projects: [], email: 'olivia.martinez@example.com', sheetId: 'sheet-011', active: false, type: 'Core' },
    { id: 'emp-012', name: 'Ben Carter', skills: ['React', 'Redux', 'Jest'], projects: ['Nova E-commerce Platform'], email: 'ben.carter@example.com', sheetId: 'sheet-012', active: true, type: 'Freelancer' },
    { id: 'emp-013', name: 'Chloe Dubois', skills: ['Ruby on Rails', 'Heroku'], projects: [], email: 'chloe.dubois@example.com', sheetId: 'sheet-013', active: true, type: 'Core' },
    { id: 'emp-014', name: 'Arjun Reddy', skills: ['Python', 'Django', 'AWS'], projects: ['Project Phoenix'], email: 'arjun.reddy@example.com', sheetId: 'sheet-014', active: true, type: 'Lead' },
    { id: 'emp-015', name: 'Sofia Petrov', skills: ['JavaScript', 'HTML', 'CSS'], projects: [], email: 'sofia.petrov@example.com', sheetId: 'sheet-015', active: false, type: 'Freelancer' },
];


export default function AdminEmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployeeData);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

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
  
  const handleSaveEmployee = (employeeData: Omit<Employee, 'id' | 'projects' | 'sheetId'>, id?: string) => {
    if (id) {
        // For now, we only handle adding new employees
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
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem 
                                                  className="text-destructive"
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
    </div>
  );
}
