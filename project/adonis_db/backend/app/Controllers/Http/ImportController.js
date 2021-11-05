'use strict'
const Police = use('App/Models/Police')
const Helpers = use('Helpers')
const Excel = require('exceljs')

class ImportController {
    async import({ request, response }) {
        let upload = request.file('upload')
        let fname = `${new Date().getTime()}.${upload.extname}`
        let dir = 'upload/'

        //move uploaded file into custom folder
        await upload.move(Helpers.tmpPath(dir), {
            name: fname
        })
        if (!upload.moved()) {
            console.log('error')
            return (upload.error(), 'Error moving files', 500)
        }
        var workbook = new Excel.Workbook()
        let explanation = await workbook.csv.readFile('tmp/' + dir + fname)
        let colComment = explanation.getColumn('C') //column name

        colComment.eachCell(async (cell, rowNumber) => {
            if (rowNumber > 1) {
                try {
                    const newPolice = new Police();

                    //console.log(explanation.getRow(rowNumber).values);
                    newPolice.rank = explanation.getCell('B' + rowNumber).value;
                    newPolice.name = explanation.getCell('C' + rowNumber).value;
                    newPolice.surname = explanation.getCell('D' + rowNumber).value;
                    newPolice.position = explanation.getCell('E' + rowNumber).value;
                    newPolice.dob = explanation.getCell('H' + rowNumber).value;
                    newPolice.education = explanation.getCell('AH' + rowNumber).value + ',' + explanation.getCell('AI' + rowNumber).value + ',' + explanation.getCell('AJ' + rowNumber).value + ',' + explanation.getCell('AK' + rowNumber).value;
                    newPolice.telephone = explanation.getCell('AF' + rowNumber).value;
                    newPolice.training = explanation.getCell('BX' + rowNumber).value;
                    newPolice.civil_history = explanation.getCell('BY' + rowNumber).value;
                    newPolice.civil_year = explanation.getCell('BZ' + rowNumber).value;
                    newPolice.reward = explanation.getCell('CA' + rowNumber).value;
                    newPolice.appoint = explanation.getCell('CB' + rowNumber).value;

                    newPolice.idCard = explanation.getCell('F'+rowNumber).value;
                    newPolice.idPosition = explanation.getCell('AQ'+rowNumber).value;


                    await newPolice.save();
                } catch (error) {
                    response.send(error)
                }
            }
        })
        return response.send("PASS");
    }
}

module.exports = ImportController
