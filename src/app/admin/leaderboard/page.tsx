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
  ArrowUp,
  ArrowDown,
  LineChart,
  Percent,
  Sigma,
} from 'lucide-react';
import type { User as UserType } from '@/lib/definitions';
import { useEffect, useState, useMemo } from 'react';
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
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';


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

type SortKey = 'totalScore' | 'unblockMe' | 'minesweeper' | 'waterCapacity' | 'rank';

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

const Leaderboard = ({
    candidates,
    searchQuery,
    sortDescriptor,
    onSortChange,
  }: {
    candidates: Candidate[];
    searchQuery: string;
    sortDescriptor: { key: SortKey; direction: 'asc' | 'desc' };
    onSortChange: (key: SortKey) => void;
  }) => (
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
            <Button 
                key={opt.name} 
                variant="outline" 
                size="sm" 
                className={cn("bg-white rounded-full", sortDescriptor.key === opt.sortKey && 'bg-primary text-primary-foreground')}
                onClick={() => onSortChange(opt.sortKey)}
            >
              <opt.icon className="mr-2 h-4 w-4" />
              {opt.name}
              {sortDescriptor.key === opt.sortKey && (
                sortDescriptor.direction === 'desc' 
                  ? <ArrowDown className="ml-2 h-4 w-4" /> 
                  : <ArrowUp className="ml-2 h-4 w-4" />
              )}
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

const Insights = ({ candidates }: { candidates: Candidate[] }) => {
    const insightsData = useMemo(() => {
        const totalCandidates = candidates.length;
        if (totalCandidates === 0) {
            return { totalCandidates: 0, averageScore: 0, topScore: 0, puzzleAverages: [] };
        }

        const totalScore = candidates.reduce((acc, c) => acc + c.totalScore, 0);
        const averageScore = totalScore / totalCandidates;
        const topScore = Math.max(...candidates.map(c => c.totalScore));

        const totalUnblockMe = candidates.reduce((acc, c) => acc + c.unblockMe, 0);
        const totalMinesweeper = candidates.reduce((acc, c) => acc + c.minesweeper, 0);
        const totalWaterCapacity = candidates.reduce((acc, c) => acc + c.waterCapacity, 0);

        const puzzleAverages = [
            { name: 'Unblock Me', avgScore: totalUnblockMe / totalCandidates, fill: 'hsl(var(--chart-1))' },
            { name: 'Minesweeper', avgScore: totalMinesweeper / totalCandidates, fill: 'hsl(var(--chart-2))' },
            { name: 'Water Capacity', avgScore: totalWaterCapacity / totalCandidates, fill: 'hsl(var(--chart-3))' },
        ];

        return { totalCandidates, averageScore, topScore, puzzleAverages };
    }, [candidates]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-2xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{insightsData.totalCandidates}</div>
                </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <Sigma className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{insightsData.averageScore.toFixed(2)}</div>
                </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Score</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{insightsData.topScore}</div>
                </CardContent>
            </Card>
            <Card className="rounded-2xl shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">100%</div>
                    <p className="text-xs text-muted-foreground">All candidates completed</p>
                </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-lg col-span-1 md:col-span-2 lg:col-span-4">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-5 w-5"/>
                        Average Score by Puzzle
                    </CardTitle>
                    <CardDescription>
                        Comparing the average performance across different puzzles.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <RechartsBarChart data={insightsData.puzzleAverages}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderRadius: 'var(--radius)',
                                    border: '1px solid hsl(var(--border))',
                                }}
                            />
                            <Legend/>
                            <Bar dataKey="avgScore" name="Average Score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};


const tabs = [
    { name: 'Candidates', icon: Users },
    { name: 'Leaderboard', icon: BarChart },
    { name: 'Insights', icon: TrendingUp },
];

const sortOptions: { name: string; icon: React.ElementType; sortKey: SortKey }[] = [
    { name: 'Total Score', icon: Trophy, sortKey: 'totalScore' },
    { name: 'Unblock Me', icon: Puzzle, sortKey: 'unblockMe' },
    { name: 'Minesweeper', icon: Box, sortKey: 'minesweeper' },
    { name: 'Water Capacity', icon: Droplets, sortKey: 'waterCapacity' },
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('Leaderboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<{key: SortKey, direction: 'asc' | 'desc'}>({ key: 'totalScore', direction: 'desc' });
  const router = useRouter();

  const handleSignOut = () => {
    sessionStorage.removeItem('mockUser');
    router.push('/login');
  };

  const handleSortChange = (key: SortKey) => {
    if (sortDescriptor.key === key) {
        setSortDescriptor({ ...sortDescriptor, direction: sortDescriptor.direction === 'asc' ? 'desc' : 'asc' });
    } else {
        setSortDescriptor({ key, direction: 'desc' });
    }
  };
  
  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [searchQuery]);

  const sortedCandidates = useMemo(() => {
    const sorted = [...filteredCandidates].sort((a, b) => {
        if (a[sortDescriptor.key] < b[sortDescriptor.key]) {
            return sortDescriptor.direction === 'asc' ? -1 : 1;
        }
        if (a[sortDescriptor.key] > b[sortDescriptor.key]) {
            return sortDescriptor.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });
  
    // Re-assign ranks after sorting
    return sorted.map((c, index) => ({ ...c, rank: index + 1 }));
  }, [filteredCandidates, sortDescriptor]);
  
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
        {activeTab === 'Leaderboard' && (
          <Leaderboard 
            candidates={sortedCandidates} 
            searchQuery={searchQuery}
            sortDescriptor={sortDescriptor}
            onSortChange={handleSortChange} 
          />
        )}
        {activeTab === 'Candidates' && <Candidates candidates={sortedCandidates} searchQuery={searchQuery} />}
        {activeTab === 'Insights' && <Insights candidates={mockCandidates} />}
      </main>

    </div>
  );
}

    