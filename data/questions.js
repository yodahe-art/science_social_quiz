// Store questions and explanations in a JavaScript object.
// examData -> Section -> Subject -> Grade -> Unit -> [Questions]
// Question: { id: "...", text: "...", options: ["A", "B", "C", "D"], answer: 0 (index), explanation: "..." }

window.examData = {
    "Natural Science": {
        "subjects": {
            "Physics": {
                "grades": {
                    "Grade 9": {
                        "units": {
                            "Unit 1: Introduction to Physics (G9)": [],
                            "Unit 2: Motion (G9)": []
                        }
                    },
                    "Grade 10": {
                        "units": {
                            "Unit 1: Waves (G10)": [],
                            "Unit 2: Light (G10)": []
                        }
                    },
                    "Grade 11": {
                        "units": {
                            "Unit 1: Vectors (G11)": [],
                            "Unit 2: Kinematics (G11)": []
                        }
                    },
                    "Grade 12": {
                        "units": {
                            "Unit 1: Mechanics (G12 P)": [
                                {
                                    "id": "phy_g12_mech_001",
                                    "text": "What is the SI unit of force?",
                                    "options": ["Watt", "Joule", "Newton", "Pascal"],
                                    "answer": 2,
                                    "explanation": "The SI unit of force is the Newton (N), named after Sir Isaac Newton. It is defined as the force required to accelerate a one-kilogram mass at a rate of one meter per second squared (1 N = 1 kg·m/s²)."
                                },
                                {
                                    "id": "phy_g12_mech_002",
                                    "text": "Which of the following is a scalar quantity?",
                                    "options": ["Velocity", "Acceleration", "Force", "Speed"],
                                    "answer": 3,
                                    "explanation": "Speed is a scalar quantity as it only has magnitude. Velocity, acceleration, and force are vector quantities as they have both magnitude and direction."
                                }
                            ],
                            "Unit 2: Thermodynamics (G12 P)": [
                                {
                                    "id": "phy_g12_thermo_001",
                                    "text": "What is the first law of thermodynamics also known as?",
                                    "options": ["Law of Conservation of Energy", "Law of Entropy", "Zeroth Law", "Charles's Law"],
                                    "answer": 0,
                                    "explanation": "The first law of thermodynamics, also known as the Law of Conservation of Energy, states that energy cannot be created or destroyed in an isolated system. It can only be transformed from one form to another."
                                }
                            ]
                        }
                    }
                }
            },
            "Chemistry": {
                "grades": {
                    "Grade 9": {"units": {"Unit 1: Intro to Chemistry (G9)": []}},
                    "Grade 10": {"units": {"Unit 1: States of Matter (G10)": []}},
                    "Grade 11": {"units": {"Unit 1: Stoichiometry (G11)": []}},
                    "Grade 12": {
                        "units": {
                            "Unit 1: Atomic Structure (G12 C)": [
                                {
                                    "id": "chem_g12_atom_001",
                                    "text": "How many protons does a Carbon atom (C) have?",
                                    "options": ["5", "6", "7", "12"],
                                    "answer": 1,
                                    "explanation": "A Carbon atom has an atomic number of 6, which means it has 6 protons in its nucleus."
                                }
                            ],
                            "Unit 2: Chemical Bonding (G12 C)": [
                                {
                                    "id": "chem_g12_bond_001",
                                    "text": "What type of bond is formed by sharing electrons between two atoms?",
                                    "options": ["Ionic Bond", "Covalent Bond", "Metallic Bond", "Hydrogen Bond"],
                                    "answer": 1,
                                    "explanation": "A covalent bond is formed when two atoms share one or more pairs of electrons. This type of bonding typically occurs between non-metallic elements."
                                }
                            ]
                        }
                    }
                }
            },
            "Biology": {
                "grades": {
                    "Grade 9": {"units": {"Unit 1: Intro to Biology (G9)": []}},
                    "Grade 10": {"units": {"Unit 1: Ecosystems (G10)": []}},
                    "Grade 11": {"units": {"Unit 1: Genetics (G11)": []}},
                    "Grade 12": {
                        "units": {
                            "Unit 1: Cell Biology (G12 B)": [
                                {
                                    "id": "bio_g12_cell_001",
                                    "text": "What is the powerhouse of the cell?",
                                    "options": ["Nucleus", "Ribosome", "Mitochondrion", "Golgi Apparatus"],
                                    "answer": 2,
                                    "explanation": "Mitochondria are often referred to as the powerhouses of the cell because they generate most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
                                }
                            ]
                        }
                    }
                }
            },
            "Mathematics": {
                "grades": {
                    "Grade 9": {"units": {"Unit 1: Basic Algebra (G9)": []}},
                    "Grade 10": {"units": {"Unit 1: Geometry (G10)": []}},
                    "Grade 11": {"units": {"Unit 1: Functions (G11)": []}},
                    "Grade 12": {
                        "units": {
                            "Unit 1: Algebra (G12 M)": [
                                {
                                    "id": "math_g12_alg_001",
                                    "text": "Solve for x: 2x + 5 = 15",
                                    "options": ["3", "4", "5", "10"],
                                    "answer": 2,
                                    "explanation": "To solve for x: 2x + 5 = 15. Subtract 5 from both sides: 2x = 10. Divide by 2: x = 5."
                                }
                            ]
                        }
                    }
                }
            }
        }
    },
    "Social Science": {
        "subjects": {
            "History": {
                "grades": {
                    "Grade 9": {"units": {"Unit 1: Early Humans (G9)": []}},
                    "Grade 10": {"units": {"Unit 1: World Wars (G10)": []}},
                    "Grade 11": {"units": {"Unit 1: Revolutions (G11)": []}},
                    "Grade 12": {
                        "units": {
                            "Unit 1: Ancient Civilizations (G12 H)": [
                                {
                                    "id": "hist_g12_anc_001",
                                    "text": "Which river was crucial for ancient Egyptian civilization?",
                                    "options": ["Tigris", "Euphrates", "Nile", "Indus"],
                                    "answer": 2,
                                    "explanation": "The Nile River was central to the development of ancient Egyptian civilization, providing water, fertile soil for agriculture, and a means of transportation."
                                }
                            ]
                        }
                    }
                }
            },
            "Geography": {
                "grades": {
                    "Grade 9": {"units": {"Unit 1: Map Skills (G9)": []}},
                    "Grade 10": {"units": {"Unit 1: Population (G10)": []}},
                    "Grade 11": {"units": {"Unit 1: Resources (G11)": []}},
                    "Grade 12": {
                        "units": {
                            "Unit 1: World Climates (G12 G)": [
                                {
                                    "id": "geo_g12_clim_001",
                                    "text": "What type of climate is characterized by hot, humid summers and mild winters?",
                                    "options": ["Tundra", "Desert", "Mediterranean", "Humid Subtropical"],
                                    "answer": 3,
                                    "explanation": "Humid Subtropical climates (e.g., Southeastern USA, parts of China) are characterized by hot, humid summers and cool to mild winters."
                                }
                            ]
                        }
                    }
                }
            },
            "Civics": {
                "grades": {
                    "Grade 9": {"units": {"Unit 1: Citizenship (G9)": []}},
                    "Grade 10": {"units": {"Unit 1: Constitution (G10)": []}},
                    "Grade 11": {"units": {"Unit 1: Human Rights (G11)": []}},
                    "Grade 12": {
                        "units": {
                            "Unit 1: Forms of Government (G12 Civ)": [
                                 {
                                    "id": "civ_g12_gov_001",
                                    "text": "A system of government where power is held by a single person, often by inheritance, is called:",
                                    "options": ["Democracy", "Republic", "Monarchy", "Oligarchy"],
                                    "answer": 2,
                                    "explanation": "A monarchy is a form of government in which a single person, called a monarch (such as a king, queen, or emperor), holds supreme authority, typically inherited."
                                }
                            ]
                        }
                    }
                }
            },
            "Economics": {
                "grades": {
                    "Grade 9": {"units": {"Unit 1: Needs and Wants (G9)": []}},
                    "Grade 10": {"units": {"Unit 1: Supply and Demand (G10)": []}},
                    "Grade 11": {"units": {"Unit 1: Global Economy (G11)": []}},
                    "Grade 12": {
                        "units": {
                            "Unit 1: Basic Economic Concepts (G12 Eco)": [
                                {
                                    "id": "eco_g12_basic_001",
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
        }
    }
};

// Example of how to add more questions for the new structure:
// window.examData["Natural Science"]["subjects"]["Physics"]["grades"]["Grade 9"]["units"]["Unit 1: Introduction to Physics (G9)"].push({
//     "id": "phy_g9_intro_001",
//     "text": "What is Physics?",
//     "options": ["Study of matter", "Study of life", "Study of society", "Study of numbers"],
//     "answer": 0,
//     "explanation": "Physics is the natural science that studies matter, its fundamental constituents, its motion and behavior through space and time, and the related entities of energy and force."
// });
