import * as ejs from 'ejs';
import * as htmlToPdf from 'html-pdf-node';

export class PdfService {
  static async generate(templatePath: string, data: any): Promise<Buffer> {
    const html = await ejs.renderFile(templatePath, data);
    const file = { content: html };
    const options = {
      format: 'A4',
      printBackground: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };
    return htmlToPdf.generatePdf(file, options) as Promise<Buffer>;
  }
}
