// ============================================================
// CHARACTER SHEET SCRIPT
// ============================================================

console.log("main-sheet.js is working!");

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    const nameField =
        document.getElementById("name");
    function loadCharacterName() {

    if (
        typeof KKState === "undefined" ||
        !nameField
    ) {
        return;
    }

    const state =
        KKState.load();

    nameField.value =
        typeof state?.derived?.characterName === "string"
            ? state.derived.characterName
            : "";

}


function saveCharacterName() {

    if (
        typeof KKState === "undefined" ||
        !nameField
    ) {
        return;
    }

    const state =
        KKState.load();

    if (
        !state.derived ||
        typeof state.derived !== "object"
    ) {
        state.derived = {};
    }

    state.derived.characterName =
        nameField.value;

    KKState.save(state);

}

    // ========================================================
    // GET HTML ELEMENTS
    // ========================================================
    
    const physiqueField =
        document.getElementById("physique");

    const heightField =
        document.getElementById("height");

    const skillField =
        document.getElementById("skills");

    const stealthField =
        document.getElementById("stealth");

    const mobilityField =
        document.getElementById("mobility");

    const enduranceField =
        document.getElementById("endurance");

    const recoveryField =
        document.getElementById("recovery");

    const fortitudeField =
        document.getElementById("fortitude");

    const mightField =
        document.getElementById("might");

    const paddingField =
        document.getElementById("padding");

    const reachField =
        document.getElementById("reach");

    const grapplingField =
        document.getElementById("grappling");

    const weightField =
        document.getElementById("weight");

    const weightBaseField =
        document.getElementById("weightBase");

    const weightEIndicatorField =
        document.getElementById("weightEIndicator");

    const movementField =
        document.getElementById("movement");

    const fatigueField =
        document.getElementById("fatigue");

    const fatigueMinusButton =
        document.getElementById(
        "fatigueMinus"
        );

    const fatiguePlusButton =
        document.getElementById(
        "fatiguePlus"
        );

    const fatigueModifierField =
        document.getElementById(
        "fatigueModifier"
        );

    const priorityField =
        document.getElementById("priority");

    const priorityPenaltyField =
        document.getElementById("priorityPenalty");

    const injurySelect =
        document.getElementById("injurySelect");

    const injuryTokens =
        document.getElementById("injuryTokens");


    // ========================================================
    // PHYSIQUE DATA
    // ========================================================

    const physiqueData = {

        Massive: {
            Might: 4,
            Padding: 3,
            Fortitude: 3,
            Recovery: "d4",
            WeightBase: 20,
            Endurance: 5,
            Mobility: 0,
            Stealth: -1
        },

        Huge: {
            Might: 3,
            Padding: 3,
            Fortitude: 3,
            Recovery: "d6",
            WeightBase: 19,
            Endurance: 6,
            Mobility: 0,
            Stealth: 0
        },

        Bulky: {
            Might: 3,
            Padding: 2,
            Fortitude: 2,
            Recovery: "d6",
            WeightBase: 18,
            Endurance: 6,
            Mobility: 1,
            Stealth: 1
        },

        Muscular: {
            Might: 2,
            Padding: 2,
            Fortitude: 2,
            Recovery: "d8",
            WeightBase: 17,
            Endurance: 7,
            Mobility: 1,
            Stealth: 2
        },

        Athletic: {
            Might: 2,
            Padding: 1,
            Fortitude: 2,
            Recovery: "d8",
            WeightBase: 16,
            Endurance: 7,
            Mobility: 2,
            Stealth: 2
        },

        Average: {
            Might: 1,
            Padding: 1,
            Fortitude: 2,
            Recovery: "d8",
            WeightBase: 15,
            Endurance: 8,
            Mobility: 2,
            Stealth: 2
        },

        Toned: {
            Might: 1,
            Padding: 0,
            Fortitude: 2,
            Recovery: "d8",
            WeightBase: 14,
            Endurance: 8,
            Mobility: 3,
            Stealth: 2
        },

        Lean: {
            Might: 0,
            Padding: 0,
            Fortitude: 2,
            Recovery: "d8",
            WeightBase: 13,
            Endurance: 8,
            Mobility: 3,
            Stealth: 3
        },

        Slender: {
            Might: 0,
            Padding: 0,
            Fortitude: 2,
            Recovery: "d10",
            WeightBase: 12,
            Endurance: 8,
            Mobility: 4,
            Stealth: 3
        },

        Small: {
            Might: 0,
            Padding: 0,
            Fortitude: 1,
            Recovery: "d10",
            WeightBase: 11,
            Endurance: 9,
            Mobility: 4,
            Stealth: 4
        },

        Meek: {
            Might: -1,
            Padding: 0,
            Fortitude: 1,
            Recovery: "d12",
            WeightBase: 10,
            Endurance: 10,
            Mobility: 5,
            Stealth: 5
        }

    };


    // ========================================================
    // HEIGHT DATA
    // ========================================================

    const heightData = {

        Tall: {
            Reach: 2,
            GrapplingBase: 0
        },

        Average: {
            Reach: 1,
            GrapplingBase: 1
        },

        Short: {
            Reach: 0,
            GrapplingBase: 2
        }

    };


    // ========================================================
    // CHARACTER VALUES
    // ========================================================

    let character = {

        Might: "",
        Padding: "",
        Fortitude: "",
        Recovery: "",
        WeightBase: "",
        Endurance: "",
        Mobility: "",
        Stealth: "",

        Reach: "",
        GrapplingBase: "",
        Grappling: "",

        Weight: "",
        Movement: "",
        WeightEIndicator: ""

    };


// ========================================================
// SET CURRENT FATIGUE
// ========================================================

function setCurrentFatigue(
    value
) {

    const newValue =
        Math.max(
            0,
            Number(
                value
            ) || 0
        );


    // ----------------------------------------------------
    // DISPLAY
    // ----------------------------------------------------

    fatigueField.textContent =
        String(
            newValue
        );


    // ----------------------------------------------------
    // SHARED STATE
    // ----------------------------------------------------

    if (
        typeof KKState !==
            "undefined"
    ) {

        const state =
            KKState.load();


        if (
            !state.derived ||
            typeof state.derived !==
                "object"
        ) {

            state.derived = {};

        }


        state
            .derived
            .currentFatigue =
                newValue;


        KKState.save(
            state
        );

    }

}


// ========================================================
// SYNC CURRENT FATIGUE FROM SHARED STATE
// ========================================================

function syncCurrentFatigue() {

    if (
        typeof KKState ===
            "undefined"
    ) {

        return;

    }


    const state =
        KKState.load();


    const fatigue =
        Math.max(
            0,
            Number(
                state?.derived?.currentFatigue
            ) || 0
        );


    fatigueField.textContent =
        String(
            fatigue
        );

}


// ========================================================
// CHANGE CURRENT FATIGUE
// ========================================================

function changeFatigue(
    amount
) {

    let current =
        Number(
            fatigueField.textContent
        );


    if (
        !Number.isFinite(
            current
        )
    ) {

        current = 0;

    }


    setCurrentFatigue(
        current +
        Number(
            amount
        )
    );

}


// ========================================================
// DEFAULT VALUES
// ========================================================

fatigueField.textContent = "0";
priorityField.value = "0";


    // ========================================================
    // INJURY LIST
    // ========================================================

    let injuries = [];


function loadInjuriesFromState() {

    if (typeof KKState === "undefined") {
        return;
    }

    const currentState = KKState.load();

    injuries =
        Array.isArray(currentState?.derived?.injuries)
            ? currentState.derived.injuries.map(
                function (injury) {
                    return { ...injury };
                }
            )
            : [];

}


function saveInjuriesToState() {

    if (typeof KKState === "undefined") {
        return;
    }

    const currentState = KKState.load();

    if (
        !currentState.derived ||
        typeof currentState.derived !== "object"
    ) {
        currentState.derived = {};
    }

    currentState.derived.injuries =
        injuries.map(
            function (injury) {
                return { ...injury };
            }
        );

    publishingDerivedStats = true;

    try {

        KKState.save(currentState);

    } finally {

        publishingDerivedStats = false;

    }

}


    // ========================================================
// HEAD TRAUMA TINT
// ========================================================

