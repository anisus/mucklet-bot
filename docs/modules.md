## Classes

<dl>
<dt><a href="#Api">Api</a></dt>
<dd><p>Api module connects to the backend api and provides low level
methods for service modules to send and receive data.</p>
</dd>
<dt><a href="#ActionCreateChar">ActionCreateChar</a></dt>
<dd><p>ActionCreateChar adds the action to create a character if the limit is not reached.</p>
</dd>
<dt><a href="#ActionGo">ActionGo</a></dt>
<dd><p>ActionGo adds the action to go around using exits.</p>
</dd>
<dt><a href="#ActionIdle">ActionIdle</a></dt>
<dd><p>ActionIdle adds the action to idle with awake characters.</p>
</dd>
<dt><a href="#ActionLurk">ActionLurk</a></dt>
<dd><p>ActionLurk adds the action to lurk for a while, without having any awake
characters.</p>
</dd>
<dt><a href="#ActionPose">ActionPose</a></dt>
<dd><p>ActionPose adds the action to pose in a room with other characters.</p>
</dd>
<dt><a href="#ActionSay">ActionSay</a></dt>
<dd><p>ActionSay adds the action to speak in a room with other characters.</p>
</dd>
<dt><a href="#ActionSleep">ActionSleep</a></dt>
<dd><p>ActionSleep adds the action to put a character to sleep.</p>
</dd>
<dt><a href="#ActionTeleport">ActionTeleport</a></dt>
<dd><p>ActionTeleport adds the action to teleport.</p>
</dd>
<dt><a href="#ActionWakeup">ActionWakeup</a></dt>
<dd><p>ActionWakeup adds the action to wake up an existing character.</p>
</dd>
<dt><a href="#ActionWhisper">ActionWhisper</a></dt>
<dd><p>ActionWhisper adds the action to speak in a room with other characters.</p>
</dd>
<dt><a href="#BotController">BotController</a></dt>
<dd><p>BotController is the central module for creating an autonomous, self acting
bot. Other modules may register actions that the bot controller may tell the
bot-characters to perform.</p>
</dd>
<dt><a href="#Personality">Personality</a></dt>
<dd><p>Personality holds common personality traits that an action can use to
determine behavior.</p>
</dd>
<dt><a href="#ReactionArriveWelcome">ReactionArriveWelcome</a></dt>
<dd><p>ReactionArriveWelcome greets when traveling to a room with other characters.</p>
</dd>
<dt><a href="#ReactionRead">ReactionRead</a></dt>
<dd><p>ReactionRead intercepts with idle time to read whenever someone else speaks
in the room.</p>
</dd>
<dt><a href="#ReactionTravelGreet">ReactionTravelGreet</a></dt>
<dd><p>ReactionTravelGreet greets when traveling to a room with other characters.</p>
</dd>
<dt><a href="#ReactionPrivateReply">ReactionPrivateReply</a></dt>
<dd><p>ReactionPrivateReply reacts to whispers and enqueues a whisper reply.</p>
</dd>
<dt><a href="#CharEvents">CharEvents</a></dt>
<dd><p>CharEvents listens to outgoing log events for any controlled character.</p>
<p>The purpose is to simplify listening and reacting to events for other
modules.</p>
</dd>
<dt><a href="#CharPing">CharPing</a></dt>
<dd><p>CharPing periodically sends a ping for all controlled characters to ensure
they are kept awake.</p>
<p>If the botController module is available, it will only ping characters
validated by botController.validChar</p>
</dd>
<dt><a href="#Login">Login</a></dt>
<dd><p>Login logs in the bot after registering it.</p>
</dd>
<dt><a href="#Player">Player</a></dt>
<dd><p>Player fetches the player object and keeps it suscribed once logged in.</p>
</dd>
</dl>

<a name="Api"></a>

## Api
Api module connects to the backend api and provides low level
methods for service modules to send and receive data.

**Kind**: global class  

