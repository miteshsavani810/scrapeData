import { Selector, t } from 'testcafe';
import { common, path } from '../utils/common'

const fs = require('fs');
fixture `Grap a emails from Yahoo`
    .page `https://in.search.yahoo.com/`;

test('fetch all emails form yahoo searh', async t => {
   const googleSearchInput = await Selector('input[type="text"]');
    const searchString = `site:facebook.com "doctors" "pune" "@gmail.com"`;
    let nextPage = await Selector('div.compPagination').find('a').withText('Next');

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
            //console.log('Email address', emailsArray);
            foundNothingCount = 5;;
            if (emailsArray.length === 0) foundNothingCount++ ;
            listOfEmails = [...listOfEmails, ...emailsArray];
        }
    }catch (e) {
        console.log('error', e);
    }
   console.log(listOfEmails);

   const fileName = path.join(__dirname, '../Data/Google_Search/Yahoo_' + await common.getTimeStamp() + '.txt');
   //fs.appendFileSync(fileName, listOfEmails.join('\n'));
   await addContentInFile(fileName, listOfEmails.join('\n'));
   
});

async function addContentInFile(file, data) {
	fs.writeFileSync(file, data, (error) => {
		if (error) {
			return console.log(error);
		}
	});
}