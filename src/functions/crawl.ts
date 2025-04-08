import { JSDOM } from 'jsdom'

export const normalizeUrl = (url: string): string => {
    try {
        const urlString = (!url.startsWith('http://') && !url.startsWith('https://'))
            ? `https://${url}`
            : url;

        const normalizedUrl = new URL(urlString);
        
        let hostname = normalizedUrl.hostname;
        if (hostname.startsWith('www.')) {
            hostname = hostname.slice(4);
        }

        const pathname = normalizedUrl.pathname.replace(/\/$/, '');
        return pathname ? `${hostname}${pathname}` : hostname;

    } catch (error) {
        throw new Error(`Invalid URL: ${url}`);
    }
};

export const getURLsFromHTML = (htmlBody: string, baseURL: string): string[] => {
    if (!htmlBody || !baseURL) {
        return [];
    }

    try {
        const urls: Set<string> = new Set();
        const dom = new JSDOM(htmlBody);
        const aElements = dom.window.document.querySelectorAll('a[href]');

        for (const a of aElements) {
            const href = a.getAttribute('href');
            if (!href) continue;

            try {
                const url = href.startsWith('http://') || href.startsWith('https://')
                    ? new URL(href)
                    : new URL(href, baseURL);

                urls.add(url.href);
            } catch {
                continue;
            }
        }

        return Array.from(urls);
    } catch (error) {
        console.error('Error parsing HTML:', error);
        return [];
    }
};

export const getHTML = async (url: string): Promise<string> => {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('text/html')) {
            throw new Error(`Invalid content type: ${contentType}`);
        }
        
        return await response.text();
    } catch (error) {
        console.error('Error fetching HTML:', error);
        throw error; //
    }
};

export const crawlPage = async (baseURL: string, currentURL: string, pages: Record<string, number>): Promise<Record<string, number>> => {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);

    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }

    const normalizedCurrentURL = normalizeUrl(currentURL);
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++;
        return pages;
    }

    pages[normalizedCurrentURL] = 1;

    console.log(`Crawling: ${currentURL}`);

    try {
        const htmlBody = await getHTML(currentURL);
        const urls = getURLsFromHTML(htmlBody, baseURL);

        for (const url of urls) {
            pages = await crawlPage(baseURL, url, pages);
        }
    } catch (error) {
        console.error(`Error crawling ${currentURL}:`, error);
    }

    return pages;
};




