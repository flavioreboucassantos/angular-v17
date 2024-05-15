export abstract class BaseService {

	/*
		MONTAR BASE URL REST API: A Navegação de Routes não deve ser usada como path para REST.
	*/	
	readonly protocol = 'http:';
	readonly host = 'localhost:8080';
	readonly settedOrigin = this.protocol + '//' + this.host;
	
	readonly nameService = '/area';
	readonly pathApi = '/api/';

	readonly baseUrlRestApi: string = origin + this.nameService + this.pathApi;
	readonly baseUrlRestApiSettedOrigin: string = this.settedOrigin + this.nameService + this.pathApi;

	doPathParamRest(pathParam: any): string {
		return this.baseUrlRestApi + pathParam;
	}
}