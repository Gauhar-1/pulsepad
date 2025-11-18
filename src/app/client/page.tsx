
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Clock, Github, Link as LinkIcon, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { ProjectSheetItem } from '@/lib/definitions';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const fetchProjects = async (): Promise<ProjectSheetItem[]> => {
    const res = await fetch('/api/admin/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
}

const ClientReportSkeleton = () => (
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
              {Array.from({length: 4}).map((_, i) => (
                  <div key={i} className="mb-8 flex items-center gap-6">
                      <Skeleton className="z-10 h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-1/2" />
                          <Skeleton className="h-4 w-1/3" />
                      </div>
                  </div>
              ))}
          </div>
      </CardContent>
    </Card>
);

const ClientReport = () => {
  // We'll just show the first project's milestones for demo purposes
  const { data: projects, isLoading } = useQuery<ProjectSheetItem[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  if (isLoading || !projects) return <ClientReportSkeleton />;

  const milestones = projects[0]?.milestones || [];
  const sortedMilestones = [...milestones].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());


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
          {sortedMilestones.map((milestone) => (
            <div key={milestone.id} className="mb-8 flex items-center gap-6">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background">
                {milestone.status === 'completed' ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <Clock
                    className={`h-6 w-6 ${
                      new Date(milestone.date) < new Date() && milestone.status === 'upcoming'
                        ? 'text-yellow-500'
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

const ProjectLinks = () => {
    const { data: projects, isLoading } = useQuery<ProjectSheetItem[]>({
        queryKey: ['projects'],
        queryFn: fetchProjects
    });

    if (isLoading || !projects) return (
        <Card>
            <CardHeader><CardTitle>Project Files & Links</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    );

    // Assuming the client is associated with the first project for this example
    const project = projects[0];
    const links = [
        { href: project.githubLink, icon: Github, label: 'GitHub Repository' },
        { href: project.loomLink, icon: LinkIcon, label: 'Loom Videos' },
        { href: project.whatsappLink, icon: LinkIcon, label: 'WhatsApp Group' },
        { href: project.oneDriveLink, icon: LinkIcon, label: 'OneDrive Folder' }
    ].filter(link => link.href);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Files & Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                 {links.length > 0 ? links.map((link) => (
                    <Button key={link.label} variant="outline" asChild className="w-full justify-start">
                        <Link href={link.href!} target="_blank" rel="noopener noreferrer">
                            <link.icon className="mr-2 h-4 w-4" />
                            {link.label}
                        </Link>
                    </Button>
                )) : (
                    <p className="text-sm text-muted-foreground">No links available for this project.</p>
                )}
            </CardContent>
        </Card>
    )
}

const ContactAdmin = () => {
    const admin = {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatar: "https://i.pravatar.cc/150?u=admin",
        phone: "+1 (555) 123-4567"
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contact Your Admin</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-primary">
                    <AvatarImage src={admin.avatar} />
                    <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-lg">{admin.name}</p>
                    <p className="text-muted-foreground text-sm">{admin.email}</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <a href={`mailto:${admin.email}`}>
                            <Mail className="mr-2 h-4 w-4" /> Email
                        </a>
                    </Button>
                     <Button asChild>
                        <a href={`tel:${admin.phone}`}>
                            <Phone className="mr-2 h-4 w-4" /> Call
                        </a>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}


export default function ClientPage() {
    return (
      <>
        <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Project Overview
            </h1>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
                <ClientReport />
            </div>
            <div className="space-y-8">
                <ProjectLinks />
                <ContactAdmin />
            </div>
        </div>
      </>
    );
}
