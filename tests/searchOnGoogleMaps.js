import { t } from 'testcafe';
import { common } from '../utils/common';
import { elements } from '../Pages/elements';

fixture`Grap a data from Google maps`
    .page`https://www.google.com`;

test('Search and store all available details from google maps', async t => {
    
    let SearchUrl = `https://www.google.com/maps/search/surat+dental/@21.2000848,72.7744555,13z`;
    const fileName = await common.getFullFilePath(await common.getUniqueFileName('Dental Clinic In Surat'));

    await t.navigateTo(SearchUrl);
    await t.maximizeWindow();

    console.log('wait for 10 sec');
    await t.wait(10000);
    console.log('end of wailt 10 sec');
    

    let isNextPageHasData = false;
    let noOfPageToNavigate = 1;
    do {
        isNextPageHasData = false;
        await iterateAllResultItem(fileName);
        let nextPageButton = elements.googleMaps.result_Next_Page;


        console.log('is visible');
        console.log(await nextPageButton.visible);
        if (await nextPageButton.visible) {
            console.log('found it is visible');
            await t.click(nextPageButton).wait(8000);
            isNextPageHasData = true;
        }
        noOfPageToNavigate --;
    } while (isNextPageHasData && noOfPageToNavigate > 0)

});


async function iterateAllResultItem(fileName) {
    let searchResultItems = elements.googleMaps.result_Panel;
    console.log(await searchResultItems.count);
    let resultItemCount = 1 || await searchResultItems.count

    for (let i = 0; i <resultItemCount; i++) {
        await t.click(searchResultItems.nth(i)).wait(3000);

        let obj = {
            Name: await common.getInnerText(elements.googleMaps.result_Title),
            Address: await common.getInnerText(elements.googleMaps.result_Address),
            Phone: await common.getInnerText(elements.googleMaps.result_Phone),
        };
        await common.addContentInFile(fileName, JSON.stringify(obj));
        await t.click(elements.googleMaps.back_To_Result).wait(3000);
    }
}

