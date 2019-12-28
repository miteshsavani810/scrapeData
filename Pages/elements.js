import {Selector} from 'testcafe';

class Elements {

    googleMaps = {
        back_To_Result: Selector('span').withText('Back to results'),
        result_Panel: Selector('div.section-result'),
        result_Title: Selector('h1'),
        result_Address: Selector('span[aria-label="Address"]').sibling('span.section-info-text'),
        result_Phone: Selector('span[aria-label="Phone"][class="section-info-icon"]').sibling(`span.section-info-text`).find(`span[role="text"][class="widget-pane-link"]`),
        result_Next_Page: Selector(`span[class*='button-next-icon']`).parent('button')
    }

    googleSearch= {
        searchBar: Selector('input[title="Search"]'),
        nextPage: Selector('div[id="navcnt"]').find('span').withText('Next')
    } 
}

export let elements = new Elements();