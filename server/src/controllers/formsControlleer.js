const FormService = require('../services/forms-service.js');
exports.getAllForms = async (req, res, next) => {
    try {
        const forms = await FormService.getAllForms();
        res.status(forms.status).json(forms.json);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getFormsById = async (req, res, next) => {
    const { id: id } = req.params;
    console.log(id)
    try {
        const forms = await FormService.getFormsById(id);
        res.status(forms.status).json(forms.json);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
        exports.updateForms = async (req, res, next) => {
            const { id: id } = req.params;
            const formData = req.body;
            try {
                const forms = await FormService.updateForms(id, formData);
                res.status(forms.status).json(forms.json);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
        exports.createForms = async (req, res, next) => {
            const { templates_id: template_id, users_id: user_id } = req.body;
            try {
                const forms = await FormService.createForms(template_id, user_id);
                res.status(forms.status).json(forms.json);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
        exports.deleteForms = async (req, res, next) => {
            const { id: id } = req.params;
            try {
                const forms = await FormService.deleteForms(id);
                res.status(forms.status).send();
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
