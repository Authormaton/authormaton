import { ProjectTemplate, projectTemplates } from '@/lib/templates';
import { TemplateCard } from './TemplateCard';

interface TemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void;
  selectedTemplateId: string;
}

export function TemplateSelector({ onTemplateSelect, selectedTemplateId }: TemplateSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projectTemplates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onSelect={onTemplateSelect}
          isSelected={selectedTemplateId === template.id}
        />
      ))}
    </div>
  );
}
