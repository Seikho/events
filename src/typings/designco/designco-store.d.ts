/// <reference path='../redis/redis.d.ts' />
declare module "designco-store" {
	import redis = require("redis");
	export function client(): redis.RedisClient;
	export function pub(event: AppEvent);
	export function psub(channel: string, callback: (channel: string, pattern: string, message: string) => void);
	export function sub(channel: string, callback: (channel: string, message: string) => void);
	export function fetch(pattern: string, count?: number);
	export function setHost(hostname: string, port?: number);

	export interface StoreApi {
		pub(event: AppEvent);
		psub(channel: string, callback: (channel: string, pattern: string, message: string) => void);
		sub(channel: string, callback: (channel: string, message: string) => void);
		fetch(pattern: string, count?: number);
		setHost(hostname: string, port?: number);
	}

	export const enum EventType {
		Create,
		Read,
		Update,
		Delete,
		Notification
	}

	export interface AppEvent {
		event: EventType;
		context: EventContext;
		data: any;
		key: string|number;
	}

	export const enum EventContext {
		User,
		Order,
		Item
	}
}