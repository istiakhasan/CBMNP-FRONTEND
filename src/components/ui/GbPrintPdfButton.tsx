
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
const GbPrintPdfButton = ({componentRef}:{componentRef:any}) => {
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'RequisitionPdf',
    });

    const handlePDF = async (action = 'view') => {
        const element = componentRef.current;
        if (element) {
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4',
            });
            const imgWidth = 595.28; // A4 width in points
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
            if (action === 'download') {
                // Append a formatted timestamp to the filename
                const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
                const filename = `requisition-${timestamp}.pdf`;
                pdf.save(filename);
            } else {
                const pdfBlob = pdf.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl);
            }
        }
    };
    
    return (
        <div className=' items-center justify-end gap-[12px] flex'>
        <button className=' py-[4px] px-[20px] text-[10px] bg-primary text-[white]  font-bold uppercase rounded-[5px]' onClick={handlePrint}>Print</button>
        <button className='py-[4px] px-[20px] text-[10px] bg-primary text-white font-bold uppercase rounded-[5px]' onClick={() => handlePDF()}>View PDF</button>
        <button className='py-[4px] px-[20px] text-[10px] bg-primary text-white font-bold uppercase rounded-[5px]' onClick={() => handlePDF('download')}>Download PDF</button>
    </div>
    );
};

export default GbPrintPdfButton;