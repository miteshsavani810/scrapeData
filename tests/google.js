import { Selector, t } from 'testcafe';
import { common } from '../utils/common'

const fs = require('fs');
fixture `Grap a emails from Google`
    .page `http://www.google.com`;

test('fetch all emails form google searh', async t => {
    const searchString = `site:facebook.com "doctors" "pune" "@gmail.com"`;
    const fileName = 'Google_All_' + await common.getTimeStamp() + '.txt';

   
    let inputSearchStringArray = await readInputFile('InputEmailSearch.txt') || [];
console.log(inputSearchStringArray);
    for (let i=0; i<inputSearchStringArray.length; i++) {
        await searchAndFetchData(inputSearchStringArray[i], fileName);
    }

/* 
    await t.typeText(googleSearchInput, searchString);
    await t.pressKey('enter').wait(5000);

    let pageSourchData = await Selector('body').innerText;
    let emailsArray = await common.extractEmails(pageSourchData) || [];
    await storeData(fileName, emailsArray);
     
    try {
        while(await nextButtonSelector.visible) {
            await t.hover(await nextButtonSelector);
            await t.click(await nextButtonSelector);
            pageSourchData = await Selector('body').innerText;
            emailsArray = await common.extractEmails(pageSourchData);
            await storeData(fileName, emailsArray);
        }
    }catch (e) {
        console.log('error', e);
    } */

    console.log('Data store in file: ', fileName);

   
});

async function readInputFile(fileName) {
    return fs.readFileSync(fileName).toString('utf8').split('\n');
}

async function storeData(fileName, data) {
    fs.appendFileSync(fileName, data.join('\n'));
}

async function searchAndFetchData(searchString, storeFileName ) {
    const googleSearchInput = await Selector('input[title="Search"]');
    const nextButtonSelector = await Selector('div[id="navcnt"]').find('span').withText('Next');

    await t.navigateTo('https://www.google.com').wait(8000);
    await t.typeText(googleSearchInput, searchString);
    await t.pressKey('enter').wait(5000);

    let pageSourchData = await Selector('body').innerText;
    let emailsArray = await common.extractEmails(pageSourchData) || [];
    await storeData(storeFileName, emailsArray);
     
    try {
        while(await nextButtonSelector.visible) {
            await t.hover(await nextButtonSelector);
            await t.click(await nextButtonSelector);
            pageSourchData = await Selector('body').innerText;
            emailsArray = await common.extractEmails(pageSourchData);
            await storeData(storeFileName, emailsArray);
        }
    }catch (e) {
        console.log('error', e);
    }
}

