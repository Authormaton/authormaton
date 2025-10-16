import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectTemplate } from '@/lib/templates';
import { cn } from '@/lib/utils';

interface TemplateCardProps extends React.HTMLAttributes<HTMLDivElement> {
  template: ProjectTemplate;
  onSelect: (templateId: string) => void;
  isSelected: boolean;
}

export function TemplateCard({ template, onSelect, isSelected, className, ...props }: TemplateCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer hover:border-primary transition-colors',
        isSelected && 'border-primary ring-2 ring-primary ring-offset-2',
        className
      )}
      onClick={() => onSelect(template.id)}
      {...props}
    >
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground line-clamp-3'>{template.content || 'No initial content.'}</p>
      </CardContent>
    </Card>
  );
}