function getHeadTintDismissed() {

    if (
        typeof KKState ===
        "undefined"
    ) {

        return false;

    }


    const currentState =
        KKState.load();


    return Boolean(
        currentState
            .derived
            .headInjuryTintDismissed
    );

}


function setHeadTintDismissed(
    dismissed
) {

    if (
        typeof KKState ===
        "undefined"
    ) {

        return;

    }


    const currentState =
        KKState.load();


    if (
        !currentState.derived ||
        typeof currentState.derived !==
            "object"
    ) {

        currentState.derived = {};

    }


    currentState
        .derived
        .headInjuryTintDismissed =
            Boolean(
                dismissed
            );


    publishingDerivedStats =
        true;


    try {

        KKState.save(
            currentState
        );

    }

    finally {

        publishingDerivedStats =
            false;

    }

}


function renderHeadTraumaTint() {

    const characterSheet =
        document.querySelector(
            ".character-sheet"
        );


    if (
        !characterSheet
    ) {

        return;

    }


    const hasHeadWound =
        countInjury(
            "head-wound"
        ) > 0;


    const hasActiveHeadInjury =
        countInjury(
            "head-injury"
        ) > 0 &&
        !getHeadTintDismissed();


    characterSheet.classList.toggle(
        "head-trauma-tint",
        hasHeadWound ||
        hasActiveHeadInjury
    );

}


