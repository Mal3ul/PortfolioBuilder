// Données de démonstration affichées sur /portfolio/demo.
// Permet de présenter un exemple de portfolio sans dépendre de la base de données.
// La forme correspond aux données transformées par PublicPortfolio (cf. transformedData).

const demoPortfolio = {
  profile: {
    firstName: "Marcus",
    lastName: "Diallo",
    name: "Marcus Diallo",
    title: "Consultant Senior en Transformation Digitale",
    bio:
      "Fort de 15 ans d'expérience dans le secteur IT, j'accompagne les entreprises dans leur transition numérique. Passionné par l'innovation et le leadership, j'ai piloté des projets d'envergure pour des grands comptes en France et en Afrique francophone. Mon approche combine expertise technique, vision stratégique et management d'équipes multiculturelles.",
    email: "marcus.diallo@example.com",
    phone: "+33 6 12 34 56 78",
    avatar: "👤",
  },
  skills: [
    "Gestion de projet",
    "Cloud (AWS / Azure)",
    "Architecture logicielle",
    "Agilité / Scrum",
    "DevOps",
    "Leadership",
  ],
  projects: [
    {
      id: 1,
      title: "Migration Cloud d'un grand compte bancaire",
      description:
        "Pilotage de la migration de l'infrastructure on-premise vers le cloud pour une banque internationale, avec une réduction de 40% des coûts d'exploitation.",
      technologies: ["AWS", "Terraform", "Kubernetes", "CI/CD"],
    },
    {
      id: 2,
      title: "Plateforme e-commerce panafricaine",
      description:
        "Conception et déploiement d'une plateforme e-commerce desservant 6 pays d'Afrique de l'Ouest, supportant plusieurs devises et moyens de paiement mobiles.",
      technologies: ["React", "Node.js", "PostgreSQL", "Docker"],
    },
    {
      id: 3,
      title: "Refonte du SI d'une administration publique",
      description:
        "Accompagnement de la transformation digitale d'un ministère : dématérialisation des processus et formation des équipes internes.",
      technologies: ["Microservices", "Azure", "Power BI"],
    },
  ],
  experiences: [
    {
      title: "Consultant Senior en Transformation Digitale",
      company: "Cabinet Conseil International",
      startDate: "2018",
      endDate: "Présent",
      description:
        "Accompagnement de directions générales sur leur stratégie numérique, du cadrage à la mise en œuvre opérationnelle.",
    },
    {
      title: "Chef de projet IT",
      company: "Groupe Télécom",
      startDate: "2012",
      endDate: "2018",
      description:
        "Pilotage de projets d'infrastructure et de développement applicatif pour des équipes pluridisciplinaires de 10 à 30 personnes.",
    },
  ],
  education: [
    {
      id: 1,
      diploma: "Master en Informatique",
      school: "Université de Technologie",
      startDate: "2008",
      endDate: "2010",
      description: "Spécialité Systèmes d'information et réseaux.",
    },
  ],
  certifications: [
    {
      id: 1,
      title: "AWS Certified Solutions Architect",
      organization: "Amazon Web Services",
      date: "2021",
      description: "Conception d'architectures cloud sécurisées et résilientes.",
    },
    {
      id: 2,
      title: "Professional Scrum Master (PSM I)",
      organization: "Scrum.org",
      date: "2019",
      description: "Maîtrise du framework Scrum et de la facilitation d'équipes agiles.",
    },
  ],
  media: {
    cvFile: "",
    cvFileName: "CV.pdf",
    links: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/" },
      { platform: "GitHub", url: "https://github.com/" },
    ],
  },
};

export default demoPortfolio;
