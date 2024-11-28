import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePdf = async (elementId: any, fileName:string) => {
	const input = document.getElementById(elementId);

	if (!input) {
		console.error(`Element with id ${elementId} not found`);
		return;
	}

	// Add padding to the element
	input.style.padding = "20px";

	// Capture the element as a canvas
	const canvas = await html2canvas(input, { scale: 2 });
	const imgData = canvas.toDataURL("image/png");

	// Create a PDF document
	const pdf = new jsPDF("p", "pt", "a4"); // 'pt' for points, 'a4' size
	const pdfWidth = pdf.internal.pageSize.getWidth();
	const pdfHeight = pdf.internal.pageSize.getHeight();

	const imgWidth = pdfWidth - 40; // 20pt padding on each side
	const imgHeight = (canvas.height * imgWidth) / canvas.width;

	pdf.addImage(imgData, "PNG", 20, 20, imgWidth, imgHeight); // 20pt padding on each side
    pdf.save(`${fileName}.pdf`);
};
