
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
    FileText,
    Users,
    Code,
    UserCircle
} from 'lucide-react';
import Link from 'next/link';

interface ViewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectSheetItem | null;
}

const DetailItem = ({ icon: Icon, label, value, isLink=false }: { icon: React.ElementType, label: string, value?: string | number | string[] | null, isLink?: boolean }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

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
                
                {project.projectDescription && (
                    <div className="flex gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Description</p>
                            <p className="text-sm whitespace-pre-wrap">{project.projectDescription}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <DetailItem icon={Briefcase} label="Client" value={project.clientName} />
                    <DetailItem icon={User} label="Client Type" value={project.clientType} />
                    <div className="flex gap-3 items-start">
                        <ListChecks className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Status</p>
                            <Badge
                                variant={
                                    project.status === 'In Progress' || project.status === 'Active' ? 'default' :
                                    project.status === 'On Hold' || project.status === 'Stalled' ? 'secondary' :
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

                    <DetailItem icon={Briefcase} label="Priority" value={project.priority} />
                    <DetailItem icon={Clock} label="Estimated Hours" value={`${project.estimatedHours} hrs`} />
                    <DetailItem icon={CalendarDays} label="Start Date" value={project.startDate} />
                    <DetailItem icon={CalendarDays} label="End Date" value={project.endDate} />
                    
                </div>
                
                <div className="space-y-6 pt-4 border-t">
                     <h3 className="text-base font-semibold">Assignments</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem icon={User} label="Lead Assignee" value={project.leadAssignee} />
                        <DetailItem icon={UserCircle} label="Project Leader" value={project.projectLeader} />
                        <DetailItem icon={User} label="Virtual Assistant" value={project.virtualAssistant} />
                        <DetailItem icon={Users} label="Freelancers" value={project.freelancers} />
                        <DetailItem icon={Code} label="Coders" value={project.coders} />
                    </div>
                </div>

                <div className="space-y-6 pt-4 border-t">
                    <h3 className="text-base font-semibold">Links</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem icon={Github} label="GitHub Link" value={project.githubLink} isLink />
                        <DetailItem icon={LinkIcon} label="Loom Link" value={project.loomLink} isLink />
                        <DetailItem icon={LinkIcon} label="WhatsApp Link" value={project.whatsappLink} isLink />
                        <DetailItem icon={LinkIcon} label="OneDrive Link" value={project.oneDriveLink} isLink />
                    </div>
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
