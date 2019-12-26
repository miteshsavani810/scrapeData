import { Selector, t } from 'testcafe';
import { common } from '../utils/common'

const fs = require('fs');
fixture`Grap a emails from SearchEngine`
    .page`https://www.google.in/`;

test('fetch all emails from Google searh', async t => {
    const searchInput = await Selector('input[title="Search"]');
    const searchString = `site:linkedIn.com "QA Tester" "pune" "@gmail.com"`;
    let nextButton = await Selector('div[id="navcnt"]').find('span').withText('Next');

    await searchAndSaveGrapEmails('Google_All', 'https://www.google.com', searchString, searchInput, nextButton);

});

test('fetch all emails from Yahoo searh', async t => {
    const searchInput = await Selector('input[type="text"]');
    const searchString = `site:linkedIn.com "QA Tester" "pune" "@gmail.com"`;
    let nextButton = await Selector('div.compPagination').find('a').withText('Next');

    await searchAndSaveGrapEmails('Yahoo_All', 'https://in.search.yahoo.com', searchString, searchInput, nextButton);

});

test('fetch all emails from Bing searh', async t => {
    const searchInput = await Selector('input[type="Search"]');
    const searchString = `site:linkedIn.com "QA Tester" "pune" "@gmail.com"`;
    let nextButton = await Selector('li.b_pag').find('a').withText('Next');

    await searchAndSaveGrapEmails('Bing_All', 'https://www.bing.com', searchString, searchInput, nextButton);

});

async function searchAndSaveGrapEmails(engineName, website, searchString, searchTextSelector, nextButtonSelector) {

    await t.wait(2000);
    await t.navigateTo(website)
    await t.typeText(searchTextSelector, searchString);
    await t.pressKey('enter').wait(5000);

    let listOfEmails = [];

    let pageSourchData = await Selector('body').innerText;
    let emailsArray = await common.extractEmails(pageSourchData) || [];
    listOfEmails = [...listOfEmails, ...emailsArray];
    let foundNothingCount = 0;
    try {
        while (await nextButtonSelector.visible && foundNothingCount < 3) {
            await t.hover(nextButtonSelector);
            await t.click(nextButtonSelector).wait(5000);
            pageSourchData = await Selector('body').innerText;
            emailsArray = await common.extractEmails(pageSourchData);
            if (emailsArray.length === 0) foundNothingCount++;
            listOfEmails = [...listOfEmails, ...emailsArray];
        }
    } catch (e) {
        console.log('error', e);
    }
    console.log(listOfEmails);

    const fileName = '../Data/Google_Search/'+ engineName + '_' + await common.getTimeStamp() + '.txt';
    fs.appendFileSync(fileName, listOfEmails.join('\n'));
};