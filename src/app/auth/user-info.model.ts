export interface IUserInfo
{
	login: 				string;
	password?: 			string;
	repeatPassword?: 	string;
	ssid?: 				string;
	picture?: 			string;
	name?: 				string;
	email?: 			string;
	created_at?: 		string;
	updated_at?: 		string;
	address?:	 		string;
}

export class UserInfo implements IUserInfo
{
	constructor(
		public login: string 			= '',
		public password: string 		= '',
		public repeatPassword: string 	= '',
		public ssid: string 			= '',
	) {}
	
	public toString() : string {
		return `UserInfo with login=${this.login} and event ssid=${this.ssid}`;
	}
}