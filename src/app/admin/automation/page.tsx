
'use client';
import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Bot,
  Send,
  Mail,
  MessageSquare
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProjectData } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';

const mockCandidates = [
  { id: 'cand-001', name: 'John Doe', email: 'john.doe@email.com', role: 'React Developer' },
  { id: 'cand-002', name: 'Emily White', email: 'emily.white@email.com', role: 'Project Manager' },
  { id: 'cand-003', name: 'Michael Black', email: 'michael.black@email.com', role: 'UX/UI Designer' },
  { id: 'cand-004', name: 'Sarah Green', email: 'sarah.green@email.com', role: 'Node.js Developer' },
];

const triggerTypes = [
    { value: 'project-assignment', label: 'Project Assignment' },
    { value: 'update-notification', label: 'Daily Update Notification' },
    { value: 'deadline-reminder', label: 'Deadline Reminder' },
];

const communicationChannels = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
];

export default function AdminAutomationPage() {
  const { toast } = useToast();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const handleQueueCommunications = (type: 'project' | 'candidate') => {
    toast({
        title: "Communications Queued",
        description: `Your ${type} messages have been queued for sending.`,
    });
    if (type === 'project') {
        setSelectedProjects([]);
    } else {
        setSelectedCandidates([]);
    }
  }

  return (
    <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Bot className="h-8 w-8 text-primary"/>
            <div>
                <h1 className="text-2xl font-bold">Automation Center</h1>
                <p className="text-muted-foreground">Manage and dispatch automated communications.</p>
            </div>
        </div>
      </header>

      <main>
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle>Create New Automation</CardTitle>
            <CardDescription>Select a target and configure your message.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="projects">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="projects">Project Notifications</TabsTrigger>
                    <TabsTrigger value="candidates">Candidate Outreach</TabsTrigger>
                </TabsList>
                <TabsContent value="projects" className="mt-6">
                    <div className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label>1. Select Trigger Type</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a trigger..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {triggerTypes.map(trigger => (
                                            <SelectItem key={trigger.value} value={trigger.value}>{trigger.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>2. Select Channel</Label>
                                <RadioGroup defaultValue="email" className="flex gap-4 pt-2">
                                    {communicationChannels.map(channel => (
                                        <div key={channel.value} className="flex items-center space-x-2">
                                            <RadioGroupItem value={channel.value} id={`proj-${channel.value}`} />
                                            <Label htmlFor={`proj-${channel.value}`} className="flex items-center gap-2">
                                                <channel.icon className="h-4 w-4" />
                                                {channel.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>3. Select Projects ({selectedProjects.length} selected)</Label>
                            <Card className="max-h-60 overflow-y-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                <Checkbox
                                                     checked={selectedProjects.length === mockProjectData.length}
                                                     onCheckedChange={(checked) => {
                                                        setSelectedProjects(checked ? mockProjectData.map(p => p.id) : []);
                                                     }}
                                                />
                                            </TableHead>
                                            <TableHead>Project Title</TableHead>
                                            <TableHead>Client</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockProjectData.map(p => (
                                            <TableRow key={p.id}>
                                                <TableCell>
                                                    <Checkbox 
                                                        checked={selectedProjects.includes(p.id)}
                                                        onCheckedChange={(checked) => {
                                                            setSelectedProjects(prev => checked ? [...prev, p.id] : prev.filter(id => id !== p.id));
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{p.projectTitle}</TableCell>
                                                <TableCell>{p.clientName}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="project-message">4. Message Template</Label>
                            <Textarea id="project-message" placeholder="Hi {team_member}, this is a reminder about..." />
                        </div>

                         <Button className="w-full md:w-auto md:ml-auto" onClick={() => handleQueueCommunications('project')}>
                            <Send className="mr-2 h-4 w-4" /> Queue {selectedProjects.length} Project Notifications
                        </Button>
                    </div>
                </TabsContent>
                 <TabsContent value="candidates" className="mt-6">
                     <div className="grid gap-6">
                        <div className="space-y-2">
                            <Label>1. Select Channel</Label>
                            <RadioGroup defaultValue="email" className="flex gap-4 pt-2">
                                {communicationChannels.map(channel => (
                                    <div key={channel.value} className="flex items-center space-x-2">
                                        <RadioGroupItem value={channel.value} id={`cand-${channel.value}`} />
                                        <Label htmlFor={`cand-${channel.value}`} className="flex items-center gap-2">
                                            <channel.icon className="h-4 w-4" />
                                            {channel.label}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className="space-y-2">
                            <Label>2. Select Candidates ({selectedCandidates.length} selected)</Label>
                            <Card className="max-h-60 overflow-y-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12">
                                                <Checkbox
                                                    checked={selectedCandidates.length === mockCandidates.length}
                                                    onCheckedChange={(checked) => {
                                                        setSelectedCandidates(checked ? mockCandidates.map(c => c.id) : []);
                                                    }}
                                                />
                                            </TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockCandidates.map(c => (
                                            <TableRow key={c.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedCandidates.includes(c.id)}
                                                        onCheckedChange={(checked) => {
                                                            setSelectedCandidates(prev => checked ? [...prev, c.id] : prev.filter(id => id !== c.id));
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{c.name}</TableCell>
                                                <TableCell>{c.email}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="candidate-message">3. Message Template</Label>
                            <Textarea id="candidate-message" placeholder="Hi {candidate_name}, thank you for applying..." />
                        </div>
                         <Button className="w-full md:w-auto md:ml-auto" onClick={() => handleQueueCommunications('candidate')}>
                            <Send className="mr-2 h-4 w-4" /> Queue {selectedCandidates.length} Candidate Messages
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
