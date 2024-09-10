import jsPDF from "jspdf";
import "jspdf-autotable";

const loadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
  });
};

const generatePdf = async (pdfData) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const marginX = 15;
  const marginY = 10;
  const maxWidth = 180; // Max width for text
  let y = marginY;

  // Add centered title with background color and border
  doc.setFontSize(20);
  doc.setFillColor(240, 128, 128); // Light coral background color
  const titleHeight = 20;
  if (y + titleHeight > pageHeight) {
    doc.addPage();
    y = marginY;
  }

  const titleText = "Report";
  const textWidth = doc.getTextWidth(titleText);
  const x = (pageWidth - textWidth) / 2; // Center the title

  doc.rect(marginX, y, maxWidth, titleHeight + 5, "FD"); // Background color and border
  doc.setTextColor(255, 255, 255); // White text color
  doc.text(titleText, x, y + titleHeight - 5); // Centered title position
  y += titleHeight + marginY + 10;

  for (let index = 0; index < pdfData.length; index++) {
    const tableJson = pdfData[index].json;

    // Add heading with underline and color
    doc.setFontSize(14);
    doc.setTextColor(0, 128, 0); // Green color for headings
    doc.setDrawColor(0, 128, 0); // Green color for underline
    const headingHeight = 8;
    if (y + headingHeight > pageHeight) {
      doc.addPage();
      y = marginY;
    }
    doc.text("Insights:", marginX, y);
    doc.line(marginX, y + 2, marginX + 30, y + 2); // Underline the heading
    y += headingHeight + marginY;

    // Add text with a different color and padding
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50); // Dark gray for text
    const textLines = doc.splitTextToSize(pdfData[index].insights, maxWidth);
    const textHeight = textLines.length * 10;
    if (y + textHeight > pageHeight) {
      doc.addPage();
      y = marginY;
    }
    doc.text(textLines, marginX, y);
    y += textHeight;

    // Add image with a different, softer border color and padding
    const imgData = await loadImage(pdfData[index].image);
    const imgPadding = 5;
    const imgHeight = 150;
    if (y + imgHeight + 2 * imgPadding > pageHeight) {
      doc.addPage();
      y = marginY;
    }
    doc.setDrawColor(135, 206, 250); // Light Sky Blue border color for image
    doc.setLineWidth(0.5); // Lighter border width
    doc.rect(
      marginX - imgPadding,
      y - imgPadding,
      180 + 2 * imgPadding,
      imgHeight + 2 * imgPadding
    ); // Border with padding
    doc.addImage(imgData, "JPEG", marginX, y, 180, imgHeight);
    y += imgHeight + 2 * imgPadding + marginY;

    // Add table with border styling using autotable
    if (tableJson.length > 0) {
      const headers = ["#", ...Object.keys(tableJson[0])]; // Add index column header
      const tableData = tableJson?.map((item, index) => [
        index + 1,
        ...Object.values(item),
      ]);

      const tableStartY = y;
      doc.autoTable({
        startY: tableStartY,
        head: [headers],
        body: tableData,
        theme: "striped", // Use striped theme for alternating row colors
        headStyles: { fillColor: [0, 128, 128] }, // Teal color for table header
        alternateRowStyles: { fillColor: [240, 240, 240] }, // Light gray for alternate rows
        styles: {
          fontSize: 10,
          textColor: [50, 50, 50], // Dark gray text
          lineColor: [0, 0, 0], // Black border color for table
          lineWidth: 0.1, // Border width for table cells
        },
        margin: { top: 10 },
        tableLineColor: [0, 0, 0], // Black border for the entire table
        tableLineWidth: 0.2, // Thickness of the table border
      });

      y = doc.lastAutoTable.finalY + marginY + 10;
      // Avoid extra page break if it's the last item
      if (index !== pdfData.length - 1 && y + marginY > pageHeight) {
        doc.addPage();
        y = marginY;
      }
    }
  }
  doc.save("report.pdf");
};

export default generatePdf;
