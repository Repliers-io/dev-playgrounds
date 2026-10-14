---
name: direct-setparams-needs-validation
description: Calling SearchProvider.setParams(getValues()) to skip react-hook-form's async submit must still run the Joi schema synchronously first, or invalid fields reach the API and their error messages vanish
type: feedback
---

`ParamsFormProvider.onChange` runs `handleSubmit`, whose Joi resolver is async, so the
params land one render after a map position change. Bypassing it with
`setParams(getValues())` is legitimate when params and position must change in one render
(map presets), but it skips validation for the *whole* form, not just the fields being
set, and the `values:` re-sync afterwards clears `formState.errors`.

**Why:** MapLocationsPresets (22d3996) did this with the comment "every value set above is
valid". A user with `abc` in `locationsMaxSize` and a visible error would click a preset
and send `maxSize=abc`, then lose the error message. Review finding on feat/locations-apn.

**How to apply:** Joi is synchronous. Validate before the direct call:

```ts
const { value, error } = schema.validate(getValues(), { allowUnknown: true })
if (error) return trigger() // surface errors, send nothing
setParams(value)
```

Use the validated `value`, not raw `getValues()`, so URL-bootstrapped strings get the same
coercion the normal path applies. See [[presets-reset-every-scoping-field]].
