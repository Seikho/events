/// <reference path='../bluebird/bluebird.d.ts' />
/// <reference path='../redis/redis.d.ts' />

declare module "ls-events" {
	import redis = require("redis");

	export function client(): redis.RedisClient;
	export function pub(event: Event): Promise<{}>;
	export function psub(channel: string, callback: (pattern: string, channel: string, message: EventData) => void): Promise<{}>;
	export function sub(channel: string, callback: (channel: string, message: string) => void): Promise<{}>;
	export function fetch(context?: string, event?: string, key?: string): Promise<any>;
	export function setHost(hostname: string, port?: number);

	export interface Event {
		event: string;
		context: string;
		data: any;
		key: string|number;
	}

	export interface EventData {
		published: number;
		data: any;
	}
}
