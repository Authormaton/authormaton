export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  content: string; // Initial content for the project
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Project',
    description: 'Start with an empty project.',
    content: ''
  },
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'A template for writing a blog post.',
    content: '# My Awesome Blog Post\n\nStart writing your blog post here...'
  },
  {
    id: 'research-paper',
    name: 'Research Paper',
    description: 'A template for a research paper.',
    content: '# Research Paper Title\n\n## Abstract\n\n...'
  }
];
