// ============================================================
// KNIGHTS & KNAVES
// BUILDER PAGE 2 - SKILLS
// ============================================================

console.log(
    "builder-skills.js is working!"
);


document.addEventListener(
    "DOMContentLoaded",
    function () {

        "use strict";


        // ====================================================
        // ELEMENTS
        // ====================================================

        const sheetWrapper =
            document.querySelector(
                ".sheet-wrapper"
            );


        const builderSheet =
            document.getElementById(
                "builderSheet"
            );


        const toggleChoices =
            Array.from(
                document.querySelectorAll(
                    ".toggle-choice"
                )
            );


        const rankedChoices =
            Array.from(
                document.querySelectorAll(
                    ".ranked-choice"
                )
            );


        const modificationRules =
            window.KKModificationData || {

                "center-grip": {
                    target: "nonBucklerShield"
                },

                cushioned: {
                    target: "armor",
                    once: true
                },

                flanged: {
                    target: "mace"
                },

                "gigue-strap": {
                    target: "nonBucklerShield"
                },

                reinforced: {
                    target: "weaponOrShield"
                },

                spiked: {
                    target: "flail"
                },

                "top-spike": {
                    target: "warhammer"
                }

            };


        let openModificationMenu =
            null;


        const pointsCounter =
            document.getElementById(
                "pointsCounter"
            );


        // ====================================================
        // CONSTANTS
        // ====================================================

        const DESIGN_WIDTH =
            2048;


        const DESIGN_HEIGHT =
            1325;


        // ====================================================
        // PHYSIQUE ATTRIBUTE DATA
        // ====================================================

        const physiqueAttributeData = {

            Massive: {
                Might: 4,
                Padding: 3,
                Fortitude: 3,
                Endurance: 5,
                Mobility: 0,
                Stealth: -1
            },

            Huge: {
                Might: 3,
                Padding: 3,
                Fortitude: 3,
                Endurance: 6,
                Mobility: 0,
                Stealth: 0
            },

            Bulky: {
                Might: 3,
                Padding: 2,
                Fortitude: 2,
                Endurance: 6,
                Mobility: 1,
                Stealth: 1
            },

            Muscular: {
                Might: 2,
                Padding: 2,
                Fortitude: 2,
                Endurance: 7,
                Mobility: 1,
                Stealth: 2
            },

            Athletic: {
                Might: 2,
                Padding: 1,
                Fortitude: 2,
                Endurance: 7,
                Mobility: 2,
                Stealth: 2
            },

            Average: {
                Might: 1,
                Padding: 1,
                Fortitude: 2,
                Endurance: 8,
                Mobility: 2,
                Stealth: 2
            },

            Toned: {
                Might: 1,
                Padding: 0,
                Fortitude: 2,
                Endurance: 8,
                Mobility: 3,
                Stealth: 2
            },

            Lean: {
                Might: 0,
                Padding: 0,
                Fortitude: 2,
                Endurance: 8,
                Mobility: 3,
                Stealth: 3
            },

            Slender: {
                Might: 0,
                Padding: 0,
                Fortitude: 2,
                Endurance: 8,
                Mobility: 4,
                Stealth: 3
            },

            Small: {
                Might: 0,
                Padding: 0,
                Fortitude: 1,
                Endurance: 9,
                Mobility: 4,
                Stealth: 4
            },

            Meek: {
                Might: -1,
                Padding: 0,
                Fortitude: 1,
                Endurance: 10,
                Mobility: 5,
                Stealth: 5
            }

        };


        // ====================================================
        // SINGLE-PURCHASE ATTRIBUTE SKILLS
        // ====================================================

        const cappedToggleSkills = {

            flexible: {
                stat: "Mobility",
                increase: 1,
                cap: 5
            },

            resilient: {
                stat: "Fortitude",
                increase: 1,
                cap: 3
            },

            strong: {
                stat: "Might",
                increase: 1,
                cap: 3
            },

            tough: {
                stat: "Padding",
                increase: 1,
                cap: 3
            }

        };


        // ====================================================
        // RANKED ATTRIBUTE SKILLS
        // ====================================================

        const cappedRankedSkills = {

            sneaky: {
                stat: "Stealth",
                cap: 5
            },

            tireless: {
                stat: "Endurance",
                cap: 10
            }

        };


        // ====================================================
        // LOCAL STATE
        // ====================================================

        let state =
            KKState.load();


        // ====================================================
        // RESPONSIVE SCALING
        // ====================================================

        function resizeBuilderSheet() {

            if (
                !sheetWrapper ||
                !builderSheet
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


            builderSheet.style.transform =
                `scale(${scale})`;


            builderSheet.style.transformOrigin =
                "top left";


            sheetWrapper.style.width =
                (
                    DESIGN_WIDTH *
                    scale
                ) + "px";


            sheetWrapper.style.height =
                (
                    DESIGN_HEIGHT *
                    scale
                ) + "px";

        }


        // ====================================================
        // CLONE STATE
        // ====================================================

        function cloneState() {

            return JSON.parse(
                JSON.stringify(
                    state
                )
            );

        }


        // ====================================================
        // GET STORAGE AREA
        // ====================================================

        function getChoiceStore(
            candidateState,
            type
        ) {

            if (
                type ===
                "modification"
            ) {

                return candidateState
                    .builder
                    .modifications;

            }


            return candidateState
                .builder
                .skills;

        }


        // ====================================================
        // MODIFICATION TARGETS
        // ====================================================

        function getModificationAssignments(
            candidateState,
            key
        ) {

            const value =
                candidateState
                    .builder
                    .modifications[
                        key
                    ];


            if (
                Array.isArray(
                    value
                )
            ) {

                return value.map(
                    String
                );

            }


            return [];

        }


            function itemMatchesModification(
            item,
            key,
            candidateState
        ) {

            const definition =
                (
                    window.KKEquipmentData ||
                    {}
                )[
                    item.itemId
                ] ||
                {};

            const conflictingKey =
                key === "center-grip"
                    ? "gigue-strap"
                    : key === "gigue-strap"
                        ? "center-grip"
                        : null;


            if (
                conflictingKey &&
                candidateState &&
                getModificationAssignments(
                    candidateState,
                    conflictingKey
                ).includes(
                    String(
                        item.id
                    )
                )
            ) {

                return false;

            }


            switch (
                (
                    modificationRules[
                        key
                    ] ||
                    {}
                ).target
            ) {

                case "nonBucklerShield":

                    return (
                        (
                            definition.shield ===
                                true ||
                            item.shield ===
                                true
                        ) &&
                        item.itemId !==
                            "buckler"
                    );


                case "mace":

                    return (
                        item.itemId ===
                        "mace"
                    );


                    case "weaponOrShield":

                    return Boolean(
                        item.itemId &&
                        item.itemId !==
                            "buckler"
                    );


                case "flail":

                    return (
                        String(
                            definition.type ||
                            ""
                        ).toLowerCase() ===
                            "flail" ||
                        [
                            "flail",
                            "chain-flail",
                            "war-flail"
                        ].includes(
                            item.itemId
                        )
                    );


                case "warhammer":

                    return (
                        item.itemId ===
                        "warhammer"
                    );


                default:

                    return false;

            }

        }


        function getModificationTargets(
            candidateState,
            key
        ) {

            const rule =
                modificationRules[
                    key
                ];


            if (
                !rule
            ) {

                return [];

            }


            if (
                rule.target ===
                "armor"
            ) {

                return candidateState
                    .builder
                    .armor
                        ? [
                            {
                                id:
                                    "armor:" +
                                    candidateState
                                        .builder
                                        .armor,

                                name:
                                    String(
                                        candidateState
                                            .builder
                                            .armor
                                    ).replace(
                                        /^./,
                                        function (
                                            letter
                                        ) {

                                            return letter
                                                .toUpperCase();

                                        }
                                    ) +
                                    " Armor"
                            }
                        ]
                        : [];

            }


            const items =
                candidateState.inventory &&
                Array.isArray(
                    candidateState
                        .inventory
                        .items
                )
                    ? candidateState
                        .inventory
                        .items
                    : [];


            const duplicateTotals =
                {};


            const duplicateNumbers =
                {};


            items.forEach(
                function (
                    item
                ) {

                    if (
                            itemMatchesModification(
                            item,
                            key,
                            candidateState
                        )
                    ) {

                        duplicateTotals[
                            item.itemId
                        ] =
                            (
                                duplicateTotals[
                                    item.itemId
                                ] ||
                                0
                            ) +
                            1;

                    }

                }
            );


            return items
                .filter(
                    function (
                        item
                    ) {

                        return itemMatchesModification(
                            item,
                            key,
                            candidateState
                        );

                    }
                )
                .map(
                    function (
                        item
                    ) {

                        duplicateNumbers[
                            item.itemId
                        ] =
                            (
                                duplicateNumbers[
                                    item.itemId
                                ] ||
                                0
                            ) +
                            1;


                        return {

                            id:
                                String(
                                    item.id
                                ),

                            name:
                                String(
                                    item.name ||
                                    item.itemId
                                ) +
                                (
                                    duplicateTotals[
                                        item.itemId
                                    ] > 1
                                        ? " " +
                                            duplicateNumbers[
                                                item.itemId
                                            ]
                                        : ""
                                )

                        };

                    }
                );

        }


        function reconcileModifications(
    candidateState
) {

    let changed =
        false;


    Object.keys(
        modificationRules
    ).forEach(
        function (
            key
        ) {

            const legalIds =
                new Set(
                    getModificationTargets(
                        candidateState,
                        key
                    )
                    .map(
                        function (
                            target
                        ) {

                            return target.id;

                        }
                    )
                );


            const previous =
                getModificationAssignments(
                    candidateState,
                    key
                );


            const assignments =
                previous.filter(
                    function (
                        id
                    ) {

                        return legalIds.has(
                            id
                        );

                    }
                );


            if (
                previous.length !==
                    assignments.length ||

                previous.some(
                    function (
                        id,
                        index
                    ) {

                        return (
                            id !==
                            assignments[index]
                        );

                    }
                )
            ) {

                changed =
                    true;

            }


            if (
                assignments.length >
                0
            ) {

                candidateState
                    .builder
                    .modifications[
                        key
                    ] =
                        assignments;

            }

            else {

                delete candidateState
                    .builder
                    .modifications[
                        key
                    ];

            }

        }
    );


    return changed;

}


        // ====================================================
        // GET RANK COST TABLE
        // ====================================================

        function getRankCosts(
            button
        ) {

            return button
                .dataset
                .rankCosts
                .split(",")
                .map(
                    function (
                        value
                    ) {

                        return Number(
                            value
                        );

                    }
                );

        }


        // ====================================================
        // GET NORMAL MAXIMUM RANK
        // ====================================================

        function getMaximumRank(
            button
        ) {

            return (
                getRankCosts(
                    button
                ).length -
                1
            );

        }


        // ====================================================
        // GET SELECTED PHYSIQUE DATA
        // ====================================================

        function getSelectedPhysiqueData(
            candidateState = state
        ) {

            const physique =
                candidateState &&
                candidateState.builder
                    ? candidateState
                        .builder
                        .physique
                    : null;


            if (
                !physique
            ) {

                return null;

            }


            return (
                physiqueAttributeData[
                    physique
                ] ||
                null
            );

        }


        // ====================================================
        // GET LEGAL MAXIMUM RANK
        // ====================================================
        //
        // SNEAKY cannot raise Stealth above 5.
        //
        // TIRELESS cannot raise Endurance above 10.
        //
        // Other ranked skills use their normal HTML maximum.
        // ====================================================

        function getLegalMaximumRank(
            button,
            candidateState = state
        ) {

            const normalMaximum =
                getMaximumRank(
                    button
                );


            const key =
                button.dataset.key;


            const rule =
                cappedRankedSkills[
                    key
                ];


            if (
                !rule
            ) {

                return normalMaximum;

            }


            const physiqueData =
                getSelectedPhysiqueData(
                    candidateState
                );


            if (
                !physiqueData
            ) {

                return normalMaximum;

            }


            const baseValue =
                Number(
                    physiqueData[
                        rule.stat
                    ]
                );


            const room =
                Math.max(
                    0,
                    rule.cap -
                        baseValue
                );


            return Math.min(
                normalMaximum,
                room
            );

        }


        // ====================================================
        // CHECK SINGLE-PURCHASE ATTRIBUTE SKILL
        // ====================================================

        function cappedToggleIsLegal(
            key,
            candidateState = state
        ) {

            const rule =
                cappedToggleSkills[
                    key
                ];


            if (
                !rule
            ) {

                return true;

            }


            const physiqueData =
                getSelectedPhysiqueData(
                    candidateState
                );


            // If no Physique has been chosen yet, allow the
            // purchase. It will be reconciled when a Physique
            // is selected later.

            if (
                !physiqueData
            ) {

                return true;

            }


            const baseValue =
                Number(
                    physiqueData[
                        rule.stat
                    ]
                );


            return (
                baseValue +
                    rule.increase <=
                rule.cap
            );

        }


                // ====================================================
        // CALCULATE SKILL / MODIFICATION SPENDING
        // ====================================================

        function calculateSkillSpent(
            candidateState = state
        ) {

            let total =
                0;


            // --------------------------------------------
            // NORMAL TOGGLES
            // --------------------------------------------

            toggleChoices.forEach(
                function (button) {

                    const type =
                        button.dataset.type;


                    const key =
                        button.dataset.key;


                    const cost =
                        Number(
                            button.dataset.cost
                        ) || 0;


                    const store =
                        getChoiceStore(
                            candidateState,
                            type
                        );


                    if (
                        type ===
                        "modification"
                    ) {

                        total +=
                            getModificationAssignments(
                                candidateState,
                                key
                            ).length *
                            cost;

                    }

                    else if (
                        store[
                            key
                        ] === true
                    ) {

                        total +=
                            cost;

                    }

                }
            );


            // --------------------------------------------
            // RANKED SKILLS
            // --------------------------------------------

            rankedChoices.forEach(
                function (button) {

                    const type =
                        button.dataset.type;


                    const key =
                        button.dataset.key;


                    const costs =
                        getRankCosts(
                            button
                        );


                    const store =
                        getChoiceStore(
                            candidateState,
                            type
                        );


                    const rank =
                        Number(
                            store[
                                key
                            ]
                        ) || 0;


                    total +=
                        costs[
                            rank
                        ] || 0;

                }
            );


            return total;

        }


        // ====================================================
        // GET REMAINING POINTS FOR CANDIDATE
        // ====================================================

        function getRemainingPointsFor(
            candidateState
        ) {

            const gearSpent =
                Number(
                    candidateState
                        .builder
                        .spent
                        .gear
                ) || 0;


            const skillSpent =
                calculateSkillSpent(
                    candidateState
                );


            return (
                Number(
                    candidateState
                        .builder
                        .startingPoints
                ) -
                gearSpent -
                skillSpent
            );

        }


        // ====================================================
        // VALIDATE CANDIDATE
        // ====================================================

        function candidateIsLegal(
            candidateState
        ) {

            return (
                getRemainingPointsFor(
                    candidateState
                ) >= 0
            );

        }


        // ====================================================
        // RECONCILE ATTRIBUTE SKILLS
        // ====================================================
        //
        // This is used when Physique changes.
        //
        // Illegal single-purchase skills are removed.
        //
        // SNEAKY / TIRELESS ranks are reduced to whatever
        // maximum the new Physique permits.
        //
        // The removed ranks are automatically refunded because
        // skill spending is recalculated afterward.
        // ====================================================

        function reconcileAttributeSkills(
            candidateState
        ) {

            const physiqueData =
                getSelectedPhysiqueData(
                    candidateState
                );


            if (
                !physiqueData
            ) {

                return false;

            }


            let changed =
                false;


            const skills =
                candidateState
                    .builder
                    .skills;


            // --------------------------------------------
            // SINGLE-PURCHASE SKILLS
            // --------------------------------------------

            Object.keys(
                cappedToggleSkills
            ).forEach(
                function (key) {

                    if (
                        skills[
                            key
                        ] !== true
                    ) {

                        return;

                    }


                    if (
                        !cappedToggleIsLegal(
                            key,
                            candidateState
                        )
                    ) {

                        delete skills[
                            key
                        ];


                        changed =
                            true;

                    }

                }
            );


            // --------------------------------------------
            // RANKED ATTRIBUTE SKILLS
            // --------------------------------------------

            rankedChoices.forEach(
                function (button) {

                    const key =
                        button.dataset.key;


                    if (
                        !cappedRankedSkills[
                            key
                        ]
                    ) {

                        return;

                    }


                    const currentRank =
                        Number(
                            skills[
                                key
                            ]
                        ) || 0;


                    const legalMaximum =
                        getLegalMaximumRank(
                            button,
                            candidateState
                        );


                    if (
                        currentRank >
                        legalMaximum
                    ) {

                        if (
                            legalMaximum >
                            0
                        ) {

                            skills[
                                key
                            ] =
                                legalMaximum;

                        }

                        else {

                            delete skills[
                                key
                            ];

                        }


                        changed =
                            true;

                    }

                }
            );


            return changed;

        }


        // ====================================================
        // SAVE CURRENT STATE
        // ====================================================

        function saveCurrentState() {

            state
                .builder
                .spent
                .skills =
                    calculateSkillSpent(
                        state
                    );


            state =
                KKState.save(
                    state
                );

        }


        // ================================================= ====================================================
        // CHECK WHETHER TOGGLE CHOICE IS AFFORDABLE
        // ====================================================

        function toggleChoiceIsAffordable(
            button
        ) {

            const type =
                button.dataset.type;


            const key =
                button.dataset.key;


            const currentStore =
                getChoiceStore(
                    state,
                    type
                );


            if (
                type ===
                "modification"
            ) {

                const assignments =
                    getModificationAssignments(
                        state,
                        key
                    );


                const availableTarget =
                    getModificationTargets(
                        state,
                        key
                    ).find(
                        function (
                            target
                        ) {

                            return !assignments.includes(
                                target.id
                            );

                        }
                    );


                if (
                    assignments.length >
                    0
                ) {

                    return true;

                }


                if (
                    !availableTarget
                ) {

                    return false;

                }


                const candidate =
                    cloneState();


                candidate
                    .builder
                    .modifications[
                        key
                    ] = [
                        availableTarget.id
                    ];


                return (
                    getRemainingPointsFor(
                        candidate
                    ) >= 0
                );

            }


            // ------------------------------------------------
            // ALREADY SELECTED
            // ------------------------------------------------
            //
            // Keep purchased choices clickable so they can
            // still be removed and refunded.
            // ------------------------------------------------

            if (
                currentStore[
                    key
                ] === true
            ) {

                return true;

            }


            const candidate =
                cloneState();


            const candidateStore =
                getChoiceStore(
                    candidate,
                    type
                );


            candidateStore[
                key
            ] =
                true;


            return (
                getRemainingPointsFor(
                    candidate
                ) >= 0
            );

        }


        // ====================================================
        // CHECK WHETHER RANKED CHOICE IS AFFORDABLE
        // ====================================================

        function rankedChoiceIsAffordable(
            button
        ) {

            const type =
                button.dataset.type;


            const key =
                button.dataset.key;


            const currentStore =
                getChoiceStore(
                    state,
                    type
                );


            const currentRank =
                Number(
                    currentStore[
                        key
                    ]
                ) || 0;


            // ------------------------------------------------
            // ALREADY HAS RANKS
            // ------------------------------------------------
            //
            // Keep ranked skills clickable after purchase.
            //
            // This preserves the existing cycle/reset/refund
            // behavior even when another rank is unaffordable.
            // ------------------------------------------------

            if (
                currentRank >
                0
            ) {

                return true;

            }


            const candidate =
                cloneState();


            const candidateStore =
                getChoiceStore(
                    candidate,
                    type
                );


            candidateStore[
                key
            ] =
                1;


            return (
                getRemainingPointsFor(
                    candidate
                ) >= 0
            );

        }


        // ====================================================
        // RENDER
        // ====================================================

        function render() {

            // --------------------------------------------
            // NORMAL TOGGLES
            // --------------------------------------------

            toggleChoices.forEach(
                function (button) {

                    const type =
                        button.dataset.type;


                    const key =
                        button.dataset.key;


                    const store =
                        getChoiceStore(
                            state,
                            type
                        );


                    button.classList.toggle(
                        "selected",
                        type ===
                            "modification"
                                ? getModificationAssignments(
                                    state,
                                    key
                                ).length > 0
                                : store[
                                    key
                                ] === true
                    );


                    if (
                        type ===
                        "modification"
                    ) {

                        button.dataset.assignmentCount =
                            String(
                                getModificationAssignments(
                                    state,
                                    key
                                ).length
                            );

                    }


                        const affordable =
                        toggleChoiceIsAffordable(
                            button
                        );


                    const conflictsWithArmor =
                        type === "skill" &&
                        key === "unarmored" &&
                        Boolean(
                            state.builder.armor
                        );


                    button.classList.toggle(
                        "unaffordable",
                        !affordable ||
                        conflictsWithArmor
                    );

                }
            );


            // --------------------------------------------
            // RANKED SKILLS
            // --------------------------------------------

            rankedChoices.forEach(
                function (button) {

                    const type =
                        button.dataset.type;


                    const key =
                        button.dataset.key;


                    const store =
                        getChoiceStore(
                            state,
                            type
                        );


                    const rank =
                        Number(
                            store[
                                key
                            ]
                        ) || 0;


                    button.textContent =
                        rank > 0
                            ? rank
                            : "";


                    button.classList.toggle(
                        "has-rank",
                        rank > 0
                    );


                    const affordable =
                        rankedChoiceIsAffordable(
                            button
                        );


                    button.classList.toggle(
                        "unaffordable",
                        !affordable
                    );

                }
            );


            // --------------------------------------------
            // POINT DISPLAY
            // --------------------------------------------

            const remaining =
                KKState.getRemainingPoints(
                    state
                );


            pointsCounter.textContent =
                remaining;

        }


        // ====================================================
        // REJECT FEEDBACK
        // ====================================================

        function showRejected(
            button
        ) {

            button.classList.remove(
                "choice-rejected"
            );


            void button.offsetWidth;


            button.classList.add(
                "choice-rejected"
            );

        }


                // ====================================================
        // MODIFICATION TARGET MENU
        // ====================================================

        function closeModificationTargetMenu() {

            if (
                openModificationMenu
            ) {

                openModificationMenu.remove();

                openModificationMenu =
                    null;

            }

        }


        function commitModificationTarget(
            button,
            targetId,
            remove
        ) {

            const key =
                button.dataset.key;


            const candidate =
                cloneState();


            const assignments =
                getModificationAssignments(
                    candidate,
                    key
                );


            const next =
                remove
                    ? assignments.filter(
                        function (
                            id
                        ) {

                            return (
                                id !==
                                targetId
                            );

                        }
                    )
                    : assignments
                        .concat(
                            targetId
                        )
                        .filter(
                            function (
                                id,
                                index,
                                values
                            ) {

                                return (
                                    values.indexOf(
                                        id
                                    ) === index
                                );

                            }
                        );


            if (
                next.length >
                0
            ) {

                candidate
                    .builder
                    .modifications[
                        key
                    ] =
                        next;

            }

            else {

                delete candidate
                    .builder
                    .modifications[
                        key
                    ];

            }


            if (
                !remove &&
                key ===
                    "reinforced"
            ) {

                const targetItem =
                    (
                        candidate
                            .inventory
                            .items ||
                        []
                    ).find(
                        function (
                            item
                        ) {

                            return (
                                String(
                                    item.id
                                ) ===
                                String(
                                    targetId
                                )
                            );

                        }
                    );


                if (
                    targetItem
                ) {

                    targetItem.integrity =
                        null;

                }

            }


            if (
                !candidateIsLegal(
                    candidate
                )
            ) {

                showRejected(
                    button
                );

                return;

            }


            state =
                candidate;


            saveCurrentState();


            render();

        }


        function showModificationTargetMenu(
            button,
            targets,
            assignments
        ) {

            closeModificationTargetMenu();


            const menu =
                document.createElement(
                    "select"
                );


            const placeholder =
                document.createElement(
                    "option"
                );


            const rect =
                button.getBoundingClientRect();


            placeholder.value =
                "";


            placeholder.textContent =
                "Choose target…";


            menu.appendChild(
                placeholder
            );


            targets.forEach(
                function (
                    target
                ) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    const assigned =
                        assignments.includes(
                            target.id
                        );


                    option.value =
                        (
                            assigned
                                ? "remove:"
                                : "add:"
                        ) +
                        target.id;


                    option.textContent =
                        (
                            assigned
                                ? "Remove from "
                                : "Add to "
                        ) +
                        target.name;


                    menu.appendChild(
                        option
                    );

                }
            );


            menu.className =
                "modification-target-select";


            menu.style.position =
                "fixed";


            menu.style.left =
                Math.min(
                    rect.right +
                        6,
                    window.innerWidth -
                        230
                ) +
                "px";


            menu.style.top =
                rect.top +
                "px";


            menu.style.zIndex =
                "10000";


            menu.style.width =
                "220px";


            menu.style.fontFamily =
                "serif";


            menu.style.fontSize =
                "16px";


            menu.style.color =
                "white";


            menu.style.background =
                "#171717";


            menu.style.border =
                "1px solid #777";


            menu.addEventListener(
                "change",
                function () {

                    const separator =
                        menu.value.indexOf(
                            ":"
                        );


                    if (
                        separator >=
                        0
                    ) {

                        commitModificationTarget(
                            button,
                            menu.value.slice(
                                separator +
                                    1
                            ),
                            menu.value.slice(
                                0,
                                separator
                            ) ===
                                "remove"
                        );

                    }


                    closeModificationTargetMenu();

                }
            );


            menu.addEventListener(
                "blur",
                function () {

                    window.setTimeout(
                        closeModificationTargetMenu,
                        100
                    );

                }
            );


            document.body.appendChild(
                menu
            );


            openModificationMenu =
                menu;


            menu.focus();

        }


        function handleModificationChoice(
            button
        ) {

            const key =
                button.dataset.key;


            const targets =
                getModificationTargets(
                    state,
                    key
                );


            const assignments =
                getModificationAssignments(
                    state,
                    key
                );


            if (
                targets.length ===
                0
            ) {

                showRejected(
                    button
                );

                return;

            }


            if (
                targets.length ===
                1
            ) {

                commitModificationTarget(
                    button,
                    targets[
                        0
                    ].id,
                    assignments.includes(
                        targets[
                            0
                        ].id
                    )
                );


                return;

            }


            showModificationTargetMenu(
                button,
                targets,
                assignments
            );

        }


        // ====================================================
        // NORMAL TOGGLE HANDLING
        // ====================================================

        function handleToggleChoice(
            button
        ) {

            const type =
                button.dataset.type;


            const key =
                button.dataset.key;


            if (
                type ===
                "modification"
            ) {

                handleModificationChoice(
                    button
                );

                return;

            }


            // --------------------------------------------
            // UNARMORED CANNOT BE SELECTED WITH ARMOR
            // --------------------------------------------

            if (
                type === "skill" &&
                key === "unarmored" &&
                state.builder.armor
            ) {

                showRejected(
                    button
                );

                return;

            }


            const candidate =
                cloneState();


            const store =
                getChoiceStore(
                    candidate,
                    type
                );


            const currentlySelected =
                store[
                    key
                ] === true;


            // --------------------------------------------
            // DESELECT
            // --------------------------------------------

            if (
                currentlySelected
            ) {

                delete store[
                    key
                ];


                state =
                    candidate;


                saveCurrentState();


                render();


                return;

            }


            // --------------------------------------------
            // TRY SELECT
            // --------------------------------------------

            store[
                key
            ] =
                true;


            // --------------------------------------------
            // ATTRIBUTE CAP CHECK
            // --------------------------------------------

            if (
                type === "skill" &&
                !cappedToggleIsLegal(
                    key,
                    candidate
                )
            ) {

                showRejected(
                    button
                );

                return;

            }


            // --------------------------------------------
            // POINT CHECK
            // --------------------------------------------

            if (
                !candidateIsLegal(
                    candidate
                )
            ) {

                showRejected(
                    button
                );

                return;

            }


            state =
                candidate;


            saveCurrentState();


            render();

        }


        // ====================================================
        // RANKED SKILL HANDLING
        // ====================================================
        //
        // AWARE:
        // 0 -> 1 -> 2 -> 3 -> 0
        //
        // SNEAKY:
        // Limited dynamically by Stealth 5.
        //
        // TIRELESS:
        // Limited dynamically by Endurance 10.
        //
        // EXECUTIONER:
        // 0 -> 1 -> 2 -> 3 -> 0
        //
        // ABRAZARE:
        // 0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 0
        //
        // ABRAZARE has no Grappling cap.
        // ====================================================

        function handleRankedChoice(
            button
        ) {

            const type =
                button.dataset.type;


            const key =
                button.dataset.key;


            const candidate =
                cloneState();


            const maximumRank =
                getLegalMaximumRank(
                    button,
                    candidate
                );


            const store =
                getChoiceStore(
                    candidate,
                    type
                );


            const currentRank =
                Number(
                    store[
                        key
                    ]
                ) || 0;


            // --------------------------------------------
            // CAPPED AT ZERO
            // --------------------------------------------
            //
            // SNEAKY and TIRELESS may have a legal maximum
            // of 0 because the selected Physique already
            // has the associated stat at its maximum.
            //
            // In that case, clicking the empty box simply
            // flashes red.
            // --------------------------------------------

            if (
                currentRank ===
                    0 &&
                maximumRank ===
                    0 &&
                (
                    key ===
                        "sneaky" ||
                    key ===
                        "tireless"
                )
            ) {

                showRejected(
                    button
                );

                return;

            }


            // --------------------------------------------
            // MAXIMUM RANK -> CLEAR
            // --------------------------------------------
            //
            // Once the skill actually has ranks, reaching
            // its legal maximum still cycles normally
            // back to zero.
            // --------------------------------------------

            if (
                currentRank >=
                maximumRank
            ) {

                delete store[
                    key
                ];


                state =
                    candidate;


                saveCurrentState();


                render();


                return;

            }


            // --------------------------------------------
            // TRY NEXT RANK
            // --------------------------------------------

            store[
                key
            ] =
                currentRank +
                1;


            // --------------------------------------------
            // POINT CHECK
            // --------------------------------------------

            if (
                !candidateIsLegal(
                    candidate
                )
            ) {

                // ----------------------------------------
                // ALREADY SELECTED
                //
                // If another rank cannot be afforded,
                // cycle back to zero.
                // ----------------------------------------

                if (
                    currentRank >
                    0
                ) {

                    const clearCandidate =
                        cloneState();


                    const clearStore =
                        getChoiceStore(
                            clearCandidate,
                            type
                        );


                    delete clearStore[
                        key
                    ];


                    state =
                        clearCandidate;


                    saveCurrentState();


                    render();

                }


                // ----------------------------------------
                // CURRENTLY ZERO
                //
                // Rank 1 itself cannot be afforded.
                // ----------------------------------------

                else {

                    showRejected(
                        button
                    );

                }


                return;

            }


            // --------------------------------------------
            // LEGAL RANK INCREASE
            // --------------------------------------------

            state =
                candidate;


            saveCurrentState();


            render();

        }


        // ====================================================
        // REFRESH FROM SHARED STATE
        // ====================================================

        function refreshFromSharedState() {

    state =
        KKState.load();


    const modificationsChanged =
        reconcileModifications(
            state
        );


    const attributesChanged =
        reconcileAttributeSkills(
            state
        );


    const recalculatedSkillSpent =
        calculateSkillSpent(
            state
        );


    if (
        modificationsChanged ||
        attributesChanged ||
        Number(
            state.builder.spent.skills
        ) !==
            recalculatedSkillSpent
    ) {

        state
            .builder
            .spent
            .skills =
                recalculatedSkillSpent;


        state =
            KKState.save(
                state
            );

    }


    render();

}


        // ====================================================
        // EVENT LISTENERS
        // ====================================================

        toggleChoices.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        handleToggleChoice(
                            button
                        );

                    }
                );

            }
        );


        rankedChoices.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        handleRankedChoice(
                            button
                        );

                    }
                );

            }
        );


        window.addEventListener(
            "resize",
            resizeBuilderSheet
        );


        window.addEventListener(
            "orientationchange",
            resizeBuilderSheet
        );


        // ====================================================
        // UPDATE FROM ANOTHER TAB / PAGE
        // ====================================================

        window.addEventListener(
            "storage",
            function (event) {

                if (
                    event.key ===
                    KKState.STORAGE_KEY
                ) {

                    refreshFromSharedState();

                }

            }
        );


        // ====================================================
        // SAME-TAB STATE UPDATE
        // ====================================================

        window.addEventListener(
            "knights-knaves-state-changed",
            function () {

                refreshFromSharedState();

            }
        );


        // ====================================================
        // RESET BUILDER
        // ====================================================

        pointsCounter.addEventListener(
            "click",
            function () {

                state =
                    KKState.resetBuilder();


                render();

            }
        );


        // ====================================================
        // INITIALIZE
        // ====================================================


        const skillDescriptions =
            window.KKSkillDescriptions ||
            {};


        document
            .querySelectorAll(
                "[data-key]"
            )
            .forEach(
                function (
                    button
                ) {

                    const description =
                        skillDescriptions[
                            button.dataset.key
                        ];


                    if (
                        description
                    ) {

                        button.title =
                            description;

                    }

                }
            );


        reconcileAttributeSkills(
            state
        );


        reconcileModifications(
            state
        );


        state
            .builder
            .spent
            .skills =
                calculateSkillSpent(
                    state
                );


        state =
            KKState.save(
                state
            );


        resizeBuilderSheet();


        render();


        console.log(
            "Builder Page 2 initialized."
        );

    }
);