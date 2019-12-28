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

    async getFullFilePath(fileName) {
        if (process.env.CIRCLECI) {
            let dir = '../Data';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            return path.join(__dirname, '../Data/' + fileName);// + await common.getTimeStamp() + '.txt');
        }

        return path.join(__dirname, '../LocalRunData/' + fileName);// + await common.getTimeStamp() + '.txt');

    }

    async getUniqueFileName(fileName) {
        return fileName + await this.getTimeStamp() + '.txt';
    }

    async addContentInFile(file, data) {
        fs.appendFileSync(file, data);
    }

    async getInnerText(locator) {
        return await locator.exists ? await locator.innerText : '';
    }

    async readInputFile(fileName) {
        return fs.readFileSync(fileName).toString('utf8').split('\n');
    }
}

export const path = require('path');
export const fs = require('fs');
export let common = new Common();
