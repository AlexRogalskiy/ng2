import { AUTH_DI_CONFIG, IAuthConfiguration } from './auth/service/auth.config';

export interface IAppConfiguration
{
	apiUrl: 		string;
	storageKey: 	string;
	authConfig: 	IAuthConfiguration;
}

// venue API URL to fetch data from
export const VENUE_DI_CONFIG: IAppConfiguration =
{
	apiUrl: 	    'http://172.16.17.91:8080/venue-api/external-api/event',
	storageKey: 	'venue',
	authConfig:		AUTH_DI_CONFIG,
};