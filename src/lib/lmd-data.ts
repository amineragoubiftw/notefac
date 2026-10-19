export type ExamType = "examen" | "ds" | "cc" | "ds1" | "ds2" | "control";

export interface ModuleDef {
  name: string;
  coef: number;
  credits?: number;
  examTypes?: ExamType[]; // default: ["examen","ds","cc"]
  rg?: Rg; // ESSTHS regime: MX (CC10/DS20/EX70) or CC (CC10/DS45/EX45)
  weights?: Partial<Record<ExamType, number>>;
}

export type Rg = "MX" | "CC";

export interface UEDef {
  name: string;
  coef: number;
  credits: number;
  modules: ModuleDef[];
  rg?: Rg;
  /** Mutually exclusive option group; only the selected UE of a group counts. */
  optionGroup?: string;
}

export interface SemesterDef {
  name: string;
  ues: UEDef[];
}

export interface MajorDef {
  id: string;
  name: string;
  semesters: SemesterDef[];
}

export interface InstituteDef {
  id: string;
  name: string;
  majors: MajorDef[];
}

export interface UniversityDef {
  id: string;
  name: string;
  institutes: InstituteDef[];
}

// Default exam mix (Examen 70 / DS 20 / CC 10)
const FULL: ExamType[] = ["examen", "ds", "cc"];
const TRANS: ExamType[] = ["ds1", "ds2", "cc"];
const EXAM_DS: ExamType[] = ["examen", "ds"];

