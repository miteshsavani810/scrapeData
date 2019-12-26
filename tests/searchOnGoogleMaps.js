import { Selector, t } from 'testcafe';
import { common } from '../utils/common'

const fs = require('fs');
fixture`Grap a data from Google maps`
    .page`https://www.google.com/maps/search/surat+dental/@21.2000848,72.7744555,13z`;

test('fetch all name and address form google maps', async t => {
    const SearchInput = await Selector('input[aria-label="Search Google Maps"]');

    const searchString = `surat Dental`;

    console.log('wait for 10 sec');
    await t.wait(10000);
    console.log('end of wailt 10 sec');
    await t.maximizeWindow();
    //await t.typeText(SearchInput, searchString).wait(10000);
   /*  do {
        await t.hover(Selector('button.searchbox-searchbutton'));
        await t.click(Selector('button.searchbox-searchbutton')).wait(8000);
    } while (!await Selector('div.section-result').exists);
    */ //await t.click(Selector('button.searchbox-searchbutton')).wait(1000);
    //await t.debug();

    let clinicData = {
        name: null,
        address: null,
        phone: null
    };

    const fileName = 'Dental Clinic In Surat ' + await common.getTimeStamp() + '.txt';
    let isNextPageHasData = false;
    do {
        isNextPageHasData = false;
        let data = await iterateAllResultItem(fileName);
        let nextPageButton = Selector(`span[class*='button-next-icon']`).parent('button');
        let nextPageButtonEnabled = !(await Selector(`//span[contains(@class,'button-next-icon')]`).parent('button').filter((node,idx) => {
            return node.classNames.indexOf('disabled') > 1;
        }));
        console.log('is visible');
        console.log(await nextPageButton.visible);
        if (await nextPageButton.visible) {
            console.log('found it is visible');
            await t.click(nextPageButton).wait(8000);
            isNextPageHasData = true;
        }
    } while (isNextPageHasData)

});


async function iterateAllResultItem(fileName) {
    let searchResultItems = Selector('div.section-result');
    console.log(await searchResultItems.count);

    let clinicDataArray = [];
    for (let i = 0; i < await searchResultItems.count; i++) {
        await t.click(searchResultItems.nth(i)).wait(3000);
        let titleLocator = await Selector('h1');
        let addressLocator = await Selector('span[aria-label="Address"]').sibling('span.section-info-text');
        let phoneLocator = await Selector('span[aria-label="Phone"][class="section-info-icon"]').sibling(`span.section-info-text`).find(`span[role="text"][class="widget-pane-link"]`);

        let title = await titleLocator.exists ? await titleLocator.innerText : '' ;
        let address = await addressLocator.exists ? await addressLocator.innerText : '';
        let phone = await phoneLocator.exists ? await phoneLocator.innerText : '';

        console.log('title', title);
        console.log('address', address);
        console.log('phone', phone);
        let obj = {
            name: title,
            address: address,
            phone: phone
        };
        clinicDataArray.push(obj);
        fs.appendFileSync(fileName, JSON.stringify(obj));
        await t.click(Selector('span').withText('Back to results')).wait(3000);
    }

    return clinicDataArray;
}