function publishHeadTraumaState() {

    if (
        typeof KKState ===
            "undefined" ||
        publishingDerivedStats
    ) {

        return;

    }


    const currentState =
        KKState.load();


    if (
        !currentState.derived ||
        typeof currentState.derived !==
            "object"
    ) {

        currentState.derived = {};

    }


    const headInjuries =
        countInjury(
            "head-injury"
        );


    const headWounds =
        countInjury(
            "head-wound"
        );


    const currentHeadInjuries =
        Number(
            currentState
                .derived
                .headInjuries
        ) || 0;


    const currentHeadWounds =
        Number(
            currentState
                .derived
                .headWounds
        ) || 0;


    if (
        currentHeadInjuries ===
            headInjuries &&
        currentHeadWounds ===
            headWounds
    ) {

        return;

    }


    currentState
        .derived
        .headInjuries =
            headInjuries;


    currentState
        .derived
        .headWounds =
            headWounds;


    publishingDerivedStats =
        true;


    try {

        KKState.save(
            currentState
        );

    }

    finally {

        publishingDerivedStats =
            false;

    }

}


    // ========================================================
    // DERIVED-STATE PUBLISH GUARD
    // ========================================================
    //
    // KKState.save() dispatches the shared-state event
    // synchronously. This flag prevents the Main Sheet from
    // reacting to the event generated by its own derived-stat
    // publication and creating a refresh/save loop.
    // ========================================================

    let publishingDerivedStats =
        false;


    // ========================================================
    // INJURY TRACKER TYPES
    // ========================================================
    //
    // Only regular Injuries receive the 1 -> 2 -> 3 tracker.
    // Wounds, Bruise, and Bleeding do not.
    // ========================================================

    const trackedInjuries =
        new Set([

            "head-injury",
            "left-arm-injury",
            "right-arm-injury",
            "leg-injury",
            "torso-injury"

        ]);


    // ========================================================
    // IMAGE PATHS
    // ========================================================

    const injuryImages = {

        "bleeding":
            "injuries/Bleeding.png",

        "bruise":
            "injuries/Bruise.png",

        "head-injury":
            "injuries/Head Injury.png",

        "head-wound":
            "injuries/Head Wound.png",

        "left-arm-injury":
            "injuries/Left Arm Injury.png",

        "left-arm-wound":
            "injuries/Left Arm Wound.png",

        "leg-injury":
            "injuries/Leg Injury.png",

        "leg-wound":
            "injuries/Leg Wound.png",

        "right-arm-injury":
            "injuries/Right Arm Injury.png",

        "right-arm-wound":
            "injuries/Right Arm Wound.png",

        "torso-injury":
            "injuries/Torso Injury.png",

        "torso-wound":
            "injuries/Torso Wound.png"

    };


    // ========================================================
    // BUILDER SKILL NAMES
    // ========================================================

    const builderSkillNames = {

        aware: "AWARE",
        flexible: "FLEXIBLE",
        resilient: "RESILIENT",
        sneaky: "SNEAKY",
        strong: "STRONG",
        tireless: "TIRELESS",
        tough: "TOUGH",

        abrazare: "ABRAZARE",
        disarm: "DISARM",
        "dual-wielding": "DUAL WIELDING",
        executioner: "EXECUTIONER",
        feint: "FEINT",
        gambit: "GAMBIT",
        lunge: "LUNGE",
        opportunist: "OPPORTUNIST",
        pickpocket: "PICKPOCKET",
        rabat: "RABAT",
        sweep: "SWEEP",
        unarmored: "UNARMORED",
        yank: "YANK",

        "hold-the-line": "HOLD THE LINE",
        "shield-bash": "SHIELD BASH",
        swashbuckling: "SWASHBUCKLING",

        assassin: "ASSASSIN",
        "half-swording": "HALF-SWORDING",
        mordschlag: "MORDSCHLAG",
        moulinet: "MOULINET",
        riposte: "RIPOSTE",
        "sword-and-board": "SWORD & BOARD",

        "grappling-hook": "GRAPPLING HOOK",
        "haft-hack": "HAFT HACK",
        "weapon-hook": "WEAPON HOOK",

        "sword-breaker": "SWORD-BREAKER",

        "haft-block": "HAFT BLOCK",
        "haft-strike": "HAFT STRIKE",

        ensnare: "ENSNARE"

    };


    // ========================================================
    // RANKED BUILDER SKILLS
    // ========================================================

    const rankedBuilderSkills =
        new Set([

            "aware",
            "sneaky",
            "tireless",
            "executioner",
            "abrazare"

        ]);


    // ========================================================
    // BUILDER SKILL COST / RANK RULES
    // ========================================================

    const builderToggleSkillCosts = {

        flexible: 5,
        resilient: 5,
        strong: 5,
        tough: 3,

        disarm: 2,
        "dual-wielding": 2,
        feint: 3,
        gambit: 4,
        lunge: 2,
        opportunist: 2,
        pickpocket: 1,
        rabat: 2,
        sweep: 5,
        unarmored: 4,
        yank: 3,

        "hold-the-line": 2,
        "shield-bash": 3,
        swashbuckling: 1,

        assassin: 3,
        "half-swording": 5,
        mordschlag: 4,
        moulinet: 3,
        riposte: 3,
        "sword-and-board": 3,

        "grappling-hook": 2,
        "haft-hack": 4,
        "weapon-hook": 3,

        "sword-breaker": 1,

        "haft-block": 2,
        "haft-strike": 2,

        ensnare: 3

    };


    const builderRankCosts = {

        aware:
            [0, 1, 2, 3],

        sneaky:
            [0, 3, 6, 9, 12, 15, 18],

        tireless:
            [0, 3, 6, 9, 12, 15],

        executioner:
            [0, 2, 4, 7],

        abrazare:
            [0, 4, 8, 12, 16, 20, 24, 28]

    };


    // ========================================================
    // CALCULATE BUILDER SKILL SPENDING
    // ========================================================

    function calculateBuilderSkillSpent(
        skills
    ) {

        let total = 0;


        Object.entries(
            builderToggleSkillCosts
        ).forEach(
            function (
                [key, cost]
            ) {

                if (
                    skills[key] === true
                ) {

                    total += cost;

                }

            }
        );


        Object.entries(
            builderRankCosts
        ).forEach(
            function (
                [key, costs]
            ) {

                const rank =
                    Math.max(
                        0,
                        Math.min(
                            costs.length - 1,
                            Number(
                                skills[key]
                            ) || 0
                        )
                    );


                total +=
                    costs[rank] || 0;

            }
        );


        return total;

    }


    // ========================================================
    // GET LEGAL MANUAL RANK
    // ========================================================

    function getLegalManualRank(
        key,
        requestedRank,
        state
    ) {

        let rank =
            Math.max(
                0,
                Math.floor(
                    Number(
                        requestedRank
                    ) || 0
                )
            );


        const costs =
            builderRankCosts[
                key
            ];


        if (costs) {

            rank =
                Math.min(
                    rank,
                    costs.length - 1
                );

        }


        const physique =
            state
                .builder
                .physique;


        const base =
            physiqueData[
                physique
            ];


        if (
            base &&
            key === "sneaky"
        ) {

            rank =
                Math.min(
                    rank,
                    Math.max(
                        0,
                        5 -
                        Number(
                            base.Stealth
                        )
                    )
                );

        }


        if (
            base &&
            key === "tireless"
        ) {

            rank =
                Math.min(
                    rank,
                    Math.max(
                        0,
                        10 -
                        Number(
                            base.Endurance
                        )
                    )
                );

        }


        return rank;

    }


    // ========================================================
    // CHECK MANUALLY TYPED TOGGLE SKILL
    // ========================================================

    function toggleSkillIsStatLegal(
        key,
        state
    ) {

        const base =
            physiqueData[
                state
                    .builder
                    .physique
            ];


        if (!base) {

            return true;

        }


        if (
            key === "flexible"
        ) {

            return (
                Number(
                    base.Mobility
                ) + 1 <=
                5
            );

        }


        if (
            key === "resilient"
        ) {

            return (
                Number(
                    base.Fortitude
                ) + 1 <=
                3
            );

        }


        if (
            key === "strong"
        ) {

            return (
                Number(
                    base.Might
                ) + 1 <=
                3
            );

        }


        if (
            key === "tough"
        ) {

            return (
                Number(
                    base.Padding
                ) + 1 <=
                3
            );

        }


        return true;

    }


        // ========================================================
    // SYNC BUILDER FROM MANUALLY EDITED SKILL TEXT
    // ========================================================
    //
    // Deleting a builder-managed ALL-CAPS skill removes it
    // from Builder Page 2 and refunds its points.
    //
    // Typing a valid skill attempts to purchase it.
    //
    // If the requested set costs too many points, the legal
    // Builder state is restored in the Skills box.
    // ========================================================

    function syncBuilderFromSkillText() {

        if (
            !skillField ||
            typeof KKState ===
                "undefined"
        ) {

            return;

        }


        const state =
            KKState.load();


        const requested =
            {};


        const reverseNames =
            {};


        Object.entries(
            builderSkillNames
        ).forEach(
            function (
                [key, name]
            ) {

                reverseNames[
                    name
                ] =
                    key;

            }
        );


        skillField
            .value
            .split(/\r?\n/)
            .forEach(
                function (
                    rawLine
                ) {

                    const line =
                        rawLine.trim();


                                            if (!line) {

                        return;

                    }


                    Object.entries(
                        reverseNames
                    ).some(
                        function (
                            [name, key]
                        ) {

                            const escaped =
                                name.replace(
                                    /[.*+?^${}()|[\]\\]/g,
                                    "\\$&"
                                );


                            const match =
                                line.match(
                                    new RegExp(
                                        "^" +
                                        escaped +
                                        "(?:\\s+(\\d+))?$"
                                    )
                                );


                            if (!match) {

                                return false;

                            }


                            if (
                                rankedBuilderSkills.has(
                                    key
                                )
                            ) {

                                requested[
                                    key
                                ] =
                                    getLegalManualRank(
                                        key,
                                        match[1]
                                            ? Number(
                                                match[1]
                                            )
                                            : 1,
                                        state
                                    );

                            }

                            else {

                                requested[
                                    key
                                ] =
                                    true;

                            }


                            return true;

                        }
                    );

                }
            );

        // ----------------------------------------------------
        // REMOVE ILLEGAL TOGGLE SKILLS
        // ----------------------------------------------------

        Object.keys(
            requested
        ).forEach(
            function (
                key
            ) {

                if (
                    requested[key] ===
                    true
                ) {

                    const testState = {

                        ...state,

                        builder: {

                            ...state.builder,

                            skills:
                                requested

                        }

                    };


                    if (
                        !toggleSkillIsStatLegal(
                            key,
                            testState
                        )
                    ) {

                        delete requested[
                            key
                        ];

                    }

                }


                if (
                    requested[key] ===
                    0
                ) {

                    delete requested[
                        key
                    ];

                }

            }
        );


        // ----------------------------------------------------
        // POINT CHECK
        // ----------------------------------------------------

        const proposedSpent =
            calculateBuilderSkillSpent(
                requested
            );


        const availableForSkills =
            Number(
                state
                    .builder
                    .startingPoints ||
                30
            ) -
            Number(
                state
                    .builder
                    .spent
                    .gear ||
                0
            );


        if (
            proposedSpent >
            availableForSkills
        ) {

            syncBuilderSkills();

            return;

        }


        // ----------------------------------------------------
        // SAVE REQUESTED BUILDER SKILLS
        // ----------------------------------------------------

        state
            .builder
            .skills =
                requested;


        state
            .builder
            .spent
            .skills =
                proposedSpent;


        KKState.save(
            state
        );

    }


    // ========================================================
    // BUILDER PHYSIQUE / HEIGHT SYNC
    // ========================================================

    function syncBuilderPhysiqueAndHeight() {

        if (
            typeof KKState === "undefined"
        ) {

            return;

        }


        const state =
            KKState.load();


        const builderPhysique =
            state &&
            state.builder
                ? state.builder.physique
                : null;


        const builderHeight =
            state &&
            state.builder
                ? state.builder.height
                : null;


        const physiqueChanged =
            physiqueField.value !==
            (builderPhysique || "");


        const heightChanged =
            heightField.value !==
            (builderHeight || "");


        // ----------------------------------------------------
        // PHYSIQUE
        // ----------------------------------------------------

        physiqueField.value =
            builderPhysique || "";


        if (
            builderPhysique &&
            physiqueData[
                builderPhysique
            ]
        ) {

            if (
                physiqueChanged ||
                character.Might === ""
            ) {

                updatePhysique();

            }

        }

        else {

            clearPhysiqueValues();

        }


        // ----------------------------------------------------
        // HEIGHT
        // ----------------------------------------------------

        heightField.value =
            builderHeight || "";


        if (
            builderHeight &&
            heightData[
                builderHeight
            ]
        ) {

            if (
                heightChanged ||
                character.GrapplingBase === ""
            ) {

                updateHeight();

            }

        }

        else {

            clearHeightValues();

        }


        updateAllStats();

    }


    // ========================================================
    // CLEAR PHYSIQUE VALUES
    // ========================================================

    function clearPhysiqueValues() {

        character.Might = "";
        character.Padding = "";
        character.Fortitude = "";
        character.Recovery = "";
        character.WeightBase = "";
        character.Endurance = "";
        character.Mobility = "";
        character.Stealth = "";

        character.Weight = "";


        mightField.value = "";
        paddingField.value = "";

        stealthField.value = "";
        mobilityField.value = "";
        enduranceField.value = "";
        recoveryField.value = "";
        fortitudeField.value = "";

        weightBaseField.value = "";
        weightField.value = "";

        movementField.value = "";
        weightEIndicatorField.value = "";

    }


    // ========================================================
    // CLEAR HEIGHT VALUES
    // ========================================================

    function clearHeightValues() {

        character.Reach = "";
        character.GrapplingBase = "";
        character.Grappling = "";

        reachField.value = "";
        grapplingField.value = "";

    }


    // ========================================================
    // UPDATE PHYSIQUE
    // ========================================================

    function updatePhysique() {

        const selectedPhysique =
            physiqueField.value;


        const data =
            physiqueData[
                selectedPhysique
            ];


        if (!data) {

            clearPhysiqueValues();

            return;

        }


        character.Might =
            data.Might;

        character.Padding =
            data.Padding;

        character.Fortitude =
            data.Fortitude;

        character.Recovery =
            data.Recovery;

        character.WeightBase =
            data.WeightBase;

        character.Endurance =
            data.Endurance;

        character.Mobility =
            data.Mobility;

        character.Stealth =
            data.Stealth;

        // ----------------------------------------------------
        // DISPLAY VALUES
        // ----------------------------------------------------

        mightField.value =
            data.Might;

        paddingField.value =
            data.Padding;

        stealthField.value =
            data.Stealth;

        mobilityField.value =
            data.Mobility;

        enduranceField.value =
            data.Endurance;

        recoveryField.value =
            data.Recovery;

        fortitudeField.value =
            data.Fortitude;

        weightBaseField.value =
            data.WeightBase;

    }


    // ========================================================
    // UPDATE HEIGHT
    // ========================================================

    function updateHeight() {

        const selectedHeight =
            heightField.value;


        const data =
            heightData[
                selectedHeight
            ];


        if (!data) {

            clearHeightValues();

            return;

        }


        character.Reach =
            data.Reach;


        character.GrapplingBase =
            data.GrapplingBase;


        reachField.value =
            data.Reach;


        updateGrappling();

    }


    // ========================================================
    // GET BUILDER SKILLS
    // ========================================================

    function getBuilderSkills() {

        if (
            typeof KKState ===
            "undefined"
        ) {

            return {};

        }


        const state =
            KKState.load();


        if (
            !state ||
            !state.builder ||
            !state.builder.skills
        ) {

            return {};

        }


        return state.builder.skills;

    }


    // ========================================================
    // GET SKILL RANK
    // ========================================================

    function getSkillRank(
        skills,
        key
    ) {

        const value =
            skills[key];


        if (
            value === true
        ) {

            return 1;

        }


        const numeric =
            Number(
                value
            );


        if (
            Number.isFinite(
                numeric
            ) &&
            numeric > 0
        ) {

            return numeric;

        }


        return 0;

    }


    // ========================================================
    // GET SELECTED ARMOR EFFECTS
    // ========================================================

    function getSelectedArmorEffects() {

        if (
            typeof KKState ===
                "undefined"
        ) {

            return null;

        }


        const state =
            KKState.load();


        const armorId =
            String(
                state?.builder?.armor ||
                ""
            )
            .trim()
            .toLowerCase();


        const armorEffects = {

            light: {
                mobilityPenalty: 0,
                stealthPenalty: 0,
                fatigue: 1,
                weight: 2
            },

            medium: {
                mobilityPenalty: -1,
                stealthPenalty: -2,
                fatigue: 2,
                weight: 4
            },

            heavy: {
                mobilityPenalty: -3,
                stealthPenalty: -4,
                fatigue: 3,
                weight: 5
            }

        };


        return (
            armorEffects[
                armorId
            ] ||
            null
        );

    }


    // ========================================================
    // UPDATE STATS FROM SKILLS
    // ========================================================

    function updateSkillStats() {

        const skills =
            getBuilderSkills();


        const selectedPhysique =
            physiqueField.value;


        const data =
            physiqueData[
                selectedPhysique
            ];


        if (!data) {

            return;

        }


        // ----------------------------------------------------
        // SKILL RANKS
        // ----------------------------------------------------

        const flexible =
            getSkillRank(
                skills,
                "flexible"
            );


        const resilient =
            getSkillRank(
                skills,
                "resilient"
            );


        const sneaky =
            getSkillRank(
                skills,
                "sneaky"
            );


        const strong =
            getSkillRank(
                skills,
                "strong"
            );


        const tireless =
            getSkillRank(
                skills,
                "tireless"
            );


        const tough =
            getSkillRank(
                skills,
                "tough"
            );


        const abrazare =
            getSkillRank(
                skills,
                "abrazare"
            );


        const unarmored =
            getSkillRank(
                skills,
                "unarmored"
            );


        // ----------------------------------------------------
        // MIGHT
        // ----------------------------------------------------

        const baseMight =
    Number(
        data.Might
    );


character.Might =
    Math.max(
        baseMight,

        Math.min(
            3,
            baseMight +
            strong
        )
    );


        // ----------------------------------------------------
        // PADDING
        // ----------------------------------------------------

        character.Padding =
            Math.min(
                3,
                Number(
                    data.Padding
                ) +
                tough
            );


        // ----------------------------------------------------
        // FORTITUDE
        // ----------------------------------------------------

        character.Fortitude =
            Math.min(
                3,
                Number(
                    data.Fortitude
                ) +
                resilient
            );


        // ----------------------------------------------------
        // ENDURANCE
        // ----------------------------------------------------

        character.Endurance =
            Math.min(
                10,
                Number(
                    data.Endurance
                ) +
                tireless
            );


        // ----------------------------------------------------
        // STEALTH
        // ----------------------------------------------------

        character.Stealth =
            Math.min(
                5,
                Number(
                    data.Stealth
                ) +
                sneaky
            );

                    const armor =
            getSelectedArmorEffects();


        if (
            armor
        ) {

            character.Stealth +=
                Number(
                    armor.stealthPenalty
                ) || 0;

        }


        // ----------------------------------------------------
        // MOBILITY
        // ----------------------------------------------------
        //
        // UNARMORED does not have a cap of 5.
        //
        // FLEXIBLE does not stack with UNARMORED.
        // ----------------------------------------------------

        character.Mobility =
    Math.min(
        5,
        Number(
            data.Mobility
        ) +
        flexible
    ) +
    (
        unarmored > 0
            ? 5
            : 0
    );


        // ----------------------------------------------------
        // ARMOR MOBILITY PENALTY
        // ----------------------------------------------------

        if (
            armor
        ) {

            character.Mobility +=
                Number(
                    armor.mobilityPenalty
                ) || 0;

        }


        // ----------------------------------------------------
        // RECOVERY
        // ----------------------------------------------------

        character.Recovery =
            data.Recovery;


        // ----------------------------------------------------
        // DISPLAY BASE + SKILL VALUES
        // ----------------------------------------------------

        mightField.value =
            character.Might;


        paddingField.value =
            character.Padding;


        fortitudeField.value =
            character.Fortitude;


        enduranceField.value =
            character.Endurance;


        stealthField.value =
            character.Stealth;


        mobilityField.value =
            character.Mobility;


        recoveryField.value =
            character.Recovery;


        // ----------------------------------------------------
        // GRAPPLING
        // ----------------------------------------------------

        updateGrappling(
            abrazare
        );

    }


    // ========================================================
    // UPDATE GRAPPLING
    // ========================================================

    function updateGrappling(
        abrazareRank = null
    ) {

        if (
            character.Might === "" ||
            character.GrapplingBase === ""
        ) {

            character.Grappling = "";

            grapplingField.value = "";

            return;

        }


        let rank =
            abrazareRank;


        if (
            rank === null
        ) {

            rank =
                getSkillRank(
                    getBuilderSkills(),
                    "abrazare"
                );

        }


        character.Grappling =
    Math.min(
        10,
        Number(
            character.Might
        ) +
        Number(
            character.GrapplingBase
        ) +
        Number(
            rank
        )
    );


        grapplingField.value =
            character.Grappling;

    }


    // ========================================================
    // COUNT INJURY
    // ========================================================

    function countInjury(
        type
    ) {

        return injuries.filter(
            function (
                injury
            ) {

                return (
                    injury.type ===
                    type
                );

            }
        ).length;

    }


    // ========================================================
    // DOES CHARACTER HAVE INJURY TYPE?
    // ========================================================

    function hasInjury(
        type
    ) {

        return (
            countInjury(
                type
            ) >
            0
        );

    }


    // ========================================================
    // SET INJURY-AFFECTED TEXT COLOR
    // ========================================================

    function setInjuryAffectedColor(
        field,
        affected
    ) {

        if (!field) {

            return;

        }


        field.classList.toggle(
            "injury-affected",
            Boolean(
                affected
            )
        );

    }


    // ========================================================
    // UPDATE SKILL-AFFECTED COLORS
    // ========================================================

    function updateSkillAffectedColors() {

        const skills =
            getBuilderSkills();


        const affectedFields = [

    {
        field: mobilityField,
        skills: [
            "flexible",
            "unarmored"
        ]
    },

    {
        field: movementField,
        skills: [
            "unarmored"
        ]
    },

    {
        field: fortitudeField,
        skills: [
            "resilient"
        ]
    },

    {
        field: stealthField,
        skills: [
            "sneaky"
        ]
    },

    {
        field: mightField,
        skills: [
            "strong"
        ]
    },

    {
        field: enduranceField,
        skills: [
            "tireless"
        ]
    },

    {
        field: paddingField,
        skills: [
            "tough"
        ]
    },

    {
        field: grapplingField,
        skills: [
            "abrazare"
        ]
    }

];


        affectedFields.forEach(
            function (
                entry
            ) {

                if (
                    !entry.field
                ) {

                    return;

                }


                const isSkillAffected =
    entry.skills.some(
        function (
            skill
        ) {

            return (
                getSkillRank(
                    skills,
                    skill
                ) > 0
            );

        }
    );


entry.field.classList.toggle(
    "skill-affected",
    isSkillAffected
);

            }
        );

    }


    // ========================================================
    // UPDATE INJURY-AFFECTED COLORS
    // ========================================================

    function updateInjuryAffectedColors() {

        const legInjuryCount =
            countInjury(
                "leg-injury"
            );


        const legWoundCount =
            countInjury(
                "leg-wound"
            );


        const hasLegDamage =
            (
                legInjuryCount >
                0 ||
                legWoundCount >
                0
            );


        setInjuryAffectedColor(
    mightField,
    hasLegDamage
);


setInjuryAffectedColor(
    mobilityField,
    hasLegDamage
);


        setInjuryAffectedColor(
            movementField,
            hasLegDamage
        );


        setInjuryAffectedColor(
            priorityField,
            hasLegDamage
        );


        setInjuryAffectedColor(
            priorityPenaltyField,
            hasLegDamage
        );

    }


    // ========================================================
