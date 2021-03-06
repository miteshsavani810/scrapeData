import { Selector, t } from 'testcafe';
import { common } from '../utils/common'

const fs = require('fs');
fixture `Grap a emails from bing`
    .page `https://www.bing.com/`;

test('fetch all emails form bing searh', async t => {
   const googleSearchInput = await Selector('input[type="Search"]');
    const searchString = `site:facebook.com "doctors" "pune" "@gmail.com"`;
    let nextPage = await Selector('li.b_pag').find('a').withText('Next');

    await t.wait(8000);
    await t.typeText(googleSearchInput, searchString);
    await t.pressKey('enter').wait(5000);

    let listOfEmails = [];

    let pageSourchData = await Selector('body').innerText;
    let emailsArray = await common.extractEmails(pageSourchData) || [];
    listOfEmails = [...listOfEmails, ...emailsArray];
    let foundNothingCount = 0;
    try {
        while(await nextPage.visible && foundNothingCount < 3) {
            await t.hover(nextPage);
            await t.click(nextPage).wait(5000);
            pageSourchData = await Selector('body').innerText;
            emailsArray = await common.extractEmails(pageSourchData);
            if (emailsArray.length === 0) foundNothingCount ++;
            listOfEmails = [...listOfEmails, ...emailsArray];
        }
    }catch (e) {
        console.log('error', e);
    }
   console.log(listOfEmails);

   const fileName = 'bing_' + await common.getTimeStamp() + '.txt';
   fs.appendFileSync(fileName, listOfEmails.join('\n'));
   
});