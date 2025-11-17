
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { mockProjectData, mockEmployeeData } from '@/lib/mock-data';
import type { ProjectSheetItem, Employee, Update } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Briefcase,
  Calendar,
  Clock,
  Code,
  FileText,
  Github,
  Link as LinkIcon,
  ListChecks,
  Milestone,
  Tag,
  User,
  Users,
  MessageSquare,
  Star,
  UserCircle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllUpdates } from '@/lib/api';
import { cn } from '@/lib/utils';

const DetailItem = ({
  icon: Icon,
  label,
  value,
  children,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | number | string[] | null;
  children?: React.ReactNode;
}) => {
  if ((!value || (Array.isArray(value) && value.length === 0)) && !children)
    return null;

  return (
    <div className="flex items-start gap-3">
      <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-sm">{children || value}</div>
      </div>
    </div>
  );
};

interface UpdateWithAuthor extends Update {
    authorName: string;
    authorAvatar: string;
}


export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<ProjectSheetItem | null>(null);
  const [team, setTeam] = useState<Employee[]>([]);
  const [updates, setUpdates] = useState<UpdateWithAuthor[]>([]);

  useEffect(() => {
    const foundProject = mockProjectData.find((p) => p.id === id);
    if (foundProject) {
      setProject(foundProject);

      const assignedTeam = [
        foundProject.leadAssignee,
        foundProject.projectLeader,
        foundProject.virtualAssistant,
        ...(foundProject.coders || []),
        ...(foundProject.freelancers || []),
      ].filter((name): name is string => !!name);

      const uniqueTeamNames = [...new Set(assignedTeam)];

      const teamMembers = mockEmployeeData.filter((e) =>
        uniqueTeamNames.includes(e.name)
      );
      setTeam(teamMembers);
    }
     async function fetchUpdates() {
        const allUpdates = await getAllUpdates();
        const projectUpdates = allUpdates
            .filter(u => u.projectId === id)
            .map(u => {
                const author = mockEmployeeData.find(e => `user-${e.id.split('-')[1]}` === u.userId);
                return {
                    ...u,
                    authorName: author?.name || 'Unknown User',
                    authorAvatar: `https://i.pravatar.cc/150?u=${author?.id}`
                }
            })
            .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setUpdates(projectUpdates);
      }
      if (id) {
          fetchUpdates();
      }

  }, [id]);

  if (!project) {
    if (project === null) {
      return <div className="p-8">Loading project details...</div>;
    }
    return notFound();
  }

  const sortedMilestones = (project.milestones || []).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  return (
    <div className="p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {project.projectTitle}
        </h1>
        <p className="text-lg text-muted-foreground">
          {project.clientName}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <DetailItem icon={FileText} label="Description">
                        <p className="whitespace-pre-wrap">{project.projectDescription || 'No description provided.'}</p>
                    </DetailItem>
                    <Separator />
                     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        <DetailItem icon={ListChecks} label="Status">
                            <Badge
                                variant={ project.status === 'Active' ? 'default' :
                                    project.status === 'On Hold' || project.status === 'Stalled' ? 'secondary' :
                                    'outline'
                                }
                            >
                                {project.status}
                            </Badge>
                        </DetailItem>
                        <DetailItem icon={Briefcase} label="Priority" value={project.priority} />
                        <DetailItem icon={Briefcase} label="Project Type" value={project.projectType} />
                        <DetailItem icon={User} label="Client Type" value={project.clientType} />
                        <DetailItem icon={Calendar} label="Start Date" value={project.startDate} />
                        <DetailItem icon={Calendar} label="End Date" value={project.endDate} />
                        <DetailItem icon={Clock} label="Estimated Hours" value={`${project.estimatedHours} hrs`} />
                     </div>
                     <Separator />
                      <DetailItem icon={Tag} label="Tags">
                        <div className="flex flex-wrap gap-1">
                            {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                      </DetailItem>
                </CardContent>
            </Card>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare /> Recent Updates
                    </CardTitle>
                    <CardDescription>A log of daily updates from the team.</CardDescription>
                </CardHeader>
                <CardContent>
                   <div className="relative pl-6">
                        <div className="absolute left-[22px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                        {updates.length > 0 ? updates.map((item) => (
                           <div key={item.id} className="mb-8 flex items-start gap-4">
                               <Avatar className="z-10 h-10 w-10 border-2 border-primary">
                                    <AvatarImage src={item.authorAvatar} />
                                    <AvatarFallback>{item.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 -mt-1 pt-1">
                                    <p className="font-medium">{item.content}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                        {' - by '} 
                                        <span className="font-semibold">{item.authorName}</span>
                                    </p>
                                </div>
                            </div>
                        )) : (
                          <p className="text-sm text-muted-foreground">No updates have been submitted for this project yet.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-8">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Milestone /> Milestone Progress
                    </CardTitle>
                    <CardDescription>A timeline of project milestones.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative pl-6">
                        <div className="absolute left-[22px] top-0 h-full w-0.5 bg-border -translate-x-1/2"></div>
                        {sortedMilestones.length > 0 ? sortedMilestones.map((item) => (
                           <div key={item.id} className="mb-8 flex items-start gap-4">
                                <div className={cn("z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background border-2", {
                                    "border-green-500": item.status === 'completed',
                                    "border-primary": item.status === 'upcoming',
                                    "border-destructive": item.status === 'missed'
                                })}>
                                    {item.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500"/>}
                                    {item.status === 'upcoming' && <Milestone className="h-5 w-5 text-primary"/>}
                                    {item.status === 'missed' && <Milestone className="h-5 w-5 text-destructive"/>}
                                </div>
                                <div className="flex-1 pt-1.5">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        )) : (
                          <p className="text-sm text-muted-foreground">No milestones have been set for this project yet.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {team.map(member => (
                    <li key={member.id} className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.type}</p>
                        </div>
                    </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.githubLink && <LinkItem href={project.githubLink} icon={Github} label="GitHub Repository" />}
              {project.loomLink && <LinkItem href={project.loomLink} icon={LinkIcon} label="Loom Videos" />}
              {project.whatsappLink && <LinkItem href={project.whatsappLink} icon={LinkIcon} label="WhatsApp Group" />}
              {project.oneDriveLink && <LinkItem href={project.oneDriveLink} icon={LinkIcon} label="OneDrive Folder" />}
               {!project.githubLink && !project.loomLink && !project.whatsappLink && !project.oneDriveLink && (
                  <p className="text-sm text-muted-foreground">No links have been added for this project.</p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const LinkItem = ({ href, icon: Icon, label }: { href: string, icon: React.ElementType, label: string }) => (
    <Button variant="outline" asChild className="w-full justify-start">
        <Link href={href} target="_blank" rel="noopener noreferrer">
            <Icon className="mr-2 h-4 w-4" />
            {label}
        </Link>
    </Button>
)

    

    