// APPLY INJURY STAT MODIFIERS
// ========================================================

function applyInjuryModifiers() {

    if (
        character.Might === ""
    ) {

        return;

    }


    const legInjuryCount =
        countInjury(
            "leg-injury"
        );


    const legWoundCount =
        countInjury(
            "leg-wound"
        );


    // ----------------------------------------------------
    // LEG PENALTY
    //
    // Leg Injury = -1 Might / Mobility
    // Leg Wound  = -2 Might / Mobility
    //
    // Applied AFTER skill and armor modifiers.
    // ----------------------------------------------------

    const legPenalty =
        (
            legInjuryCount *
            1
        ) +
        (
            legWoundCount *
            2
        );


    character.Might =
        Number(
            character.Might
        ) -
        legPenalty;


    character.Mobility =
        Number(
            character.Mobility
        ) -
        legPenalty;


    mightField.value =
        character.Might;


    mobilityField.value =
        character.Mobility;


    // ----------------------------------------------------
    // GRAPPLING USES FINAL MIGHT
    // ----------------------------------------------------

    updateGrappling();

}


        // ========================================================
    // UPDATE PRIORITY PENALTY
    // ========================================================

    function updatePriorityPenalty() {

        const legInjuryCount =
            countInjury(
                "leg-injury"
            );


        const legWoundCount =
            countInjury(
                "leg-wound"
            );


        const penalty =
            (
                legInjuryCount *
                1
            ) +
            (
                legWoundCount *
                2
            );


        if (
            penalty > 0
        ) {

            priorityPenaltyField.value =
                "-" +
                penalty;

        }

        else {

            priorityPenaltyField.value =
                "";

        }

    }


