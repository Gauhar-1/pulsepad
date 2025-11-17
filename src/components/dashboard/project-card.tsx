
'use client';
import { useState } from 'react';
import type { Project, Update } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building, Plus, CheckCircle2, Edit, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { UpdateSheet } from './update-sheet';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type ProjectWithUpdate = Project & { todaysUpdate?: Update };

export function ProjectCard({ project }: { project: ProjectWithUpdate }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const hasUpdate = !!project.todaysUpdate;

  return (
    <>
      <Card className="flex h-full flex-col transition-all hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-bold tracking-tight">{project.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 pt-1">
                <Building className="h-4 w-4" />
                {project.client}
              </CardDescription>
            </div>
             <Button variant="ghost" size="icon" asChild>
                <Link href={`/dashboard/projects/${project.id}`}>
                    <Eye className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">View Details</span>
                </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <Badge
            variant={project.status === 'active' ? 'default' : 'secondary'}
            className={cn({
              'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300':
                project.status === 'active',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300':
                project.status === 'on-hold',
              'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300':
                project.status === 'completed',
            })}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
        </CardContent>
        <CardFooter className="flex items-center justify-between rounded-b-lg bg-muted/50 p-4">
          {hasUpdate ? (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <div>
                <p className="font-semibold">Update Submitted</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(project.todaysUpdate!.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No update for today.</div>
          )}

          <Button
            variant={hasUpdate ? 'outline' : 'default'}
            size="sm"
            onClick={() => setIsSheetOpen(true)}
            className="shrink-0"
          >
            {hasUpdate ? (
              <>
                <Edit className="mr-2 h-4 w-4" /> View / Edit
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Add Update
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      <UpdateSheet
        project={project}
        update={project.todaysUpdate}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </>
  );
}
