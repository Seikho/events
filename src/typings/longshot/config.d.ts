declare module NodeJS {
	export interface Global {
		longshotConfig: any;
	}
}

declare module "ls-config" {
	export function config(key: string, value?: any): any;
}