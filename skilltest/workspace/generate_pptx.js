
const pptxgen = require('pptxgenjs');
// Using absolute path to the html2pptx script
const html2pptx = require('./html2pptx.js');
const path = require('path');

async function createPresentation() {
    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    pptx.author = 'Trae AI';
    pptx.title = 'Life Coding';

    const slides = [
        'slide1.html',
        'slide2.html',
        'slide3.html',
        'slide4.html',
        'slide5.html',
        'slide6.html'
    ];

    console.log('Starting presentation generation...');

    for (const slideFile of slides) {
        console.log(`Processing ${slideFile}...`);
        const fullPath = path.join(__dirname, slideFile);
        try {
            await html2pptx(fullPath, pptx);
        } catch (error) {
            console.error(`Error processing ${slideFile}:`, error);
        }
    }

    const outputPath = path.join(__dirname, 'Life_Coding.pptx');
    await pptx.writeFile({ fileName: outputPath });
    console.log(`Presentation created successfully at: ${outputPath}`);
}

createPresentation().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
