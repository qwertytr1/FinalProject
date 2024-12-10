module.exports = class UserDto{
    id;
    email;
    username;
    language;
    theme;
    constructor(model) {
        this.email = model.email;
        this.id = model.id;
        this.username = model.username;
        this.language = model.language;
        this.theme = model.theme;
    }

}