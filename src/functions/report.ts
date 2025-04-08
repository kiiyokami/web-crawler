export const printReport = (pages: Record<string, number>, baseURL: string) => {
    console.log("=============================");
    console.log("REPORT for " + baseURL);
    console.log("=============================");
    const sortedPages = sortPages(pages);
    for (const sortedPage of sortedPages) {
      const url = sortedPage[0];
      const count = sortedPage[1];
      console.log(`Found ${count} internal links to ${url}`);
    }
  }

export const sortPages = (pages: Record<string, number>) => {
    const pagesArr = Object.entries(pages);
    pagesArr.sort((a, b) => b[1] - a[1]);
    return pagesArr;
  };