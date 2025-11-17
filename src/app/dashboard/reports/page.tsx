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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Shield,
  User,
  Briefcase,
  Trophy,
  Filter,
  CheckCircle,
  Clock,
  ListChecks,
  TrendingUp,
  Star,
  Users,
  BarChart,
  ArrowLeft,
  Search,
  Download,
  Puzzle,
  Box,
  Droplets,
  LogOut,
} from 'lucide-react';
import type { User as UserType, Project, Update } from '@/lib/definitions';
import { useEffect, useState } from 'react';
import {
  getAllProjects,
  getAllUpdates,
  getTodaysUpdates,
  getUsers,
} from '@/lib/api';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

type Candidate = {
  rank: number;
  id: string;
  name: string;
  avatarUrl: string;
  college: string;
  totalScore: number;
  unblockMe: number;
  minesweeper: number;
  waterCapacity: number;
  completed: string;
};

const mockCandidates: Candidate[] = [
  { rank: 1, id: 'IFA941710UY92', name: 'Lankalapalli Kumar', avatarUrl: 'https://i.pravatar.cc/150?u=a', college: 'Gayatri vidya parishad', totalScore: 18, unblockMe: 4, minesweeper: 1, waterCapacity: 7, completed: '16/11/2025' },
  { rank: 2, id: 'IFA6103685JYK', name: 'Anmol Pathak', avatarUrl: 'https://i.pravatar.cc/150?u=b', college: 'abc', totalScore: 18, unblockMe: 6, minesweeper: 2, waterCapacity: 2, completed: '16/11/2025' },
  { rank: 3, id: 'IFA0435331315', name: 'Piyush Kumar', avatarUrl: 'https://i.pravatar.cc/150?u=c', college: 'Army Institute Of Technology', totalScore: 18, unblockMe: 6, minesweeper: 2, waterCapacity: 2, completed: '16/11/2025' },
  { rank: 4, id: 'IFA913280FQ90', name: 'Kaustubh Shashikant Patil', avatarUrl: '', college: 'rajrambapu institute of technology,rajaramnager', totalScore: 17, unblockMe: 6, minesweeper: 1, waterCapacity: 3, completed: '16/11/2025' },
  { rank: 5, id: 'IFA3491980X3C', name: 'ARJAV JAIN', avatarUrl: '', college: 'Teerthanker Mahaveer University', totalScore: 15, unblockMe: 6, minesweeper: 1, waterCapacity: 1, completed: '16/11/2025' },
  { rank: 6, id: 'IFA5167903HWX', name: 'Yathendra Aashish Velpuri', avatarUrl: '', college: 'Otto-von-guericke university', totalScore: 15, unblockMe: 6, minesweeper: 1, waterCapacity: 1, completed: '16/11/2025' },
  { rank: 7, id: 'IFA661148EX61', name: 'Chirag Khati', avatarUrl: '', college: 'ARMY INSTITUTE OF TECHNOLOGY', totalScore: 14, unblockMe: 6, minesweeper: 1, waterCapacity: 0, completed: '16/11/2025' },
  { rank: 8, id: 'IFA091869SPST', name: 'ADISH JAIN', avatarUrl: '', college: 'Teerthanker Mahaveer University', totalScore: 11, unblockMe: 4, minesweeper: 1, waterCapacity: 1, completed: '16/11/2025' },
  { rank: 9, id: 'IFA5091876117', name: 'Sabiha', avatarUrl: '', college: 'Garden city university', totalScore: 9, unblockMe: 2, minesweeper: 1, waterCapacity: 3, completed: '16/11/2025' },
  { rank: 10, id: 'IFA59583212MQ', name: 'Shalvi Atul Surve', avatarUrl: '', college: 'Vellore Institute of Technology (Vellore)', totalScore: 9, unblockMe: 4, minesweeper: 0, waterCapacity: 1, completed: '16/11/2025' },
  { rank: 11, id: 'IFA88786BASGH', name: 'N Ganesh', avatarUrl: '', college: 'Akshaya Institute of Technology Tumakuru', totalScore: 9, unblockMe: 4, minesweeper: 0, waterCapacity: 1, completed: '16/11/2025' },
  { rank: 12, id: 'IFA931723A35Y', name: 'Ramesh Harini', avatarUrl: '', college: 'HITAM', totalScore: 8, unblockMe: 4, minesweeper: 0, waterCapacity: 0, completed: '16/11/2025' },
  { rank: 13, id: 'IFA231945QY59', name: 'Pragat Sharma', avatarUrl: '', college: 'IIT Ropar', totalScore: 6, unblockMe: 2, minesweeper: 1, waterCapacity: 0, completed: '16/11/2025' },
  { rank: 14, id: 'IFA4999843YL6', name: 'Divya Darsini', avatarUrl: '', college: 'SRM Univeristy of Science and Technology', totalScore: 6, unblockMe: 2, minesweeper: 0, waterCapacity: 2, completed: '16/11/2025' },
];

