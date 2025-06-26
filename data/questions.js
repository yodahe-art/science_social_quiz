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
                    "Grade 9": {
                        "units": {
                            "Unit 1: Basic Algebra (G9)": [], // Kept existing placeholder or can be removed if "Fundamentals of Sets" is the true Unit 1
                            "Unit 1: Fundamentals of Sets": [
                                {
                                    "id": "math_g9_set_001",
                                    "text": "What is a well-defined set?",
                                    "options": ["A collection of anything", "A collection of objects that can be clearly identified", "A collection of random items", "A collection that must contain at least one element"],
                                    "answer": 1,
                                    "explanation": "A well-defined set has clear criteria for membership — we can determine unambiguously whether an object belongs to it or not."
                                },
                                {
                                    "id": "math_g9_set_002",
                                    "text": "Which of the following is a proper subset of the set {1, 2, 3}?",
                                    "options": ["{1, 2, 3}", "{1, 2}", "{4}", "{1, 2, 3, 4}"],
                                    "answer": 1,
                                    "explanation": "A proper subset contains some but not all elements of the original set. Option B has only two of the three elements from {1, 2, 3}, so it is a proper subset."
                                },
                                {
                                    "id": "math_g9_set_003",
                                    "text": "If A = {x | x is a natural number less than 5}, then A is:",
                                    "options": ["{0, 1, 2, 3, 4}", "{1, 2, 3, 4}", "{1, 2, 3, 4, 5}", "{1, 2, 3, 4, 5, 6}"],
                                    "answer": 1,
                                    "explanation": "Natural numbers typically start from 1 (not 0). So, natural numbers less than 5 are: 1, 2, 3, 4."
                                },
                                {
                                    "id": "math_g9_set_004",
                                    "text": "The union of the sets {1, 2, 3} and {3, 4, 5} is:",
                                    "options": ["{1, 2, 3, 4, 5}", "{3}", "{1, 2}", "{1, 2, 3, 3, 4, 5}"],
                                    "answer": 0,
                                    "explanation": "Union combines all elements from both sets without repetition. So {1, 2, 3} ∪ {3, 4, 5} = {1, 2, 3, 4, 5}"
                                },
                                {
                                    "id": "math_g9_set_005",
                                    "text": "If A = {2, 4, 6} and B = {4, 5, 6}, what is A ∩ B?",
                                    "options": ["{2, 4}", "{4, 6}", "{6}", "{4}"],
                                    "answer": 1,
                                    "explanation": "Intersection includes only the common elements between the two sets. In this case, 4 and 6 are in both A and B."
                                },
                                {
                                    "id": "math_g9_set_006",
                                    "text": "The absolute complement of the set A = {1, 2, 3} in the universal set U = {1, 2, 3, 4, 5} is:",
                                    "options": ["{1, 2, 3}", "{4, 5}", "{1, 2, 3, 4, 5}", "{}"],
                                    "answer": 1,
                                    "explanation": "The complement of A in U is the set of all elements in U that are not in A → {4, 5}"
                                },
                                {
                                    "id": "math_g9_set_007",
                                    "text": "Which of the following represents a finite set?",
                                    "options": ["The set of all integers", "The set of all natural numbers", "The set of months in a year", "The set of all real numbers"],
                                    "answer": 2,
                                    "explanation": "Months in a year are countable and limited (only 12), making it a finite set."
                                },
                                {
                                    "id": "math_g9_set_008",
                                    "text": "In set theory, if A = {x | x is an even number}, then which of the following is NOT a member of A?",
                                    "options": ["2", "4", "5", "6"],
                                    "answer": 2,
                                    "explanation": "Only even numbers belong to A. Since 5 is odd, it's not in A."
                                },
                                {
                                    "id": "math_g9_set_009",
                                    "text": "The power set of {a, b} contains how many elements?",
                                    "options": ["2", "4", "8", "16"],
                                    "answer": 1,
                                    "explanation": "Power set = set of all subsets. For a set with n elements, power set has 2^n elements. Here, n = 2 → 2^2 = 4"
                                },
                                {
                                    "id": "math_g9_set_010",
                                    "text": "If the set A has 3 elements, how many subsets does it have?",
                                    "options": ["3", "6", "8", "12"],
                                    "answer": 2,
                                    "explanation": "Number of subsets = 2^n, where n is the number of elements in the set. 2^3 = 8"
                                },
                                {
                                    "id": "math_g9_set_011",
                                    "text": "Which of the following is an example of a well-defined set?",
                                    "options": ["The set of all beautiful people", "The set of all students in a classroom", "The set of all tall buildings", "The set of all colors"],
                                    "answer": 1,
                                    "explanation": "\"Students in a classroom\" is clearly defined — you can objectively identify who belongs. Other options like \"beautiful\" or \"tall\" are subjective."
                                },
                                {
                                    "id": "math_g9_set_012",
                                    "text": "The set {x | x is a vowel in the English alphabet} is:",
                                    "options": ["Well-defined", "Not well-defined", "Finite", "Infinite"],
                                    "answer": 0, // Assuming question means "Which property best describes..." A is primary. C is also true.
                                    "explanation": "There are exactly 5 vowels in English: a, e, i, o, u. Membership is clearly defined."
                                },
                                {
                                    "id": "math_g9_set_013",
                                    "text": "The intersection of {1, 2, 3} and {2, 3, 4} is:",
                                    "options": ["{1, 2, 3, 4}", "{2, 3}", "{1}", "{}"],
                                    "answer": 1,
                                    "explanation": "Common elements in both sets: 2 and 3."
                                },
                                {
                                    "id": "math_g9_set_014",
                                    "text": "Which of the following sets is empty?",
                                    "options": ["{}", "{0}", "{a, b, c}", "{x | x is an even prime number greater than 2}"],
                                    "answer": 3, // Both A and D are empty. Assuming D is the intended answer for concept.
                                    "explanation": "2 is the only even prime number. There are no even primes > 2, so this set is empty. {} also represents the empty set."
                                },
                                {
                                    "id": "math_g9_set_015",
                                    "text": "If A = {1, 2, 3} and B = {1, 3, 4}, what is A ∪ B?",
                                    "options": ["{1, 2, 3, 4}", "{1, 3}", "{2, 4}", "{1, 2}"],
                                    "answer": 0,
                                    "explanation": "Union combines all unique elements from both sets: {1, 2, 3, 4}"
                                },
                                {
                                    "id": "math_g9_set_016",
                                    "text": "The symmetric difference of two sets A and B is defined as:",
                                    "options": ["A ∩ B", "A ∪ B", "(A - B) ∪ (B - A)", "(A ∩ B) - (A ∪ B)"],
                                    "answer": 2,
                                    "explanation": "Symmetric difference includes elements that are in either A or B, but not in both."
                                },
                                {
                                    "id": "math_g9_set_017",
                                    "text": "If A = {1, 2, 3} and B = {3, 4, 5}, what is A - B?",
                                    "options": ["{1, 2}", "{3, 4, 5}", "{1, 2, 3, 4, 5}", "{}"],
                                    "answer": 0,
                                    "explanation": "Set difference A - B means elements in A that are not in B → {1, 2}"
                                },
                                {
                                    "id": "math_g9_set_018",
                                    "text": "The number of elements in the power set of a set with n elements is:",
                                    "options": ["n", "2^n", "n^2", "n!"],
                                    "answer": 1,
                                    "explanation": "Power set = all subsets. Number of subsets = 2^n"
                                },
                                {
                                    "id": "math_g9_set_019",
                                    "text": "The complement of the set A = {2, 4} in the universal set U = {1, 2, 3, 4, 5} is:",
                                    "options": ["{1, 2, 3, 4}", "{1, 3, 5}", "{2, 4}", "{}"],
                                    "answer": 1,
                                    "explanation": "Elements in U but not in A → {1, 3, 5}"
                                },
                                {
                                    "id": "math_g9_set_020",
                                    "text": "If the set A = {x | x is a prime number}, which of the following is NOT in A?",
                                    "options": ["2", "3", "4", "5"],
                                    "answer": 2,
                                    "explanation": "4 is not a prime number because it has more than two divisors (1, 2, 4)"
                                },
                                {
                                    "id": "math_g9_set_021",
                                    "text": "If two sets A and B are equal, then:",
                                    "options": ["A ∩ B = A", "A ∪ B = A", "A - B = B", "A = B"],
                                    "answer": 3, // D. A=B implies A, B, and (A U B = A) and (A int B = A) are all true.
                                    "explanation": "This is just restating the definition of equality. If A=B, then A ∩ B = A and A ∪ B = A are also true."
                                },
                                {
                                    "id": "math_g9_set_022",
                                    "text": "The set of natural numbers is denoted by:",
                                    "options": ["ℕ", "ℤ", "ℚ", "ℝ"],
                                    "answer": 0,
                                    "explanation": "ℕ is standard notation for natural numbers."
                                },
                                {
                                    "id": "math_g9_set_023",
                                    "text": "The complement of the empty set is:",
                                    "options": ["The universal set", "The empty set", "None", "Undefined"],
                                    "answer": 0,
                                    "explanation": "All elements not in the empty set are in the universal set."
                                },
                                {
                                    "id": "math_g9_set_024",
                                    "text": "If A = {1, 2, 3} and B = {2, 3, 4}, what is A ∩ B?",
                                    "options": ["{1}", "{2, 3}", "{4}", "{}"],
                                    "answer": 1,
                                    "explanation": "Common elements in both sets: {2, 3}"
                                },
                                {
                                    "id": "math_g9_set_025",
                                    "text": "For a set A = {1, 2, 3, 4}, what is the number of subsets of A?",
                                    "options": ["4", "8", "16", "2"],
                                    "answer": 2,
                                    "explanation": "Number of subsets = 2^n. Here, n = 4 → 2^4 = 16"
                                },
                                {
                                    "id": "math_g9_set_026",
                                    "text": "The statement \"A is a subset of B\" means:",
                                    "options": ["All elements of B are in A", "All elements of A are in B", "A and B are equal", "A is empty"],
                                    "answer": 1,
                                    "explanation": "Subset means every element of A is also in B."
                                },
                                {
                                    "id": "math_g9_set_027",
                                    "text": "The difference between two sets A and B is denoted as:",
                                    "options": ["A ∩ B", "A ∪ B", "A - B", "A + B"],
                                    "answer": 2,
                                    "explanation": "Standard notation for set difference is A - B"
                                },
                                {
                                    "id": "math_g9_set_028",
                                    "text": "If A = {1, 2} and B = {1, 2, 3}, what is A ⊆ B?",
                                    "options": ["True", "False", "Cannot be determined", "None of the above"],
                                    "answer": 0,
                                    "explanation": "Every element of A is in B → A is a subset of B."
                                },
                                {
                                    "id": "math_g9_set_029",
                                    "text": "The notation |A| represents:",
                                    "options": ["The union of A", "The intersection of A", "The number of elements in set A", "The complement of A"],
                                    "answer": 2,
                                    "explanation": "|A| denotes the cardinality (number of elements) of set A."
                                },
                                {
                                    "id": "math_g9_set_030",
                                    "text": "If A = {x | x is a positive integer} and B = {x | x is even}, what is A ∩ B?",
                                    "options": ["All positive integers", "All odd integers", "All even positive integers", "Empty set"],
                                    "answer": 2,
                                    "explanation": "Positive integers include both even and odd numbers. Intersection gives only those that are both positive and even."
                                },
                                {
                                    "id": "math_g9_set_031",
                                    "text": "The symmetric difference of sets A and B is given by:",
                                    "options": ["A ∩ B", "A ∪ B", "(A - B) ∪ (B - A)", "(A ∩ B) - (A ∪ B)"],
                                    "answer": 2,
                                    "explanation": "Definition of symmetric difference."
                                },
                                {
                                    "id": "math_g9_set_032",
                                    "text": "If A = {2, 4, 6} and B = {4, 6, 8}, what is A ∪ B?",
                                    "options": ["{4, 6}", "{2, 4, 6, 8}", "{2, 4, 6}", "{}"],
                                    "answer": 1,
                                    "explanation": "Combine all unique elements from both sets."
                                },
                                {
                                    "id": "math_g9_set_033",
                                    "text": "The number of subsets of a set with n elements is:",
                                    "options": ["n!", "2^n", "n^2", "n + 1"],
                                    "answer": 1,
                                    "explanation": "Total subsets = 2^n"
                                },
                                {
                                    "id": "math_g9_set_034",
                                    "text": "If A = {1, 2, 3}, what is the power set of A?",
                                    "options": ["{1, 2, 3}", "{{}, {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3}}", "{1, 2, 3, 4}", "None of the above"],
                                    "answer": 1,
                                    "explanation": "Power set includes all possible subsets."
                                },
                                {
                                    "id": "math_g9_set_035",
                                    "text": "The empty set is a subset of:",
                                    "options": ["Only itself", "All sets", "No sets", "Only infinite sets"],
                                    "answer": 1,
                                    "explanation": "Empty set is a subset of every set."
                                },
                                {
                                    "id": "math_g9_set_036",
                                    "text": "If A = {1, 2, 3} and B = {3, 4, 5}, what is A ∩ B?",
                                    "options": ["{1, 2}", "{3}", "{4, 5}", "{}"],
                                    "answer": 1,
                                    "explanation": "Only common element is 3."
                                },
                                {
                                    "id": "math_g9_set_037",
                                    "text": "The difference between the sets A and B is represented by:",
                                    "options": ["A ∩ B", "A ∪ B", "A - B", "A + B"],
                                    "answer": 2,
                                    "explanation": "Standard notation."
                                },
                                {
                                    "id": "math_g9_set_038",
                                    "text": "If A = {x | x is a prime number}, which of the following is NOT in A?",
                                    "options": ["2", "3", "4", "5"],
                                    "answer": 2,
                                    "explanation": "4 is not a prime number."
                                },
                                {
                                    "id": "math_g9_set_039",
                                    "text": "The notation A' represents:",
                                    "options": ["The intersection of A", "The union of A", "The absolute complement of A", "The symmetric difference of A"],
                                    "answer": 2,
                                    "explanation": "A’ usually denotes the complement of A."
                                },
                                {
                                    "id": "math_g9_set_040",
                                    "text": "If A has 5 elements, how many subsets does it have?",
                                    "options": ["5", "10", "32", "64"],
                                    "answer": 2,
                                    "explanation": "2^5 = 32"
                                },
                                {
                                    "id": "math_g9_set_041",
                                    "text": "The universal set U contains the elements {1, 2, 3, 4, 5}. What is the complement of A = {2, 4}?",
                                    "options": ["{1, 2, 3, 4, 5}", "{1, 3, 5}", "{2, 4}", "{}"],
                                    "answer": 1,
                                    "explanation": "Elements in U not in A → {1, 3, 5}"
                                },
                                {
                                    "id": "math_g9_set_042",
                                    "text": "If A = {1, 2, 3, 4} and B = {2, 3}, which statement is true?",
                                    "options": ["B ⊆ A", "A ⊆ B", "A ∩ B = {}", "A ∪ B = {1, 2, 3, 4}"],
                                    "answer": 0, // B is a subset of A. D is also true, but A is more specific to subset relation.
                                    "explanation": "All elements of B are in A → B is a subset of A."
                                },
                                {
                                    "id": "math_g9_set_043",
                                    "text": "The intersection of two disjoint sets A and B is:",
                                    "options": ["A", "B", "Empty set", "A ∪ B"],
                                    "answer": 2,
                                    "explanation": "Disjoint sets share no elements → their intersection is empty."
                                },
                                {
                                    "id": "math_g9_set_044",
                                    "text": "The cardinality of a set refers to:",
                                    "options": ["The number of elements in the set", "The type of elements in the set", "The order of elements in the set", "None of the above"],
                                    "answer": 0,
                                    "explanation": "Cardinality = size of the set."
                                },
                                {
                                    "id": "math_g9_set_045",
                                    "text": "A set is defined as finite if:",
                                    "options": ["It has no elements", "It has a limited number of elements", "It has an infinite number of elements", "It is empty"],
                                    "answer": 1,
                                    "explanation": "Finite set has a definite, limited number of elements."
                                },
                                {
                                    "id": "math_g9_set_046",
                                    "text": "If A = {x | x is a multiple of 3}, which of the following is an element of A?",
                                    "options": ["2", "4", "9", "5"],
                                    "answer": 2,
                                    "explanation": "9 is divisible by 3 → belongs to A."
                                },
                                {
                                    "id": "math_g9_set_047",
                                    "text": "If A = {1, 2, 3} and B = {3, 4, 5}, what is A ∪ B?",
                                    "options": ["{1, 2}", "{3}", "{1, 2, 3, 4, 5}", "{}"],
                                    "answer": 2,
                                    "explanation": "Union includes all unique elements from both sets."
                                },
                                {
                                    "id": "math_g9_set_048",
                                    "text": "The number of elements in the power set of a set with n elements is:",
                                    "options": ["2^n", "n^2", "n + 1", "n!"],
                                    "answer": 0,
                                    "explanation": "As before, total subsets = 2^n"
                                },
                                {
                                    "id": "math_g9_set_049",
                                    "text": "If A and B are equal sets, then:",
                                    "options": ["A ∩ B = A", "A ∪ B = A", "A - B = B", "A = B"],
                                    "answer": 3, // D. A=B implies A, B, and (A U B = A) and (A int B = A) are all true.
                                    "explanation": "Equality implies they are the same set."
                                },
                                {
                                    "id": "math_g9_set_050",
                                    "text": "The union of two sets A and B is denoted by:",
                                    "options": ["A ∩ B", "A ∪ B", "A - B", "A + B"],
                                    "answer": 1,
                                    "explanation": "Standard notation for union is A ∪ B."
                                }
                            ]
                        }
                    },
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
