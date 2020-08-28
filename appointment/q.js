const time = "2020-08-21T14:00:00+09:00"
const date = "2020-08-21T12:00:00+09:00"
const timeZoneOffset = '+09:00'
const dateTimeStart = new Date(Date.parse(date.split('T')[0] + 'T' + time.split('T')[1].split('+')[0] + timeZoneOffset))
console.log(dateTimeStart)


console.log(date.split('T')[0])
console.log(time.split('T')[1])
console.log(time.split('T')[1].split('-')[0])

console.log(dateTimeStart.toISOString())
// import functions from 'firebase-functions'
// import {WebhookClient, Payload, Card, Suggestion} from 'dialogflow-fulfillment'
import request from 'request-promise-native'
const api_key = '45B1B5C28EB675B4AEC2C2928290F0C5'
const uri = 'https://cloudhospitalsearch.search.windows.net/indexes/idx-hospitals-prd/docs/search?api-version=2020-06-30'
const query_string = 'https://cloudhospitalsearch.search.windows.net/indexes/idx-hospitals-prd/docs?api-version=2020-06-30&search=cancer + korea&$select=Name'
async function searchHospitalsBySpecialty(keyword){
    let options = {
        method: 'POST',
        uri: uri,
        json: true,
        body: {
            // 'search': "cancer + korea",
            'search': "Country:korea AND \"lung cancer\"^3",
            'queryType': "full",
            'searchMode': "any",
            'select':"Name, Id",
        },
        headers:{
            'api-key': '45B1B5C28EB675B4AEC2C2928290F0C5',
            'content-type': 'application/json'
        }
    }

    // "search": "country:korea" AND \"lung cancer\"^3"
    const response = await request(options)
    // console.log(response)
    return response.value
  }

// exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, respnse) => {
//     const agent = new WebhookClient({request, response})
//     agent.add()
//     function welcome(agent) {
        
//     }

// })
searchHospitalsBySpecialty('lung cancer').then(d => console.log(d))

// searchHospitalsBySpecialty('cancer')

async function getSearchResult(){
    let options = {
        uri: 'https://cloudhospitalsearch.search.windows.net/indexes/idx-hospitals-prd/docs?api-version=2020-06-30&search=cancer',
        headers: {
            'api-key': 'api_key',
            'content-type': 'application/json'
        },
        json: true
    }

    const response = await request(options)

    return response.data;
}
// getSearchResult().then(d => console.log(d))
