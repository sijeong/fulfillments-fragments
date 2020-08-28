'use strict';

const functions = require('firebase-functions');
const { google } = require('googleapis');
const { WebhookClient } = require('dialogflow-fulfillment');
const request = require('request-promise-native');
const calendarId = 'c_isqfdr0li1ulr4ovfdi2hnorao@group.calendar.google.com';
const serviceAccount = {
  type: 'service_account',
  project_id: 'appointmentscheduler-kfdc',
  private_key_id: '38a25f37eb79634f5a010f683c5be5f882a3fd59',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3nmtcM9WLocF0\n2kC9Ar/Ebx5j8385llKoDMykagFbsExpJz5T9jom9GTSKxUkL2evEPEwUBe0PfUT\nlVPikqzw1VKf6OD+tSbn8FoHnqU9Ft8FbfhVppWW0pXtZCan/YY30JmlWqElSrlf\nyHyhfqZ6v4cGD4z2NESw502X/f5saYgLqX0qnpzvCnmOoouFSRUscSuvLSW6+su/\nV29Ti+1mo1xApAD0ZKYaqXqlpwNeI6nfaP4V+E6CCdT02ohQ6ffxxw2lSiniS8gD\nLmbqSXJ3Il5FruIlboUTd/mXWGfsfKtLzgDbhSsMzwd8/8nE88ppZzUfZctTOCev\nKJZTSF2bAgMBAAECggEALdRrHITNgH/7nrRY4zQ79AX+Ell0wEVeVRZ4v3K76wwq\nTjaezmsPIajvPyvEp5bzbJUwdewPtoueT2h+mvccFjJQYJxKCBjj4JEzj2JQANrk\nCGFl0c712EKwbCOKqHRVWzoEF2ry/LFVamxKey520/1Y8LDR8KOkH3lj+xNIvPr/\ni3k6yvUpXrOZ++Qt9lWXdu/lMPmtoWFtxt9SbfaocZBEwwZXrhZ+Bm9uZYv/0VIg\nGkUJym1p6XiBrOLoKlTBqRBjDFVp6OlTUYdbzh6r/9Mgt3c9PjCm2CTykU9b7vVf\nNiL58oDz4EhLB7gp+qmGSTT6YAOeD45Ua4jjJP0rIQKBgQDqe56NKGiGO+MLkZE0\nE+J210Xd474n9eiwhxa9YXKt6vLojl1p60Km6tLB40zv6XTmPma6TrL1reeIcF2F\nh0K/pk8RZZ2BTCxskKbWg3LbPU39+kHLHd4GsulrBFaIImtkpuETU1HJfRp5GmLn\nMcNrJ9kXMSLV5WbA0MWBZXih+wKBgQDId+vaEmD3JKKIN/USUrmzidWr0uKZNzMg\nQyLOXLkMBX6px371joyM2smuB/9UbE2Fq8YopizTUVB1C7KqzESdgBeV4mgxQ2or\ngUL0qG/YNL/DmCsK2M2NhaS+6f4vSbboi+3TkYek7qkybn0GlsvZ12MZypQ2xi5t\ne6r5+yYA4QKBgQDZZgfYZDCU1A1remkf2ZfMC0dRtIdnUU2N7ZGdwC2tJfpUtznQ\nrDi9vVXuQanhfZfOqOhhr/moYrYZ/+QVmxS9z5nbTVU8vb0qYursVC83KZ2X7mD1\nyxlBKLvVZs47pX3gcgCYBFX986mJwncUV0URon5aTEo5+ljMSEP19nhj5QKBgBMB\n++TzdSo52QdddulD2sPBP/dIyZ+JclmOxBAZDpqrMrVaaxlRaNY6MIFF1NnmYvtX\nrDRSfVGUFjLi5w/2ylK8wH+/te1l3P0/BmA4UFKJvd0H4pzmrabLkzFe8nD9ZlBq\nZCR5Wgkzb+uOOmCTj8SZ/ZWGdcMzy1cqMK3/OD1BAoGBALyJ3xUgwEe4JOQoXYs2\n4z/mA+zKPb2fXnzLSeKOyd44P+r5vgmjk9kzx0yMdzD2xntDadd1GlMkA3/imW4V\nzFc93kfJfReGZyIKXHmkTEZm7TJmnhMYsLYEh4WOT0Cp8bm1DXRqmZppH+XHH+t+\nz5Ma8meXmZ5EZb0Z0gs+i1+E\n-----END PRIVATE KEY-----\n',
  client_email:
    'dialogflow-vwlebv@appointmentscheduler-kfdc.iam.gserviceaccount.com',
  client_id: '102720656207486223817',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/dialogflow-vwlebv%40appointmentscheduler-kfdc.iam.gserviceaccount.com',
};
const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar',
});