const AdminReport = () => {
  const [activeTab, setActiveTab] = useState('Leaderboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);

  useEffect(() => {
    const filtered = mockCandidates.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCandidates(filtered);
  }, [searchQuery]);


  const tabs = [
    { name: 'Candidates', icon: Users },
    { name: 'Leaderboard', icon: BarChart },
    { name: 'Insights', icon: TrendingUp },
    { name: 'Back to Overview', icon: ArrowLeft },
  ];

  const sortOptions = [
    { name: 'Total Score', icon: Trophy },
    { name: 'Unblock Me', icon: Puzzle },
    { name: 'Minesweeper', icon: Box },
    { name: 'Water Capacity', icon: Droplets },
  ];
  
  return (
    <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
      <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="text-yellow-400 h-8 w-8"/>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">IFA SkillQuest</p>
          </div>
        </div>
        <Button variant="outline" className="mt-4 sm:mt-0 bg-white">
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </header>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <Button
            key={tab.name}
            variant={activeTab === tab.name ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab.name)}
            className={cn(
              "shrink-0 rounded-full",
              activeTab === tab.name ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-600'
            )}
          >
            <tab.icon className="mr-2 h-4 w-4" />
            {tab.name}
          </Button>
        ))}
      </div>

      <main>
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <Trophy className="h-8 w-8 text-yellow-500"/>
                 <div>
                    <CardTitle className="text-xl">Assessment Leaderboard</CardTitle>
                    <CardDescription>Top performers ranked by total score</CardDescription>
                 </div>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search leaderboard..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 mt-4">
              <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {sortOptions.map(opt => (
                  <Button key={opt.name} variant="outline" size="sm" className="bg-white rounded-full">
                    <opt.icon className="mr-2 h-4 w-4" />
                    {opt.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Candidate ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Total Score</TableHead>
                    <TableHead><Puzzle className="h-5 w-5 mx-auto" /></TableHead>
                    <TableHead><Box className="h-5 w-5 mx-auto" /></TableHead>
                    <TableHead><Droplets className="h-5 w-5 mx-auto" /></TableHead>
                    <TableHead>Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-bold text-lg text-primary">#{candidate.rank}</TableCell>
                      <TableCell className="text-muted-foreground">{candidate.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={candidate.avatarUrl} />
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{candidate.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{candidate.college}</TableCell>
                      <TableCell className="font-bold text-lg text-green-600">{candidate.totalScore}</TableCell>
                      <TableCell className="text-center text-blue-500 font-semibold">{candidate.unblockMe}</TableCell>
                      <TableCell className="text-center text-orange-500 font-semibold">{candidate.minesweeper}</TableCell>
                      <TableCell className="text-center text-teal-500 font-semibold">{candidate.waterCapacity}</TableCell>
                      <TableCell className="text-muted-foreground">{candidate.completed}</TableCell>
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

const EmployeeReport = () => {
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    async function fetchData() {
      const todaysUpdates = await getTodaysUpdates();
      setUpdates(todaysUpdates);
    }
    fetchData();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp /> Your Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <p className="font-medium">Updates Submitted Today</p>
            <p className="text-2xl font-bold">{updates.length}</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <p className="font-medium">Tasks Completed This Week</p>
            <p className="text-2xl font-bold">12</p>
          </div>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <p className="font-medium">Active Projects</p>
            <p className="text-2xl font-bold">3</p>
          </div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks /> Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your recent daily updates will be listed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const ClientReport = () => {
  const milestones = [
    { id: 1, name: 'Project Kick-off', date: '2024-07-01', status: 'completed' },
    {
      id: 2,
      name: 'Design Phase Complete',
      date: '2024-07-15',
      status: 'completed',
    },
    {
      id: 3,
      name: 'Development Sprint 1',
      date: '2024-07-30',
      status: 'in-progress',
    },
    { id: 4, name: 'User Testing', date: '2024-08-15', status: 'upcoming' },
    { id: 5, name: 'Project Launch', date: '2024-09-01', status: 'upcoming' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock /> Project Timeline & Milestones
        </CardTitle>
        <CardDescription>
          An overview of your project's progress and key dates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          <div className="absolute left-[30px] h-full w-0.5 bg-border -translate-x-1/2"></div>
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="mb-8 flex items-center gap-6">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background">
                {milestone.status === 'completed' ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <Clock
                    className={`h-6 w-6 ${
                      milestone.status === 'in-progress'
                        ? 'text-blue-500 animate-spin'
                        : 'text-muted-foreground'
                    }`}
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{milestone.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(milestone.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function ReportsPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('mockUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
        router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const renderReport = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
            <p>Loading reports...</p>
        </div>
      )
    }
    if (!user) {
         return (
             <div className="flex justify-center items-center h-64">
                <Alert className="max-w-md">
                    <FileText className="h-4 w-4" />
                    <AlertTitle>Not Logged In</AlertTitle>
                    <AlertDescription>
                    Please log in to view reports.
                    </AlertDescription>
                </Alert>
             </div>
         )
    }
    switch (user.role) {
      case 'admin':
        return <AdminReport />;
      case 'employee':
        return <EmployeeReport />;
      case 'client':
        return <ClientReport />;
      default:
        return (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>No Report Available</AlertTitle>
            <AlertDescription>
              Reports are not available for your role at this time.
            </AlertDescription>
          </Alert>
        );
    }
  };

  if (user?.role === 'admin') {
      return renderReport();
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Reports
        </h1>
      </div>
      {renderReport()}
    </main>
  );
}
