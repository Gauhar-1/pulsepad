
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
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';


type Candidate = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Interviewing' | 'New' | 'Hired' | 'Rejected';
  avatarUrl: string;
};

const fetchCandidates = async (): Promise<Candidate[]> => {
    const res = await fetch('/api/admin/candidates');
    if (!res.ok) {
        throw new Error('Failed to fetch candidates');
    }
    return res.json();
};

const statusFilters = ['All', 'New', 'Interviewing', 'Hired', 'Rejected'];

const TableSkeleton = ({rows = 5}: {rows?: number}) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead><Skeleton className="h-5 w-48" /></TableHead>
                <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {Array.from({length: rows}).map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className='space-y-1'>
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

export default function AdminCandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const { data: candidates = [], isLoading } = useQuery<Candidate[]>({
    queryKey: ['candidates'],
    queryFn: fetchCandidates,
  });

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const searchMatch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.role.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = statusFilter === 'All' || c.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [searchQuery, statusFilter, candidates]);

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
                    <CardDescription>{isLoading ? 'Loading candidates...' : `${filteredCandidates.length} of ${candidates.length} candidates shown.`}</CardDescription>
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
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
                {isLoading ? <TableSkeleton /> : (
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
                )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
