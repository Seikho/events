declare module Store {
	export function pub(event: Store.Event): Promise<{}>;
	export function psub(channel: string, callback: (channel: string, pattern: string, message: string) => void): Promise<{}>;
	export function sub(channel: string, callback: (channel: string, message: string) => void): Promise<{}>;
	export function fetch(pattern: string, count?: number): Promise<any>;
	export function setHost(hostname: string, port?: number);

	export interface Event {
		event: Operation;
		context: Context;
		data: any;
		key: string|number;
	}

	export interface User {
		displayName: string;
		username: string;
		email: string;
		password: string;
		enabled: number;
		company?: string;
	}

	export const enum Operation {
		Create,
		Read,
		Update,
		Delete,
		Notification
	}

	export const enum Context {
		User,
		Order,
		Item
	}
}