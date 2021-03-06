import { Selector, t } from 'testcafe';
import { common,path } from '../../utils/common';
import { elements } from '../../Pages/elements';

const dataSet = require(path.join(__dirname, '../inputData/InputEmailSearch.json'));
let index = 1;

fixture`Grap a emails from Google`
    .page`http://www.google.com`;


dataSet.forEach(data => {
    data.index = index;
    test(`AAAA ${index} emails for '${data.searchName}' from google`, async t => {
        const fileName = await common.getFullFilePath(`G_${data.index}_${data.searchName}.txt`);
        await searchAndFetchData(`${data.searchString}`, fileName);
        //console.log(`\n\nData of ${data.searchName} is store in File: \n`, fileName);
    
    });
    index = index + 1;
});



async function searchAndFetchData(searchString, fileName) {
    const nextButtonSelector = elements.googleSearch.nextPage;

    await t.navigateTo('https://www.google.com').wait(8000);
    await t.typeText(elements.googleSearch.searchBar, searchString);
    await t.pressKey('enter').wait(5000);

    let isNextPage = false;
    let noOfPage = 10;

    try {
        do {
            let pageSourchData = await Selector('body').innerText;
            let emailsArray = await common.extractEmails(pageSourchData) || [];
            await common.addContentInFile(fileName, emailsArray.join('\n'));

            if (await nextButtonSelector.visible) {
                isNextPage = true;
                await t.hover(await nextButtonSelector);
                await t.click(await nextButtonSelector);
            }
            noOfPage--;
        } while (isNextPage && noOfPage > 0)
    } catch (e) {
        console.log('error', e);
    }
}

