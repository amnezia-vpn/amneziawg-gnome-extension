const { GObject, St, Gio, GLib } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Util = imports.misc.util;

class ToggleAWG {
    constructor(settings) {
        this._isActive = false;
        this.settings = settings;
    }

    _getIconPath(isActive) {
        const manualTheme = this.settings.get_string('manual-theme');
        const iconType = manualTheme === 'dark' ? 'dark' : 'light';
        return `${Me.path}/icons/${isActive ? 'active-' : 'inactive-'}${iconType}.png`;
    }

    toggleService() {
        const iface = this.settings.get_string('interface');
        if (!iface) {
            Main.notify('Toggle AWG', 'No interface set in settings!');
            return;
        }

        const action = this._isActive ? 'stop' : 'start';
        const command = ['sudo', 'systemctl', action, `awg-quick@${iface}`];

        Util.spawn(command);
        this._isActive = !this._isActive;
    }
}

var ToggleAWGButton = GObject.registerClass(
    class ToggleAWGButton extends PanelMenu.Button {
        _init(toggleAWG, settings) {
            super._init(0.0, 'Toggle AWG Button');
            this.toggleAWG = toggleAWG;
            this.settings = settings;

            this._icon = this._createIcon(false);
            this.add_child(this._icon);

            this.connect('button-press-event', () => {
                this.toggleAWG.toggleService();
                this._updateIcon();
            });

            this.settings.connect('changed', () => this._updateIcon());
        }

        _createIcon(isActive) {
            return new St.Icon({
                gicon: Gio.icon_new_for_string(this.toggleAWG._getIconPath(isActive)),
                icon_size: this.settings.get_int('icon-size'),
                style_class: 'system-status-icon',
            });
        }

        _updateIcon() {
            const isActive = this.toggleAWG._isActive;
            this._icon.gicon = Gio.icon_new_for_string(this.toggleAWG._getIconPath(isActive));
	    this._icon.icon_size = this.settings.get_int('icon-size');
        }
    }
);

class Extension {
    constructor() {
    }

    _initializeDefaults() {
        if (!this._settings.get_string('interface')) {
            this._settings.set_string('interface', 'awg0');
        }
        if (!this._settings.get_int('icon-size')) {
            this._settings.set_int('icon-size', 32);
        }
        if (!this._settings.get_string('manual-theme')) {
            this._settings.set_string('manual-theme', 'dark');
        }
    }

    enable() {
        this._button = null;
        this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.amneziawg');
        this._initializeDefaults();
        const toggleAWG = new ToggleAWG(this._settings);
        this._button = new ToggleAWGButton(toggleAWG, this._settings);
        Main.panel.addToStatusArea('toggle-awg-button', this._button);
    }

    disable() {
        if (this._button) {
            this._button.destroy();
            this._button = null;
        }
    }
}

function init() {
    return new Extension();
}
