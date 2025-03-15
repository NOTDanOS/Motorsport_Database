export const tableConfigs = {

  Sponsor_Tier: {
    fields: [
      {
        name: "tier_level",
        type: "VARCHAR",
        maxLength: 50,
        label: "Tier Level",
        nullable: false,
        description: "Sponsorship tier level (Primary Key)",
      },
      {
        name: "amount_contributed",
        type: "INT",
        label: "Amount Contributed",
        nullable: false,
        description: "Amount contributed in dollars",
      },
    ],
  },

  Sponsor: {
    fields: [
      {
        name: "sponsor_name",
        type: "VARCHAR",
        maxLength: 50,
        label: "Sponsor Name",
        nullable: false,
        description: "Name of the sponsor",
      },
      {
        name: "tier_level",
        type: "VARCHAR",
        maxLength: 50,
        label: "Tier Level",
        nullable: true,
        description: "Foreign Key referencing Sponsor_Tier",
      },
      {
        name: "point_of_contact",
        type: "VARCHAR",
        maxLength: 100,
        label: "Point of Contact",
        nullable: true,
        description: "Main contact person for this sponsor",
      },
    ],
  },

  Team_Principal: {
    fields: [
      {
        name: "team_principal",
        type: "VARCHAR",
        maxLength: 100,
        label: "Team Principal Name",
        nullable: false,
        description: "Name of the team principal (Primary Key)",
      },
      {
        name: "team_name",
        type: "VARCHAR",
        maxLength: 100,
        label: "Team Name",
        nullable: false,
        description: "Name of the team (Unique)",
      },
    ],
  },
  
  

};
