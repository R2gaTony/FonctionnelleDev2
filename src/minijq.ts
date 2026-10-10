export const moi = {
    nom: "Antoine Pellegrini",
    matricule: "22 116 416"
};

export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [cle: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export type Filtre = (entree: JsonValue) => Resultat;

export type Resultat = { resultats: JsonValue[] };

export function resultat(resultats: JsonValue[]): Resultat {

}

export function estString(json: JsonValue): json is string {
}

export function estNumber(json: JsonValue): json is number {
}

export function estBoolean(json: JsonValue): json is boolean {
}

export function estNull(json: JsonValue): json is null {
}

export function estPrimitive(json: JsonValue): json is JsonPrimitive {
}

export function estObjet(json: JsonValue): json is JsonObject {
}

export function estTableau(json: JsonValue): json is JsonValue[] {
}

export function cle(nom: string): Filtre {
}

export function minijq(i: number): Filtre {
}

export function tous(): Filtre {
}

export function trouverPremier(nom: string): Filtre {
}

export function descendre(nom: string): Filtre {
}

export function filtrer(p: (json: JsonValue) => boolean): Filtre {
}

export function transformer(f: (json: JsonValue) => JsonValue): Filtre {
}

export function chaine(...filtres: Filtre[]): Filtre {
}

// Extrait la liste des titres de tous les cours
export const titresDesCours: Filtre;

// Extrait les sigles des cours où actif === true
export const siglesCoursActifs: Filtre;

// Recherche dans tous les cours, les noms des personnes étudiantes ayant une note >= 85
export const personnesEtudiantes85: Filtre;

// Crée un sélecteur qui trouve le premier bureau d'un enseignant du cours avec le sigle reçu en paramètre
export const premierBureau: (sigle: string) => Filtre;

// Fonction utilitaire pour afficher un JsonValue
export function afficher(json: JsonValue) {
    console.log(JSON.stringify(json));
}

const value: JsonValue = {
    departement: "Informatique",
    cours: [
        {
            sigle: "IFT359",
            titre: "Programmation Fonctionnelle",
            actif: true,
            enseignants: [
                {nom: "Professeur A", bureau: "D1-2004"},
                {nom: "Chargé de cours X", bureau: "D1-2006"},
            ],
            etudiants: [
                {nom: "Alice", note: 88},
                {nom: "Bob", note: 62},
            ],
        },
        {
            sigle: "IFT209",
            titre: "Structures de Données",
            actif: false,
            enseignants: [{nom: "Professeur B", bureau: "D1-2010"}],
            etudiants: [{nom: "Charlie", note: 94}],
        },
    ],
};
