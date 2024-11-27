![License](https://img.shields.io/github/license/amnezia-vpn/amneziawg-gnome-extension?labelColor=303030&color=2dba4e)
[![GitHub release (latest)](https://img.shields.io/github/v/release/amnezia-vpn/amneziawg-gnome-extension?display_name=release&labelColor=303030&color=2dba4e)](https://github.com/amnezia-vpn/amneziawg-gnome-extension/releases/latest)
[![Download extension](https://img.shields.io/badge/Download-extensions.gnome.org-4a86cf?logo=gnome&logoColor=lightgrey&labelColor=303030)](https://extensions.gnome.org/extension/7586/amneziawg-toggle-button/)
[<img src="https://github.com/amnezia-vpn/amneziawg-gnome-extension/raw/master/images/get_it_on_gnome_extensions.png" height="100" align="right">](https://extensions.gnome.org/extension/7586/amneziawg-toggle-button/)
# AmneziaWG Gnome Shell Extension

<div align="center">
    <a href="https://docs.amnezia.org/documentation/amnezia-wg/">
        <img src="https://github.com/amnezia-vpn/amneziawg-gnome-extension/raw/master/icons/active-light.png" height="100">
    </a>
</div>

A GNOME Shell extension that allows you to toggle the **AmneziaWG** (via awg-quick@.service) conveniently from the system status bar. The extension supports custom icons for light and dark themes, which can be manually configured through the preferences.

> [!IMPORTANT]
> Extension requires [AmneziaWG Kernel Module](https://github.com/amnezia-vpn/amneziawg-linux-kernel-module) and [AmneziaWG Tools](https://github.com/amnezia-vpn/amneziawg-tools) to be installed

## Features

- Start/Stop awg-quick Service with a single click.
- Configure the interface name directly in the settings.
- Customizable icons for active/inactive states for both dark and light themes.
- Manual theme selection for icons (dark or light).
- Adjustable icon size.

## Screenshots

### Panel buton

![Screenshot](images/screenshot-panel.png)

### Settings window

![Screenshot](images/screenshot-prefs.png)

## Gnome Versions Support

 - 40|41|42|43|44 - `master` branch, `v3` tag

## Manual Installation

### Get extension from GIT:

```bash
git clone https://github.com/amnezia-vpn/amneziawg-gnome-extension.git ~/.local/share/gnome-shell/extensions/amneziawg@amnezia-vpn
```

> [!TIP]
> add `--branch <version tag>` if you need exact version

### Get extension from ZIP:
```bash
wget https://github.com/amnezia-vpn/amneziawg-gnome-extension/releases/download/v3/amneziawg@amnezia-vpn.shell-extension.zip
gnome-extensions install amneziawg@amnezia-vpn.shell-extension.zip --force
```

> [!TIP]
> Replace `v3` in url with `<version tag>` if you need another version

### Apply extension

1. Restart GNOME Shell
 - *For X11*: press `Alt + F2`, type `r`, and hit `Enter`.
 - *For Wayland*: logout and login again

2. Enable the extension using GNOME Extensions app or with `gnome-extensions enable amneziawg@amnezia-vpn` command

## Configuration

Open the extension preferences through the GNOME Extensions app to configure the following:

 - *Interface Name*: Specify the system interface name (default is awg0).
 - *Icon Size*: Adjust the size of the icons displayed in the system panel.
 - *Icon Theme*: Choose between dark or light theme icons.

## Work Mechanics

The extension interacts with the systemctl command to manage the AWG Quick Service:

 - *Start*: `sudo systemctl start awg-quick@<interface>`
 - *Stop*: `sudo systemctl stop awg-quick@<interface>`

Ensure that the awg-quick service is properly configured on your system.

## AmneziaWG client setup

### Install AmneziaWG

You can use [this instructions](https://github.com/amnezia-vpn/amneziawg-linux-kernel-module/blob/master/README.md#installation) to install **AmneziaWG**

### Install configuration file

- Configuration Directory: `/etc/amnezia/amneziawg/`
- Configuration File Name Format: `*.conf`
- Configuration File Permissions: Any 'root' readable

> [!TIP]
> While the configuration file can have any name, it is recommended to name it `awg0.conf`, as this name is used by default by the application. However, you can choose any name and update the configuration in the extension settings accordingly.

### Sudoers

The command triggered by the extension button requires `sudo` permissions. To avoid entering your password each time you toggle the button, add a sudoers file with the following content:

```
io ALL=(ALL:ALL) NOPASSWD: /usr/bin/systemctl
```

## License

This project is licensed under the GPL-2.0 License. See the [LICENSE](LICENSE) file for details.

## Contribution

Feel free to open issues or submit pull requests to improve this extension.
