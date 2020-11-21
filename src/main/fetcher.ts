import * as puppeteer from 'puppeteer';
import { wait } from './helper';
import * as config from 'config';

export class Fetcher {
  config: any;
  constructor(credentials) {
    this.config = {
      scrapUrl: config.get('scrapUrl'),
      endDate: config.get('endDate'),
      startDate: config.get('startDate'),
      ...credentials,
    };
  }
  public async scrape() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(this.config.scrapUrl);
    await wait(2000);

    await page.type('input[type="email"]', this.config.email);
    await page.type('input[type="password"]', this.config.password);
    await page.click('button[type=submit]');

    await page.waitForNavigation();
    await page.goto(this.resolveUrl());
    await wait(2000);

    await page.click('.page-content-body .portlet-title .dataTables_length button');
    await wait(2000);

    await page.click('.page-content-body .portlet-title .dataTables_length .dropdown-menu ul li:last-child a');
    await wait(2000);

    const result = await this.extractedEvaluateCall(page);
    await browser.close();
    return result;
  }

  private async extractedEvaluateCall(page) {
    return page.evaluate(() => {
      let dates = [];
      let elements = document.querySelectorAll('.table-responsive tbody tr') as NodeListOf<any>;
      for (const element of elements) {
        let date = [];
        for (let index = 0; index < element.childNodes.length; index++) {
          if (index == 4) {
            date.push(parseFloat(element.childNodes[index].innerText.replace(/,/g, '')));
          } else {
            date.push(element.childNodes[index].innerText);
          }
        }
        dates.push(date);
      }
      return dates;
    });
  }

  private resolveUrl() {
    return `${this.config.scrapUrl}/list?type=dates&startDate=${this.config.startDate}&endDate=${this.config.endDate}`;
  }
}
