import { Selector } from "testcafe";

class Common {

    async extractEmails(text) {
        return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) || [];
    }

    async visibleElement(locator) {
        return Selector(locator).filterVisible();
    }

    async getTimeStamp() {
        let dd = new Date();
        return dd.getDate() + '-' + dd.getMonth() + '-' + dd.getFullYear() + '_' +
            dd.getHours() + '' + dd.getMinutes() + '' + dd.getSeconds(); 
    }
}

export let common = new Common();
