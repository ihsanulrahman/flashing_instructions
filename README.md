# 📱 Flashing Instructions for Miatoll Devices

> **Supported Devices:** Redmi Note 9S / 9Pro / 9Pro Max / 10Lite / Poco M2 Pro

## Table of Contents
- [Recommended Recoveries](#recommended-recoveries)
- [Terminology](#terminology)
- [Preparation](#preparation)
- [Flashing Steps](#flashing-steps)
  - [Clean Flash](#clean-flash)
  - [Dirty Flash](#dirty-flash)
  - [VoltageOS (Sandbox Gapps)](#voltageos--clean-flash-sandbox-gapps)
- [Important Notes](#important-notes)
- [Troubleshooting](#troubleshooting)
- [Support](#support)
- [Contributing](#contributing)

---

## Recommended Recoveries

- [OrangeFox FBEv2](https://cyberneticsnail.pages.dev/api/raw?path=/test/OrangeFox-R11.3-Unofficial-miatoll.zip)
- [TWRP](https://t.me/clarencerepo/510)
- AOSP Recovery (included in ROM zip)

## Terminology

- **Clean Flash:** Wipes all data before installing the ROM, recommended for major updates.
- **Dirty Flash:** Installs a new ROM version over the old one, keeping user data.
- **Gapps:** Google Apps package for ROMs without built-in Google services.

## Preparation

1. Backup your data! Flashing may erase all device data.
2. Charge your device to at least 50%.
3. Download your chosen recovery and ROM zip files.

---

## Flashing Steps

### Clean Flash

> ⚠️ **Warning:** This will erase all your data.

1. Boot to recovery.
2. Wipe: Dalvik, Data, and Cache.
3. Flash ROM zip.
4. Format Data (`FORMAT DATA` or `Factory Reset`).
5. *(Optional)* Flash Gapps if your ROM doesn't include Google Apps.
6. Reboot system.

### Dirty Flash

1. Boot to recovery.
2. Wipe Dalvik Cache *(Do NOT wipe Data)*.
3. Flash new ROM zip.
4. Reboot system.
5. *(Optional)* Flash Magisk after first boot if previously rooted.
6. *(Optional)* Flash Gapps if previously used.

### VoltageOS ⚡ Clean Flash (Sandbox Gapps)

1. Flash ROM via recovery.
2. Format Data/Factory Reset.
3. Reboot system.
4. Download and install [App Store](https://github.com/GrapheneOS/AppStore/releases).
5. Open the App Store and download desired apps.
   - ![App screenshot](https://raw.githubusercontent.com/Karan-Frost/images/refs/heads/main/IMG_20241209_143433_631.jpg)
6. For Google Contacts sync issues: Give Contacts permission to Play Services and reboot.
7. More about Sandbox Gapps: [Read here](https://grapheneos.org/usage#sandboxed-google-play).
8. For specific fixes: [VoltageOS support post](https://t.me/voltageos/122664).

---

## Important Notes

- If upgrading from Android 11/12/13 to 14/15/16, **format data after first boot** to avoid storage bugs.
- Always read ROM-specific instructions if provided.

## Troubleshooting

- **Attachment not supported / storage bugs:** Perform a data format after first boot.
- **Contact sync issues:** Ensure Play Services has Contacts permission and reboot.

## Support

- For questions, join the [SUPPORT GROUP](https://t.me/Miatoll_Support).

---

## Contributing

Found a mistake or want to suggest improvements? Feel free to open a Pull Request!

---

**Happy Flashing! 🚀**
