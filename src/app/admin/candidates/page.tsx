
'use client';
import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
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
  Search,
  Download,
  UserPlus
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockCandidates = [
  { id: 'cand-001', name: 'John Doe', email: 'john.doe@email.com', role: 'React Developer', status: 'Interviewing', avatarUrl: 'https://i.pravatar.cc/150?u=cand001' },
  { id: 'cand-002', name: 'Emily White', email: 'emily.white@email.com', role: 'Project Manager', status: 'New', avatarUrl: 'https://i.pravatar.cc/150?u=cand002' },
  { id: 'cand-003', name: 'Michael Black', email: 'michael.black@email.com', role: 'UX/UI Designer', status: 'Hired', avatarUrl: 'https://i.pravatar.cc/150?u=cand003' },
  { id: 'cand-004', name: 'Sarah Green', email: 'sarah.green@email.com', role: 'Node.js Developer', status: 'Rejected', avatarUrl: 'https://i.pravatar.cc/150?u=cand004' },
  { id: 'cand-005', name: 'David Blue', email: 'david.blue@email.com', role: 'DevOps Engineer', status: 'New', avatarUrl: 'https://i.pravatar.cc/150?u=cand005' },
];

const statusFilters = ['All', 'New', 'Interviewing', 'Hired', 'Rejected'];

export default function AdminCandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter(c => {
      const searchMatch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.role.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = statusFilter === 'All' || c.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [searchQuery, statusFilter]);

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Status'];
    const rows = filteredCandidates.map(c => [c.name, c.email, c.role, c.status]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'candidates.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <UserPlus className="h-8 w-8 text-primary"/>
            <div>
                <h1 className="text-2xl font-bold">Candidate Tracking</h1>
                <p className="text-muted-foreground">Manage and review all job applicants.</p>
            </div>
        </div>
      </header>

      <main>
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
             <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <CardTitle>All Candidates</CardTitle>
                    <CardDescription>{filteredCandidates.length} of {mockCandidates.length} candidates shown.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                        placeholder="Search candidates..." 
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusFilters.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={exportToCSV}>
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={candidate.avatarUrl} />
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">{candidate.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{candidate.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            candidate.status === 'Hired' ? 'default' : 
                            candidate.status === 'Interviewing' ? 'secondary' : 'outline'
                          }
                          className={
                            candidate.status === 'Hired' ? 'bg-green-100 text-green-800' :
                            candidate.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''
                          }
                        >
                          {candidate.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