const calendar = google.calendar('v3');
process.env.DEBUG = 'dialogflow:*';

const timeZone = 'Asia/Tokyo';
const timeZoneOffset = '+09:00';

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Parameters', agent.parameters);
    const appointment_type = agent.parameters.AppointmentType;
    function makeAppointment(agent) {
      const dateTimeStart = new Date(
        Date.parse(
          agent.parameters.date.split('T')[0] +
            'T' +
            agent.parameters.time.split('T')[1].split('-')[0] +
            timeZoneOffset
        )
      );
      const dateTimeEnd = new Date(
        new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1)
      );
      const appointmentTimeString = dateTimeStart.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        timeZone: timeZone,
      });

      return createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type)
        .then(() => {
          agent.add(
            `Ok, let me see if we can fit you in. ${appointmentTimeString} is fine!.`
          );
        })
        .catch((err) => {
          console.log('Error', err);
        //   agent.add(
        //     `I'm sorry, there are no slots available for ${appointmentTimeString}`
        //   );
            agent.add(err);
        });
    }
	function handleSearchTextMode(agent){
      
    }
    function handleSelection(agent){
      console.log(agent.parameters.selection);
      switch(agent.parameters.selection){
        case '__search__':
          agent.add('What specialty (or specialty type) are you looking for?');
          break;
        case '__text_mode__':
          agent.add('Hi. How can I help you?');
          break;
        case '__issues__':
          agent.add('Please describe your technical issues here. Our export will send you feedback ASAP.');
          break;
        case '__contact__':
          agent.add('Our English speaking Doctor Corrdinator Dr. Kim Irina is in chat with you now. Please describe your situation');
          break;
        default:
          agent.add('default message');
      //agent.add(`You choose ${agent.parameters.selection}.`);
    }
    
      function telegramIntegration(agent){
      const ClientResponse = {
        "ClientResponse":[
          {
            "payload":{
              "telegram":
              {
                "text": "Please share your contact", 
                "reply_markup":{
                  "keyboard":[
                    [
                      {
                        "text": "Share my phone number",
                        "callback_data": "phone",
                        // "request_contact": true
                      }
                    ],
                    [
                      {
                        "text": "Cancel",
                        "callback_data": "Cancel"
                      }
                    ]
                  ]
                }
              }
            }
          }
        ]
      };

      response.send(JSON.stringify(ClientResponse));
    }
    }
    let intentMap = new Map();
    intentMap.set('search_text_mode', telegramIntegration);
    intentMap.set('handle_intro', handleSelection);
    intentMap.set('Schedule Appointment', makeAppointment);
    //intentMap.set('search', search);
    
    agent.handleRequest(intentMap);
  }
);

const uri = 'https://cloudhospitalsearch.search.windows.net/indexes/idx-hospitals-prd/docs/search?api-version=2020-06-30';
async function searchHospitalsBySpecialty(keyword){
    let options = {
        method: 'POST',
        uri: uri,
        json: true,
        body: {
            'search': "cancer",
            'queryType': "full",
            'searchMode': "all",
            'select':"Name",
        },
        headers:{
            'api-key': '45B1B5C28EB675B4AEC2C2928290F0C5',
            'content-type': 'application/json'
        }
    };

    const response = await request(options);
    // console.log(response)
    return response.value;
  }
function createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type) {
  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        auth: serviceAccountAuth,
        calendarId: calendarId,
        timeMin: dateTimeStart.toISOString(),
        timeMax: dateTimeEnd.toISOString(),
      },
      (err, calendarResponse) => {
        if (err || calendarResponse.data.items.length > 0) {
          reject(
            err ||
              new Error('Requested time conflicts with another appointment')
          );
        } else {
          calendar.events.insert(
            {
              auth: serviceAccountAuth,
              calendarId: calendarId,
              resource: {
                summary: appointment_type + ' Appointment',
                description: appointment_type,
                start: { dateTime: dateTimeStart },
                end: { dateTime: dateTimeEnd },
              },
            },
            (err, event) => {
              err ? reject(err) : resolve(event);
            }
          );
        }
      }
    );
  });
}
