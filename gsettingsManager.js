const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

var GsettingsManager = class {
    constructor(schemaId = null) {
        if (!schemaId) {
            const meta = ExtensionUtils.getCurrentExtension().metadata;
            schemaId = meta['settings-schema'];
        }

        this.settings = ExtensionUtils.getSettings(schemaId);

        if (!this.settings) {
            throw new Error(`Failed to load schema: ${schemaId}`);
        }
    }


    resetKey(key) {
        if (!this.settings.list_keys().includes(key)) {
            throw new Error(`Key '${key}' does not exist in the schema.`);
        }
        this.settings.reset(key);
        log(`Key '${key}' has been reset to its default value.`);
    }

    listKeys() {
        return this.settings.list_keys();
    }

    getValue(key) {
        if (!this.settings.list_keys().includes(key)) {
            throw new Error(`Key '${key}' does not exist in the schema.`);
        }
        return this.settings.get_value(key).unpack();
    }

    setValue(key, value) {
        if (!this.settings.list_keys().includes(key)) {
            throw new Error(`Key '${key}' does not exist in the schema.`);
        }

        const currentType = this.settings.get_value(key).get_type_string();
        const variant = new imports.gi.GLib.Variant(currentType, value);

        this.settings.set_value(key, variant);
        log(`Key '${key}' has been set to: ${value}`);
    }

    resetAllKeys() {
        const keys = this.listKeys();
        for (const key of keys) {
            this.resetKey(key);
        }
        log("All keys have been reset to their default values.");
    }
};
