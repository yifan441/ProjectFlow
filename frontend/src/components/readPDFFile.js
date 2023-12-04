import * as pdfjsLib from 'pdfjs-dist/webpack';

const readPDFFile = async (file) => {
    const readFileAsync = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    };
  
    try {
      const pdfData = await readFileAsync(file);
      const loadingTask = pdfjsLib.getDocument({ data: pdfData });
      const pdfDocument = await loadingTask.promise;
  
      const numPages = pdfDocument.numPages;
      let fullPDFText = '';
  
      for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
        const page = await pdfDocument.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(' ');
        fullPDFText += pageText + '\n';
      }
  
      return fullPDFText;
    } catch (error) {
      throw new Error(`Unable to extract PDF file: ${error.message}`);
    }
  };
  
  export {readPDFFile};