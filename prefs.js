const { GObject, Gtk } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

let settings;

function init() {
    settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.toggle-awg');
}

/**
 * Creates a labeled widget (label + child) inside a horizontal box.
 * @param {string} labelText - The text for the label.
 * @param {Gtk.Widget} widget - The widget to pair with the label.
 * @returns {Gtk.Box} - The labeled container.
 */
function _createLabeledWidget(labelText, widget) {
    const box = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, spacing: 10 });

    const label = new Gtk.Label({
        label: labelText,
        halign: Gtk.Align.START,
        hexpand: true
    });

    box.append(label);
    box.append(widget);

    return box;
}

/**
 * Creates a ComboBox with predefined options and binds it to a setting.
 * @param {string} labelText - The text for the label.
 * @param {string} settingKey - The key for the setting to bind.
 * @param {Object[]} options - Array of { id, label } objects for ComboBox options.
 * @returns {Gtk.Box} - The labeled ComboBox container.
 */
function _createLabeledComboBox(labelText, settingKey, options) {
    const comboBox = new Gtk.ComboBoxText();

    options.forEach(option => comboBox.append(option.id, option.label));
    comboBox.set_active_id(settings.get_string(settingKey));

    comboBox.connect('changed', () => {
        settings.set_string(settingKey, comboBox.get_active_id());
    });

    return _createLabeledWidget(labelText, comboBox);
}

/**
 * Creates a labeled Entry widget bound to a setting.
 * @param {string} labelText - The text for the label.
 * @param {string} settingKey - The key for the setting to bind.
 * @returns {Object} - { box: Gtk.Box, entry: Gtk.Entry }.
 */
function _createLabeledEntry(labelText, settingKey) {
    const entry = new Gtk.Entry({
        text: settings.get_string(settingKey),
        hexpand: true
    });

    return {
        box: _createLabeledWidget(labelText, entry),
        entry
    };
}

/**
 * Creates a labeled SpinButton widget bound to a setting.
 * @param {string} labelText - The text for the label.
 * @param {string} settingKey - The key for the setting to bind.
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 * @param {number} step - Step increment.
 * @returns {Object} - { box: Gtk.Box, spinButton: Gtk.SpinButton }.
 */
function _createLabeledSpinButton(labelText, settingKey, min, max, step) {
    const adjustment = new Gtk.Adjustment({
        lower: min,
        upper: max,
        step_increment: step
    });

    const spinButton = new Gtk.SpinButton({
        adjustment,
        value: settings.get_int(settingKey),
        hexpand: true
    });

    spinButton.connect('value-changed', () => {
        settings.set_int(settingKey, spinButton.get_value_as_int());
    });

    return {
        box: _createLabeledWidget(labelText, spinButton),
        spinButton
    };
}

/**
 * Builds the preferences widget.
 * @returns {Gtk.Box} - The main container with all preferences.
 */
function buildPrefsWidget() {
    const widget = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        spacing: 10,
        margin_top: 20,
        margin_bottom: 20,
        margin_start: 20,
        margin_end: 20
    });

    // Interface Name Entry
    const { box: interfaceBox, entry: interfaceEntry } = _createLabeledEntry(
        'Interface Name:',
        'interface'
    );
    widget.append(interfaceBox);

    // Icon Size Spin Button
    const { box: iconSizeBox, spinButton: iconSizeSpinButton } = _createLabeledSpinButton(
        'Icon Size:',
        'icon-size',
        16, // Minimum size
        128, // Maximum size
        1 // Step increment
    );
    widget.append(iconSizeBox);

    // Icon Theme ComboBox
    const iconThemeBox = _createLabeledComboBox(
        'Icon Theme:',
        'manual-theme',
        [
            { id: 'dark', label: 'Dark' },
            { id: 'light', label: 'Light' }
        ]
    );
    widget.append(iconThemeBox);

    // Save Button
    const saveButton = new Gtk.Button({
        label: 'Save',
        halign: Gtk.Align.CENTER
    });

    saveButton.connect('clicked', () => {
        settings.sync(); // Ensure settings are saved immediately
    });

    widget.append(saveButton);

    return widget;
}
