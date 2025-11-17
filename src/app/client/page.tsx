
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
import { mockProjectData } from '@/lib/mock-data';

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

const ProjectLinks = () => {
    // Assuming the client is associated with the first project for this example
    const project = mockProjectData[0];
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
