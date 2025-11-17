
'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectSheetItem } from '@/lib/definitions';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import {
    CalendarDays,
    Clock,
    Github,
    Link as LinkIcon,
    Briefcase,
    Tag,
    User,
    ListChecks,
} from 'lucide-react';
import Link from 'next/link';

interface ViewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectSheetItem | null;
}

const DetailItem = ({ icon: Icon, label, value, isLink=false }: { icon: React.ElementType, label: string, value?: string | number | string[] | null, isLink?: boolean }) => {
    if (!value) return null;

    return (
        <div className="flex gap-3">
            <div className="flex-shrink-0">
                <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                {isLink && typeof value === 'string' ? (
                     <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all">{value}</a>
                ) : (
                    <p className="text-sm">{Array.isArray(value) ? value.join(', ') : value}</p>
                )}
            </div>
        </div>
    )
}

export function ViewProjectDialog({
  open,
  onOpenChange,
  project,
}: ViewProjectDialogProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.projectTitle}</DialogTitle>
          <DialogDescription>
            {project.clientName} - {project.projectType}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="py-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <DetailItem icon={Briefcase} label="Client" value={project.clientName} />
                    <DetailItem icon={User} label="Client Type" value={project.clientType} />
                    <div className="flex gap-3 items-start">
                        <ListChecks className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            <Badge
                                variant={
                                    project.status === 'In Progress' ? 'default' :
                                    project.status === 'On Hold' ? 'secondary' :
                                    'outline'
                                }
                            >
                                {project.status}
                            </Badge>
                        </div>
                    </div>
                     <div className="flex gap-3 items-start">
                        <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Tags</p>
                            <div className="flex flex-wrap gap-1">
                                {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                            </div>
                        </div>
                    </div>

                    <DetailItem icon={User} label="Lead Assignee" value={project.leadAssignee} />
                    <DetailItem icon={Briefcase} label="Priority" value={project.priority} />

                    <DetailItem icon={CalendarDays} label="Start Date" value={project.startDate} />
                    <DetailItem icon={CalendarDays} label="End Date" value={project.endDate} />
                    <DetailItem icon={Clock} label="Estimated Hours" value={project.estimatedHours} />

                    <DetailItem icon={Github} label="GitHub Link" value={project.githubLink} isLink />
                    <DetailItem icon={LinkIcon} label="Loom Link" value={project.loomLink} isLink />
                    <DetailItem icon={LinkIcon} label="WhatsApp Link" value={project.whatsappLink} isLink />
                    <DetailItem icon={LinkIcon} label="OneDrive Link" value={project.oneDriveLink} isLink />

                </div>
            </div>
        </ScrollArea>
        <DialogFooter className="mt-auto">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
