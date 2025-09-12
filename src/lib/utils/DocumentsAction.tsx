import html2pdf from "html2pdf.js";
import { toast } from "sonner"; // or your toast lib

export const generatePdf = async (
  previewRef: React.RefObject<HTMLElement | null>, // allow null
  type: "save" | "blob" | "base64",
  filename = "document.pdf"
): Promise<Blob | string | null> => {
  if (!previewRef.current) return null;

  const opt = {
    margin: 0.5,
    filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  if (type === "save") {
    await html2pdf().from(previewRef.current).set(opt).save();
    return null;
  }

  const pdfBlob: Blob = await html2pdf()
    .from(previewRef.current)
    .set(opt)
    .outputPdf("blob");

  if (type === "blob") return pdfBlob;

  if (type === "base64") {
    const arrayBuffer = await pdfBlob.arrayBuffer();
    return Buffer.from(arrayBuffer).toString("base64");
  }

  return null;
};

// 🔹 Download PDF
export const downloadPdf = async (
  previewRef: React.RefObject<HTMLElement>,
  filename: string
) => {
  await generatePdf(previewRef, "save", filename);
};

// 🔹 Print PDF
export const printPdf = async (previewRef: React.RefObject<HTMLElement>, filename: string) => {
  const pdfBlob = (await generatePdf(previewRef, "blob", filename)) as Blob | null;
  if (!pdfBlob) return;

  const pdfUrl = URL.createObjectURL(pdfBlob);
  const newWindow = window.open(pdfUrl);
  if (newWindow) {
    newWindow.onload = () => newWindow.print();
  }
};

// 🔹 Generate Base64 PDF (for sending via API/email)
export const getBase64Pdf = async (
  previewRef: React.RefObject<HTMLElement>,
  filename: string
): Promise<string | null> => {
  return (await generatePdf(previewRef, "base64", filename)) as string | null;
};
