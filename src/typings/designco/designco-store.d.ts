declare module "designco-store" {
	export = Store;
}

declare module Store {
	export const enum EventType {
		Create,
		Read,
		Update,
		Delete,
		Notification
	}

	export interface StoreApi {
		pub(event: AppEvent);
		psub(channel: string, callback: (channel: string, pattern: string, message: string) => void);
		sub(channel: string, callback: (channel: string, message: string) => void);
		fetch(pattern: string, count?: number);
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