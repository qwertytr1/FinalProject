const translationsPL = {
  register: {
    title: 'Zarejestruj się',
    formText: 'Utwórz konto, aby rozpocząć',
    username: 'Nazwa użytkownika',
    messageUserName: 'Proszę wprowadzić nazwę użytkownika!',
    inputUsername: 'Wprowadź nazwę użytkownika',
    emailLabel: 'E-mail',
    emailError: 'Proszę wprowadzić poprawny e-mail!',
    emailMessage: 'Proszę wprowadzić swój e-mail!',
    emailPlaceholder: 'Wprowadź swój e-mail',
    passwordLabel: 'Hasło',
    passwordMessage: 'Proszę wprowadzić hasło!',
    passwordPlaceholder: 'Wprowadź hasło',
    languageLabel: 'Język',
    languageMessage: 'Proszę wybrać język!',
    languagePlaceholder: 'Wybierz język',
    rus: 'Rosyjski',
    en: 'Angielski',
    pl: 'Polski',
    themePlaceholder: 'Wybierz motyw',
    themeLabel: 'Motyw',
    black: 'Czarny',
    white: 'Biały',
    themeMessage: 'Proszę wybrać motyw!',
    RoleLabel: 'Rola',
    RoleMessage: 'Proszę wybrać rolę!',
    RolePlaceholder: 'Wybierz rolę',
    admin: 'Administrator',
    user: 'Użytkownik',
    register: 'Zarejestruj się',
  },
  login: {
    title: 'Witaj ponownie',
    subtitle: 'Proszę zalogować się na swoje konto',
    emailLabel: 'E-mail',
    emailPlaceholder: 'Wprowadź swój e-mail',
    emailRequiredMessage: 'Proszę wprowadzić swój e-mail!',
    emailInvalidMessage: 'Proszę wprowadzić poprawny e-mail!',
    passwordLabel: 'Hasło',
    passwordPlaceholder: 'Wprowadź hasło',
    passwordRequiredMessage: 'Proszę wprowadzić hasło!',
    loginButton: 'Zaloguj się',
    loginSuccessMessage: 'Zalogowano pomyślnie',
    loginErrorMessage: 'Błąd logowania. Sprawdź swoje dane.',
    registrationPrompt: 'Nie masz konta?',
    registrationLink: 'Zarejestruj się tutaj',
  },
  profile: {
    pageTitle: 'Strona profilu',
    editProfileButton: 'Edytuj profil',
    saveButton: 'Zapisz',
    cancelButton: 'Anuluj',
    usernameLabel: 'Nazwa użytkownika',
    usernameError: 'Proszę wprowadzić nazwę użytkownika!',
    emailLabel: 'E-mail',
    emailError: 'Proszę wprowadzić poprawny e-mail!',
    languageLabel: 'Język',
    languageError: 'Proszę wprowadzić język!',
    themeLabel: 'Motyw',
    themeError: 'Proszę wprowadzić motyw!',
    passwordLabel: 'Hasło',
    descriptions: {
      username: 'Nazwa użytkownika',
      email: 'E-mail',
      language: 'Język',
      theme: 'Motyw',
      role: 'Rola',
    },
  },
  adminPanel: {
    title: 'Panel administratora',
    userListPanelHeader: 'Lista użytkowników',
    refreshUserListButton: 'Odśwież listę użytkowników',
    noUsersMessage: 'Brak dostępnych użytkowników',
    blockConfirmationTitle: 'Czy na pewno chcesz zablokować tego użytkownika?',
    unblockConfirmationTitle:
      'Czy na pewno chcesz odblokować tego użytkownika?',
    blockButton: 'Zablokuj',
    unblockButton: 'Odblokuj',
    successBlockMessage: 'Użytkownik {userId} został zablokowany',
    successUnblockMessage: 'Użytkownik {userId} został odblokowany',
    errorBlockMessage: 'Nie udało się zablokować użytkownika.',
    errorUnblockMessage: 'Nie udało się odblokować użytkownika.',
  },
  sidebarMenu: {
    main: 'Strona główna',
    addTemplate: 'Dodaj formularz',
    templates: 'Utworzone formularze',
    profile: 'Profil',
    admin: 'Administracja',
    adminPanel: 'Użytkownicy',
    statistics: 'Statystyki',
    adminTemplates: 'Szablony',
    tags: 'Utwórz tagi',
    welcomeTitle: 'Witaj!',
    welcomeMessage: 'Wybierz element menu, aby rozpocząć.',
    statisticsPlaceholder: 'Informacje o statystykach będą wyświetlane tutaj.',
  },
  addTagPage: {
    title: 'Dodaj tag',
    placeholder: 'Wprowadź nazwę tagu',
    addButton: 'Dodaj tag',
    noPermissionMessage: 'Nie masz uprawnień do dodawania tagów.',
    successMessage: 'Tag został dodany pomyślnie!',
    errorMessage: 'Nie udało się dodać tagu.',
    tagRequiredMessage: 'Nazwa tagu jest wymagana.',
  },
  addTemplates: {
    title: 'Utwórz szablon',
    successMessage: 'Szablon utworzony pomyślnie!',
    errorMessage: 'Nie udało się utworzyć szablonu',
  },
  templateDetails: {
    title: 'Tytuł',
    description: 'Opis',
    category: 'Kategoria',
    image: 'Obraz',
    ButtonImage: 'Prześlij obraz',
    makePublic: 'Czy chcesz, aby ten szablon był publiczny?',
    nextButton: 'Dalej',
    mathematics: 'Matematyka',
    physics: 'Fizyka',
    chemistry: 'Chemia',
    biology: 'Biologia',
    history: 'Historia',
    geography: 'Geografia',
    literature: 'Literatura',
    computerScience: 'Informatyka',
    foreignLanguages: 'Języki obce',
    art: 'Sztuka',
    music: 'Muzyka',
    philosophy: 'Filozofia',
    economics: 'Ekonomia',
    psychology: 'Psychologia',
    travel: 'Podróże',
    cars: 'Samochody',
    sports: 'Sport',
    health: 'Zdrowie',
    technology: 'Technologia',
    programming: 'Programowanie',
    fashion: 'Moda',
    cooking: 'Gotowanie',
    gaming: 'Gry',
    scienceFiction: 'Fantastyka naukowa',
    environment: 'Środowisko',
  },
  templatePage: {
    title: 'Czy na pewno chcesz usunąć ten szablon?',
    content: 'Tego działania nie można cofnąć.',
    okText: 'Tak, usuń',
    okType: 'danger',
    cancelText: 'Anuluj',
    spinTip: 'Ładowanie szablonów...',
    errorMessage: 'Błąd',
    zeroTemplates: 'Brak szablonów',
    deleteButton: 'Usuń',
  },
  templateDetailsPage: {
    title: 'Czy na pewno chcesz usunąć ten szablon?',
    content: 'Tego działania nie można cofnąć.',
    okText: 'Tak, usuń',
    okType: 'danger',
    cancelText: 'Anuluj',
    spinTip: 'Ładowanie szablonów...',
    errorMessage: 'Błąd',
    zeroTemplates: 'Brak szablonów',
    category: 'Kategoria:',
    editTemplate: 'Edytuj szablon',
    deleteButton: 'Usuń szablon',
    templateTitle: 'Tytuł szablonu',
    templateTitlePlaceholder: 'Wprowadź tytuł szablonu',
    description: 'Opis',
    descriptionPlaceholder: 'Wprowadź opis',
    categoryLabel: 'Kategoria',
    categoryPlaceholder: 'Wprowadź kategorię',
    saveTemplate: 'Zapisz szablon',
    questionsTitle: 'Pytania',
    addQuestion: 'Dodaj pytanie',
    saveQuestion: 'Zapisz pytanie',
    saveEditedQuestion: 'Zapisz edytowane pytanie',
    questionTitle: 'Tytuł pytania',
    questionTitlePlaceholder: 'Wprowadź tytuł pytania',
    questionType: 'Typ pytania',
    questionTypePlaceholder: 'Wybierz typ pytania',
    questionDescription: 'Opis pytania',
    questionDescriptionPlaceholder: 'Wprowadź opis pytania (opcjonalnie)',
    correctAnswer: 'Poprawna odpowiedź',
    correctAnswerPlaceholder: 'Wprowadź poprawną odpowiedź (opcjonalnie)',
    noQuestions: 'Brak pytań.',
    editButton: 'Edytuj',
    deleteButtonQuestion: 'Usuń',
  },
};
export default translationsPL;
