import { getProjects, ProjectListItem } from '@/actions/projects/getProjects';

export async function exportProjects(userId: string, format: 'csv' | 'pdf') {
  let allProjects: ProjectListItem[] = [];
  let page = 1;
  const perPage = 100; 

  let total = 0;
  let fetchedCount = 0;

  do {
    const result = await getProjects({ userId, page, perPage });

    if (!result.success) {
      throw new Error('Failed to fetch projects for export.');
    }

    allProjects = allProjects.concat(result.data.projects);
    total = result.data.total;
    fetchedCount += result.data.projects.length;
    page++;
  } while (fetchedCount < total);


  if (format === 'csv') {
    if (allProjects.length === 0) {
      const csvContent = 'data:text/csv;charset=utf-8,';
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'projects.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [Object.keys(allProjects[0]).join(','), ...allProjects.map((project) => Object.values(project).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'projects.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (format === 'pdf') {
    // This is a basic placeholder for PDF export.
    // In a real application, you would use a library like 'jspdf' or send data to a backend for PDF generation.
    alert('PDF export is not yet fully implemented. A real implementation would generate a PDF file.');
    console.warn('PDF export not fully implemented.');
  }
}
