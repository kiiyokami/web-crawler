import { expect, test, describe } from "vitest"
import { normalizeUrl, getURLsFromHTML, getHTML } from "../functions/crawl"


describe("normalizeUrl", () => {
  test("strip protocol", () => {
    const input = "https://blog.boot.dev/path"
    const actual = normalizeUrl(input)
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
  })
  test("strip trailing slash", () => {
    const input = "https://blog.boot.dev/path/"
    const actual = normalizeUrl(input)
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
  })
  test("http protocol", ()=> {
    const input = "http://blog.boot.dev/path/"
    const actual = normalizeUrl(input)
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
  })

  test("www subdomain", ()=> {
    const input = "http://www.example.com"
    const actual = normalizeUrl(input)
    const expected = "example.com"
    expect(actual).toEqual(expected)
  })
})


describe("getUrlsFromHTML",()=>{
  test("absolute urls",()=>{
    const inputHTMLBody = `
    <html>
      <body>
        <a href="https://boot.dev/courses/learn-code-python">Learn Python</a>
      </body>
    </html>
    `
    const inputBaseURL = "https://boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody,inputBaseURL)
    const expected = ["https://boot.dev/courses/learn-code-python"]
    expect(actual).toEqual(expected)
  })
  test("relative urls",()=>{
    const inputHTMLBody = `
    <html>
      <body>
        <a href="/courses/learn-code-python">Learn to Python</a>
      </body>
    </html>
    `
    const inputBaseURL = "https://boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody,inputBaseURL)
    const expected = ["https://boot.dev/courses/learn-code-python"]
    expect(actual).toEqual(expected)
  })
  test("multiple urls",()=>{
    const inputHTMLBody = `
    <html>
      <body>
        <a href="https://boot.dev/courses/learn-code-python">Learn Python</a>
        <a href="/courses/learn-git">Learn Git</a>
      </body>
    </html>
    `
    const inputBaseURL = "https://boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody,inputBaseURL)
    const expected = ["https://boot.dev/courses/learn-code-python","https://boot.dev/courses/learn-git"]
    expect(actual).toEqual(expected)
  })
})

describe("getHTML", () => {
  test("getHTML successfully fetches HTML content", async () => {
      const input = "https://wikipedia.org";
      const html = await getHTML(input);
      
      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(0);
      // Test that it contains basic HTML structure
      expect(html).toMatch(/<html/i);
  });

  test("getHTML throws error for invalid URL", async () => {
      const input = "https://this-is-not-a-real-website-xyz.com";
      await expect(getHTML(input)).rejects.toThrow();
  });

  test("getHTML throws error for non-HTML content", async () => {
      const input = "https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg";
      await expect(getHTML(input)).rejects.toThrow('Invalid content type');
  });
});