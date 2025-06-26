// Store questions and explanations in a JavaScript object.
// examData -> Section -> Subject -> Unit -> [Questions]
// Question: { text: "...", options: ["A", "B", "C", "D"], answer: 0 (index), explanation: "..." }

window.examData = {
    "Natural Science": {
        "subjects": {
            "Physics": {
                "units": {
                    "Unit 1: Mechanics": [
                        {
                            "id": "phy_mech_001",
                            "text": "What is the SI unit of force?",
                            "options": ["Watt", "Joule", "Newton", "Pascal"],
                            "answer": 2, // Index of "Newton"
                            "explanation": "The SI unit of force is the Newton (N), named after Sir Isaac Newton. It is defined as the force required to accelerate a one-kilogram mass at a rate of one meter per second squared (1 N = 1 kg·m/s²)."
                        },
                        {
                            "id": "phy_mech_002",
                            "text": "Which of the following is a scalar quantity?",
                            "options": ["Velocity", "Acceleration", "Force", "Speed"],
                            "answer": 3, // Index of "Speed"
                            "explanation": "Speed is a scalar quantity as it only has magnitude. Velocity, acceleration, and force are vector quantities as they have both magnitude and direction."
                        }
                    ],
                    "Unit 2: Thermodynamics": [
                        {
                            "id": "phy_thermo_001",
                            "text": "What is the first law of thermodynamics also known as?",
                            "options": ["Law of Conservation of Energy", "Law of Entropy", "Zeroth Law", "Charles's Law"],
                            "answer": 0,
                            "explanation": "The first law of thermodynamics, also known as the Law of Conservation of Energy, states that energy cannot be created or destroyed in an isolated system. It can only be transformed from one form to another."
                        }
                    ]
                }
            },
            "Chemistry": {
                "units": {
                    "Unit 1: Atomic Structure": [
                        {
                            "id": "chem_atom_001",
                            "text": "How many protons does a Carbon atom (C) have?",
                            "options": ["5", "6", "7", "12"],
                            "answer": 1,
                            "explanation": "A Carbon atom has an atomic number of 6, which means it has 6 protons in its nucleus."
                        }
                    ],
                    "Unit 2: Chemical Bonding": [
                        {
                            "id": "chem_bond_001",
                            "text": "What type of bond is formed by sharing electrons between two atoms?",
                            "options": ["Ionic Bond", "Covalent Bond", "Metallic Bond", "Hydrogen Bond"],
                            "answer": 1,
                            "explanation": "A covalent bond is formed when two atoms share one or more pairs of electrons. This type of bonding typically occurs between non-metallic elements."
                        }
                    ]
                }
            },
            "Biology": {
                "units": {
                    "Unit 1: Cell Biology": [
                        {
                            "id": "bio_cell_001",
                            "text": "What is the powerhouse of the cell?",
                            "options": ["Nucleus", "Ribosome", "Mitochondrion", "Golgi Apparatus"],
                            "answer": 2,
                            "explanation": "Mitochondria are often referred to as the powerhouses of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
                        }
                    ]
                }
            },
            "Mathematics": {
                "units": {
                    "Unit 1: Algebra": [
                        {
                            "id": "math_alg_001",
                            "text": "Solve for x: 2x + 5 = 15",
                            "options": ["3", "4", "5", "10"],
                            "answer": 2,
                            "explanation": "To solve for x: 2x + 5 = 15. Subtract 5 from both sides: 2x = 10. Divide by 2: x = 5."
                        }
                    ]
                }
            }
        }
    },
    "Social Science": {
        "subjects": {
            "History": {
                "units": {
                    "Unit 1: Ancient Civilizations": [
                        {
                            "id": "hist_anc_001",
                            "text": "Which river was crucial for ancient Egyptian civilization?",
                            "options": ["Tigris", "Euphrates", "Nile", "Indus"],
                            "answer": 2,
                            "explanation": "The Nile River was central to the development of ancient Egyptian civilization, providing water, fertile soil for agriculture, and a means of transportation."
                        }
                    ]
                }
            },
            "Geography": {
                "units": {
                    "Unit 1: World Climates": [
                        {
                            "id": "geo_clim_001",
                            "text": "What type of climate is characterized by hot, humid summers and mild winters?",
                            "options": ["Tundra", "Desert", "Mediterranean", "Humid Subtropical"],
                            "answer": 3,
                            "explanation": "Humid Subtropical climates (e.g., Southeastern USA, parts of China) are characterized by hot, humid summers and cool to mild winters."
                        }
                    ]
                }
            },
            "Civics": {
                "units": {
                    "Unit 1: Forms of Government": [
                         {
                            "id": "civ_gov_001",
                            "text": "A system of government where power is held by a single person, often by inheritance, is called:",
                            "options": ["Democracy", "Republic", "Monarchy", "Oligarchy"],
                            "answer": 2,
                            "explanation": "A monarchy is a form of government in which a single person, called a monarch (such as a king, queen, or emperor), holds supreme authority, typically inherited."
                        }
                    ]
                }
            },
            "Economics": {
                "units": {
                    "Unit 1: Basic Economic Concepts": [
                        {
                            "id": "eco_basic_001",
                            "text": "What is the term for the total value of all goods and services produced in a country in a year?",
                            "options": ["Gross Domestic Product (GDP)", "Net National Product (NNP)", "Inflation Rate", "Consumer Price Index (CPI)"],
                            "answer": 0,
                            "explanation": "Gross Domestic Product (GDP) is the total monetary or market value of all the finished goods and services produced within a country's borders in a specific time period, usually a year."
                        }
                    ]
                }
            }
        }
    }
};

// Example of how to add more questions:
// window.examData["Natural Science"]["subjects"]["Physics"]["units"]["Unit 1: Mechanics"].push({
//     "id": "phy_mech_003",
//     "text": "What is Newton's second law of motion?",
//     "options": ["F=ma", "P=IV", "E=mc^2", "V=IR"],
//     "answer": 0,
//     "explanation": "Newton's second law of motion states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass (F=ma)."
// });
