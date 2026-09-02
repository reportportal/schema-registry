# Schema Registry

This is a simple schema registry repository that allows you to retrieve schemas:

* [Schema for remote application](manifest.schema.json)
* [Metadata for remote application manifest](manifest.metadata.json)
* [Example for remote application manifest](manifest.example.json)

## Page modules

Remote applications can contribute iframe pages through the manifest `modules` object:

* `projectPages` adds pages to a project sidebar.
* `adminPages` adds pages to the instance administration sidebar. These pages are available only to instance administrators.

Optional page fields:

* `title` — sidebar label; falls back to `name` when omitted.
* `menuOrder` — sidebar position (lower values appear higher). When omitted, the page is placed after the built-in sidebar items.
