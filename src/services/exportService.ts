import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

export const exportToWord = async (title: string, content: string) => {
  // Simple markdown to docx conversion logic
  // In a real app, we'd use a more robust parser, but for this demo:
  const lines = content.split("\n");
  const children = [
    new Paragraph({
      text: title.toUpperCase(),
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
  ];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith("# ")) {
      children.push(new Paragraph({ text: trimmed.replace("# ", ""), heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 } }));
    } else if (trimmed.startsWith("## ")) {
      children.push(new Paragraph({ text: trimmed.replace("## ", ""), heading: HeadingLevel.HEADING_2, spacing: { before: 150, after: 80 } }));
    } else if (trimmed.startsWith("### ") || /^[IVX]+\./.test(trimmed)) {
      children.push(new Paragraph({ 
        children: [new TextRun({ text: trimmed, bold: true })],
        spacing: { before: 120, after: 60 } 
      }));
    } else {
      children.push(new Paragraph({
        children: [new TextRun(trimmed)],
        spacing: { after: 100 }
      }));
    }
  });

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title.replace(/\s+/g, "_")}.docx`);
};
