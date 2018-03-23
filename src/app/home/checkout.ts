import { Owner } from './owner';
export interface ICheckout {
    id: number;
    server: string;
    clientCode: string;
    startDate: string;
    endDate: string;
    permanent: boolean;
    jira: string;
    hdEvent: string;
    notes: string;
    owners: Owner[];
}

export class Checkout implements ICheckout {

    constructor(public id: number,
        public server: string,
        public clientCode: string,
        public startDate: string,
        public endDate: string,
        public permanent: boolean,
        public jira: string,
        public hdEvent: string,
        public notes: string,
        public owners: Owner[]
        ) {
    }
}
