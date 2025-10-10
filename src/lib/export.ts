import { getProjects } from "@/actions/projects/getProjects";

export async function exportProjects(format: "csv" | "pdf") {
  const result = await getProjects();

  if (!result.success) {
    throw new Error("Failed to fetch projects for export.");
  }

  const projects = result.data;

  if (format === "csv") {
    const csvContent = "data:text/csv;charset=utf-8," +
      [
        Object.keys(projects[0]).join(","),
        ...projects.map((project) => Object.values(project).join(",")),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "projects.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (format === "pdf") {
    // This is a basic placeholder for PDF export.
    // In a real application, you would use a library like 'jspdf' or send data to a backend for PDF generation.
    alert("PDF export is not yet fully implemented. A real implementation would generate a PDF file.");
    console.warn("PDF export not fully implemented.");
  }
}