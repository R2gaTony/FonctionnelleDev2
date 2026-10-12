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
    return {
        resultats
    };
}

export function estString(json: JsonValue): json is string {
    return typeof json === "string";
}

export function estNumber(json: JsonValue): json is number {
    return typeof json === "number";
}

export function estBoolean(json: JsonValue): json is boolean {
    return typeof json === "boolean";
}

export function estNull(json: JsonValue): json is null {
    return json === null;
}

export function estPrimitive(json: JsonValue): json is JsonPrimitive {
    return estString(json) || estNumber(json) || estBoolean(json) || estNull(json);
}

export function estObjet(json: JsonValue): json is JsonObject {
    return typeof json === "object"
        && !estNull(json)
        && !Array.isArray(json);
}

export function estTableau(json: JsonValue): json is JsonValue[] {
    return Array.isArray(json);
}

export function cle(nom: string): Filtre {
    return (entree: JsonValue) => {
        if (estObjet(entree)) {
            if (nom in entree)
                return resultat([entree[nom]]);
        }
        return resultat([]);
    }
}

export function minijq(i: number): Filtre {
    return (entree: JsonValue) => {
        if (estTableau(entree)) {
            if (i < entree.length && i >= 0)
                return resultat([entree[i]]);
        }
        return resultat([]);
    }
}

export function tous(): Filtre {
    return (entree: JsonValue) => {
        if (estTableau(entree))
            return resultat(entree);
        if (estObjet(entree))
            return resultat(Object.values(entree));
        return resultat([]);
    }
}

export function trouverPremier(nom: string): Filtre {
    return (entree: JsonValue) => {
        function chercher(
            aExplorer: JsonValue[],
        ): Resultat {
            if (aExplorer.length === 0)
                return resultat([]);

            const [courant, ...reste] = aExplorer;

            if (estObjet(courant) && nom in courant)
                return resultat([courant[nom]]);

            if (estObjet(courant) || estTableau(courant))
                return chercher([...tous()(courant).resultats, ...reste]);

            return chercher(reste);
        }

        return chercher([entree]);
    }
}

export function descendre(nom: string): Filtre {
    return (entree: JsonValue) => {
        function chercher(
            aExplorer: JsonValue[],
            acc: JsonValue[]
        ): Resultat {
            if (aExplorer.length === 0)
                return resultat(acc);

            const [courant, ...reste] = aExplorer;

            const newAcc = estObjet(courant) && nom in courant
                ? [...acc, courant[nom]]
                : acc;

            if (estObjet(courant) || estTableau(courant))
                return chercher([...tous()(courant).resultats, ...reste], newAcc);

            return chercher(reste, newAcc);
        }

        return chercher([entree], []);
    }
}

export function filtrer(p: (json: JsonValue) => boolean): Filtre {
    return (entree: JsonValue) => {
        return p(entree)? resultat([entree]) : resultat([]);
    }
}

export function transformer(f: (json: JsonValue) => JsonValue): Filtre {
    return (entree: JsonValue) => {
        return resultat([f(entree)]);
    }
}

export function chaine(...filtres: Filtre[]): Filtre {
    return (entree: JsonValue) => {
        return filtres.reduce(
            (acc, filtre) =>
                resultat(
                    acc.resultats.flatMap(
                        valeur => filtre(valeur).resultats
                    )
                ),
            resultat([entree])
        );
    };
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
