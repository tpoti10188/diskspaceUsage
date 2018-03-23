export interface IOwner {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    client: boolean;
    primary: boolean;
    alert: boolean;
    checkoutID: number;
}
export class Owner implements IOwner {
    constructor(public id: number,
        public firstName: string,
        public lastName: string,
        public email: string,
        public department: string,
        public client: boolean,
        public primary: boolean,
        public alert: boolean,
        public checkoutID: number
        ) {
    }
}
