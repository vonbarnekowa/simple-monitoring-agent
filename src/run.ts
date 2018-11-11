import * as Cron from 'cron';
import * as request from 'request';

import {Constants} from './Constants';
import {log} from './log';

let crons = new Array();

const getDataFromApi = () => {
  request(Constants.API_URL + Constants.API_GET_ALL_URL, ((error, response, body) => {
     if (error) {
       log.error(error);
     }
     if (response && response.statusCode == 200) {
       if (crons.length > 0) {
         crons.forEach((cron: Cron.CronJob) => {
           cron.stop();
         });
         crons = new Array();
       }
       JSON.parse(body).forEach((monitor: any) => {
         let cron = '';

         switch (monitor.frequency) {
           case '1':
             cron = '0 0 * * *';
             break;
           case '2':
             cron = '0 0,12 * * *';
             break;
           case '4':
             cron = '0 0,6,12,18 * * *';
             break;
           case '8':
             cron = '0 0,3,6,9,12,15,18,21 * * *';
             break;
           case '16':
             cron = '30 1-22/3 * * *';
             break;
           case '32':
             cron = '0,45 0,3,6,9,12,15,18,21 * * *';
             break;
           case '48':
             cron = '0,30 * * * *';
             break;
           case '144':
             cron = '0,15,30,45 * * * *';
             break;
           case '288':
             cron = '0,10,15,20,25,30,35,40,45,50,55 * * * *';
             break;
           case '1440':
             cron = '* * * * *';
             break;
           default:
             cron = '* * * * *';
         }
         crons.push(new Cron.CronJob(cron,
           () => {
             check(monitor);
           }, null, true, 'Europe/Zurich'));
         log.info('Cron ' + monitor.name + ' configured');
       });
     } else {
       log.error('Error during request');
     }
    }
  ));
  setTimeout(getDataFromApi, 10 * 60 * 1000);
};

const check = (monitor: any) => {
  let isUp = false;
  request(monitor.address, (error: Error, response: request.Response, body: any) => {
    if (response && response.statusCode == 200) {
      isUp = true;
    }
    request.post({url: Constants.API_URL +
        Constants.API_POST_FEEDBACK_URL.replace('{monitor_id}', monitor._id), body:
        {date: Date(), is_up: isUp, agent_id: monitor._id}, json: true},
        ((postError: Error, postResponse: request.Response, postBody: any) => {
          if (postError) {
            log.error(postError);
          }
          if (postResponse && postResponse.statusCode == 200) {
            log.info('Uploaded status for ' + monitor.name);
          } else {
            log.error('Error during request1');
          }
        }
    ));
  });
};

getDataFromApi();
