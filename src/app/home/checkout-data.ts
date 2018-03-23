import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Owner} from './owner';
import { Checkout } from './checkout';
export class CheckoutData implements InMemoryDbService {

    createDb() {
        const Owners1: Owner[] = [
            {
                'id': 1,
                'firstName': 'Stellar',
                'lastName': 'Lumens',
                'email': 'SLumens@XLM.com',
                'department': 'XLM',
                'client': true,
                'primary': false,
                'alert': false,
                'checkoutID': 1
              },
              {
                'id': 2,
                'firstName': 'Ripple',
                'lastName': 'Zerps',
                'email': 'Ripple@XRP.com',
                'department': 'XRP',
                'client': false,
                'primary': true,
                'alert': true,
                'checkoutID': 1
              }];
        const Owners2: Owner[] = [{
                'id': 3,
                'firstName': 'Bitcoin',
                'lastName': 'Sucks',
                'email': 'Bitcoin@BTC.com',
                'department': 'BTC',
                'client': false,
                'primary': true,
                'alert': false,
                'checkoutID': 2
              },
              {
                'id': 4,
                'firstName': 'Nebulas',
                'lastName': 'Hitter',
                'email': 'Nebulas@NAS.com',
                'department': 'NAS',
                'client': false,
                'primary': false,
                'alert': true,
                'checkoutID': 2
              }];
        const Owners3: Owner[] = [{
                'id': 5,
                'firstName': 'Tron',
                'lastName': 'Justin',
                'email': 'Tron@TRX.com',
                'department': 'TRX',
                'client': false,
                'primary': true,
                'alert': true,
                'checkoutID': 3
              },
              {
                'id': 6,
                'firstName': 'Mo',
                'lastName': 'Poe',
                'email': 'Poet@POE.com',
                'department': 'POE',
                'client': true,
                'primary': false,
                'alert': false,
                'checkoutID': 3
              }
        ];
        const Owners4: Owner[] = [{
                'id': 7,
                'firstName': 'Monero',
                'lastName': 'IOTA',
                'email': 'Monero@XMR.com',
                'department': 'XMR',
                'client': false,
                'primary': true,
                'alert': true,
                'checkoutID': 4
              },
              {
                'id': 8,
                'firstName': 'NEO',
                'lastName': 'Litecoin',
                'email': 'NEO@NEO.com',
                'department': 'NEO',
                'client': false,
                'primary': false,
                'alert': false,
                'checkoutID': 4
              }
        ];
        const Owners5: Owner[] = [{
                'id': 9,
                'firstName': 'Vechain',
                'lastName': 'Qtum',
                'email': 'Vechain@VEN.com',
                'department': 'VEN',
                'client': true,
                'primary': true,
                'alert': true,
                'checkoutID': 5
              },
              {
                'id': 10,
                'firstName': 'Ethereum',
                'lastName': 'Moon',
                'email': 'Ethereum@ETH.com',
                'department': 'ETH',
                'client': false,
                'primary': false,
                'alert': false,
                'checkoutID': 5
              }
        ];
        const Owners6: Owner[] = [{
                'id': 11,
                'firstName': 'Dragon',
                'lastName': 'Chain',
                'email': 'DragonChain@DRGN.com',
                'department': 'DRGN',
                'client': false,
                'primary': true,
                'alert': true,
                'checkoutID': 6
              },
              {
                'id': 12,
                'firstName': 'Medi',
                'lastName': 'Bloc',
                'email': 'MediBloc@MED.com',
                'department': 'MED',
                'client': false,
                'primary': false,
                'alert': false,
                'checkoutID': 6
              }
        ];
        const checkouts: Checkout[] = [
            {
                'id': 1,
                'server': 'UX04',
                'clientCode': 'FM',
                'startDate': '05/01/2018',
                'endDate': '05/31/2018',
                'jira': 'HEK-100',
                'hdEvent': '869632',
                'notes': 'My First Note goes something like this. But now i am going to make this really long and seee how it looks when I write a crazy long note that take up a ton of text. I would like to time to sit right down and go into detaul I about how to make this crazy form from scrtac',
                'permanent': false,
                'owners': Owners1
              },
              {
                  'id': 2,
                  'server': 'UX04',
                  'clientCode': 'CK',
                  'startDate': '01/01/2018',
                  'endDate': '12/31/2018',
                  'jira': 'HEK-518',
                  'hdEvent': '861456',
                  'notes': 'My First Note goes something like this',
                  'permanent': false,
                  'owners': Owners2
              },
              {
                  'id': 3,
                  'server': 'UX04',
                  'clientCode': 'WR',
                  'startDate': '10/01/2018',
                  'endDate': '11/30/2018',
                  'jira': 'HEK-83',
                  'hdEvent': '864545',
                  'notes': 'My First Note goes something like this',
                  'permanent': true,
                  'owners': Owners3
              },
              {
                'id': 4,
                'server': 'UX04',
                'clientCode': 'SX',
                'startDate': '05/01/2018',
                'endDate': '05/31/2018',
                'jira': 'HEK-673',
                'hdEvent': '864554',
                'notes': 'My First Note goes something like this',
                'permanent': false,
                'owners': Owners4
              },
              {
                  'id': 5,
                  'server': 'UX04',
                  'clientCode': 'GN',
                  'startDate': '01/01/2018',
                  'endDate': '12/31/2018',
                  'jira': 'HEK-671',
                  'hdEvent': '860217',
                  'notes': 'My First Note goes something like this',
                  'permanent': false,
                  'owners': Owners5
              },
              {
                  'id': 6,
                  'server': 'UX04',
                  'clientCode': 'GX',
                  'startDate': '10/01/2018',
                  'endDate': '11/30/2018',
                  'jira': 'HPEDI-877',
                  'hdEvent': '870200',
                  'notes': 'My First Note goes something like this',
                  'permanent': true,
                  'owners': Owners6
              }
        ];
        return { checkouts };
    }
}
