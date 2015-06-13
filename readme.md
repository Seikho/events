### Longshot Event Store API
Carl Winkler

#### Installation
```
npm install ls-events --save
```

#### Pre-requisites
 **Redis**  
 This store uses Redis for its pub/sub and event storage.

#### Usage
All pub, sub and fetch methods return Promises.

```javascript
var events = require("ls-events");

// Subscribe to a pattern
events.psub("users/create/*", function(ch, pt, msg) {
	console.log("[CHANNEL: %s] Message: %s", ch, msg);
}).then(function(count) { console.log("Successfully listening with %d others", count) });

var newUser = {
	username: 'carl',
	email: 'carl@longshot.io',
	// ...
}
var newEvent = {
	event: 'create',
	context: 'users',
	key: 'carl', // Primary key of the object 
	data: newUser
};

events.pub("users/create/carl", newEvent)
	.then(function() { console.log("Successfully published!"); }); 
// This will publish to the channel 'users/create/carl' (context/event/key)

/*
Console output:
>> Successfully listening with 1 others!
>> Successfully published!
>> [CHANNEL: users/create/carl] Message: { "usersname": "carl", "email": "carl@longshot.io" } 
*/
```

#### API

##### Event
```javascript
{
	event: string, // operation type. E.g. create, read, update, delete, ...
	context: string, // object type. E.g. users, orders, invoices, ...
	key: string|number, // identifier of the object. typically the primary key.
	data: any // a POJO. This will get serialised and deserialsed using JSON.	
}
```

##### Configuration
Configure the location of Redis.  
Defaults to `127.0.0.1` and port `6379`
```javascript
function setHost(hostname: string, port?: number);

```

##### Subscribe
Subscribing to a simple channel such as: `users/create/carl`
```javascript
function sub(channel: string, callback: (channel: string, message: string) =>  void): Promise<{}>;
```

##### Pattern Subscribe
Subscribing to a event that conforms to a pattern, such as:  
* `users/create/*`
* `users/*/*`
* `users/*/carl`

```javascript
function psub(channel: string, callback: (channel: string, pattern: string, message: string) =>  void): Promise<{}>;
```

##### Publish
Publish an event. See the [Event](#event) type.  
The publish function automatically constructs the `channel` from the `Event` object provided.

```javascript
function pub(event: Event): Promise<{}>;
```

##### Fetch
Fetches events from the event store.  
context: object type. Such as `'users'`, `'orders'`, ...
event: type of event. Such as `'create'`, `'update'`, `'delete'`, ...
key: the key of the object. Typically the primary key. In the previous example this would be `'carl'`.

```javascript
function fetch(context?: string, event?: string, key?: string): Promise<any>;
```