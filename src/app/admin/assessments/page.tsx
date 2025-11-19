
'use client';
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { CheckCheck, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChecklistItem {
    id: string;
    text: string;
    weight: number;
}

export default function AdminAssessmentsPage() {
    const { toast } = useToast();
    const [templateName, setTemplateName] = useState('');
    const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
        { id: `item-${Date.now()}`, text: '', weight: 1 },
    ]);

    const handleAddItem = () => {
        setChecklistItems([
            ...checklistItems,
            { id: `item-${Date.now()}`, text: '', weight: 1 },
        ]);
    };

    const handleRemoveItem = (id: string) => {
        setChecklistItems(checklistItems.filter(item => item.id !== id));
    };

    const handleItemChange = (id: string, field: 'text' | 'weight', value: string | number) => {
        setChecklistItems(
            checklistItems.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };
    
    const handleSaveTemplate = () => {
        if (!templateName.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Template name is required.',
                variant: 'destructive',
            });
            return;
        }
        // In a real app, you would post this data to your backend
        console.log({
            name: templateName,
            checklist: checklistItems,
        });
        toast({
            title: 'Template Saved',
            description: `The "${templateName}" template has been saved successfully.`,
        });
        setTemplateName('');
        setChecklistItems([{ id: `item-${Date.now()}`, text: '', weight: 1 }]);
    }

    return (
        <div className="admin-dashboard-gradient min-h-screen p-4 sm:p-8">
            <header className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CheckCheck className="h-8 w-8 text-primary"/>
                    <div>
                        <h1 className="text-2xl font-bold">Assessment Templates</h1>
                        <p className="text-muted-foreground">Create and manage daily assessment checklists.</p>
                    </div>
                </div>
            </header>

            <main>
                 <Card className="rounded-2xl shadow-lg max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle>Template Builder</CardTitle>
                        <CardDescription>Design a new assessment template by adding checklist items.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="template-name">Template Name</Label>
                            <Input
                                id="template-name"
                                placeholder="e.g., Daily Punctuality Check"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <Label>Checklist Items</Label>
                             <ScrollArea className="h-72 w-full rounded-md border p-4">
                                <div className="space-y-4">
                                    {checklistItems.map((item, index) => (
                                        <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                                            <span className="text-sm font-medium">{index + 1}.</span>
                                            <Input
                                                placeholder="Enter checklist text..."
                                                value={item.text}
                                                onChange={(e) => handleItemChange(item.id, 'text', e.target.value)}
                                                className="flex-grow"
                                            />
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor={`weight-${item.id}`} className="text-sm">Weight</Label>
                                                <Input
                                                    id={`weight-${item.id}`}
                                                    type="number"
                                                    value={item.weight}
                                                    onChange={(e) => handleItemChange(item.id, 'weight', parseInt(e.target.value, 10) || 1)}
                                                    className="w-16"
                                                />
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => handleRemoveItem(item.id)}
                                                disabled={checklistItems.length <= 1}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <Button variant="outline" onClick={handleAddItem}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Checklist Item
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button size="lg" className="ml-auto" onClick={handleSaveTemplate}>
                            Save Template
                        </Button>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}

