export abstract class BaseService {

	/*
		MONTAR BASE URL REST API: A Navegação de routes não deve ser usada como path para REST.
	*/
	readonly nameService = '/area';
	readonly pathApi = '/api/';
	readonly baseUrlRestApi: string = location.origin + this.nameService + this.pathApi;	

	doPathParamRest(pathParam: any): string {
		return this.baseUrlRestApi + pathParam;
	}
}