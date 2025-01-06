const SettingService = require("../services/settings-service.js");

class SettingsController {
  static async getSettings(req, res, next) {
    const id = req.params.id;
    try {
      const settings = await SettingService.getSettings(id);
      res.status(settings.status).json(settings.json);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async editSettings(req, res, next) {
    const id = req.params.id;
    const { language, theme, role } = req.body;

    if (theme && !["light", "dark"].includes(theme)) {
      return res.status(400).json({ message: "Invalid theme value" });
    }

    if (language && typeof language !== "string") {
      return res.status(400).json({ message: "Invalid language value" });
    }

    try {
      const updatedSettings = await SettingService.editSettings(id, language, theme, role);
      res.status(updatedSettings.status).json(updatedSettings.json);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = SettingsController;
