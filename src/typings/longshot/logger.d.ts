declare module "ls-logger" {
	export function info(message: string): void;
	export function warn(message: string): void;
	export function error(message: string): void;
	export function debug(message: string): void;
}