# Aliasing Action

Sometimes, while it's convenient for a reducer to deal with only one action type,
it still comes handy to have multiple action creators.

- Improving expressiveness.
- Having a fine-grained way of dealing with particular fields.

So, as you can provide meta and payload creators while creating the action, 
you can also alias them by providing additional meta and payload creators via `actionCreator.alias`.  

```typescript
import { createAction } from 'redux-fluent';

export const edit = createAction('edit');
export const editName = edit.alias((name) => ({ name }));
export const editBirthday = edit.alias((ts) => ({ birthday: new Date(ts) }));
```

- `alias` causes previously provided `metaCreator` and `payloadCreator` to be skipped

## Arguments

- `(rawPayload: any, rawMeta: any, type: string) => Payload` - the payload creator
- `(rawPayload: any, rawMeta: any, type: string) => Meta` - the meta creator

## Returns

```typescript
(rawPayload, rawMeta) => FluxStandardAction
```
