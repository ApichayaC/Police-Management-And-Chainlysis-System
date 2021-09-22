// 'use strict'

// class PoliceController {
// }

// module.exports = PoliceController
'use strict'
const Police = use ("App/Models/Police") 
const Database =use ("Database")
class PoliceController {
    async show({request, response}){
        const polices = await Database.table("police").select("*") ;
        response.send(polices)
         //const plc = await Police.query().with('police').fetch()
        response.send(polices)

    }

    //get:id
    async getID({request,response,params}){
        const police = await Police.find(params.id);
        response.send(police)

    }
    //post
    async store({ request, response }) {
        const body = request.all()
        const newPolice = new Police();
        
        newPolice.rank = body.rank ;
        newPolice.name = body.name ;
        newPolice.surname = body.surname ;       
        newPolice.position = body.position ;
        newPolice.dob = body.dob ;
        newPolice.education = body.education ;
        newPolice.training = body.training ;
        newPolice.civil_history = body.civil_history ;
        newPolice.civil_year = body.civil_year ;
        newPolice.reward = body.reward ;
        newPolice.appoint = body.appoint ;
        newPolice.telephone = body.telephone ;

        await newPolice.save();
        return response.send("PASS");
      }

    //update
    async update ({ request, response ,params}){
        const police = await Police.find(params.id);
        const body = request.all()
        police.rank = body.rank ;
        police.name = body.name ;
        police.surname = body.surname ;
        police.position = body.position ;
        police.dob = body.dob ;
        police.education = body.education ;
        police.training = body.training ;
        police.civil_history = body.civil_history ;
        police.civil_year = body.civil_year ;
        police.reward = body.reward ;
        police.appoint = body.appoint ;
        police.telephone = body.telephone ;
        await police.save()
        return response.send("PASS!!")
    }
    
    //delete
    async delete ({request ,response,params}){
        const police = await Police.find(params.id);
        await police.delete() ;
        return response.send("OK, Delete PASS!!")
    }
}

module.exports = PoliceController
