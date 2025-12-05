import { getProjects, ProjectListItem } from '@/actions/projects/getProjects';

function escapeCsvValue(value: any): string {
  let stringValue = String(value);

  if (value instanceof Date) {
    stringValue = value.toISOString();
  }

  stringValue = stringValue.replace(/"/g, '""');

  if (stringValue.startsWith('=') || stringValue.startsWith('+') || stringValue.startsWith('-') || stringValue.startsWith('@')) {
    stringValue = "'" + stringValue;
  }

  return `"${stringValue}"`;
}

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
    const headers = allProjects.length > 0 ? Object.keys(allProjects[0]) : ['id', 'title', 'createdAt', 'updatedAt', 'type', 'userId']; // Fallback headers for empty projects
    const escapedHeaders = headers.map(escapeCsvValue).join(',');

    const csvRows = allProjects.map(project => {
      const rowValues = headers.map(header => project[header as keyof ProjectListItem]);
      return rowValues.map(escapeCsvValue).join(',');
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [escapedHeaders, ...csvRows].join('\n');

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
