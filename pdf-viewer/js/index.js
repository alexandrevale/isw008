const url = "../docs/cv.pdf";
// const url = "https://github.com/alexandrevale/js-101/blob/master/pdf-viewer/docs/cv.pdf";

// Config
let pdfDoc = null,
	pageNum = 1,
	pageIsRendering = false,
	pageNumIsPending = null;

const scale = 1.5,
	canvas = document.querySelector('#pdf-render'),
	ctx = canvas.getContext('2d');

// Render the page
const renderPage = num => {
	pageIsRendering = true;

	// Get page
	pdfDoc.getPage(num).then(page => {
		// Set scale
		const viewport = page.getViewport({ scale });
		canvas.width = viewport.width;
		canvas.height = viewport.height;

		const renderCtx = {
			canvasContext: ctx,
			viewport
		}

		page.render(renderCtx).promise.then(() => {
			pageIsRendering = false;

			if(pageNumIsPending !== null) {
				renderPage(pageNumIsPending);
				pageNumIsPending = null;
			}
		});

		// Output current page
		document.querySelector('#page-num').textContext = num;
	});
}

// Check for pages rendering
const queueRenderPage = num => {
	if (pageNumIsPending) {
		pageNumIsPending = num;
	} else {
		renderPage(num)
	}
}

// Show prev page
const showPrevPage = () => {
	if (pageNum <= 1) {
		return;
	}

	pageNum--;
	queueRenderPage(pageNum);
}

// Show next page
const showNextPage = () => {
	if (pageNum >= pdfDoc.numPages) {
		return;
	}

	pageNum++;
	queueRenderPage(pageNum);
}

// Get doc
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
	pdfDoc = pdfDoc_;
	// console.log(pdfDoc);
	
	document.querySelector('#page-count').textContent = pdfDoc.numPages/

	renderPage(pageNum);
})
	.catch(err => {

		// Display error
		const div = document.createElement('div');
		div.className = 'error';
		div.appendChild(document.createTextNode(err.message));
		document.querySelector('body').insertBefore(div, canvas);

		// Remove top-bar
		document.querySelector('.top-bar').style.display = 'none';
	});

// btn events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);