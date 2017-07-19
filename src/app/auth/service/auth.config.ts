export interface IAuthConfiguration
{
	clientId: 		string;
	domain: 		string;
	callbackURL?: 	string;
	accessToken: 	string;
	tokenId: 		string;
	profileKey: 	string;
}

export const AUTH_DI_CONFIG: IAuthConfiguration =
{
    clientId: 		'HQJTvyR0o8t9s6JOJDUHAsgB2YT3l79U',//'{CLIENT_ID}',
    domain: 		'alexander-rogalsky.auth0.com',//'{DOMAIN}',
    callbackURL: 	'http://localhost:3000/',//'{CALLBACK}',
	accessToken: 	'accessToken',
	tokenId: 		'id_token',
	profileKey: 	'profile',
};