// ============================================================
// KNIGHTS & KNAVES
// BUILDER PAGE 1 - PHYSIQUE & GEAR
// ============================================================

console.log(
    "builder-gear.js is working!"
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


        const pointsCounter =
            document.getElementById(
                "pointsCounter"
            );


        const singleChoices =
            Array.from(
                document.querySelectorAll(
                    ".single-choice"
                )
            );


        const quantityChoices =
            Array.from(
                document.querySelectorAll(
                    ".quantity-choice"
                )
            );


        const capacityDebug =
            document.getElementById(
                "capacityDebug"
            );


        // ====================================================
        // CONSTANTS
        // ====================================================

        const DESIGN_WIDTH =
            2048;


        const DESIGN_HEIGHT =
            1325;


        const HAND_CAPACITY =
            2;


        const SIDEARM_CAPACITY =
            2;


        // ====================================================
        // GET USABLE HAND CAPACITY
        // ====================================================
        //
        // Arm Wounds remove their corresponding arm from
        // usable hand capacity.
        //
        // 0 wounded arms = 2 usable hands
        // 1 wounded arm  = 1 usable hand
        // 2 wounded arms = 0 usable hands
        // ====================================================

        function getUsableHandCapacity(
            candidateState = state
        ) {

            const derived =
                candidateState &&
                candidateState.derived
                    ? candidateState.derived
                    : {};


            const leftArmWounded =
                (
                    Number(
                        derived.leftArmWounds
                    ) || 0
                ) > 0;


            const rightArmWounded =
                (
                    Number(
                        derived.rightArmWounds
                    ) || 0
                ) > 0;


            let capacity =
                HAND_CAPACITY;


            if (
                leftArmWounded
            ) {

                capacity -=
                    1;

            }


            if (
                rightArmWounded
            ) {

                capacity -=
                    1;

            }


            return Math.max(
                0,
                capacity
            );

        }


        // ====================================================
        // HAS DUAL WIELDING
        // ====================================================

        function hasDualWielding(
            candidateState = state
        ) {

            return Boolean(
                candidateState &&
                candidateState.builder &&
                candidateState.builder.skills &&
                candidateState.builder.skills[
                    "dual-wielding"
                ] === true
            );

        }


        // ====================================================
        // CHECK DUAL-WIELDING LOADOUT
        // ====================================================
        //
        // Without DUAL WIELDING:
        //
        // - Only ONE independent one-handed weapon may need
        //   an active hand.
        //
        // - Shields do not count as weapons.
        //
        // - Sidearms use the two Sidearm slots first.
        //
        // - Sidearms beyond those two slots DO need active
        //   hands and therefore count toward this rule.
        //
        // - A true 2H weapon is still legal by itself.
        //
        // ====================================================

        function isDualWieldLoadoutValid(
            candidateState
        ) {

            if (
                hasDualWielding(
                    candidateState
                )
            ) {

                return true;

            }


            const equipment =
                candidateState.builder.equipment ||
                {};


            let activeOneHandedWeapons =
                0;


            let sidearmCopies =
                0;


            Object.entries(
                equipment
            ).forEach(
                function (
                    [itemId, quantity]
                ) {

                    const item =
                        equipmentData[
                            itemId
                        ];


                    if (
                        !item
                    ) {

                        return;

                    }


                    const count =
                        Math.max(
                            0,
                            Number(
                                quantity
                            ) || 0
                        );


                    // --------------------------------------------
                    // SHIELDS DO NOT COUNT
                    // --------------------------------------------

                    if (
                        item.shield === true
                    ) {

                        return;

                    }


                    // --------------------------------------------
                    // SIDEARMS
                    // --------------------------------------------

                    if (
                        item.sidearm === true
                    ) {

                        sidearmCopies +=
                            count;

                        return;

                    }


                    // --------------------------------------------
                    // ORDINARY 1H WEAPONS
                    // --------------------------------------------

                    if (
                        Number(
                            item.hands
                        ) === 1
                    ) {

                        activeOneHandedWeapons +=
                            count;

                    }

                }
            );


            // The first two Sidearms live in the dedicated
            // Sidearm slots and do not occupy active hands.

            const sidearmsNeedingHands =
                Math.max(
                    0,
                    sidearmCopies -
                    SIDEARM_CAPACITY
                );


            activeOneHandedWeapons +=
                sidearmsNeedingHands;


            return (
                activeOneHandedWeapons <=
                1
            );

        }


        // ====================================================
        // EQUIPMENT DEFINITIONS
        // ====================================================
        //
        // Builder Page 1 still gets its equipment definitions
        // directly from the HTML.
        //
        // The new shared inventory system also needs:
        //
        // name
        // shield
        //
        // in addition to the existing:
        //
        // cost
        // hands
        // sidearm
        // ====================================================

        const equipmentData =
            {};


        quantityChoices.forEach(
            function (button) {

                const itemId =
                    button.dataset.item;


                equipmentData[
                    itemId
                ] = {

                    name:
                        button.getAttribute(
                            "aria-label"
                        ) || itemId,

                    cost:
                        Number(
                            button.dataset.cost
                        ) || 0,

                    hands:
                        Number(
                            button.dataset.hands
                        ) || 1,

                    sidearm:
                        button.dataset.sidearm ===
                        "true",

                    shield:
                        button.classList.contains(
                            "shield-choice"
                        )

                };

            }
        );


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
                document.documentElement
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
        // PHYSIQUE / HEIGHT RULES
        // ====================================================

        function getForcedHeight(
            physique
        ) {

            if (
                physique === "Massive" ||
                physique === "Huge"
            ) {

                return "Tall";

            }


            if (
                physique === "Small" ||
                physique === "Meek"
            ) {

                return "Short";

            }


            return null;

        }


        // ====================================================
        // IS HEIGHT LOCKED
        // ====================================================

        function isHeightLocked(
            candidateState = state
        ) {

            return (
                getForcedHeight(
                    candidateState
                        .builder
                        .physique
                ) !== null
            );

        }


        // ====================================================
        // APPLY HEIGHT WHEN PHYSIQUE CHANGES
        // ====================================================
        //
        // Massive / Huge:
        //     force Tall
        //
        // Small / Meek:
        //     force Short
        //
        // Everything else:
        //     clear Height and allow the player to choose.
        // ====================================================

        function applyHeightForPhysiqueChange(
            candidateState
        ) {

            const physique =
                candidateState
                    .builder
                    .physique;


            const forcedHeight =
                getForcedHeight(
                    physique
                );


            if (
                forcedHeight
            ) {

                candidateState
                    .builder
                    .height =
                        forcedHeight;

            }

            else {

                candidateState
                    .builder
                    .height =
                        null;

            }

        }


                // ====================================================
        // ENFORCE FORCED HEIGHT ONLY
        // ====================================================
        //
        // Used when shared state is loaded.
        //
        // Normal manually chosen Heights are preserved.
        // ====================================================

        function enforceForcedHeightOnly(
            candidateState
        ) {

            const forcedHeight =
                getForcedHeight(
                    candidateState
                        .builder
                        .physique
                );


            if (
                forcedHeight
            ) {

                candidateState
                    .builder
                    .height =
                        forcedHeight;

            }

        }


        // ====================================================
        // GET SINGLE-SELECTION COST
        // ====================================================

        function getSingleSelectionCost(
            groupName,
            value
        ) {

            if (
                !value
            ) {

                return 0;

            }


            const button =
                singleChoices.find(
                    function (choice) {

                        return (
                            choice.dataset.group ===
                                groupName &&
                            choice.dataset.value ===
                                value
                        );

                    }
                );


            if (
                !button
            ) {

                return 0;

            }


            return (
                Number(
                    button.dataset.cost
                ) || 0
            );

        }


        // ====================================================
        // CALCULATE GEAR SPENDING
        // ====================================================

        function calculateGearSpent(
            candidateState = state
        ) {

            let total =
                0;


            // --------------------------------------------
            // PHYSIQUE
            // --------------------------------------------

            total +=
                getSingleSelectionCost(
                    "physique",
                    candidateState
                        .builder
                        .physique
                );


            // --------------------------------------------
            // HEIGHT
            // --------------------------------------------

            total +=
                getSingleSelectionCost(
                    "height",
                    candidateState
                        .builder
                        .height
                );


            // --------------------------------------------
            // ARMOR
            // --------------------------------------------

            total +=
                getSingleSelectionCost(
                    "armor",
                    candidateState
                        .builder
                        .armor
                );


            // --------------------------------------------
            // EQUIPMENT
            // --------------------------------------------

            Object.entries(
                candidateState
                    .builder
                    .equipment
            ).forEach(
                function (
                    [itemId, quantity]
                ) {

                    const item =
                        equipmentData[
                            itemId
                        ];


                    if (
                        !item
                    ) {

                        return;

                    }


                    total +=
                        item.cost *
                        Number(
                            quantity
                        );

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
                calculateGearSpent(
                    candidateState
                );


            const skillsSpent =
                Number(
                    candidateState
                        .builder
                        .spent
                        .skills
                ) || 0;


            return (
                Number(
                    candidateState
                        .builder
                        .startingPoints
                ) -
                gearSpent -
                skillsSpent
            );

        }


        // ====================================================
        // CALCULATE CAPACITY
        // ====================================================

        function calculateCapacity(
            candidateState
        ) {

            let handsUsed = 0;
            let sidearmsUsed = 0;


            const equipment =
                candidateState
                    .builder
                    .equipment;


            // --------------------------------------------
            // NON-SIDEARM EQUIPMENT
            // --------------------------------------------

            Object.entries(
                equipment
            ).forEach(
                function (
                    [itemId, quantity]
                ) {

                    const item =
                        equipmentData[
                            itemId
                        ];


                    if (
                        !item ||
                        item.sidearm
                    ) {

                        return;

                    }


                    handsUsed +=
                        item.hands *
                        Number(
                            quantity
                        );

                }
            );


            // --------------------------------------------
            // SIDEARM-CAPABLE EQUIPMENT
            // --------------------------------------------

            Object.entries(
                equipment
            ).forEach(
                function (
                    [itemId, quantity]
                ) {

                    const item =
                        equipmentData[
                            itemId
                        ];


                    if (
                        !item ||
                        !item.sidearm
                    ) {

                        return;

                    }


                    let remainingCopies =
                        Number(
                            quantity
                        );


                    const sidearmSpace =
                        Math.max(
                            0,
                            SIDEARM_CAPACITY -
                            sidearmsUsed
                        );


                    const placedAsSidearms =
                        Math.min(
                            remainingCopies,
                            sidearmSpace
                        );


                    sidearmsUsed +=
                        placedAsSidearms;


                    remainingCopies -=
                        placedAsSidearms;


                    if (
                        remainingCopies > 0
                    ) {

                        handsUsed +=
                            remainingCopies *
                            item.hands;

                    }

                }
            );


            // ====================================================
            // GIGUE + TRUE TWO-HANDED WEAPON CAPACITY
            // ====================================================
            //
            // A Gigued Shield still reserves its arm against
            // carrying a second independent one-handed weapon.
            //
            // However, a true two-handed weapon may still be used
            // while a Shield is Gigued.
            // ====================================================

            const gear =
                candidateState.gearSheet ||
                {};


            const inventoryItems =
                (
                    candidateState.inventory &&
                    Array.isArray(
                        candidateState.inventory.items
                    )
                )
                    ? candidateState.inventory.items
                    : [];


            const hasTrueTwoHandedWeapon =
                Object.entries(
                    equipment
                ).some(
                    function (
                        [itemId, quantity]
                    ) {

                        const item =
                            equipmentData[
                                itemId
                            ];


                        return Boolean(
                            item &&
                            item.sidearm !== true &&
                            item.shield !== true &&
                            Number(
                                item.hands
                            ) === 2 &&
                            Number(
                                quantity
                            ) > 0
                        );

                    }
                );


            if (
                hasTrueTwoHandedWeapon
            ) {

                [
                    gear.leftGigue,
                    gear.rightGigue
                ]
                    .filter(Boolean)
                    .forEach(
                        function (
                            instanceId
                        ) {

                            const instance =
                                inventoryItems.find(
                                    function (
                                        item
                                    ) {

                                        return (
                                            item &&
                                            item.id ===
                                                instanceId
                                        );

                                    }
                                );


                            if (
                                !instance ||
                                instance.source !==
                                    "builder" ||
                                instance.shield !==
                                    true
                            ) {

                                return;

                            }


                            handsUsed -=
                                Math.max(
                                    1,
                                    Number(
                                        instance.hands
                                    ) || 1
                                );

                        }
                    );

            }


            handsUsed =
                Math.max(
                    0,
                    handsUsed
                );


            const usableHandCapacity =
                getUsableHandCapacity(
                    candidateState
                );


            return {

                handsUsed,
                sidearmsUsed,

                usableHandCapacity,

                handsRemaining:
                    usableHandCapacity -
                    handsUsed,

                sidearmsRemaining:
                    SIDEARM_CAPACITY -
                    sidearmsUsed

            };

        }


                // ====================================================
        // CHECK CAPACITY
        // ====================================================

        function isCapacityValid(
            candidateState
        ) {

            const capacity =
                calculateCapacity(
                    candidateState
                );


            return (
                capacity.handsUsed <=
                    capacity.usableHandCapacity &&
                capacity.sidearmsUsed <=
                    SIDEARM_CAPACITY
            );

        }


        // ====================================================
        // VALIDATE CANDIDATE STATE
        // ====================================================

        function candidateIsLegal(
            candidateState
        ) {

            if (
                getRemainingPointsFor(
                    candidateState
                ) < 0
            ) {

                return false;

            }


            if (
                !isCapacityValid(
                    candidateState
                )
            ) {

                return false;

            }


            if (
                !isDualWieldLoadoutValid(
                    candidateState
                )
            ) {

                return false;

            }


            return true;

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
        // SYNCHRONIZE INDIVIDUAL INVENTORY
        // ====================================================
        //
        // Builder quantities remain the source for how many
        // purchased copies the player owns.
        //
        // KKState creates/removes individual physical copies to
        // match those quantities.
        //
        // New unplaced copies are then placed into the ordinary
        // hand / sidearm locations.
        // ====================================================

        function synchronizeInventory(
            candidateState
        ) {

            if (
                typeof KKState
                    .reconcileBuilderInventory ===
                "function"
            ) {

                KKState
                    .reconcileBuilderInventory(
                        candidateState,
                        equipmentData
                    );

            }


            if (
                typeof KKState
                    .autoPlaceBuilderInventory ===
                "function"
            ) {

                KKState
                    .autoPlaceBuilderInventory(
                        candidateState
                    );

            }


            return candidateState;

        }


        // ====================================================
        // SAVE / RECALCULATE
        // ====================================================

        function saveCurrentState() {

            state
                .builder
                .spent
                .gear =
                    calculateGearSpent(
                        state
                    );


            synchronizeInventory(
                state
            );


            // Cushioned targets the currently selected armor.
            // Changing or removing that armor removes the old
            // per-target assignment and refunds it when Page 2
            // recalculates modification spending.

            const cushioned =
                state.builder.modifications &&
                state.builder.modifications.cushioned;


            if (
                Array.isArray(
                    cushioned
                )
            ) {

                const armorTarget =
                    state.builder.armor
                        ? "armor:" +
                            state.builder.armor
                        : null;


                const remaining =
                    cushioned.filter(
                        function (
                            targetId
                        ) {

                            return (
                                targetId ===
                                armorTarget
                            );

                        }
                    );


                if (
                    remaining.length >
                    0
                ) {

                    state
                        .builder
                        .modifications
                        .cushioned =
                            remaining;

                }

                else {

                    delete state
                        .builder
                        .modifications
                        .cushioned;

                }

            }


            state =
                KKState.save(
                    state
                );

        }


        // ====================================================
        // CHECK WHETHER SINGLE CHOICE IS AFFORDABLE
        // ====================================================

        function singleChoiceIsAffordable(
            button
        ) {

            const group =
                button.dataset.group;


            const value =
                button.dataset.value;


            // ------------------------------------------------
            // CURRENTLY SELECTED
            // ------------------------------------------------
            //
            // Never black out the current selection because
            // clicking it removes/refunds it.
            // ------------------------------------------------

            if (
                state.builder[
                    group
                ] === value
            ) {

                return true;

            }


            const candidate =
                cloneState();


            candidate
                .builder[
                    group
                ] =
                    value;


            // Physique can force a Height change.

            if (
                group ===
                "physique"
            ) {

                applyHeightForPhysiqueChange(
                    candidate
                );

            }


            return (
                getRemainingPointsFor(
                    candidate
                ) >= 0
            );

        }


        // ====================================================
        // CHECK WHETHER EQUIPMENT IS AFFORDABLE
        // ====================================================

        function quantityChoiceIsAffordable(
            button
        ) {

            const itemId =
                button.dataset.item;


            const item =
                equipmentData[
                    itemId
                ];


            if (
                !item
            ) {

                return true;

            }


            const currentQuantity =
                Number(
                    state
                        .builder
                        .equipment[
                            itemId
                        ]
                ) || 0;


            // ------------------------------------------------
            // ALREADY OWNED
            // ------------------------------------------------
            //
            // Do not black out an owned item.
            //
            // Its button still needs to remain clickable so
            // quantities can cycle/reset normally.
            // ------------------------------------------------

            if (
                currentQuantity >
                0
            ) {

                return true;

            }


            const candidate =
                cloneState();


            candidate
                .builder
                .equipment[
                    itemId
                ] =
                    1;


            return candidateIsLegal(
                candidate
            );

        }


        // ====================================================
        // RENDER
        // ====================================================

        function render() {

            // --------------------------------------------
            // POINTS
            // --------------------------------------------

            const remaining =
                KKState.getRemainingPoints(
                    state
                );


            pointsCounter.textContent =
                remaining;


            // --------------------------------------------
            // HEIGHT LOCK
            // --------------------------------------------

            const heightLocked =
                isHeightLocked(
                    state
                );


            // --------------------------------------------
            // SINGLE SELECTS
            // --------------------------------------------

            singleChoices.forEach(
                function (button) {

                    const group =
                        button.dataset.group;


                    const value =
                        button.dataset.value;


                    const selectedValue =
                        state
                            .builder[
                                group
                            ];


                    button.classList.toggle(
                        "selected",
                        selectedValue ===
                            value
                    );


                    // ------------------------------------
                    // AFFORDABILITY
                    // ------------------------------------

                        const affordable =
                        singleChoiceIsAffordable(
                            button
                        );


                    const conflictsWithUnarmored =
                        group === "armor" &&
                        state.builder.skills &&
                        state.builder.skills.unarmored ===
                            true;


                    button.classList.toggle(
                        "unaffordable",
                        !affordable ||
                        conflictsWithUnarmored
                    );


                    // ------------------------------------
                    // HEIGHT LOCK
                    // ------------------------------------

                    if (
                        group ===
                        "height"
                    ) {

                        button.disabled =
                            heightLocked;

                    }

                }
            );


            // --------------------------------------------
            // EQUIPMENT QUANTITIES
            // --------------------------------------------

            quantityChoices.forEach(
                function (button) {

                    const itemId =
                        button.dataset.item;


                    const quantity =
                        Number(
                            state
                                .builder
                                .equipment[
                                    itemId
                                ]
                        ) || 0;


                    button.textContent =
                        quantity > 0
                            ? quantity
                            : "";


                    button.classList.toggle(
                        "has-quantity",
                        quantity > 0
                    );


                    const affordable =
                        quantityChoiceIsAffordable(
                            button
                        );


                    button.classList.toggle(
                        "unaffordable",
                        !affordable
                    );

                }
            );


            // --------------------------------------------
            // DEBUG CAPACITY
            // --------------------------------------------

            if (
                capacityDebug
            ) {

                const capacity =
                    calculateCapacity(
                        state
                    );


                capacityDebug.textContent =
                    `Hands: ${capacity.handsUsed}/${HAND_CAPACITY} | ` +
                    `Sidearms: ${capacity.sidearmsUsed}/${SIDEARM_CAPACITY}`;

            }

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
        // SINGLE-SELECT HANDLING
        // ====================================================

        function handleSingleChoice(
            button
        ) {

            const group =
                button.dataset.group;


            const value =
                button.dataset.value;


            // --------------------------------------------
            // ARMOR CANNOT BE SELECTED WITH UNARMORED
            // --------------------------------------------

            if (
                group === "armor" &&
                state.builder.skills &&
                state.builder.skills.unarmored ===
                    true &&
                state.builder.armor !==
                    value
            ) {

                showRejected(
                    button
                );

                return;

            }


            // --------------------------------------------
            // HEIGHT LOCKED BY PHYSIQUE
            // --------------------------------------------

            if (
                group === "height" &&
                isHeightLocked(
                    state
                )
            ) {

                return;

            }


            const candidate =
                cloneState();


            // --------------------------------------------
            // TOGGLE SELECTION
            // --------------------------------------------

            if (
                candidate
                    .builder[
                        group
                    ] === value
            ) {

                candidate
                    .builder[
                        group
                    ] =
                        null;

            }

            else {

                candidate
                    .builder[
                        group
                    ] =
                        value;

            }


            // --------------------------------------------
            // PHYSIQUE CHANGED
            // --------------------------------------------

            if (
                group ===
                "physique"
            ) {

                applyHeightForPhysiqueChange(
                    candidate
                );

            }


            // --------------------------------------------
            // VALIDATE
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
        // THEORETICAL MAXIMUM QUANTITY
        // ====================================================

        function getTheoreticalMax(
            item
        ) {

            if (
                item.sidearm
            ) {

                /*
                   Two sidearm slots plus two possible hands.
                */

                return 4;

            }


            if (
                item.hands ===
                2
            ) {

                return 1;

            }


            return 2;

        }


        // ====================================================
        // QUANTITY HANDLING
        // ====================================================

        function handleQuantityChoice(
            button
        ) {

            const itemId =
                button.dataset.item;


            const item =
                equipmentData[
                    itemId
                ];


            if (
                !item
            ) {

                return;

            }


            const currentQuantity =
                Number(
                    state
                        .builder
                        .equipment[
                            itemId
                        ]
                ) || 0;


            const theoreticalMax =
                getTheoreticalMax(
                    item
                );


            // --------------------------------------------
            // AT MAXIMUM -> CLEAR
            // --------------------------------------------

            if (
                currentQuantity >=
                theoreticalMax
            ) {

                const candidate =
                    cloneState();


                delete candidate
                    .builder
                    .equipment[
                        itemId
                    ];


                state =
                    candidate;


                saveCurrentState();


                render();


                return;

            }


            // --------------------------------------------
            // TRY +1
            // --------------------------------------------

            const candidate =
                cloneState();


            candidate
                .builder
                .equipment[
                    itemId
                ] =
                    currentQuantity +
                    1;


            // --------------------------------------------
            // NEXT VALUE IS ILLEGAL
            // --------------------------------------------

            if (
                !candidateIsLegal(
                    candidate
                )
            ) {

                /*
                   Preserve your existing behavior:

                   if there is already at least one copy and the
                   next copy cannot be added, clicking cycles the
                   item back to zero.

                   If there are zero copies, just flash red.
                */

                if (
                    currentQuantity >
                    0
                ) {

                    const clearCandidate =
                        cloneState();


                    delete clearCandidate
                        .builder
                        .equipment[
                            itemId
                        ];


                    state =
                        clearCandidate;


                    saveCurrentState();


                    render();

                }

                else {

                    showRejected(
                        button
                    );

                }


                return;

            }


            // --------------------------------------------
            // LEGAL INCREASE
            // --------------------------------------------

            state =
                candidate;


            saveCurrentState();


            render();

        }


        // ====================================================
        // RESET BUILDER
        // ====================================================

        function resetBuilder() {

            state =
                KKState.resetBuilder();


            /*
               resetBuilder() removes the purchased inventory
               instances as well as Builder selections.

               Pickup items are intentionally not builder-owned,
               so they remain available for the future Gear Sheet.
            */


            render();

        }


        // ====================================================
        // REFRESH FROM SHARED STATE
        // ====================================================
        //
        // This is used when another page changes shared data.
        //
        // IMPORTANT:
        //
        // We do not call KKState.save() from this function.
        // Doing so inside the shared-state event could cause an
        // event loop.
        // ====================================================

        function refreshFromSharedState() {

            state =
                KKState.load();


            enforceForcedHeightOnly(
                state
            );


            /*
               If another page removed a purchased equipment
               instance, builder.equipment has already been
               reduced by the shared-state helper.

               We recalculate the local displayed spending here.
            */

            state
                .builder
                .spent
                .gear =
                    calculateGearSpent(
                        state
                    );


            render();

        }


        // ====================================================
        // EVENT LISTENERS
        // ====================================================

        singleChoices.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        handleSingleChoice(
                            button
                        );

                    }
                );

            }
        );


        quantityChoices.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        handleQuantityChoice(
                            button
                        );

                    }
                );

            }
        );


        pointsCounter.addEventListener(
            "click",
            resetBuilder
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
        // STORAGE UPDATE FROM ANOTHER PAGE
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
        // SAME-PAGE SHARED STATE UPDATE
        // ====================================================

        window.addEventListener(
            "knights-knaves-state-changed",
            function () {

                refreshFromSharedState();

            }
        );


        // ====================================================
        // INITIALIZE
        // ====================================================

        enforceForcedHeightOnly(
            state
        );


        state
            .builder
            .spent
            .gear =
                calculateGearSpent(
                    state
                );


        /*
           This is the migration step.

           If the browser already contains Builder Page 1
           quantities from the older version, individual item
           instances will now be created automatically.
        */

        synchronizeInventory(
            state
        );


        state =
            KKState.save(
                state
            );


        resizeBuilderSheet();


        render();


        console.log(
            "Builder Page 1 initialized with individual inventory."
        );

    }
);