* [Api](#Api)
    * [.connect()](#Api+connect) ⇒ <code>Promise</code>
    * [.disconnect()](#Api+disconnect)
    * [.get(rid, [collectionFactory])](#Api+get) ⇒ <code>Promise.&lt;(ResModel\|ResCollection)&gt;</code>
    * [.call(rid, method, params)](#Api+call) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.authenticate(rid, method, params)](#Api+authenticate) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.setOnConnect(onConnect)](#Api+setOnConnect) ⇒ <code>this</code>

<a name="Api+connect"></a>

### api.connect() ⇒ <code>Promise</code>
Connects the instance to the server.
Can be called even if a connection is already established.

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>Promise</code> - A promise to the established connection.  
<a name="Api+disconnect"></a>

### api.disconnect()
Disconnects any current connection and stops attempts
of reconnecting.

**Kind**: instance method of [<code>Api</code>](#Api)  
<a name="Api+get"></a>

### api.get(rid, [collectionFactory]) ⇒ <code>Promise.&lt;(ResModel\|ResCollection)&gt;</code>
Get a resource from the API

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>Promise.&lt;(ResModel\|ResCollection)&gt;</code> - Promise of the resource.  

| Param | Type | Description |
| --- | --- | --- |
| rid | <code>string</code> | Resource ID |
| [collectionFactory] | <code>function</code> | Collection factory function. |

<a name="Api+call"></a>

### api.call(rid, method, params) ⇒ <code>Promise.&lt;object&gt;</code>
Calls a method on a resource.

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Promise of the call result.  

| Param | Type | Description |
| --- | --- | --- |
| rid | <code>string</code> | Resource ID. |
| method | <code>string</code> | Method name |
| params | <code>\*</code> | Method parameters |

<a name="Api+authenticate"></a>

### api.authenticate(rid, method, params) ⇒ <code>Promise.&lt;object&gt;</code>
Invokes a authentication method on a resource.

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>Promise.&lt;object&gt;</code> - Promise of the authentication result.  

| Param | Type | Description |
| --- | --- | --- |
| rid | <code>string</code> | Resource ID. |
| method | <code>string</code> | Method name |
| params | <code>\*</code> | Method parameters |

<a name="Api+setOnConnect"></a>

### api.setOnConnect(onConnect) ⇒ <code>this</code>
Sets the onConnect callback.

**Kind**: instance method of [<code>Api</code>](#Api)  

| Param | Type | Description |
| --- | --- | --- |
| onConnect | <code>ResClient~onConnectCallback</code> | On connect callback called prior resolving the connect promise and subscribing to stale resources. May return a promise. |

<a name="ActionCreateChar"></a>

## ActionCreateChar
ActionCreateChar adds the action to create a character if the limit is not reached.

**Kind**: global class  

* [ActionCreateChar](#ActionCreateChar)
    * [new ActionCreateChar(app, params)](#new_ActionCreateChar_new)
    * [~Params](#ActionCreateChar..Params) : <code>Object</code>

<a name="new_ActionCreateChar_new"></a>

### new ActionCreateChar(app, params)
Creates a new ActionCreateChar instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ActionCreateChar..Params) | Module parameters. |

<a name="ActionCreateChar..Params"></a>

### ActionCreateChar~Params : <code>Object</code>
ActionCreateChar parameters.

**Kind**: inner typedef of [<code>ActionCreateChar</code>](#ActionCreateChar)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [charLimit] | <code>number</code> | Limit on how many characters are totally created. |
| [probability] | <code>number</code> | Probability of the action to occur. |
| [delay] | <code>number</code> | Delay in milliseconds to wait prior to executing the action. |
| [postdelay] | <code>number</code> | Delay in milliseconds to wait after executing the action. |

<a name="ActionGo"></a>

## ActionGo
ActionGo adds the action to go around using exits.

**Kind**: global class  

* [ActionGo](#ActionGo)
    * [new ActionGo(app, params)](#new_ActionGo_new)
    * [~Params](#ActionGo..Params) : <code>Object</code>

<a name="new_ActionGo_new"></a>

### new ActionGo(app, params)
Creates a new ActionGo instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ActionGo..Params) | Module parameters. |

<a name="ActionGo..Params"></a>

### ActionGo~Params : <code>Object</code>
ActionGo parameters.

**Kind**: inner typedef of [<code>ActionGo</code>](#ActionGo)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [populationProbability] | <code>object</code> | Probabilities of the action to occur based on room population. |
| [delay] | <code>number</code> | Delay in milliseconds to wait prior to executing the action. |
| [postdelay] | <code>number</code> | Delay in milliseconds to wait after executing the action. |

<a name="ActionIdle"></a>

## ActionIdle
ActionIdle adds the action to idle with awake characters.

**Kind**: global class  

* [ActionIdle](#ActionIdle)
    * [new ActionIdle(app, params)](#new_ActionIdle_new)
    * [~Params](#ActionIdle..Params) : <code>Object</code>

<a name="new_ActionIdle_new"></a>

### new ActionIdle(app, params)
Creates a new ActionIdle instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ActionIdle..Params) | Module parameters. |

<a name="ActionIdle..Params"></a>

### ActionIdle~Params : <code>Object</code>
ActionIdle parameters.

**Kind**: inner typedef of [<code>ActionIdle</code>](#ActionIdle)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [probability] | <code>number</code> | Probability of the action to occur. |
| [delayMin] | <code>number</code> | Minimum time in milliseconds to idle. |
| [delayMax] | <code>number</code> | Maximum time in milliseconds to idle. |
| [spread] | <code>string</code> | How the random values are spread. May be 'linear', 'cube' (less high values), or 'square' (even less high values). |

<a name="ActionLurk"></a>

## ActionLurk
ActionLurk adds the action to lurk for a while, without having any awake
characters.

**Kind**: global class  

* [ActionLurk](#ActionLurk)
    * [new ActionLurk(app, params)](#new_ActionLurk_new)
    * [~Params](#ActionLurk..Params) : <code>Object</code>

<a name="new_ActionLurk_new"></a>

### new ActionLurk(app, params)
Creates a new ActionLurk instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ActionLurk..Params) | Module parameters. |

<a name="ActionLurk..Params"></a>

### ActionLurk~Params : <code>Object</code>
ActionLurk parameters.

**Kind**: inner typedef of [<code>ActionLurk</code>](#ActionLurk)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [probability] | <code>number</code> | Probability of the action to occur. |
| [delayMin] | <code>number</code> | Minimum time in milliseconds to lurk. |
| [delayMax] | <code>number</code> | Maximum time in milliseconds to lurk. |

<a name="ActionPose"></a>

## ActionPose
ActionPose adds the action to pose in a room with other characters.

**Kind**: global class  

* [ActionPose](#ActionPose)
    * [new ActionPose(app, params)](#new_ActionPose_new)
    * _instance_
        * [.enqueue(charId, msg, priority)](#ActionPose+enqueue)
    * _inner_
        * [~Params](#ActionPose..Params) : <code>Object</code>

<a name="new_ActionPose_new"></a>

### new ActionPose(app, params)
Creates a new ActionPose instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ActionPose..Params) | Module parameters. |

<a name="ActionPose+enqueue"></a>

### actionPose.enqueue(charId, msg, priority)
Enqueues a pose action to the botController.

**Kind**: instance method of [<code>ActionPose</code>](#ActionPose)  

| Param | Type | Description |
| --- | --- | --- |
| charId | <code>string</code> | Character ID. |
| msg | <code>string</code> | Message to pose. |
| priority | <code>number</code> | Priority of the action. |

<a name="ActionPose..Params"></a>

### ActionPose~Params : <code>Object</code>
ActionPose parameters.

**Kind**: inner typedef of [<code>ActionPose</code>](#ActionPose)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [populationProbability] | <code>object</code> | Probabilities of the action to occur based on room population. |
| [delay] | <code>number</code> | Additional delay in milliseconds to wait prior to executing the action. |
| [postdelay] | <code>number</code> | Delay in milliseconds to wait after executing the action. |
| [wordLengthMin] | <code>number</code> | Minimum number of words in a message. Ignored if phrases is set. |
| [wordLengthMax] | <code>number</code> | Maximum number of words in a message. Ignored if phrases is set. |
| [phrases] | <code>Array.&lt;string&gt;</code> | An array of phrases to use as message. Null means random lorem ipsum. |

<a name="ActionSay"></a>

## ActionSay
ActionSay adds the action to speak in a room with other characters.

**Kind**: global class  

* [ActionSay](#ActionSay)
    * [new ActionSay(app, params)](#new_ActionSay_new)
    * _instance_
        * [.enqueue(charId, msg, priority)](#ActionSay+enqueue)
    * _inner_
        * [~Params](#ActionSay..Params) : <code>Object</code>

<a name="new_ActionSay_new"></a>

### new ActionSay(app, params)
Creates a new ActionSay instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ActionSay..Params) | Module parameters. |

<a name="ActionSay+enqueue"></a>

### actionSay.enqueue(charId, msg, priority)
Enqueues a say action to the botController.

**Kind**: instance method of [<code>ActionSay</code>](#ActionSay)  

| Param | Type | Description |
| --- | --- | --- |
| charId | <code>string</code> | Character ID. |
| msg | <code>string</code> | Message to say. |
| priority | <code>number</code> | Priority of the action. |

<a name="ActionSay..Params"></a>

### ActionSay~Params : <code>Object</code>
ActionSay parameters.

**Kind**: inner typedef of [<code>ActionSay</code>](#ActionSay)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [populationProbability] | <code>object</code> | Probabilities of the action to occur based on room population. |
| [delay] | <code>number</code> | Additional delay in milliseconds to wait prior to executing the action. |
| [postdelay] | <code>number</code> | Delay in milliseconds to wait after executing the action. |
| [wordLengthMin] | <code>number</code> | Minimum number of words in a message. Ignored if phrases is set. |
| [wordLengthMax] | <code>number</code> | Maximum number of words in a message. Ignored if phrases is set. |
| [phrases] | <code>Array.&lt;string&gt;</code> | An array of phrases to use as message. Null means random lorem ipsum. |

<a name="ActionSleep"></a>

## ActionSleep
ActionSleep adds the action to put a character to sleep.

**Kind**: global class  

* [ActionSleep](#ActionSleep)
    * [new ActionSleep(app, params)](#new_ActionSleep_new)
    * [~Params](#ActionSleep..Params) : <code>Object</code>

<a name="new_ActionSleep_new"></a>

### new ActionSleep(app, params)
Creates a new ActionSleep instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ActionSleep..Params) | Module parameters. |

<a name="ActionSleep..Params"></a>

### ActionSleep~Params : <code>Object</code>
ActionSleep parameters.

**Kind**: inner typedef of [<code>ActionSleep</code>](#ActionSleep)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [probability] | <code>number</code> | Probability of the action to occur. |
| [delay] | <code>number</code> | Delay in milliseconds to wait prior to executing the action. |
| [postdelay] | <code>number</code> | Delay in milliseconds to wait after executing the action. |

<a name="ActionTeleport"></a>

## ActionTeleport
ActionTeleport adds the action to teleport.

**Kind**: global class  

* [ActionTeleport](#ActionTeleport)
    * [new ActionTeleport(app, params)](#new_ActionTeleport_new)
    * [~Params](#ActionTeleport..Params) : <code>Object</code>

<a name="new_ActionTeleport_new"></a>

### new ActionTeleport(app, params)
Creates a new ActionTeleport instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ActionTeleport..Params) | Module parameters. |

<a name="ActionTeleport..Params"></a>

### ActionTeleport~Params : <code>Object</code>
ActionTeleport parameters.

**Kind**: inner typedef of [<code>ActionTeleport</code>](#ActionTeleport)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [populationProbability] | <code>object</code> | Probabilities of the action to occur based on room population. |
| [delay] | <code>number</code> | Delay in milliseconds to wait prior to executing the action. |
| [postdelay] | <code>number</code> | Delay in milliseconds to wait after executing the action. |

<a name="ActionWakeup"></a>

## ActionWakeup
ActionWakeup adds the action to wake up an existing character.

**Kind**: global class  

* [ActionWakeup](#ActionWakeup)
    * [new ActionWakeup(app, params)](#new_ActionWakeup_new)
    * [~Params](#ActionWakeup..Params) : <code>Object</code>

<a name="new_ActionWakeup_new"></a>

### new ActionWakeup(app, params)
Creates a new ActionWakeup instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ActionWakeup..Params) | Module parameters. |

<a name="ActionWakeup..Params"></a>

### ActionWakeup~Params : <code>Object</code>
ActionWakeup parameters.

**Kind**: inner typedef of [<code>ActionWakeup</code>](#ActionWakeup)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [charLimit] | <code>number</code> | Limit on how many characters to have awake at any single time. |
| [probability] | <code>number</code> | Probability of the action to occur. |
| [delay] | <code>number</code> | Delay in milliseconds to wait prior to executing the action. |
| [postdelay] | <code>number</code> | Delay in milliseconds to wait after executing the action. |

<a name="ActionWhisper"></a>

## ActionWhisper
ActionWhisper adds the action to speak in a room with other characters.

**Kind**: global class  

* [ActionWhisper](#ActionWhisper)
    * [new ActionWhisper(app, params)](#new_ActionWhisper_new)
    * _instance_
        * [.enqueue(charId, targetId, msg, pose, priority)](#ActionWhisper+enqueue)
    * _inner_
        * [~Params](#ActionWhisper..Params) : <code>Object</code>

<a name="new_ActionWhisper_new"></a>

### new ActionWhisper(app, params)
Creates a new ActionWhisper instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ActionWhisper..Params) | Module parameters. |

<a name="ActionWhisper+enqueue"></a>

### actionWhisper.enqueue(charId, targetId, msg, pose, priority)
Enqueues a whisper action to the botController.

**Kind**: instance method of [<code>ActionWhisper</code>](#ActionWhisper)  

| Param | Type | Description |
| --- | --- | --- |
| charId | <code>string</code> | Character ID. |
| targetId | <code>string</code> | Target character ID. |
| msg | <code>string</code> | Message to whisper. |
| pose | <code>boolean</code> | Flag if message is posed. |
| priority | <code>number</code> | Priority of the action. |

<a name="ActionWhisper..Params"></a>

### ActionWhisper~Params : <code>Object</code>
ActionWhisper parameters.

**Kind**: inner typedef of [<code>ActionWhisper</code>](#ActionWhisper)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [populationProbability] | <code>object</code> | Probabilities of the action to occur based on room population. |
| [delay] | <code>number</code> | Additional delay in milliseconds to wait prior to executing the action. |
| [postdelay] | <code>number</code> | Delay in milliseconds to wait after executing the action. |
| [phrases] | <code>Array.&lt;string&gt;</code> | An array of phrases to use as message. Null means random lorem ipsum. |
| [chars] | <code>Array.&lt;string&gt;</code> | An array of chars eligible to be whispered to. Null means any. |

<a name="BotController"></a>

## BotController
BotController is the central module for creating an autonomous, self acting
bot. Other modules may register actions that the bot controller may tell the
bot-characters to perform.

**Kind**: global class  

* [BotController](#BotController)
    * [new BotController(app, params)](#new_BotController_new)
    * _instance_
        * [.addAction(action)](#BotController+addAction) ⇒ <code>this</code>
        * [.removeAction(actionId)](#BotController+removeAction) ⇒ <code>this</code>
        * [.enqueue(outcome)](#BotController+enqueue)
        * [.validChar(charId, [opt])](#BotController+validChar)
    * _inner_
        * [~Params](#BotController..Params) : <code>Object</code>
        * [~ActionOutcome](#BotController..ActionOutcome) : <code>Object</code>
        * [~outcomesCallback](#BotController..outcomesCallback) ⇒ [<code>ActionOutcome</code>](#BotController..ActionOutcome) \| [<code>Array.&lt;ActionOutcome&gt;</code>](#BotController..ActionOutcome)
        * [~executeCallback](#BotController..executeCallback) ⇒ <code>string</code> \| <code>Promise.&lt;?string&gt;</code>

<a name="new_BotController_new"></a>

### new BotController(app, params)
Creates a new BotController instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#BotController..Params) | Module parameters. |

<a name="BotController+addAction"></a>

### botController.addAction(action) ⇒ <code>this</code>
Register an action that may be performed by the controller.

**Kind**: instance method of [<code>BotController</code>](#BotController)  

| Param | Type | Description |
| --- | --- | --- |
| action | <code>object</code> | Action definition object. |
| action.id | <code>string</code> | Action ID. |
| action.outcomes | [<code>outcomesCallback</code>](#BotController..outcomesCallback) | Callback that returns an array of possible outcomes. |
| action.exec | [<code>executeCallback</code>](#BotController..executeCallback) | Callback that executes one of the action outcomes. |

<a name="BotController+removeAction"></a>

### botController.removeAction(actionId) ⇒ <code>this</code>
Unregisters a previously registered action.

**Kind**: instance method of [<code>BotController</code>](#BotController)  

| Param | Type | Description |
| --- | --- | --- |
| actionId | <code>string</code> | Action ID. |

<a name="BotController+enqueue"></a>

### botController.enqueue(outcome)
Queues an outcome for an action.

**Kind**: instance method of [<code>BotController</code>](#BotController)  

| Param | Type | Description |
| --- | --- | --- |
| action.id | <code>string</code> | Action ID. |
| outcome | [<code>ActionOutcome</code>](#BotController..ActionOutcome) | Action outcome to queue. |

<a name="BotController+validChar"></a>

### botController.validChar(charId, [opt])
Validates in a char is under bot control

**Kind**: instance method of [<code>BotController</code>](#BotController)  

| Param | Type | Description |
| --- | --- | --- |
| charId | <code>string</code> | ID of character. |
| [opt] | <code>object</code> | Optional parameters. |
| [opt.includeChars] | <code>Array.&lt;string&gt;</code> | Array of characters to include. If provided, it overrides the includesChars of botController. |
| [opt.excludeChars] | <code>Array.&lt;string&gt;</code> | Array of characters to exclude. If provided, it overrides the excludeChars of botController. |

<a name="BotController..Params"></a>

### BotController~Params : <code>Object</code>
BotController parameters.

**Kind**: inner typedef of [<code>BotController</code>](#BotController)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [includeChars] | <code>Array.&lt;string&gt;</code> | Char IDs of chars handled by the bot controller. Null means all characters are included. |
| [excludeChars] | <code>Array.&lt;string&gt;</code> | Char IDs of chars not handled by the bot controller. Null means no character is excluded. |
| [queue] | <code>Array</code> | Initial queue of actions when starting controller. Mainly for debug purpose. |

<a name="BotController..ActionOutcome"></a>

### BotController~ActionOutcome : <code>Object</code>
BotController action outcome. The object may contain any additional properties used by the action to perform the outcome.

**Kind**: inner typedef of [<code>BotController</code>](#BotController)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [probability] | <code>number</code> | Proportional chance that the outcome will be selected by the bot controller as the next action outsome. |
| [delay] | <code>number</code> | Delay in milliseconds before the action outcome is executed. Defaults to 0. |
| [postdelay] | <code>number</code> | Delay in milliseconds after the action outcome has been executed. Defaults to 0. |
| [priority] | <code>number</code> | Priority of the action outcome when queued. A higher priority outcome will be executed before lower priority outcomes. Defaults to 1. |

<a name="BotController..outcomesCallback"></a>

### BotController~outcomesCallback ⇒ [<code>ActionOutcome</code>](#BotController..ActionOutcome) \| [<code>Array.&lt;ActionOutcome&gt;</code>](#BotController..ActionOutcome)
Outcomes callback This callback is displayed as a global member.

**Kind**: inner typedef of [<code>BotController</code>](#BotController)  
**Returns**: [<code>ActionOutcome</code>](#BotController..ActionOutcome) \| [<code>Array.&lt;ActionOutcome&gt;</code>](#BotController..ActionOutcome) - Zero or more possible outcomes for the action.  

| Param | Type | Description |
| --- | --- | --- |
| player | <code>Model</code> | Player model. |
| state | <code>object</code> | State object. |

<a name="BotController..executeCallback"></a>

### BotController~executeCallback ⇒ <code>string</code> \| <code>Promise.&lt;?string&gt;</code>
Execute callback called to execute an action outcome.

**Kind**: inner typedef of [<code>BotController</code>](#BotController)  
**Returns**: <code>string</code> \| <code>Promise.&lt;?string&gt;</code> - Optional string to log, or promise of a string to log. If the promise rejects, it will be logged as an error.  

| Param | Type | Description |
| --- | --- | --- |
| player | <code>Model</code> | Player model. |
| state | <code>object</code> | State object. |
| outcome | [<code>ActionOutcome</code>](#BotController..ActionOutcome) | Outcome to execute. |

<a name="Personality"></a>

## Personality
Personality holds common personality traits that an action can use to
determine behavior.

**Kind**: global class  

* [Personality](#Personality)
    * [new Personality(app, params)](#new_Personality_new)
    * _instance_
        * [.calculateTypeDuration(msg)](#Personality+calculateTypeDuration) ⇒ <code>number</code>
        * [.calculateReadDuration(msg)](#Personality+calculateReadDuration) ⇒ <code>number</code>
    * _inner_
        * [~Params](#Personality..Params) : <code>Object</code>

<a name="new_Personality_new"></a>

### new Personality(app, params)
Creates a new Personality instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#Personality..Params) | Module parameters. |

<a name="Personality+calculateTypeDuration"></a>

### personality.calculateTypeDuration(msg) ⇒ <code>number</code>
Calculates the time it takes in milliseconds to type a message.

**Kind**: instance method of [<code>Personality</code>](#Personality)  
**Returns**: <code>number</code> - Duration in milliseconds.  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>string</code> | Message to type. |

<a name="Personality+calculateReadDuration"></a>

### personality.calculateReadDuration(msg) ⇒ <code>number</code>
Calculates the time it takes in milliseconds to read a message.

**Kind**: instance method of [<code>Personality</code>](#Personality)  
**Returns**: <code>number</code> - Duration in milliseconds.  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>string</code> | Message to read. |

<a name="Personality..Params"></a>

### Personality~Params : <code>Object</code>
Personality parameters.

**Kind**: inner typedef of [<code>Personality</code>](#Personality)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [typeSpeed] | <code>number</code> | Type speed in characters per minute. |
| [readSpeed] | <code>number</code> | Read speed in characters per minute. |

<a name="ReactionArriveWelcome"></a>

## ReactionArriveWelcome
ReactionArriveWelcome greets when traveling to a room with other characters.

**Kind**: global class  

* [ReactionArriveWelcome](#ReactionArriveWelcome)
    * [new ReactionArriveWelcome(app, params)](#new_ReactionArriveWelcome_new)
    * [~Params](#ReactionArriveWelcome..Params) : <code>Object</code>

<a name="new_ReactionArriveWelcome_new"></a>

### new ReactionArriveWelcome(app, params)
Creates a new ReactionArriveWelcome instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ReactionArriveWelcome..Params) | Module parameters. |

<a name="ReactionArriveWelcome..Params"></a>

### ReactionArriveWelcome~Params : <code>Object</code>
ReactionArriveWelcome parameters.

**Kind**: inner typedef of [<code>ReactionArriveWelcome</code>](#ReactionArriveWelcome)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [populationChance] | <code>object</code> | Chances of welcoming arrivals, between 0 and 1, based on room population. |
| [priority] | <code>number</code> | Priority of the reply action. |
| [delay] | <code>number</code> | Additional delay in milliseconds to wait prior to executing the action. |
| [postdelay] | <code>number</code> | Delay in milliseconds to wait after executing the action. |
| [wordLengthMin] | <code>number</code> | Minimum number of words in a message. Ignored if phrases is set. |
| [wordLengthMax] | <code>number</code> | Maximum number of words in a message. Ignored if phrases is set. |
| [phrases] | <code>Array.&lt;string&gt;</code> | An array of phrases to use as message. Null means random lorem ipsum. |

<a name="ReactionRead"></a>

## ReactionRead
ReactionRead intercepts with idle time to read whenever someone else speaks
in the room.

**Kind**: global class  

* [ReactionRead](#ReactionRead)
    * [new ReactionRead(app, params)](#new_ReactionRead_new)
    * [~Params](#ReactionRead..Params) : <code>Object</code>

<a name="new_ReactionRead_new"></a>

### new ReactionRead(app, params)
Creates a new ReactionRead instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ReactionRead..Params) | Module parameters. |

<a name="ReactionRead..Params"></a>

### ReactionRead~Params : <code>Object</code>
ReactionRead parameters.

**Kind**: inner typedef of [<code>ReactionRead</code>](#ReactionRead)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [chance] | <code>object</code> | Chance of reading, between 0 and 1. |
| [priority] | <code>number</code> | Priority of the read action. |
| [eventTypes] | <code>Array.&lt;string&gt;</code> | List of event types to read. Defaults to [ 'say', 'pose', 'ooc', 'describe' ]. |

<a name="ReactionTravelGreet"></a>

## ReactionTravelGreet
ReactionTravelGreet greets when traveling to a room with other characters.

**Kind**: global class  

* [ReactionTravelGreet](#ReactionTravelGreet)
    * [new ReactionTravelGreet(app, params)](#new_ReactionTravelGreet_new)
    * [~Params](#ReactionTravelGreet..Params) : <code>Object</code>

<a name="new_ReactionTravelGreet_new"></a>

### new ReactionTravelGreet(app, params)
Creates a new ReactionTravelGreet instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ReactionTravelGreet..Params) | Module parameters. |

<a name="ReactionTravelGreet..Params"></a>

### ReactionTravelGreet~Params : <code>Object</code>
ReactionTravelGreet parameters.

**Kind**: inner typedef of [<code>ReactionTravelGreet</code>](#ReactionTravelGreet)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [populationChance] | <code>object</code> | Chances of greeting on entering room, between 0 and 1, based on room population. |
| [priority] | <code>number</code> | Priority of the reply action. |
| [delay] | <code>number</code> | Additional delay in milliseconds to wait prior to executing the action. |
| [postdelay] | <code>number</code> | Delay in milliseconds to wait after executing the action. |
| [wordLengthMin] | <code>number</code> | Minimum number of words in a message. Ignored if phrases is set. |
| [wordLengthMax] | <code>number</code> | Maximum number of words in a message. Ignored if phrases is set. |
| [phrases] | <code>Array.&lt;string&gt;</code> | An array of phrases to use as message. Null means random lorem ipsum. |

<a name="ReactionPrivateReply"></a>

## ReactionPrivateReply
ReactionPrivateReply reacts to whispers and enqueues a whisper reply.

**Kind**: global class  

* [ReactionPrivateReply](#ReactionPrivateReply)
    * [new ReactionPrivateReply(app, params)](#new_ReactionPrivateReply_new)
    * [~Params](#ReactionPrivateReply..Params) : <code>Object</code>

<a name="new_ReactionPrivateReply_new"></a>

### new ReactionPrivateReply(app, params)
Creates a new ReactionPrivateReply instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#ReactionPrivateReply..Params) | Module parameters. |

<a name="ReactionPrivateReply..Params"></a>

### ReactionPrivateReply~Params : <code>Object</code>
ReactionPrivateReply parameters.

**Kind**: inner typedef of [<code>ReactionPrivateReply</code>](#ReactionPrivateReply)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [chance] | <code>object</code> | Chance of replying, between 0 and 1. |
| [priority] | <code>number</code> | Priority of the action. |
| [wordLengthMin] | <code>number</code> | Minimum number of words in a message. Ignored if phrases is set. |
| [wordLengthMax] | <code>number</code> | Maximum number of words in a message. Ignored if phrases is set. |
| [phrases] | <code>Array.&lt;string&gt;</code> | An array of phrases to use as message. Null means random lorem ipsum. |

<a name="CharEvents"></a>

## CharEvents
CharEvents listens to outgoing log events for any controlled character.

The purpose is to simplify listening and reacting to events for other
modules.

**Kind**: global class  

* [CharEvents](#CharEvents)
    * [new CharEvents(app, params)](#new_CharEvents_new)
    * [.subscribe(cb)](#CharEvents+subscribe) ⇒ <code>function</code>
    * [.unsubscribe(cb)](#CharEvents+unsubscribe) ⇒ <code>boolean</code>

<a name="new_CharEvents_new"></a>

### new CharEvents(app, params)
Creates a new CharEvents instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | <code>CharEvents~Params</code> | Module parameters. |

<a name="CharEvents+subscribe"></a>

### charEvents.subscribe(cb) ⇒ <code>function</code>
Subscribes to char log events.

**Kind**: instance method of [<code>CharEvents</code>](#CharEvents)  
**Returns**: <code>function</code> - Unsubscribe function.  

| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> | Callback called on events: function(char, event) |

<a name="CharEvents+unsubscribe"></a>

### charEvents.unsubscribe(cb) ⇒ <code>boolean</code>
Unsubscribes to char log events.

**Kind**: instance method of [<code>CharEvents</code>](#CharEvents)  
**Returns**: <code>boolean</code> - Returns true if callback was found, eitherwise false.  

| Param | Type | Description |
| --- | --- | --- |
| cb | <code>function</code> | Callback previously passed to the subscribe method. |

<a name="CharPing"></a>

## CharPing
CharPing periodically sends a ping for all controlled characters to ensure
they are kept awake.

If the botController module is available, it will only ping characters
validated by botController.validChar

**Kind**: global class  

* [CharPing](#CharPing)
    * [new CharPing(app, params)](#new_CharPing_new)
    * [~Params](#CharPing..Params) : <code>Object</code>

<a name="new_CharPing_new"></a>

### new CharPing(app, params)
Creates a new CharPing instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#CharPing..Params) | Module parameters. |

<a name="CharPing..Params"></a>

### CharPing~Params : <code>Object</code>
CharPing parameters.

**Kind**: inner typedef of [<code>CharPing</code>](#CharPing)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [duration] | <code>number</code> | Duration in milliseconds between successful pings. |
| [threshold] | <code>number</code> | Threshold in milliseconds after which a character is put to sleep. |
| [retry] | <code>number</code> | Duration in milliseconds beteween retries on failed pings. |

<a name="Login"></a>

## Login
Login logs in the bot after registering it.

**Kind**: global class  

* [Login](#Login)
    * [new Login(app, params)](#new_Login_new)
    * _instance_
        * [.getUserPromise()](#Login+getUserPromise) ⇒ <code>Promise.&lt;Model&gt;</code>
    * _inner_
        * [~Params](#Login..Params) : <code>Object</code>

<a name="new_Login_new"></a>

### new Login(app, params)
Creates a new Login instance.


| Param | Type | Description |
| --- | --- | --- |
| app | <code>App</code> | Modapp App object. |
| params | [<code>Params</code>](#Login..Params) | Module parameters. |

<a name="Login+getUserPromise"></a>

### login.getUserPromise() ⇒ <code>Promise.&lt;Model&gt;</code>
Returns a promise that resolves with the logged in user.

**Kind**: instance method of [<code>Login</code>](#Login)  
**Returns**: <code>Promise.&lt;Model&gt;</code> - Promise of the user model.  
<a name="Login..Params"></a>

### Login~Params : <code>Object</code>
Login parameters.

**Kind**: inner typedef of [<code>Login</code>](#Login)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [user] | <code>string</code> | User account name. |
| [pass] | <code>string</code> | Password, sha256 hashed and base64 encoded, padded with equal (=). Eg. "ZSx9xofZjJiJME7S5AjHS2EehqQMqlHEtD8d1ZE8XNA=" |

<a name="Player"></a>

## Player
Player fetches the player object and keeps it suscribed once logged in.

**Kind**: global class  

* [Player](#Player)
    * [.getModel()](#Player+getModel) ⇒ <code>Model</code>
    * [.getPlayerPromise()](#Player+getPlayerPromise) ⇒ <code>Promise.&lt;Model&gt;</code>
    * [.getOwnedChar(charId)](#Player+getOwnedChar) ⇒ <code>Model</code>
    * [.getControlledChar(charId)](#Player+getControlledChar) ⇒ <code>Model</code>

<a name="Player+getModel"></a>

### player.getModel() ⇒ <code>Model</code>
Returns the module model.

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Model</code> - Module model.  
<a name="Player+getPlayerPromise"></a>

### player.getPlayerPromise() ⇒ <code>Promise.&lt;Model&gt;</code>
Returns a promise that resolves with the player model, containing all
characters and their info, of the logged in user.

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Promise.&lt;Model&gt;</code> - Promise of the player model.  
<a name="Player+getOwnedChar"></a>

### player.getOwnedChar(charId) ⇒ <code>Model</code>
Returns an owned character with a given ID. If the character is not
owned, or if the player isn't loaded, null is returned;

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Model</code> - Controlled character model or null.  

| Param | Type | Description |
| --- | --- | --- |
| charId | <code>string</code> | Character ID |

<a name="Player+getControlledChar"></a>

### player.getControlledChar(charId) ⇒ <code>Model</code>
Returns a controlled character with a given ID. If the character is not
controlled, or if the player isn't loaded, null is returned;

**Kind**: instance method of [<code>Player</code>](#Player)  
**Returns**: <code>Model</code> - Controlled character model or null.  

| Param | Type | Description |
| --- | --- | --- |
| charId | <code>string</code> | Character ID |

