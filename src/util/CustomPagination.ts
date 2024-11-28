export const generatePagination = (
	pageNumber: number,
	totalPageNumber: number
): (number | string)[] => {
	let pages: (number | string)[] = [];
	pages.push(1);
	if (pageNumber <= 4) {
		for (let i = 2; i <= Math.min(5, totalPageNumber); i++) {
			pages.push(i);
		}
		if (totalPageNumber > 5) {
			pages.push("...");
			pages.push(totalPageNumber);
		}
	}else if (pageNumber >= 5 && pageNumber <= totalPageNumber - 4) {
		pages.push("...");
		pages.push(pageNumber - 1);
		pages.push(pageNumber);
		pages.push(pageNumber + 1);
		pages.push("...");
		pages.push(totalPageNumber);
	}else {
		pages.push("...");
		for (let i = totalPageNumber - 4; i < totalPageNumber; i++) {
			pages.push(i);
		}
		pages.push(totalPageNumber);
	}
	return pages;
};