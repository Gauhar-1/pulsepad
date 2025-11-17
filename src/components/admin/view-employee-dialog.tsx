
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
import { Employee } from '@/lib/definitions';
import { ScrollArea } from '../ui/scroll-area';
import {
    Mail,
    Briefcase,
    Wrench,
    User,
    CheckCircle,
    XCircle,
    FileText
} from 'lucide-react';

interface ViewEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

const DetailItem = ({ icon: Icon, label, value, children }: { icon: React.ElementType, label: string, value?: string | number | string[] | null, children?: React.ReactNode }) => {
    if ((!value || (Array.isArray(value) && value.length === 0)) && !children) return null;

    return (
        <div className="flex gap-3">
            <div className="flex-shrink-0">
                <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
            </div>
            <div>
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                {value && <p className="text-sm">{Array.isArray(value) ? value.join(', ') : value}</p>}
                {children}
            </div>
        </div>
    )
}

export function ViewEmployeeDialog({
  open,
  onOpenChange,
  employee,
}: ViewEmployeeDialogProps) {
  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{employee.name}</DialogTitle>
          <DialogDescription>
            {employee.type} Employee
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 -mx-6 px-6">
            <div className="py-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <DetailItem icon={User} label="Name" value={employee.name} />
                    <DetailItem icon={Mail} label="Email" value={employee.email} />
                    
                    <DetailItem icon={employee.active ? CheckCircle : XCircle} label="Status">
                         <Badge
                            variant={
                                employee.active ? 'default' : 'outline'
                            }
                            className={employee.active ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}
                        >
                            {employee.active ? 'Active' : 'Inactive'}
                        </Badge>
                    </DetailItem>
                    
                    <DetailItem icon={Briefcase} label="Employment Type" value={employee.type} />
                   
                    <div className="flex gap-3 items-start md:col-span-2">
                        <Wrench className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Skills</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {employee.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                            </div>
                        </div>
                    </div>
                     <div className="flex gap-3 items-start md:col-span-2">
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Assigned Projects</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {employee.projects.length > 0 ? employee.projects.map(project => <Badge key={project} variant="outline">{project}</Badge>) : <p className="text-sm text-muted-foreground">No projects assigned.</p>}
                            </div>
                        </div>
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
