type UserBase = {
    email: String,
    nome: String,
    cognome: String,
    ruolo: "Amministratore" | "Analista" | "Circoscrizione" | "Sondaggista",
    imageUrl: String
};

export default UserBase;