// ========================================================
// UPDATE TOTAL WEIGHT
// ========================================================
//
// Final Weight =
//
//     Physique Weight Base
//     + Armor Weight
//     + Weight of every owned equipment instance
//
// Each inventory instance is counted once.
// ========================================================

function updateTotalWeight() {

    if (
        character.WeightBase === ""
    ) {

        character.Weight = "";
        weightField.value = "";

        return;

    }


    let totalWeight =
        Number(
            character.WeightBase
        ) || 0;


    // ----------------------------------------------------
    // ARMOR WEIGHT
    // ----------------------------------------------------

    const armor =
        getSelectedArmorEffects();


    if (
        armor
    ) {

        totalWeight +=
            Number(
                armor.weight
            ) || 0;

    }


    // ----------------------------------------------------
    // EQUIPMENT WEIGHT
    // ----------------------------------------------------

    if (
        typeof KKState !==
            "undefined" &&
        typeof KKEquipmentData !==
            "undefined"
    ) {

        const state =
            KKState.load();


        const items =
            Array.isArray(
                state?.inventory?.items
            )
                ? state.inventory.items
                : [];


        items.forEach(
            function (
                instance
            ) {

                if (
                    !instance ||
                    !instance.itemId
                ) {

                    return;

                }


                const definition =
                    KKEquipmentData[
                        instance.itemId
                    ];


                if (
                    !definition
                ) {

                    return;

                }


                                const reinforcedAssignments =
                    state?.builder
                        ?.modifications
                        ?.reinforced;


                const isReinforced =
                    Array.isArray(
                        reinforcedAssignments
                    ) &&
                    reinforcedAssignments
                        .map(
                            String
                        )
                        .includes(
                            String(
                                instance.id
                            )
                        );


                totalWeight +=
                    (
                        Number(
                            definition.weight
                        ) || 0
                    ) +
                    (
                        isReinforced
                            ? 1
                            : 0
                    );

            }
        );

    }


    // ----------------------------------------------------
    // FINAL DISPLAY
    // ----------------------------------------------------

    character.Weight =
        totalWeight;


    weightField.value =
        totalWeight;

}


    // ========================================================
    // UPDATE MOVEMENT
    // ========================================================

    function updateMovement() {

        if (
            character.WeightBase === ""
        ) {

            character.Movement = "";

            movementField.value = "";

            return;

        }


        const weight =
            Number(
                weightField.value
            );


        if (
            !Number.isFinite(
                weight
            )
        ) {

            character.Movement = "";

            movementField.value = "";

            return;

        }


        const skills =
            getBuilderSkills();


        const unarmored =
            getSkillRank(
                skills,
                "unarmored"
            );


        const legInjuryCount =
            countInjury(
                "leg-injury"
            );


        const legWoundCount =
            countInjury(
                "leg-wound"
            );


        // ----------------------------------------------------
        // BASE MOVEMENT
        // ----------------------------------------------------

        let movement =
            40 -
            weight;


        // ----------------------------------------------------
        // UNARMORED
        // ----------------------------------------------------

        if (
            unarmored > 0
        ) {

            movement +=
                5;

        }


        // ----------------------------------------------------
        // LEG INJURIES
        // ----------------------------------------------------

        movement -=
            legInjuryCount;


        // ----------------------------------------------------
        // LEG WOUNDS
        //
        // Each wound halves Movement sequentially.
        // ----------------------------------------------------

        for (
            let i = 0;
            i < legWoundCount;
            i++
        ) {

            movement =
                movement /
                2;

        }


        // ----------------------------------------------------
        // MOVEMENT CANNOT DROP BELOW ZERO
        // ----------------------------------------------------

        movement =
            Math.max(
                0,
                movement
            );


        // ----------------------------------------------------
        // REMOVE UNNECESSARY DECIMAL
        // ----------------------------------------------------

        if (
            Number.isInteger(
                movement
            )
        ) {

            character.Movement =
                movement;

        }

        else {

            character.Movement =
                Number(
                    movement.toFixed(
                        2
                    )
                );

        }


        movementField.value =
            character.Movement;

    }


    // ========================================================
    // UPDATE EQUIPMENT FATIGUE
    // ========================================================
    //
    // Automatic Fatigue =
    //
    //     Armor Fatigue
    //     +
    //     Weight of ALL owned shields
    //
    // The main Fatigue field remains independent and
    // manually editable.
    // ========================================================

    function updateEquipmentFatigue() {

        if (
            !fatigueModifierField ||
            typeof KKState === "undefined"
        ) {

            return;

        }


        const state =
            KKState.load();


        // ----------------------------------------------------
        // ARMOR FATIGUE
        // ----------------------------------------------------

        const armorFatigue = {

            light: 1,
            medium: 2,
            heavy: 3

        };


        const armorId =
            String(
                state?.builder?.armor ||
                ""
            )
            .trim()
            .toLowerCase();


        let total =
            Number(
                armorFatigue[
                    armorId
                ]
            ) || 0;


        const cushionedAssignments =
            state.builder.modifications &&
            Array.isArray(
                state.builder
                    .modifications
                    .cushioned
            )
                ? state.builder
                    .modifications
                    .cushioned
                : [];


        const armorIsCushioned =
            Boolean(
                armorId
            ) &&
            cushionedAssignments.includes(
                "armor:" +
                armorId
            );


        if (
            armorIsCushioned
        ) {

            total +=
                1;

        }


        // ----------------------------------------------------
        // OWNED SHIELD WEIGHT
        // ----------------------------------------------------

        const items =
            Array.isArray(
                state?.inventory?.items
            )
                ? state.inventory.items
                : [];


        items.forEach(
            function (
                instance
            ) {

                if (
                    !instance ||
                    instance.shield !== true
                ) {

                    return;

                }


                const definition =
                    (
                        typeof KKEquipmentData !==
                            "undefined"
                    )
                        ? KKEquipmentData[
                            instance.itemId
                        ]
                        : null;


                if (
                    !definition
                ) {

                    return;

                }


                                const reinforcedAssignments =
                    state?.builder
                        ?.modifications
                        ?.reinforced;


                const isReinforced =
                    Array.isArray(
                        reinforcedAssignments
                    ) &&
                    reinforcedAssignments
                        .map(
                            String
                        )
                        .includes(
                            String(
                                instance.id
                            )
                        );


                total +=
                    (
                        Number(
                            definition.weight
                        ) || 0
                    ) +
                    (
                        isReinforced
                            ? 1
                            : 0
                    );

            }
        );


        // ----------------------------------------------------
        // DISPLAY
        // ----------------------------------------------------

        fatigueModifierField.value =
            total > 0
                ? total
                : "";


                        fatigueModifierField.classList.remove(
            "modified-value"
        );


        fatigueModifierField.style.color =
            "";


        if (
            armorIsCushioned
        ) {

            fatigueModifierField.classList.add(
                "modified-value"
            );


            fatigueModifierField.style.color =
                "#9eff97";

        }

    }


    // ========================================================
    // UPDATE WEIGHT E INDICATOR
    // ========================================================

    function updateWeightIndicator() {

        if (
            character.WeightBase === ""
        ) {

            weightEIndicatorField.value =
                "";

            return;

        }


        const weight =
            Number(
                weightField.value
            );


        const weightBase =
            Number(
                character.WeightBase
            );


        if (
            !Number.isFinite(
                weight
            ) ||
            !Number.isFinite(
                weightBase
            )
        ) {

            weightEIndicatorField.value =
                "";

            return;

        }


        if (
            weight >
            (
                weightBase *
                2
            )
        ) {

            weightEIndicatorField.value =
                "E";

        }

        else {

            weightEIndicatorField.value =
                "";

        }

    }


    // ========================================================
    // PUBLISH DERIVED MAIN-SHEET STATS
    // ========================================================
    //
    // These values are shared with the Gear Sheet.
    //
    // might:
    //     Final Might AFTER skills and injuries.
    //
    // baseReach:
    //     Character Reach supplied by Height.
    //
    // We compare against the currently stored values before
    // saving. This avoids unnecessary shared-state events.
    //
    // publishingDerivedStats prevents this page from reacting
    // to its own save event.
    // ========================================================

    function publishDerivedStats() {

        if (
            typeof KKState ===
                "undefined"
        ) {

            return;

        }


        if (
            publishingDerivedStats
        ) {

            return;

        }


        const state =
            KKState.load();


        if (
            !state.derived ||
            typeof state.derived !==
                "object"
        ) {

            state.derived = {

                might:
                    0,

                baseReach:
                    0

            };

        }


        // ----------------------------------------------------
        // FINAL MIGHT
        // ----------------------------------------------------

        let finalMight =
            Number(
                mightField.value
            );


        if (
            !Number.isFinite(
                finalMight
            )
        ) {

            finalMight =
                0;

        }


        // ----------------------------------------------------
        // BASE REACH
        // ----------------------------------------------------

        let baseReach =
            Number(
                reachField.value
            );


        if (
            !Number.isFinite(
                baseReach
            )
        ) {

            baseReach =
                0;

        }


        // ----------------------------------------------------
        // BASE PADDING
        //
        // Final Main Sheet Padding from Physique + skills,
        // BEFORE armor is added.
        // ----------------------------------------------------

        let basePadding =
            Number(
                paddingField.value
            );


        if (
            !Number.isFinite(
                basePadding
            )
        ) {

            basePadding =
                0;

        }


        // ----------------------------------------------------
// ARM INJURIES
// ----------------------------------------------------

const leftArmInjuries =
    countInjury(
        "left-arm-injury"
    );


const rightArmInjuries =
    countInjury(
        "right-arm-injury"
    );

    const leftArmWounds =
    countInjury(
        "left-arm-wound"
    );


const rightArmWounds =
    countInjury(
        "right-arm-wound"
    );


        // ----------------------------------------------------
        // DO NOTHING IF NOTHING CHANGED
        // ----------------------------------------------------

        const currentMight =
            Number(
                state
                    .derived
                    .might
            );


        const currentBaseReach =
            Number(
                state
                    .derived
                    .baseReach
            );


        const currentBasePadding =
            Number(
                state
                    .derived
                    .basePadding
            );


const currentLeftArmInjuries =
    Number(
        state
            .derived
            .leftArmInjuries
    ) || 0;


const currentRightArmInjuries =
    Number(
        state
            .derived
            .rightArmInjuries
    ) || 0;


const currentLeftArmWounds =
    Number(
        state
            .derived
            .leftArmWounds
    ) || 0;


const currentRightArmWounds =
    Number(
        state
            .derived
            .rightArmWounds
    ) || 0;


// ----------------------------------------------------
// DO NOTHING IF NOTHING CHANGED
// ----------------------------------------------------

if (
    currentMight ===
        finalMight &&
    currentBaseReach ===
        baseReach &&
    currentBasePadding ===
        basePadding &&
    currentLeftArmInjuries ===
        leftArmInjuries &&
    currentRightArmInjuries ===
        rightArmInjuries &&
    currentLeftArmWounds ===
        leftArmWounds &&
    currentRightArmWounds ===
        rightArmWounds
) {

    return;

}


        // ----------------------------------------------------
        // SAVE
        // ----------------------------------------------------

        state
            .derived
            .might =
                finalMight;


        state
            .derived
            .baseReach =
                baseReach;


        state
            .derived
            .basePadding =
                basePadding;


                state
    .derived
    .leftArmInjuries =
        leftArmInjuries;


state
    .derived
    .rightArmInjuries =
        rightArmInjuries;


        state
    .derived
    .leftArmWounds =
        leftArmWounds;


state
    .derived
    .rightArmWounds =
        rightArmWounds;


        publishingDerivedStats =
            true;


        try {

            KKState.save(
                state
            );

        }

        finally {

            publishingDerivedStats =
                false;

        }

    }


    // ========================================================
    // UPDATE ALL STATS
    // ========================================================

    function updateAllStats() {

        // ----------------------------------------------------
        // 1. PHYSIQUE + SKILLS
        // ----------------------------------------------------

        updateSkillStats();


        // ----------------------------------------------------
        // 2. INJURIES
        //
        // This must happen before publishing derived Might.
        // ----------------------------------------------------

        applyInjuryModifiers();


        // ----------------------------------------------------
        // 3. OTHER CALCULATED VALUES
        // ----------------------------------------------------

        updateTotalWeight();

        updateEquipmentFatigue();

        updateMovement();

        updateWeightIndicator();

        updatePriorityPenalty();

        updateSkillAffectedColors();

        updateInjuryAffectedColors();


        // ----------------------------------------------------
        // 4. SHARE FINAL MAIN-SHEET VALUES
        // ----------------------------------------------------

        publishDerivedStats();

        publishHeadTraumaState();

        renderHeadTraumaTint();

    }


    // ========================================================
    // BUILDER SKILLS -> MAIN SHEET TEXT
    // ========================================================

    function getBuilderSkillLines(
        state
    ) {

        const skills =
            state &&
            state.builder &&
            state.builder.skills
                ? state.builder.skills
                : {};


        const lines =
            [];


        Object.entries(
            builderSkillNames
        ).forEach(
            function (
                [key, name]
            ) {

                const value =
                    skills[key];


                if (
                    rankedBuilderSkills.has(
                        key
                    )
                ) {

                    const rank =
                        Number(
                            value
                        ) || 0;


                    if (
                        rank <= 0
                    ) {

                        return;

                    }


                    if (
                        rank === 1
                    ) {

                        lines.push(
                            name
                        );

                    }

                    else {

                        lines.push(
                            name +
                            " " +
                            rank
                        );

                    }


                    return;

                }


                if (
                    value === true ||
                    Number(
                        value
                    ) > 0
                ) {

                    lines.push(
                        name
                    );

                }

            }
        );


        return lines;

    }


    // ========================================================
    // IS BUILDER-MANAGED SKILL LINE
    // ========================================================

    function isBuilderManagedSkillLine(
        line
    ) {

        const trimmed =
            line.trim();


        if (
            !trimmed
        ) {

            return false;

        }


        return Object.values(
            builderSkillNames
        ).some(
            function (
                name
            ) {

                const escaped =
                    name.replace(
                        /[.*+?^${}()|[\]\\]/g,
                        "\\$&"
                    );


                return new RegExp(
                    "^" +
                    escaped +
                    "(?:\\s+\\d+)?$"
                ).test(
                    trimmed
                );

            }
        );

    }


    // ========================================================
    // SYNC BUILDER SKILLS INTO MAIN SHEET
    // ========================================================

    function syncBuilderSkills() {

        if (
            !skillField ||
            typeof KKState ===
                "undefined"
        ) {

            return;

        }


        const state =
            KKState.load();


        const builderLines =
            getBuilderSkillLines(
                state
            );


               // ====================================================
        // DISPLAY-ONLY SKILLS AND MODIFICATIONS
        // ====================================================

        if (
            !(skillField instanceof HTMLTextAreaElement)
        ) {

            const descriptions =
                window.KKSkillDescriptions ||
                {};

                function attachSkillReminder(
                    entry,
                    key,
                    name
                ) {

                    const description =
                        descriptions[
                            key
                        ];


                    if (
                        !description
                    ) {

                        return;

                    }


                    entry.dataset.reminderTrigger =
                        "true";


                    entry.tabIndex =
                        0;


                    function openReminder(
                        event
                    ) {

                        event.stopPropagation();


                        if (
                            window.KKReminders
                        ) {

                            window.KKReminders.show(
                                name,
                                description
                            );

                        }

                    }


                    entry.addEventListener(
                        "click",
                        openReminder
                    );


                    entry.addEventListener(
                        "keydown",
                        function (
                            event
                        ) {

                            if (
                                event.key === "Enter" ||
                                event.key === " "
                            ) {

                                event.preventDefault();

                                openReminder(
                                    event
                                );

                            }

                        }
                    );

                }

            const modificationNames = {

                "center-grip":
                    "CENTER GRIP",

                cushioned:
                    "CUSHIONED",

                flanged:
                    "FLANGED",

                "gigue-strap":
                    "GIGUE STRAP",

                reinforced:
                    "REINFORCED",

                spiked:
                    "SPIKED",

                "top-spike":
                    "TOP SPIKE"

            };


            const modifications =
                state.builder.modifications ||
                {};


            skillField.innerHTML =
                "";


            Object.entries(
                builderSkillNames
            ).forEach(
                function (
                    [key, name]
                ) {

                    const value =
                        state.builder.skills[key];


                    const rank =
                        Number(value) || 0;


                    const selected =
                        rankedBuilderSkills.has(key)
                            ? rank > 0
                            : value === true ||
                              rank > 0;


                    if (!selected) {

                        return;

                    }


                    const entry =
                        document.createElement(
                            "span"
                        );


                    entry.className =
                        "skill-entry";


                    entry.dataset.skillKey =
                        key;


                    entry.textContent =
                        rankedBuilderSkills.has(key) &&
                        rank > 1
                            ? name + " " + rank
                            : name;


                    attachSkillReminder(
                        entry,
                        key,
                        name
                    );


                    skillField.appendChild(
                        entry
                    );

                }
            );


            Object.entries(
                modificationNames
            ).forEach(
                function (
                    [key, name]
                ) {

                    const assignments =
                        modifications[key];


                    if (
                        !Array.isArray(assignments) ||
                        assignments.length === 0
                    ) {

                        return;

                    }


                    const entry =
                        document.createElement(
                            "span"
                        );


                    entry.className =
                        "skill-entry";


                    entry.dataset.skillKey =
                        key;


                    entry.textContent =
                        name;


                    attachSkillReminder(
                        entry,
                        key,
                        name
                    );


                    skillField.appendChild(
                        entry
                    );

                }
            );


            return;

        }


        const existingLines =
            skillField
                .value
                .split(/\r?\n/);


        const preservedLines =
            existingLines.filter(
                function (
                    line
                ) {

                    return (
                        !isBuilderManagedSkillLine(
                            line
                        )
                    );

                }
            );


        while (
            preservedLines.length >
            0 &&
            preservedLines[0]
                .trim() ===
                ""
        ) {

            preservedLines.shift();

        }


        while (
            preservedLines.length >
            0 &&
            preservedLines[
                preservedLines.length -
                1
            ].trim() ===
                ""
        ) {

            preservedLines.pop();

        }


        const finalLines =
            [];


        if (
            builderLines.length >
            0
        ) {

            finalLines.push(
                ...builderLines
            );

        }


        if (
            builderLines.length >
            0 &&
            preservedLines.length >
            0
        ) {

            finalLines.push(
                ""
            );

        }


        finalLines.push(
            ...preservedLines
        );


        const nextValue =
            finalLines.join(
                "\n"
            );


        if (
            skillField.value !==
            nextValue
        ) {

            skillField.value =
                nextValue;

        }

    }


    // ========================================================
    // INJURY TOKEN DISPLAY NAME
    // ========================================================

    function getInjuryDisplayName(
        type
    ) {

        const names = {

            "bleeding":
                "Bleeding",

            "bruise":
                "Bruise",

            "head-injury":
                "Head Injury",

            "head-wound":
                "Head Wound",

            "left-arm-injury":
                "Left Arm Injury",

            "left-arm-wound":
                "Left Arm Wound",

            "leg-injury":
                "Leg Injury",

            "leg-wound":
                "Leg Wound",

            "right-arm-injury":
                "Right Arm Injury",

            "right-arm-wound":
                "Right Arm Wound",

            "torso-injury":
                "Torso Injury",

            "torso-wound":
                "Torso Wound"

        };


        return (
            names[type] ||
            type
        );

    }


    // ========================================================
    // CREATE INJURY ID
    // ========================================================

    function createInjuryId() {

        return (
            "injury-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2)
        );

    }


        // ========================================================
    // RENDER INJURY TOKENS
    // ========================================================
    //
    // REGULAR INJURIES:
    //
    // Have one counter which cycles:
    //
    //     1 -> 2 -> 3 -> 1 -> 2 -> 3...
    //
    // Clicking the counter does NOT remove the Injury.
    //
    // Clicking anywhere else on the token removes it.
    //
    //
    // WOUNDS / BRUISE / BLEEDING:
    //
    // Have no counter.
    // Clicking the token removes them.
    // ========================================================

    function renderInjuryTokens() {

        if (
            !injuryTokens
        ) {

            return;

        }


        injuryTokens.innerHTML =
            "";


        injuries.forEach(
            function (
                injury
            ) {

                const token =
                    document.createElement(
                        "div"
                    );


                token.className =
                    "injury-token";


                token.dataset.injuryId =
                    injury.id;


                // ------------------------------------------------
                // IMAGE
                // ------------------------------------------------

                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    injuryImages[
                        injury.type
                    ] || "";


                image.alt =
                    getInjuryDisplayName(
                        injury.type
                    );


                image.draggable =
                    false;


                token.appendChild(
                    image
                );


                // ------------------------------------------------
                // SINGLE TURN COUNTER
                // ------------------------------------------------

                if (
                    trackedInjuries.has(
                        injury.type
                    )
                ) {

                    let turn =
                        Number(
                            injury.turn
                        );


                    if (
                        !Number.isFinite(
                            turn
                        ) ||
                        turn < 1 ||
                        turn > 3
                    ) {

                        turn = 1;

                        injury.turn = 1;

                    }


                    const tracker =
                        document.createElement(
                            "button"
                        );


                    tracker.type =
                        "button";


                    tracker.className =
                        "injury-tracker";


                    tracker.textContent =
                        String(
                            turn
                        );


                    tracker.setAttribute(
                        "aria-label",
                        "Injury turn " +
                        turn +
                        ". Click to advance."
                    );


                    tracker.addEventListener(
                        "click",
                        function (
                            event
                        ) {

                            // ------------------------------------
                            // DO NOT LET THIS CLICK REMOVE TOKEN
                            // ------------------------------------

                            event.stopPropagation();


                            // ------------------------------------
                            // 1 -> 2 -> 3 -> 1
                            // ------------------------------------

                            injury.turn =
                                Number(
                                    injury.turn
                                ) >= 3
                                    ? 1
                                    : Number(
                                        injury.turn
                                    ) + 1;

                            saveInjuriesToState();

                            renderInjuryTokens();

                        }
                    );


                    token.appendChild(
                        tracker
                    );

                }


                // ------------------------------------------------
                // CLICK TOKEN TO REMOVE
                // ------------------------------------------------

                token.addEventListener(
                    "click",
                    function () {

                        removeInjury(
                            injury.id
                        );

                    }
                );


                injuryTokens.appendChild(
                    token
                );

            }
        );

    }


    // ========================================================
    // ADD INJURY
    // ========================================================

    function addInjury(
        type
    ) {

        if (
            !type
        ) {

            return;

        }


        const injury = {

            id:
                createInjuryId(),

            type:
                type

        };


        // ----------------------------------------------------
        // TRACKED INJURIES START ON TURN 1
        // ----------------------------------------------------

        if (
            trackedInjuries.has(
                type
            )
        ) {

            injury.turn =
                1;

        }


        injuries.push(
    injury
);


// A newly added Head Injury always restores its tint.

if (
    type ===
    "head-injury"
) {

    setHeadTintDismissed(
        false
    );

}

saveInjuriesToState();

renderInjuryTokens();

updateAllStats();

    }


    // ========================================================
    // REMOVE INJURY
    // ========================================================

    function removeInjury(
        injuryId
    ) {

        injuries =
            injuries.filter(
                function (
                    injury
                ) {

                    return (
                        injury.id !==
                        injuryId
                    );

                }
            );

        saveInjuriesToState();

        renderInjuryTokens();

        updateAllStats();

    }


    // ========================================================
    // MANUAL SKILLS EDIT
    // ========================================================

    function handleSkillFieldChange() {

        syncBuilderFromSkillText();

        syncBuilderSkills();

        updateAllStats();

    }


    // ========================================================
    // INJURY SELECT EVENT
    // ========================================================

    if (
        injurySelect
    ) {

        injurySelect.addEventListener(
            "change",
            function () {

                const type =
                    injurySelect.value;


                if (
                    type
                ) {

                    addInjury(
                        type
                    );

                }


                injurySelect.value =
                    "";

            }
        );

    }


    // ========================================================
    // SKILLS EVENTS
    // ========================================================

    if (
        skillField
    ) {

        skillField.addEventListener(
            "change",
            handleSkillFieldChange
        );


        skillField.addEventListener(
            "blur",
            function () {

                handleSkillFieldChange();

            }
        );

    }


    // ========================================================
    // PREVENT PHYSIQUE / HEIGHT DIRECT EDITING
    // ========================================================
    //
    // The Builder is now the authority for these values.
    // ========================================================

    physiqueField.disabled =
        true;


    heightField.disabled =
        true;


    // ========================================================
    // REFRESH FROM SHARED BUILDER STATE
    // ========================================================

    function refreshFromSharedState() {

    loadInjuriesFromState();

    renderInjuryTokens();

    syncBuilderPhysiqueAndHeight();

    syncBuilderSkills();

    syncCurrentFatigue();

    updateAllStats();

}


    // ========================================================
    // SAME-PAGE SHARED STATE EVENT
    // ========================================================
    //
    // IMPORTANT:
    //
    // publishDerivedStats() uses KKState.save(), and save()
    // dispatches this event synchronously.
    //
    // When the event came from this Main Sheet publishing its
    // own derived values, ignore it.
    // ========================================================

    window.addEventListener(
        "knights-knaves-state-changed",
        function () {

            if (
                publishingDerivedStats
            ) {

                return;

            }


            refreshFromSharedState();

        }
    );


    // ========================================================
    // OTHER-TAB / OTHER-PAGE STORAGE EVENT
    // ========================================================
    //
    // The storage event does not fire in the same document
    // that performed the localStorage write, so no publisher
    // guard is required here.
    // ========================================================

    window.addEventListener(
        "storage",
        function (
            event
        ) {

            if (
                typeof KKState ===
                    "undefined"
            ) {

                return;

            }


            if (
                event.key ===
                KKState.STORAGE_KEY
            ) {

                refreshFromSharedState();

            }

        }
    );


    // ========================================================
    // RESPONSIVE SCALING
    // ========================================================

    const DESIGN_WIDTH =
        1200;


    const characterSheet =
        document.querySelector(
            ".character-sheet"
        );


    const sheetWrapper =
        document.querySelector(
            ".sheet-wrapper"
        );


    function resizeCharacterSheet() {

        if (
            !characterSheet ||
            !sheetWrapper
        ) {

            return;

        }


        const availableWidth =
            document
                .documentElement
                .clientWidth;


                const scale =
            availableWidth /
            DESIGN_WIDTH;


        characterSheet.style.transform =
            `scale(${scale})`;


        characterSheet.style.transformOrigin =
            "top left";


        sheetWrapper.style.width =
            (
                DESIGN_WIDTH *
                scale
            ) +
            "px";


        /*
           Use the actual unscaled artwork height so the
           wrapper does not leave a large blank region beneath
           the sheet when scaled down.
        */

        const designHeight =
            characterSheet.offsetHeight;


        sheetWrapper.style.height =
            (
                designHeight *
                scale
            ) +
            "px";

    }


