export = config;
var _config: any = [];

function config(key: string, value?: string) {
	if (!value) return _config[key];
	_config[key] = value;
	return value;
}