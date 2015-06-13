/// <reference path='../bluebird/bluebird.d.ts' />
declare module "ls-events" {
	export function pub(event: Event): Promise<{}>;
	export function psub(channel: string, callback: (channel: string, pattern: string, message: string) => void): Promise<{}>;
	export function sub(channel: string, callback: (channel: string, message: string) => void): Promise<{}>;
	export function fetch(context?: string, event?: string, key?: string): Promise<any>;
	export function setHost(hostname: string, port?: number);

	export interface Event {
		event: string;
		context: string;
		data: any;
		key: string|number;
	}
}