// ========================================================
// FATIGUE EQUIPMENT MODIFIER CLICK
// ========================================================

if (
    fatigueModifierField
) {

    fatigueModifierField.addEventListener(
        "click",
        function () {

            const amount =
                Number(
                    fatigueModifierField.value
                );


            if (
                Number.isFinite(
                    amount
                ) &&
                amount > 0
            ) {

                changeFatigue(
                    amount
                );

            }

        }
    );

}


// ========================================================
// ENDURANCE
// ========================================================
//
// Clicking Endurance:
//
// 1. Dismisses the tint caused by Head Injuries.
// 2. Does not dismiss the tint caused by Head Wounds.
// 3. Continues to recover Fatigue normally.
//
// If both are present, the Injury component is dismissed,
// but the Head Wound keeps the red tint visible.
// ========================================================

if (
    enduranceField
) {

    enduranceField.addEventListener(
        "click",
        function () {

            // --------------------------------------------
            // DISMISS HEAD-INJURY TINT
            // --------------------------------------------

            if (
                countInjury(
                    "head-injury"
                ) > 0
            ) {

                setHeadTintDismissed(
                    true
                );


                renderHeadTraumaTint();

            }


            // --------------------------------------------
            // RECOVER FATIGUE
            // --------------------------------------------

            const endurance =
                Number(
                    enduranceField.value
                );


            if (
                Number.isFinite(
                    endurance
                ) &&
                endurance > 0
            ) {

                changeFatigue(
                    -endurance
                );

            }

        }
    );

}


// ========================================================
// FATIGUE CONTROLS
// ========================================================

if (
    fatigueMinusButton
) {

    fatigueMinusButton.addEventListener(
        "click",
        function () {

            changeFatigue(
                -1
            );

        }
    );

}


if (
    fatiguePlusButton
) {

    fatiguePlusButton.addEventListener(
        "click",
        function () {

            changeFatigue(
                1
            );

        }
    );

}

    if (nameField) {

    nameField.addEventListener(
        "input",
        saveCharacterName
    );

}

    window.addEventListener(
        "resize",
        resizeCharacterSheet
    );


    window.addEventListener(
        "orientationchange",
        resizeCharacterSheet
    );


    // ========================================================
    // INITIALIZE
    // ========================================================

    loadCharacterName();

    syncBuilderPhysiqueAndHeight();

    syncBuilderSkills();

    loadInjuriesFromState();

    renderInjuryTokens();

    syncCurrentFatigue();

    updateAllStats();

    resizeCharacterSheet();


    console.log(
        "Main Character Sheet initialized."
    );

});
