import { crawlPage } from "./functions/crawl"
import { printReport } from "./functions/report"

async function main() {
    const urlArgs = process.argv

    if (urlArgs.length < 3) {
        console.log("Please provide a URL")
        process.exit(1)
    } else if (urlArgs.length > 3) {
        console.log("Please provide only one URL")
        process.exit(1)
    }
    const url = urlArgs[2]
    const body = await crawlPage(url, url, {})

    printReport(body, url)

    process.exit(0)
}

main()
