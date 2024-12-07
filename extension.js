const { GObject, St, Gio, GLib } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Util = imports.misc.util;
const { GsettingsManager } = Me.imports.gsettingsManager;

class ToggleAWG {
    constructor(gsettingsManager) {
        this._isActive = false;
        this.gsettingsManager = gsettingsManager;
    }

    _getIconPath(isActive) {
        const manualTheme = this.gsettingsManager.getValue('manual-theme');
        const iconType = manualTheme === 'dark' ? 'dark' : 'light';
        return `${Me.path}/icons/${isActive ? 'active-' : 'inactive-'}${iconType}.png`;
    }

    toggleService() {
        const iface = this.gsettingsManager.getValue('interface');
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
        _init(toggleAWG, gsettingsManager) {
            super._init(0.0, 'Toggle AWG Button');
            this.toggleAWG = toggleAWG;
            this.gsettingsManager = gsettingsManager;

            this._icon = this._createIcon(false);
            this.add_child(this._icon);

            this.connect('button-press-event', () => {
                this.toggleAWG.toggleService();
                this._updateIcon();
            });

            this.gsettingsManager.settings.connect('changed', () => this._updateIcon());
        }

        _createIcon(isActive) {
            return new St.Icon({
                gicon: Gio.icon_new_for_string(this.toggleAWG._getIconPath(isActive)),
                icon_size: this.gsettingsManager.getValue('icon-size'),
                style_class: 'system-status-icon',
            });
        }

        _updateIcon() {
            const isActive = this.toggleAWG._isActive;
            this._icon.gicon = Gio.icon_new_for_string(this.toggleAWG._getIconPath(isActive));
            this._icon.icon_size = this.gsettingsManager.getValue('icon-size');
        }
    }
);

class Extension {
    constructor() {}

    enable() {
        this._button = null;
        this._gsettingsManager = new GsettingsManager();
        const toggleAWG = new ToggleAWG(this._gsettingsManager);
        this._button = new ToggleAWGButton(toggleAWG, this._gsettingsManager);
        Main.panel.addToStatusArea('toggle-awg-button', this._button);
    }

    disable() {
        if (this._button) {
            this._button.destroy();
            this._button = null;
        }
        if (this._gsettingsManager) {
            this._gsettingsManager = null;
        }
    }
}

function init() {
    return new Extension();
}
