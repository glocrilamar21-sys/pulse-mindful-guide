import type { Locale } from "@/lib/i18n";

// Localized display names for each mascot id, across all 5 supported locales.
// Keep ids in sync with mascotOutfits in src/lib/mascot.ts
type NameMap = Record<Locale, string>;

export const mascotNames: Record<string, NameMap> = {
  default: { es: "Original", en: "Original", pt: "Original", fr: "Original", it: "Originale" },
  // Education
  graduate: { es: "Graduado", en: "Graduate", pt: "Graduado", fr: "Diplômé", it: "Laureato" },
  student: { es: "Estudiante", en: "Student", pt: "Estudante", fr: "Étudiant", it: "Studente" },
  teacher: { es: "Profesor", en: "Teacher", pt: "Professor", fr: "Professeur", it: "Insegnante" },
  // Creative
  hero: { es: "Superhéroe", en: "Superhero", pt: "Super-herói", fr: "Super-héros", it: "Supereroe" },
  musician: { es: "Músico", en: "Musician", pt: "Músico", fr: "Musicien", it: "Musicista" },
  artist: { es: "Artista", en: "Artist", pt: "Artista", fr: "Artiste", it: "Artista" },
  photographer: { es: "Fotógrafo", en: "Photographer", pt: "Fotógrafo", fr: "Photographe", it: "Fotografo" },
  model: { es: "Modelo", en: "Model", pt: "Modelo", fr: "Mannequin", it: "Modello" },
  singer: { es: "Cantante", en: "Singer", pt: "Cantor", fr: "Chanteur", it: "Cantante" },
  dancer: { es: "Bailarín", en: "Dancer", pt: "Dançarino", fr: "Danseur", it: "Ballerino" },
  actor: { es: "Actor", en: "Actor", pt: "Ator", fr: "Acteur", it: "Attore" },
  graphicdesigner: { es: "Diseñador Gráfico", en: "Graphic Designer", pt: "Designer Gráfico", fr: "Graphiste", it: "Grafico" },
  animator: { es: "Animador Digital", en: "Digital Animator", pt: "Animador Digital", fr: "Animateur Numérique", it: "Animatore Digitale" },
  // Service
  chef: { es: "Chef", en: "Chef", pt: "Chef", fr: "Chef", it: "Chef" },
  athlete: { es: "Deportista", en: "Athlete", pt: "Atleta", fr: "Athlète", it: "Atleta" },
  gardener: { es: "Jardinero", en: "Gardener", pt: "Jardineiro", fr: "Jardinier", it: "Giardiniere" },
  pilot: { es: "Piloto", en: "Pilot", pt: "Piloto", fr: "Pilote", it: "Pilota" },
  firefighter: { es: "Bombero", en: "Firefighter", pt: "Bombeiro", fr: "Pompier", it: "Pompiere" },
  police: { es: "Policía", en: "Police Officer", pt: "Policial", fr: "Policier", it: "Poliziotto" },
  // Health
  doctor: { es: "Doctor", en: "Doctor", pt: "Médico", fr: "Médecin", it: "Dottore" },
  nurse: { es: "Enfermero", en: "Nurse", pt: "Enfermeiro", fr: "Infirmier", it: "Infermiere" },
  dentist: { es: "Dentista", en: "Dentist", pt: "Dentista", fr: "Dentiste", it: "Dentista" },
  veterinarian: { es: "Veterinario", en: "Veterinarian", pt: "Veterinário", fr: "Vétérinaire", it: "Veterinario" },
  psychologist: { es: "Psicólogo", en: "Psychologist", pt: "Psicólogo", fr: "Psychologue", it: "Psicologo" },
  // Tech
  scientist: { es: "Científico", en: "Scientist", pt: "Cientista", fr: "Scientifique", it: "Scienziato" },
  astronaut: { es: "Astronauta", en: "Astronaut", pt: "Astronauta", fr: "Astronaute", it: "Astronauta" },
  systemsengineer: { es: "Ing. de Sistemas", en: "Systems Eng.", pt: "Eng. de Sistemas", fr: "Ing. Systèmes", it: "Ing. dei Sistemi" },
  programmer: { es: "Programador", en: "Programmer", pt: "Programador", fr: "Programmeur", it: "Programmatore" },
  biologist: { es: "Biólogo", en: "Biologist", pt: "Biólogo", fr: "Biologiste", it: "Biologo" },
  chemist: { es: "Químico", en: "Chemist", pt: "Químico", fr: "Chimiste", it: "Chimico" },
  // Engineering
  architect: { es: "Arquitecto", en: "Architect", pt: "Arquiteto", fr: "Architecte", it: "Architetto" },
  mechanic: { es: "Mecánico", en: "Mechanic", pt: "Mecânico", fr: "Mécanicien", it: "Meccanico" },
  civilengineer: { es: "Ing. Civil", en: "Civil Eng.", pt: "Eng. Civil", fr: "Ing. Civil", it: "Ing. Civile" },
  electricalengineer: { es: "Ing. Eléctrico", en: "Electrical Eng.", pt: "Eng. Elétrico", fr: "Ing. Électricien", it: "Ing. Elettrico" },
  industrialengineer: { es: "Ing. Industrial", en: "Industrial Eng.", pt: "Eng. Industrial", fr: "Ing. Industriel", it: "Ing. Industriale" },
  // Business
  lawyer: { es: "Abogado", en: "Lawyer", pt: "Advogado", fr: "Avocat", it: "Avvocato" },
  judge: { es: "Juez", en: "Judge", pt: "Juiz", fr: "Juge", it: "Giudice" },
  accountant: { es: "Contador", en: "Accountant", pt: "Contador", fr: "Comptable", it: "Contabile" },
  salesperson: { es: "Vendedor", en: "Salesperson", pt: "Vendedor", fr: "Vendeur", it: "Venditore" },
  manager: { es: "Administrador", en: "Manager", pt: "Administrador", fr: "Gestionnaire", it: "Amministratore" },
  // Seasons
  beach: { es: "Playa", en: "Beach", pt: "Praia", fr: "Plage", it: "Spiaggia" },
  summer: { es: "Verano", en: "Summer", pt: "Verão", fr: "Été", it: "Estate" },
  autumn: { es: "Otoño", en: "Autumn", pt: "Outono", fr: "Automne", it: "Autunno" },
  spring: { es: "Primavera", en: "Spring", pt: "Primavera", fr: "Printemps", it: "Primavera" },
  winter: { es: "Invierno", en: "Winter", pt: "Inverno", fr: "Hiver", it: "Inverno" },
  // Festive
  halloween: { es: "Halloween", en: "Halloween", pt: "Halloween", fr: "Halloween", it: "Halloween" },
  christmas: { es: "Navidad", en: "Christmas", pt: "Natal", fr: "Noël", it: "Natale" },
  diadelosmuertos: { es: "Día de Muertos", en: "Day of the Dead", pt: "Dia dos Mortos", fr: "Jour des Morts", it: "Giorno dei Morti" },
  newyear: { es: "Año Nuevo", en: "New Year", pt: "Ano Novo", fr: "Nouvel An", it: "Capodanno" },
  // Accessories
  sunglasses: { es: "Lentes de sol", en: "Sunglasses", pt: "Óculos de sol", fr: "Lunettes de soleil", it: "Occhiali da sole" },
  readingglasses: { es: "Lentes de lectura", en: "Reading glasses", pt: "Óculos de leitura", fr: "Lunettes de lecture", it: "Occhiali da lettura" },
};

export function getMascotName(id: string, locale: Locale, fallback: string): string {
  const entry = mascotNames[id];
  if (!entry) return fallback;
  return entry[locale] || entry.es || fallback;
}