export const universities: UniversityDef[] = [
  {
    id: "ut",
    name: "Université de Tunis",
    institutes: [
      { id: "institut-superieur-de-gestion-de-tunis", name: "Institut supérieur de gestion de Tunis", majors: [] },
      { id: "faculte-des-sciences-humaines-et-sociale", name: "Faculté des sciences humaines et sociales de Tunis", majors: [] },
      { id: "institut-superieur-de-l-animation-pour-l", name: "Institut supérieur de l'animation pour la jeunesse et la culture de Bir El Bey", majors: [] },
      { id: "institut-superieur-des-beaux-arts-de-tun", name: "Institut supérieur des beaux-arts de Tunis", majors: [] },
      { id: "institut-superieur-d-art-dramatique-de-t", name: "Institut supérieur d'art dramatique de Tunis", majors: [] },
      { id: "ecole-nationale-superieure-des-ingenieur", name: "Ecole nationale supérieure des ingénieurs de Tunis", majors: [] },
      { id: "institut-superieur-des-metiers-du-patrim", name: "Institut supérieur des métiers du patrimoine de Tunis", majors: [] },
      { id: "institut-superieur-de-musique-de-tunis", name: "Institut supérieur de musique de Tunis", majors: [] },
      { id: "ecole-superieure-des-sciences-economique", name: "Ecole supérieure des sciences économiques et commerciales de Tunis", majors: [] },
      { id: "institut-superieur-des-etudes-appliquees", name: "Institut supérieur des études appliquées en humanité de Zaghouan", majors: [] },
      { id: "institut-preparatoire-aux-etudes-littera", name: "Institut préparatoire aux études littéraires et des sciences humaines de Tunis", majors: [] },
    ],
  },
  {
    id: "um",
    name: "Université de Manouba",
    institutes: [
      { id: "institut-superieur-de-biotechnologie-de-", name: "Institut supérieur de biotechnologie de Sidi Thabet", majors: [] },
      { id: "ecole-superieure-de-commerce-de-tunis", name: "Ecole supérieure de commerce de Tunis", majors: [] },
      { id: "ecole-superieure-d-economie-numerique-de", name: "Ecole supérieure d'économie numérique de Manouba", majors: [] },
      { id: "ecole-superieure-des-sciences-et-technol", name: "Ecole supérieure des sciences et technologie de design", majors: [] },
      { id: "institut-superieur-du-sport-et-de-l-educ", name: "Institut supérieur du sport et de l'éducation physique de Ksar-Saïd", majors: [] },
      { id: "institut-national-du-travail-et-des-etud", name: "Institut national du travail et des études sociales de Tunis", majors: [] },
      { id: "institut-superieur-de-comptabilite-et-d-", name: "Institut supérieur de comptabilité et d'administration des entreprises", majors: [] },
      { id: "institut-de-presse-et-des-sciences-de-l-", name: "Institut de presse et des sciences de l'information", majors: [] },
      { id: "institut-superieur-de-documentation", name: "Institut supérieur de documentation", majors: [] },
      { id: "faculte-des-lettres-arts-et-humanites-de", name: "Faculté des lettres, arts et humanités de Manouba", majors: [] },
      { id: "institut-superieur-de-l-education-specia", name: "Institut supérieur de l'éducation spécialisée", majors: [] },
      { id: "institut-superieur-des-arts-du-multimedi", name: "Institut supérieur des arts du multimédia de Manouba", majors: [] },
    ],
  },
  {
    id: "utm",
    name: "Université de Tunis El Manar",
    institutes: [
      { id: "fst", name: "Faculté des sciences de Tunis", majors: [

          {
            id: "math-l1",
            name: "Mathématiques — L1",
            semesters: [
              {
                name: "Semestre 1",
                ues: [
                  {
                    name: "UE1 — Analyse", coef: 4, credits: 8,
                    modules: [
                      { name: "Analyse 1", coef: 2, examTypes: FULL },
                      { name: "Topologie", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE2 — Algèbre", coef: 4, credits: 8,
                    modules: [
                      { name: "Algèbre linéaire 1", coef: 2, examTypes: FULL },
                      { name: "Arithmétique", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE3 — Physique", coef: 3, credits: 6,
                    modules: [
                      { name: "Mécanique", coef: 1.5, examTypes: FULL },
                      { name: "Électricité", coef: 1.5, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE4 — Informatique", coef: 2, credits: 4,
                    modules: [{ name: "Programmation C", coef: 2, examTypes: FULL }],
                  },
                  {
                    name: "UE5 — Langues", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais", coef: 1, examTypes: FULL },
                      { name: "Français", coef: 1, examTypes: FULL },
                    ],
                  },
                ],
              },
              {
                name: "Semestre 2",
                ues: [
                  {
                    name: "UE1 — Analyse 2", coef: 4, credits: 8,
                    modules: [
                      { name: "Analyse 2", coef: 2, examTypes: FULL },
                      { name: "Suites & séries", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE2 — Algèbre 2", coef: 4, credits: 8,
                    modules: [
                      { name: "Algèbre linéaire 2", coef: 2, examTypes: FULL },
                      { name: "Géométrie", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE3 — Probabilités", coef: 3, credits: 6,
                    modules: [{ name: "Probabilités", coef: 3, examTypes: FULL }],
                  },
                  {
                    name: "UE4 — Statistiques", coef: 2, credits: 4,
                    modules: [{ name: "Statistiques descriptives", coef: 2, examTypes: FULL }],
                  },
                  {
                    name: "UE5 — Transversale", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais 2", coef: 1, examTypes: TRANS },
                      { name: "Culture & entrepreneuriat", coef: 1, examTypes: TRANS },
                    ],
                  },
                ],
              },
            ],
          },
      ] },
      { id: "faculte-des-sciences-economiques-et-de-g", name: "Faculté des sciences économiques et de gestion de Tunis", majors: [] },
      { id: "faculte-de-droit-et-des-sciences-politiq", name: "Faculté de droit et des sciences politiques de Tunis", majors: [] },
      { id: "ecole-superieure-des-sciences-et-techniq", name: "Ecole supérieure des sciences et techniques de la santé de Tunis", majors: [] },
      { id: "institut-superieur-des-technologies-medi", name: "Institut supérieur des technologies médicales de Tunis", majors: [] },
      { id: "institut-superieur-des-sciences-biologiq", name: "Institut supérieur des sciences biologiques appliquées de Tunis", majors: [] },
      { id: "institut-superieur-des-sciences-humaines", name: "Institut supérieur des sciences humaines de Tunis", majors: [] },
      { id: "institut-superieur-de-l-informatique", name: "Institut supérieur de l'informatique", majors: [] },
      { id: "institut-superieur-des-sciences-infirmie", name: "Institut supérieur des sciences infirmières de Tunis", majors: [] },
    ],
  },
  {
    id: "uc",
    name: "Université de Carthage",
    institutes: [
      { id: "institut-superieur-des-etudes-touristiqu", name: "Institut supérieur des études touristiques et hôtelières de Sidi Dhrif", majors: [] },
      { id: "ecole-superieure-des-industries-alimenta", name: "Ecole supérieure des industries alimentaires de Tunis", majors: [] },
      { id: "ecole-superieure-d-agriculture-de-mateur", name: "Ecole supérieure d'agriculture de Mateur", majors: [] },
      { id: "ecole-superieure-d-agriculture-de-mogran", name: "Ecole supérieure d'agriculture de Mograne", majors: [] },
      { id: "faculte-des-sciences-juridiques-et-polit", name: "Faculté des sciences juridiques et politiques et sociales de Tunis", majors: [] },
      { id: "ecole-nationale-d-ingenieurs-de-carthage", name: "Ecole nationale d'ingénieurs de Carthage", majors: [] },
      { id: "faculte-des-sciences-de-bizerte", name: "Faculté des sciences de Bizerte", majors: [] },
      { id: "institut-superieur-des-langues-de-tunis", name: "Institut supérieur des langues de Tunis", majors: [] },
      { id: "institut-superieur-des-beaux-arts-de-nab", name: "Institut supérieur des beaux-arts de Nabeul", majors: [] },
      { id: "faculte-des-sciences-economiques-et-de-g", name: "Faculté des sciences économiques et de gestion de Nabeul", majors: [] },
      { id: "institut-superieur-des-langues-de-nabeul", name: "Institut supérieur des langues de Nabeul", majors: [] },
      { id: "institut-superieur-de-gestion-de-bizerte", name: "Institut supérieur de gestion de Bizerte", majors: [] },
      { id: "institut-superieur-des-cadres-de-l-enfan", name: "Institut supérieur des cadres de l'enfance", majors: [] },
      { id: "institut-superieur-des-sciences-applique", name: "Institut supérieur des sciences appliquées et technologie de Mateur", majors: [] },
      { id: "institut-superieur-des-technologies-de-l", name: "Institut supérieur des technologies de l'environnement, de l'urbanisme et du bâtiment", majors: [] },
      { id: "institut-superieur-des-sciences-de-la-me", name: "Institut supérieur des sciences de la mer de Bizerte", majors: [] },
      { id: "institut-superieur-des-sciences-et-techn", name: "Institut supérieur des sciences et technologie de l'environnement de Borj Cédria", majors: [] },
    ],
  },
  {
    id: "uez",
    name: "Université Ez-Zitouna",
    institutes: [
      { id: "institut-superieur-de-la-civilisation-is", name: "Institut supérieur de la civilisation islamique de Tunis", majors: [] },
      { id: "institut-superieur-de-theologie-de-tunis", name: "Institut supérieur de théologie de Tunis", majors: [] },
      { id: "institut-superieur-des-sciences-islamiqu", name: "Institut supérieur des sciences islamiques de Kairouan", majors: [] },
    ],
  },
  {
    id: "uso",
    name: "Université de Sousse",
    institutes: [
      { id: "faculte-des-lettres-et-des-sciences-huma", name: "Faculté des lettres et des sciences humaines de Sousse", majors: [] },
      { id: "institut-superieur-d-informatique-et-des", name: "Institut supérieur d'informatique et des technologies de communication de Sousse", majors: [] },
      { id: "ecole-superieure-des-sciences-et-techniq", name: "Ecole supérieure des sciences et techniques de la santé de Sousse", majors: [] },
      { id: "institut-superieur-des-beaux-arts-de-sou", name: "Institut supérieur des beaux-arts de Sousse", majors: [] },
      { id: "institut-superieur-des-sciences-infirmie", name: "Institut supérieur des sciences infirmières de Sousse", majors: [] },
      { id: "institut-superieur-de-finances-et-de-fis", name: "Institut supérieur de finances et de fiscalité de Sousse", majors: [] },
      { id: "institut-superieur-des-sciences-applique", name: "Institut supérieur des sciences appliquées et de technologie de Sousse", majors: [] },
      { id: "institut-superieur-de-musique-de-sousse", name: "Institut supérieur de musique de Sousse", majors: [] },
      { id: "institut-superieur-du-transport-et-de-la", name: "Institut supérieur du transport et de la logistique de Sousse", majors: [] },
      { id: "faculte-des-sciences-economiques-et-de-g", name: "Faculté des sciences économiques et de gestion de Sousse", majors: [] },
      { id: "ecole-superieure-des-sciences-et-de-la-t", name: "Ecole supérieure des sciences et de la technologie de Hammam Sousse", majors: [
          {
            id: "essths-l2-info",
            name: "2ème année (Informatique)",
            semesters: [
              {
                name: "Semestre 1",
                ues: [
                  {
                    name: 'Bases de données et réseaux', coef: 2.5, credits: 0, rg: "MX",
                    modules: [
                      { name: 'Ingénierie des bases de données', coef: 1.5, examTypes: FULL, rg: "MX" },
                      { name: 'Services de réseaux', coef: 1, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'CPOO', coef: 3.5, credits: 0, rg: "MX",
                    modules: [
                      { name: "Conception des systèmes d'information", coef: 1.5, examTypes: FULL, rg: "MX" },
                      { name: 'Programmation Java', coef: 2, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'Probabilité', coef: 2, credits: 0, rg: "MX",
                    modules: [
                      { name: 'Probabilité et statistique', coef: 2, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'Automates et optimisation', coef: 2, credits: 0, rg: "MX",
                    modules: [
                      { name: 'Graphes et optimisation', coef: 1, examTypes: FULL, rg: "MX" },
                      { name: 'Théorie des langages des Automates', coef: 1, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'Langue et culture', coef: 2, credits: 0, rg: "CC",
                    modules: [
                      { name: "Gestion d'entreprise", coef: 1, examTypes: FULL, rg: "CC" },
                      { name: 'Anglais 3', coef: 1, examTypes: FULL, rg: "CC" },
                    ],
                  },
                  {
                    name: 'UE S3 LOT1', coef: 3, credits: 0, rg: "MX", optionGroup: "opt",
                    modules: [
                      { name: 'Web Design et Développement Dynamique', coef: 1.5, examTypes: FULL, rg: "MX" },
                      { name: 'Python pour des Solutions IoT', coef: 1.5, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'UE S3 LOT2', coef: 3, credits: 0, rg: "MX", optionGroup: "opt",
                    modules: [
                      { name: 'Web Design et Développement Dynamique', coef: 1.5, examTypes: FULL, rg: "MX" },
                      { name: 'Systèmes embarqués pour IoT', coef: 1.5, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'UEO', coef: 3, credits: 0, rg: "MX", optionGroup: "opt",
                    modules: [
                      { name: 'Introduction à la 3D pour les jeux Web', coef: 1.5, examTypes: FULL, rg: "MX" },
                      { name: 'Programmation Python II', coef: 1.5, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'UE optionnelle', coef: 3, credits: 0, rg: "MX", optionGroup: "opt",
                    modules: [
                      { name: 'Programmation Python II', coef: 1.5, examTypes: FULL, rg: "MX" },
                      { name: 'Systèmes embarqués pour IoT', coef: 1.5, examTypes: FULL, rg: "MX" },
                    ],
                  },
                ],
              },
              {
                name: "Semestre 2",
                ues: [
                  {
                    name: 'Compilation & tests', coef: 2.5, credits: 0, rg: "MX",
                    modules: [
                      { name: 'Tests de logiciels (certification ISTQB)', coef: 1, examTypes: FULL, rg: "MX" },
                      { name: 'Techniques de compilation', coef: 1.5, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'Indexation et Web', coef: 2.5, credits: 0, rg: "MX",
                    modules: [
                      { name: 'Technologies et programmation web', coef: 1.5, examTypes: FULL, rg: "MX" },
                      { name: "Techniques d'indexation", coef: 1, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'Intelligence artificielle', coef: 2, credits: 0, rg: "MX",
                    modules: [
                      { name: "Fondements de l'intelligence artificielle (programmation IA)", coef: 2, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'Bases de données', coef: 2, credits: 0, rg: "MX",
                    modules: [
                      { name: 'Administration des bases de données', coef: 1, examTypes: FULL, rg: "MX" },
                      { name: 'Entrepôts de données', coef: 1, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'Langue et éthique', coef: 3, credits: 0, rg: "CC",
                    modules: [
                      { name: 'Projet fédéré (méthode Agile)', coef: 1, examTypes: FULL, rg: "CC" },
                      { name: 'Anglais 3', coef: 1, examTypes: FULL, rg: "CC" },
                      { name: 'Droit informatique, protection des données et éthique', coef: 1, examTypes: FULL, rg: "CC" },
                    ],
                  },
                  {
                    name: 'UEO', coef: 3, credits: 0, rg: "MX", optionGroup: "opt",
                    modules: [
                      { name: 'Programmation OO avancée', coef: 1.5, examTypes: FULL, rg: "MX" },
                      { name: 'Présentation données avancées : XML', coef: 1.5, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'UEO_AU24-25', coef: 3, credits: 0, rg: "MX", optionGroup: "opt",
                    modules: [
                      { name: 'Programmation OO avancée', coef: 1.5, examTypes: FULL, rg: "MX" },
                      { name: 'Game design', coef: 1.5, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'UE S2 LOT1', coef: 3, credits: 0, rg: "MX", optionGroup: "opt",
                    modules: [
                      { name: 'Développement Java Avancé', coef: 1.5, examTypes: FULL, rg: "MX" },
                      { name: 'Présentation des données avancées : XML', coef: 1.5, examTypes: FULL, rg: "MX" },
                    ],
                  },
                  {
                    name: 'UE S2 LOT2', coef: 3, credits: 0, rg: "MX", optionGroup: "opt",
                    modules: [
                      { name: 'Développement Java Avancé', coef: 1.5, examTypes: FULL, rg: "MX" },
                      { name: 'Game Design', coef: 1.5, examTypes: FULL, rg: "MX" },
                    ],
                  },
                ],
              },
            ],
          },
        ] },
      { id: "institut-superieur-de-gestion-de-sousse", name: "Institut supérieur de gestion de Sousse", majors: [] },
      { id: "institut-des-hautes-etudes-commerciales-", name: "Institut des hautes études commerciales de Sousse", majors: [] },
      { id: "institut-superieur-agronomique-de-chott-", name: "Institut supérieur agronomique de Chott-Mariem", majors: [] },
      { id: "faculte-de-droit-et-des-sciences-politiq", name: "Faculté de droit et des sciences politiques de Sousse", majors: [] },
    ],
  },
  {
    id: "us",
    name: "Université de Sfax",
    institutes: [
      { id: "institut-superieur-d-informatique-et-de-", name: "Institut supérieur d'informatique et de multimédia de Sfax", majors: [] },
      { id: "institut-superieur-de-biotechnologies-de", name: "Institut supérieur de biotechnologies de Sfax", majors: [] },
      { id: "institut-superieur-des-arts-et-metiers-d", name: "Institut supérieur des arts et métiers de Sfax", majors: [] },
      { id: "faculte-des-sciences-de-sfax", name: "Faculté des sciences de Sfax", majors: [] },
      { id: "ecole-superieure-de-commerce-de-sfax", name: "Ecole supérieure de commerce de Sfax", majors: [] },
      { id: "ecole-superieure-des-sciences-et-techniq", name: "Ecole supérieure des sciences et techniques de la santé de Sfax", majors: [] },
      { id: "institut-des-hautes-etudes-commerciales-", name: "Institut des hautes études commerciales de Sfax", majors: [] },
      { id: "institut-superieur-d-administration-des-", name: "Institut supérieur d'administration des affaires de Sfax", majors: [] },
      { id: "fseg", name: "Faculté des sciences économiques et de gestion de Sfax", majors: [

          {
            id: "gestion-l1",
            name: "Sciences de Gestion — L1",
            semesters: [
              {
                name: "Semestre 1",
                ues: [
                  {
                    name: "UE1 — Économie", coef: 4, credits: 8,
                    modules: [
                      { name: "Microéconomie", coef: 2, examTypes: FULL },
                      { name: "Macroéconomie", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE2 — Comptabilité", coef: 4, credits: 8,
                    modules: [{ name: "Comptabilité financière 1", coef: 4, examTypes: FULL }],
                  },
                  {
                    name: "UE3 — Maths & Stats", coef: 3, credits: 6,
                    modules: [
                      { name: "Mathématiques", coef: 1.5, examTypes: FULL },
                      { name: "Statistiques", coef: 1.5, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE4 — Droit", coef: 2, credits: 4,
                    modules: [{ name: "Introduction au droit", coef: 2, examTypes: FULL }],
                  },
                  {
                    name: "UE5 — Langues", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais", coef: 1, examTypes: FULL },
                      { name: "Communication", coef: 1, examTypes: FULL },
                    ],
                  },
                ],
              },
              {
                name: "Semestre 2",
                ues: [
                  {
                    name: "UE1 — Gestion", coef: 4, credits: 8,
                    modules: [
                      { name: "Introduction à la gestion", coef: 2, examTypes: FULL },
                      { name: "Marketing fondamental", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE2 — Comptabilité 2", coef: 4, credits: 8,
                    modules: [{ name: "Comptabilité financière 2", coef: 4, examTypes: FULL }],
                  },
                  {
                    name: "UE3 — Maths financières", coef: 3, credits: 6,
                    modules: [{ name: "Mathématiques financières", coef: 3, examTypes: FULL }],
                  },
                  {
                    name: "UE4 — Informatique", coef: 2, credits: 4,
                    modules: [{ name: "Bureautique & TIC", coef: 2, examTypes: FULL }],
                  },
                  {
                    name: "UE5 — Transversale", coef: 2, credits: 4,
                    modules: [
                      { name: "Anglais des affaires", coef: 1, examTypes: TRANS },
                      { name: "Techniques d'expression", coef: 1, examTypes: TRANS },
                    ],
                  },
                ],
              },
            ],
          },
      ] },
      { id: "institut-superieur-du-sport-et-de-l-educ", name: "Institut supérieur du sport et de l'éducation physique de Sfax", majors: [] },
      { id: "faculte-des-lettres-et-des-sciences-huma", name: "Faculté des lettres et des sciences humaines de Sfax", majors: [] },
      { id: "institut-superieur-des-sciences-infirmie", name: "Institut supérieur des sciences infirmières de Sfax", majors: [] },
      { id: "ecole-nationale-d-electronique-et-des-te", name: "Ecole nationale d'électronique et des télécommunications de Sfax", majors: [] },
      { id: "faculte-de-droit-de-sfax", name: "Faculté de droit de Sfax", majors: [] },
      { id: "institut-superieur-de-musique-de-sfax", name: "Institut supérieur de musique de Sfax", majors: [] },
      { id: "institut-superieur-de-gestion-industriel", name: "Institut supérieur de gestion industrielle de Sfax", majors: [] },
    ],
  },
  {
    id: "uj",
    name: "Université de Jendouba",
    institutes: [
      { id: "ecole-superieure-d-agriculture-du-kef", name: "Ecole supérieure d'agriculture du Kef", majors: [] },
      { id: "ecole-superieure-des-ingenieurs-de-medje", name: "Ecole supérieure des ingénieurs de Medjez El Bab", majors: [] },
      { id: "institut-superieur-des-sciences-humaines", name: "Institut supérieur des sciences humaines de Jendouba", majors: [] },
      { id: "institut-superieur-de-langues-appliquees", name: "Institut supérieur de langues appliquées et d'informatique de Béja", majors: [] },
      { id: "institut-superieur-de-musique-et-de-thea", name: "Institut supérieur de musique et de théâtre du Kef", majors: [] },
      { id: "institut-superieur-d-arts-et-metiers-de-", name: "Institut supérieur d'arts et métiers de Siliana", majors: [] },
      { id: "institut-superieur-de-biotechnologie-de-", name: "Institut supérieur de biotechnologie de Béja", majors: [] },
      { id: "institut-superieur-des-sciences-infirmie", name: "Institut supérieur des sciences infirmières du Kef", majors: [] },
      { id: "faculte-des-sciences-juridiques-economiq", name: "Faculté des sciences juridiques, économiques et de gestion de Jendouba", majors: [] },
      { id: "institut-superieur-des-etudes-appliquees", name: "Institut supérieur des études appliquées en humanités du Kef", majors: [] },
      { id: "institut-superieur-du-sport-et-de-l-educ", name: "Institut supérieur du sport et de l'éducation physique du Kef", majors: [] },
      { id: "institut-superieur-de-l-informatique-du-", name: "Institut supérieur de l'informatique du Kef", majors: [] },
      { id: "institut-sylvo-pastoral-de-tabarka", name: "Institut sylvo-pastoral de Tabarka", majors: [] },
    ],
  },
  {
    id: "ugab",
    name: "Université de Gabès",
    institutes: [
      { id: "institut-superieur-d-informatique-et-de-", name: "Institut supérieur d'informatique et de multimédia de Gabès", majors: [] },
      { id: "institut-superieur-des-etudes-juridiques", name: "Institut supérieur des études juridiques de Gabès", majors: [] },
      { id: "institut-superieur-des-sciences-humaines", name: "Institut supérieur des sciences humaines de Médenine", majors: [] },
      { id: "institut-superieur-de-l-informatique-de-", name: "Institut supérieur de l'informatique de Médenine", majors: [] },
      { id: "institut-superieur-des-langues-de-gabes", name: "Institut supérieur des langues de Gabès", majors: [] },
      { id: "institut-superieur-des-arts-et-metiers-d", name: "Institut supérieur des arts et métiers de Gabès", majors: [] },
      { id: "institut-superieur-de-gestion-de-gabes", name: "Institut supérieur de gestion de Gabès", majors: [] },
      { id: "institut-superieur-des-sciences-et-techn", name: "Institut supérieur des sciences et techniques des eaux de Gabès", majors: [] },
      { id: "faculte-des-sciences-de-gabes", name: "Faculté des sciences de Gabès", majors: [] },
      { id: "institut-superieur-des-sciences-infirmie", name: "Institut supérieur des sciences infirmières de Gabès", majors: [] },
      { id: "institut-superieur-des-sciences-applique", name: "Institut supérieur des sciences appliquées et de technologie de Gabès", majors: [] },
      { id: "institut-superieur-de-biologie-appliquee", name: "Institut supérieur de biologie appliquée de Médenine", majors: [] },
      { id: "institut-superieur-des-systemes-industri", name: "Institut supérieur des systèmes industriels de Gabès", majors: [] },
      { id: "institut-superieur-des-arts-et-metiers-d-2", name: "Institut supérieur des arts et métiers de Tataouine", majors: [] },
    ],
  },
  {
    id: "umon",
    name: "Université de Monastir",
    institutes: [
      { id: "faculte-des-sciences-de-monastir", name: "Faculté des sciences de Monastir", majors: [] },
      { id: "faculte-des-sciences-economiques-et-de-g", name: "Faculté des sciences économiques et de gestion de Mahdia", majors: [] },
      { id: "institut-superieur-de-biotechnologie-de-", name: "Institut supérieur de biotechnologie de Monastir", majors: [] },
      { id: "institut-des-etudes-appliquees-en-humani", name: "Institut des études appliquées en humanités de Mahdia", majors: [] },
      { id: "institut-superieur-d-informatique-de-mah", name: "Institut supérieur d'informatique de Mahdia", majors: [] },
      { id: "institut-superieur-des-sciences-applique", name: "Institut supérieur des sciences appliquées et technologie de Mahdia", majors: [] },
      { id: "institut-superieur-des-langues-de-moknin", name: "Institut supérieur des langues de Moknine", majors: [] },
      { id: "institut-superieur-d-informatique-et-de-", name: "Institut supérieur d'informatique et de mathématique de Monastir", majors: [] },
      { id: "institut-superieur-de-la-mode-de-monasti", name: "Institut supérieur de la mode de Monastir", majors: [] },
      { id: "ecole-superieure-des-sciences-et-techniq", name: "Ecole supérieure des sciences et techniques de la santé de Monastir", majors: [] },
      { id: "institut-superieur-des-arts-et-metiers-d", name: "Institut supérieur des arts et métiers de Mahdia", majors: [] },
    ],
  },
  {
    id: "uk",
    name: "Université de Kairouan",
    institutes: [
      { id: "institut-superieur-des-arts-et-metiers-d", name: "Institut supérieur des arts et métiers de Kairouan", majors: [] },
      { id: "institut-superieur-des-etudes-juridiques", name: "Institut supérieur des études juridiques et politiques de Kairouan", majors: [] },
      { id: "institut-des-etudes-appliquees-en-humani", name: "Institut des études appliquées en humanités de Sbeitla", majors: [] },
      { id: "isigk", name: "Institut supérieur d'informatique et de gestion de Kairouan", majors: [

          {
            id: "se-l1",
            name: "Sciences Économiques — L1",
            semesters: [
              {
                name: "Semestre 1",
                ues: [
                  {
                    name: "UE1 — Initiation à l'économie", coef: 2.5, credits: 5,
                    modules: [{ name: "Initiation à l'économie", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE2 — Initiation à la gestion", coef: 2.5, credits: 5,
                    modules: [{ name: "Initiation à la gestion", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE3 — Comptabilité", coef: 2.5, credits: 5,
                    modules: [{ name: "Comptabilité", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE4 — Mathématiques (Analyse)", coef: 2.5, credits: 5,
                    modules: [{ name: "Mathématiques (Analyse)", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE5 — Statistique descriptive et calcul des probabilités", coef: 2.5, credits: 5,
                    modules: [{ name: "Statistique descriptive et calcul des probabilités", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE6 — Unité transversale", coef: 2.5, credits: 5,
                    modules: [
                      { name: "Langue étrangère 1", coef: 0.75, examTypes: TRANS },
                      { name: "Langue étrangère 2", coef: 0.75, examTypes: TRANS },
                      { name: "Compétences digitales", coef: 1, examTypes: TRANS },
                    ],
                  },
                ],
              },
              {
                name: "Semestre 2",
                ues: [
                  {
                    name: "UE1 — Microéconomie", coef: 3, credits: 6,
                    modules: [{ name: "Microéconomie", coef: 3, examTypes: FULL }],
                  },
                  {
                    name: "UE2 — Macroéconomie", coef: 2.5, credits: 5,
                    modules: [{ name: "Macroéconomie", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE3 — Comptabilité financière 2", coef: 2.5, credits: 5,
                    modules: [{ name: "Comptabilité financière 2", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE4 — Mathématiques (Algèbre)", coef: 2.5, credits: 5,
                    modules: [{ name: "Mathématiques (Algèbre)", coef: 2.5, examTypes: FULL }],
                  },
                  {
                    name: "UE5 — Principes de droit", coef: 2, credits: 4,
                    modules: [{ name: "Principes de droit", coef: 2, examTypes: FULL }],
                  },
                  {
                    name: "UE6 — Unité transversale", coef: 2.5, credits: 5,
                    modules: [
                      { name: "Langue étrangère 2", coef: 0.75, examTypes: TRANS },
                      { name: "Langue étrangère 1", coef: 0.75, examTypes: TRANS },
                      { name: "Compétences digitales", coef: 1, examTypes: TRANS },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "si-l1",
            name: "Sciences de l'Informatique — L1",
            semesters: [
              {
                name: "Semestre 1",
                ues: [
                  {
                    name: "UE1 — Multimédia & Logique", coef: 3, credits: 6,
                    modules: [
                      { name: "Technologies multimédias", coef: 1.5, examTypes: FULL },
                      { name: "Logique formelle", coef: 1.5, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE2 — Algorithmique", coef: 3.5, credits: 7,
                    modules: [
                      { name: "Algorithmique", coef: 2, examTypes: FULL },
                      { name: "Atelier programmation 1", coef: 1.5, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE3 — Systèmes", coef: 3.5, credits: 7,
                    modules: [
                      { name: "Système d'exploitation 1", coef: 1.5, examTypes: FULL },
                      { name: "Architecture des ordinateurs", coef: 2, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE4 — Mathématiques", coef: 3, credits: 6,
                    modules: [
                      { name: "Analyse 1", coef: 1.5, examTypes: FULL },
                      { name: "Algèbre 1", coef: 1.5, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE5 — Transversale", coef: 2, credits: 4,
                    modules: [
                      { name: "Communication 1", coef: 1, examTypes: TRANS },
                      { name: "Anglais 1", coef: 1, examTypes: TRANS },
                    ],
                  },
                ],
              },
              {
                name: "Semestre 2",
                ues: [
                  {
                    name: "UE1 — Maths 2", coef: 3, credits: 6,
                    modules: [
                      { name: "Analyse 2", coef: 1.5, examTypes: FULL },
                      { name: "Algèbre 2", coef: 1.5, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE2 — BD", coef: 2, credits: 4,
                    modules: [{ name: "Bases de données", coef: 2, examTypes: FULL }],
                  },
                  {
                    name: "UE3 — Réseaux & Systèmes", coef: 3.5, credits: 7,
                    modules: [
                      { name: "Réseaux", coef: 2, examTypes: FULL },
                      { name: "Système d'exploitation 2", coef: 1.5, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE4 — Programmation", coef: 3.5, credits: 7,
                    modules: [
                      { name: "Python", coef: 1, examTypes: FULL },
                      { name: "Algorithme", coef: 1.5, examTypes: FULL },
                      { name: "Atelier programmation 2", coef: 1, examTypes: FULL },
                    ],
                  },
                  {
                    name: "UE5 — Transversale", coef: 3, credits: 6,
                    modules: [
                      { name: "Communication 2", coef: 1, examTypes: TRANS },
                      { name: "Anglais 2", coef: 1, examTypes: TRANS },
                      { name: "Culture", coef: 1, examTypes: TRANS },
                    ],
                  },
                ],
              },
            ],
          },
      ] },
      { id: "institut-superieur-des-arts-et-metiers-d-2", name: "Institut supérieur des arts et métiers de Kasserine", majors: [] },
      { id: "faculte-des-lettres-et-des-sciences-huma", name: "Faculté des lettres et des sciences humaines de Kairouan", majors: [] },
      { id: "institut-superieur-des-sciences-applique", name: "Institut supérieur des sciences appliquées et technologie de Kairouan", majors: [] },
      { id: "institut-superieur-des-mathematiques-app", name: "Institut supérieur des mathématiques appliquées et d'informatique de Kairouan", majors: [] },
      { id: "faculte-des-sciences-et-techniques-de-si", name: "Faculté des sciences et techniques de Sidi Bouzid", majors: [] },
      { id: "institut-superieur-des-sciences-applique-2", name: "Institut supérieur des sciences appliquées et technologies de Kasserine", majors: [] },
      { id: "institut-superieur-des-arts-et-metiers-d-3", name: "Institut supérieur des arts et métiers de Sidi Bouzid", majors: [] },
    ],
  },
  {
    id: "ugaf",
    name: "Université de Gafsa",
    institutes: [
      { id: "institut-superieur-des-arts-et-metiers-d", name: "Institut supérieur des arts et métiers de Gafsa", majors: [] },
      { id: "institut-superieur-des-etudes-appliquees", name: "Institut supérieur des études appliquées en humanités de Tozeur", majors: [] },
      { id: "faculte-des-sciences-de-gafsa", name: "Faculté des sciences de Gafsa", majors: [] },
      { id: "institut-superieur-des-sciences-applique", name: "Institut supérieur des sciences appliquées et technologie de Gafsa", majors: [] },
      { id: "institut-superieur-des-sciences-sociales", name: "Institut supérieur des sciences sociales et éducation de Gafsa", majors: [] },
      { id: "institut-superieur-d-administration-des-", name: "Institut supérieur d'administration des entreprises de Gafsa", majors: [] },
      { id: "institut-superieur-des-etudes-appliquees-2", name: "Institut supérieur des études appliquées en humanités de Gafsa", majors: [] },
      { id: "institut-superieur-du-sport-et-de-l-educ", name: "Institut supérieur du sport et de l'éducation physique de Gafsa", majors: [] },
      { id: "ecole-superieure-des-sciences-et-techniq", name: "Ecole supérieure des sciences et techniques de la santé à Gafsa", majors: [] },
    ],
  },
];

export type ModuleGrades = Partial<Record<ExamType, string>>;

export function clamp(v: number): number {
  return Math.min(20, Math.max(0, v));
}

// Parse a grade string, tolerating French-style "9,5" alongside "9.5".
// Trailing/leading spaces are ignored. Returns NaN when no number is present
// (matches parseFloat semantics so callers' isNaN checks keep working).
function parseGrade(s: string | undefined | null): number {
  if (s == null) return NaN;
  return parseFloat(String(s).replace(",", ".").trim());
}

// Round to 2 decimals using a small epsilon to defeat IEEE-754 drift
// (e.g. 9.995 should round to 10.00, not 9.99). This is what the UI shows,
// so credit / validation decisions must use the same rounded value or a
// displayed 10.00 can end up flagged as a fail.
export function round2(v: number): number {
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

const WEIGHTS_FULL: Partial<Record<ExamType, number>> = { examen: 0.7, ds: 0.2, cc: 0.1 };
const WEIGHTS_TRANS: Partial<Record<ExamType, number>> = { ds1: 0.4, ds2: 0.4, cc: 0.2 };
const WEIGHTS_EXAM_DS: Partial<Record<ExamType, number>> = { examen: 0.7, ds: 0.3 };

function weightsFor(examTypes: ExamType[]): Partial<Record<ExamType, number>> {
  if (examTypes.includes("ds1") || examTypes.includes("ds2")) return WEIGHTS_TRANS;
  if (!examTypes.includes("cc")) return WEIGHTS_EXAM_DS;
  return WEIGHTS_FULL;
}

const WEIGHTS_RG_MX: Partial<Record<ExamType, number>> = { cc: 0.1, ds: 0.2, examen: 0.7 };
const WEIGHTS_RG_CC: Partial<Record<ExamType, number>> = { cc: 0.1, ds: 0.45, examen: 0.45 };

export function moduleComputedNote(g: ModuleGrades, examTypes: ExamType[] = ["examen", "ds", "cc"], rg?: Rg, weights?: Partial<Record<ExamType, number>>): number | null {
  const W = weights ?? (rg === "CC" ? WEIGHTS_RG_CC : rg === "MX" ? WEIGHTS_RG_MX : weightsFor(examTypes));
  if (weights && examTypes.some((t) => !Number.isFinite(W[t] ?? 0) || (W[t] ?? 0) < 0)) return null;
  const parsed: Partial<Record<ExamType, number>> = {};
  let any = false;
  for (const t of examTypes) {
    const v = parseGrade(g[t]);
    if (!isNaN(v)) {
      parsed[t] = clamp(v);
      any = true;
    }
  }
  if (!any) return null;
  const totalWeight = examTypes.reduce((s, t) => s + (W[t] ?? 0), 0);
  let sum = 0;
  for (const t of examTypes) {
    const v = parsed[t] ?? 0;
    sum += v * (W[t] ?? 0);
  }
  return totalWeight ? sum / totalWeight : null;
}

export function moduleFinalNote(
  g: ModuleGrades,
  examTypes: ExamType[] = ["examen", "ds", "cc"],
  forceMax: boolean = false,
  rg?: Rg,
  weights?: Partial<Record<ExamType, number>>,
): number | null {
  const note = moduleComputedNote(g, examTypes, rg, weights);
  const ctrl = parseGrade(g.control);
  const ctrlClamped = isNaN(ctrl) ? null : clamp(ctrl);
  // When a control grade is entered (here or in a sibling module of the UE),
  // the module average is the highest of EXAM, computed NOTE, and CONTROL.
  if (ctrlClamped !== null || forceMax) {
    const candidates: number[] = [];
    if (ctrlClamped !== null) candidates.push(ctrlClamped);
    if (note !== null) candidates.push(note);
    const examRaw = parseGrade(g.examen);
    if (!isNaN(examRaw)) candidates.push(clamp(examRaw));
    return candidates.length ? Math.max(...candidates) : null;
  }
  return note;
}

export function hasAnyControl(
  grades: Record<string, ModuleGrades> | Record<string, Record<string, ModuleGrades>> | undefined,
): boolean {
  if (!grades) return false;
  for (const v of Object.values(grades)) {
    if (!v) continue;
    // Heuristic: ModuleGrades has string values; nested map has object values.
    const first = Object.values(v)[0];
    if (typeof first === "object" && first !== null) {
      if (hasAnyControl(v as Record<string, ModuleGrades>)) return true;
    } else {
      const ctrl = parseGrade((v as ModuleGrades).control);
      if (!isNaN(ctrl)) return true;
    }
  }
  return false;
}

export function ueAverage(
  ue: UEDef,
  grades: Record<string, ModuleGrades>,
  extraControl: boolean = false,
): number | null {
  // 1) Principal-only average (no control, no max rule).
  let pw = 0, pc = 0, pAny = false;
  for (const m of ue.modules) {
    const g = grades[m.name];
    if (!g) continue;
    const n = moduleComputedNote(g, m.examTypes ?? ["examen", "ds", "cc"], m.rg, m.weights);
    if (n === null) continue;
    pAny = true;
    pw += n * m.coef;
    pc += m.coef;
  }
  const principalAvg = pAny && pc > 0 ? pw / pc : null;

  // 2) If the UE is already validated on principal grades (>= 10),
  // the whole UE is acquired — ignore controls entirely.
  if (principalAvg !== null && round2(principalAvg) >= 10) return principalAvg;

  // 3) Otherwise, if any module has a control (in this UE, this semester,
  // or anywhere in the whole major via extraControl), apply max(exam, note, control)
  // to every module in the UE.
  const anyControl = extraControl || hasAnyControl(grades);
  let w = 0, c = 0, any = false;
  for (const m of ue.modules) {
    const g = grades[m.name];
    if (!g) continue;
    const n = moduleFinalNote(g, m.examTypes ?? ["examen", "ds", "cc"], anyControl, m.rg, m.weights);
    if (n === null) continue;
    any = true;
    w += n * m.coef;
    c += m.coef;
  }
  if (!any || c === 0) return principalAvg;
  return w / c;
}

export function semesterAverage(
  ues: UEDef[],
  grades: Record<string, ModuleGrades>,
  extraControl: boolean = false,
): number | null {
  let w = 0, c = 0, any = false;
  for (const ue of ues) {
    const a = ueAverage(ue, grades, extraControl);
    if (a === null) continue;
    any = true;
    w += a * ue.coef;
    c += ue.coef;
  }
  if (!any || c === 0) return null;
  return w / c;
}

export function totalCredits(
  ues: UEDef[],
  grades: Record<string, ModuleGrades>,
  extraControl: boolean = false,
): number {
  let credits = 0;
  for (const ue of ues) {
    const a = ueAverage(ue, grades, extraControl);
    if (a !== null && round2(a) >= 10) credits += ue.credits;
  }
  return credits;
}

export function maxCreditsForSemester(ues: UEDef[]): number {
  return ues.reduce((s, ue) => s + ue.credits, 0);
}

export function generalAverage(
  major: MajorDef,
  gradesByMajor: Record<string, Record<string, ModuleGrades>>
): number | null {
  const extra = hasAnyControl(gradesByMajor);
  let w = 0, c = 0, any = false;
  for (const sem of major.semesters) {
    const semGrades = gradesByMajor?.[sem.name] || {};
    const a = semesterAverage(sem.ues, semGrades, extra);
    if (a === null) continue;
    any = true;
    // Weight by credits; fall back to UE coefs when a curriculum has no credits.
    const credits = maxCreditsForSemester(sem.ues) || sem.ues.reduce((t, u) => t + u.coef, 0);
    w += a * credits;
    c += credits;
  }
  if (!any || c === 0) return null;
  return w / c;
}

export function generalCredits(
  major: MajorDef,
  gradesByMajor: Record<string, Record<string, ModuleGrades>>
): { earned: number; max: number } {
  const extra = hasAnyControl(gradesByMajor);
  let earned = 0, max = 0;
  for (const sem of major.semesters) {
    max += maxCreditsForSemester(sem.ues);
    const semGrades = gradesByMajor?.[sem.name] || {};
    earned += totalCredits(sem.ues, semGrades, extra);
  }
  return { earned, max };
}

/** Keep non-optional UEs plus only the selected UE of each option group. */
export function filterSelectedUEs(ues: UEDef[], selected: Record<string, string> = {}): UEDef[] {
  const firstOf: Record<string, string> = {};
  for (const u of ues) if (u.optionGroup && !(u.optionGroup in firstOf)) firstOf[u.optionGroup] = u.name;
  return ues.filter((u) => !u.optionGroup || (selected[u.optionGroup] ?? firstOf[u.optionGroup]) === u.name);
}

export function applyOptionSelection(major: MajorDef, sel: Record<string, Record<string, string>> = {}): MajorDef {
  return { ...major, semesters: major.semesters.map((s) => ({ ...s, ues: filterSelectedUEs(s.ues, sel[s.name]) })) };
}
