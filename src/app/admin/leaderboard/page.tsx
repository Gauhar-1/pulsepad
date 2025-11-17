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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Trophy,
  Filter,
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
  MoreVertical,
} from 'lucide-react';
import type { User as UserType } from '@/lib/definitions';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

const Leaderboard = ({ candidates, searchQuery }: { candidates: Candidate[], searchQuery: string }) => (
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
);

const Candidates = ({ candidates, searchQuery }: { candidates: Candidate[], searchQuery: string }) => (
    <Card className="rounded-2xl shadow-lg">
        <CardHeader>
            <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary"/>
                <div>
                    <CardTitle className="text-xl">Candidates</CardTitle>
                    <CardDescription>Manage and view all candidates</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
             <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Candidate ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>College</TableHead>
                            <TableHead>Total Score</TableHead>
                            <TableHead>Completed</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {candidates.map((candidate) => (
                            <TableRow key={candidate.id}>
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
                                <TableCell className="font-bold text-green-600">{candidate.totalScore}</TableCell>
                                <TableCell className="text-muted-foreground">{candidate.completed}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                                            <DropdownMenuItem>See Assessment</DropdownMenuItem>
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
);


const tabs = [
    { name: 'Candidates', icon: Users },
    { name: 'Leaderboard', icon: BarChart },
    { name: 'Insights', icon: TrendingUp },
];

const sortOptions = [
    { name: 'Total Score', icon: Trophy },
    { name: 'Unblock Me', icon: Puzzle },
    { name: 'Minesweeper', icon: Box },
    { name: 'Water Capacity', icon: Droplets },
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('Leaderboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const router = useRouter();

  useEffect(() => {
    const filtered = mockCandidates.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCandidates(filtered);
  }, [searchQuery]);
  
  const handleSignOut = () => {
    sessionStorage.removeItem('mockUser');
    router.push('/login');
  };
  
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
        <div className='flex gap-4'>
            <Button variant="outline" className="mt-4 sm:mt-0 bg-white" onClick={() => router.push('/dashboard')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Overview
            </Button>
            <Button variant="outline" className="mt-4 sm:mt-0 bg-white" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
        </div>
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
        <div className="relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder={`Search ${activeTab.toLowerCase()}...`} 
                className="pl-10 mb-6"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
        </div>
        {activeTab === 'Leaderboard' && <Leaderboard candidates={candidates} searchQuery={searchQuery} />}
        {activeTab === 'Candidates' && <Candidates candidates={candidates} searchQuery={searchQuery} />}
        {activeTab === 'Insights' && <Card className="rounded-2xl shadow-lg"><CardHeader><CardTitle>Insights</CardTitle></CardHeader><CardContent><p>Insights will be shown here.</p></CardContent></Card>}
      </main>

    </div>
  );
}