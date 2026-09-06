// ============================================================
// KNIGHTS & KNAVES
// GEAR SHEET
// ============================================================

console.log("gear-sheet.js is working!");


document.addEventListener("DOMContentLoaded", function () {

    "use strict";


    // ============================================================
    // PART 1 OF 12 — SETUP, STATE & CORE ITEM HELPERS
    // ============================================================


    // ========================================================
    // ELEMENTS
    // ========================================================

    const sheetWrapper =
        document.querySelector(
            ".sheet-wrapper"
        );


    const gearSheetElement =
        document.getElementById(
            "gearSheet"
        );


    const armorName =
        document.getElementById(
            "armorName"
        );


    const armorDurability =
        document.getElementById(
            "armorDurability"
        );


    const armorPadding =
        document.getElementById(
            "armorPadding"
        );


    const locationElements = {

        leftHand:
            document.getElementById(
                "leftHandSlot"
            ),

        rightHand:
            document.getElementById(
                "rightHandSlot"
            ),

        leftSidearm:
            document.getElementById(
                "leftSidearmSlot"
            ),

        rightSidearm:
            document.getElementById(
                "rightSidearmSlot"
            ),

        leftGigue:
            document.getElementById(
                "leftGigueSlot"
            ),

        rightGigue:
            document.getElementById(
                "rightGigueSlot"
            ),

        leftBuckler:
            document.getElementById(
                "leftBucklerSlot"
            ),

        rightBuckler:
            document.getElementById(
                "rightBucklerSlot"
            )

    };


    const columnElements = {

        leftHand:
            document.getElementById(
                "leftHandColumn"
            ),

        rightHand:
            document.getElementById(
                "rightHandColumn"
            ),

        leftSidearm:
            document.getElementById(
                "leftSidearmColumn"
            ),

        rightSidearm:
            document.getElementById(
                "rightSidearmColumn"
            ),

        leftBuckler:
            document.getElementById(
                "leftBucklerColumn"
            ),

        rightBuckler:
            document.getElementById(
                "rightBucklerColumn"
            ),

        /*
           Your HTML uses ONE shared Gigue detail column.

           Keep its real property name here.
        */

        gigueShield:
            document.getElementById(
                "gigueShieldColumn"
            )

    };


    const leftPickupButton =
        document.getElementById(
            "leftPickupButton"
        );


    const rightPickupButton =
        document.getElementById(
            "rightPickupButton"
        );


    const leftPickupSelect =
        document.getElementById(
            "leftPickupSelect"
        );


    const rightPickupSelect =
        document.getElementById(
            "rightPickupSelect"
        );


    // ========================================================
    // CONSTANTS
    // ========================================================

    const DESIGN_WIDTH =
        2048;


    const DESIGN_HEIGHT =
        1325;


    // ========================================================
    // EQUIPMENT REFERENCE DATA
    // ========================================================
    //
    // Equipment definitions live in:
    //
    //     js/equipment-data.js
    //
    // gear-sheet.html MUST load equipment-data.js before this
    // file.
    //
    // Static equipment information belongs there:
    //
    // - Name
    // - Type
    // - Hands
    // - Sidearm status
    // - Shield status
    // - Native Reach
    // - Weight
    // - Defenses
    // - Strikes
    // - Tools
    // - Starting Durability
    // - Versatile die
    //
    // Dynamic character values are calculated here.
    // ========================================================

    const equipmentData =
        window.KKEquipmentData ||
        {};


    if (
        Object.keys(
            equipmentData
        ).length ===
        0
    ) {

        console.error(
            "KKEquipmentData was not found. " +
            "Make sure equipment-data.js loads before gear-sheet.js."
        );

    }


    const pickupItemIds =
        Object.keys(
            equipmentData
        );


    // ========================================================
    // LOCAL STATE
    // ========================================================

    let state =
        KKState.load();


    // ========================================================
    // ONE-HANDED WEAPON CYCLE DIRECTIONS
    // ========================================================
    //
    // RIGHT -> BOTH -> LEFT -> BOTH -> RIGHT
    //
    // Direction is local UI state and does not need to be
    // stored in character-state.js.
    // ========================================================

    const handCycleDirections =
        new Map();


    // ========================================================
    // BASIC HELPERS
    // ========================================================

    function getGear() {

        return state.gearSheet;

    }


    function getItem(
        instanceId
    ) {

        if (
            !instanceId
        ) {

            return null;

        }


        return KKState
            .getEquipmentInstance(
                state,
                instanceId
            );

    }


    function getDefinition(
        instance
    ) {

        if (
            !instance
        ) {

            return null;

        }


        return (
            equipmentData[
                instance.itemId
            ] ||
            {

                name:
                    instance.name ||
                    instance.itemId,

                hands:
                    Number(
                        instance.hands
                    ) ||
                    1,

                sidearm:
                    instance.sidearm ===
                    true,

                shield:
                    instance.shield ===
                    true

            }
        );

    }


    function otherSide(
        side
    ) {

        return side ===
            "left"
                ? "right"
                : "left";

    }


    function handKey(
        side
    ) {

        return (
            side +
            "Hand"
        );

    }


    function handBucklerKey(
        side
    ) {

        return (
            side +
            "HandBuckler"
        );

    }


    function sidearmKey(
        side
    ) {

        return (
            side +
            "Sidearm"
        );

    }


    function gigueKey(
        side
    ) {

        return (
            side +
            "Gigue"
        );

    }


    function bucklerKey(
        side
    ) {

        return (
            side +
            "Buckler"
        );

    }


    // ========================================================
    // DERIVED CHARACTER VALUES
    // ========================================================
    //
    // Published by main-sheet.js into shared character state.
    // ========================================================

    function getDerivedMight() {

        const value =
            Number(
                state &&
                state.derived
                    ? state
                        .derived
                        .might
                    : 0
            );


        return Number.isFinite(
            value
        )
            ? value
            : 0;

    }


    function getDerivedBaseReach() {

        const value =
            Number(
                state &&
                state.derived
                    ? state
                        .derived
                        .baseReach
                    : 0
            );


        return Number.isFinite(
            value
        )
            ? value
            : 0;

    }


    // ========================================================
    // SKILL / MODIFICATION HELPERS
    // ========================================================

    function hasSkill(
        key
    ) {

        const skills =
            state.builder.skills ||
            {};


        const value =
            skills[
                key
            ];


        return (
            value === true ||
            Number(
                value
            ) > 0
        );

    }


    function hasModification(
        key
    ) {

        const modifications =
            state
                .builder
                .modifications ||
            {};


        const value =
            modifications[
                key
            ];


        return (
            (
                Array.isArray(
                    value
                ) &&
                value.length >
                    0
            ) ||
            value === true ||
            Number(
                value
            ) > 0
        );

    }


    function itemHasModification(
        instanceOrId,
        key
    ) {

        const instanceId =
            typeof instanceOrId ===
                "object"
                    ? instanceOrId &&
                        instanceOrId.id
                    : instanceOrId;


        const value =
            (
                state.builder.modifications ||
                {}
            )[
                key
            ];


        return Array.isArray(
            value
        )
            ? value
                .map(
                    String
                )
                .includes(
                    String(
                        instanceId ||
                        ""
                    )
                )
            : value === true;

    }


    function armorHasModification(
        key
    ) {

        const armorId =
            state.builder.armor;


        return Boolean(
            armorId &&
            itemHasModification(
                "armor:" +
                    armorId,
                key
            )
        );

    }


    function markModifiedElement(
        element
    ) {

        if (
            !element
        ) {

            return;

        }


        element.classList.add(
            "modified-value"
        );


        element.style.color =
            "#9eff97";

    }


    function hasSwashbuckling() {

        return hasSkill(
            "swashbuckling"
        );

    }


    function hasGigueStrap() {

        return hasModification(
            "gigue-strap"
        );

    }


    // ========================================================
    // SAVE HELPERS
    // ========================================================

    function saveState() {

        state =
            KKState.save(
                state
            );

    }


    function saveAndRender() {

        saveState();

        render();

    }


    // ========================================================
    // ITEM TYPE HELPERS
    // ========================================================

    function isShield(
        instanceId
    ) {

        const instance =
            getItem(
                instanceId
            );


        const definition =
            getDefinition(
                instance
            );


        return Boolean(
            definition &&
            definition.shield
        );

    }


    function isBuckler(
        instanceId
    ) {

        const instance =
            getItem(
                instanceId
            );


        return Boolean(
            instance &&
            instance.itemId ===
                "buckler"
        );

    }


    function isSidearm(
        instanceId
    ) {

        const instance =
            getItem(
                instanceId
            );


        const definition =
            getDefinition(
                instance
            );


        return Boolean(
            definition &&
            definition.sidearm
        );

    }


    function isTwoHanded(
        instanceId
    ) {

        const instance =
            getItem(
                instanceId
            );


        const definition =
            getDefinition(
                instance
            );


        return Boolean(
            definition &&
            Number(
                definition.hands
            ) ===
            2
        );

    }


    function isOneHandedNonSidearmWeapon(
        instanceId
    ) {

        const instance =
            getItem(
                instanceId
            );


        const definition =
            getDefinition(
                instance
            );


        if (
            !definition
        ) {

            return false;

        }


        return (
            !definition.shield &&
            !definition.sidearm &&
            Number(
                definition.hands
            ) ===
            1
        );

    }


    // ========================================================
    // HAS DUAL WIELDING
    // ========================================================

    function hasDualWielding() {

        return Boolean(
            state &&
            state.builder &&
            state.builder.skills &&
            state.builder.skills[
                "dual-wielding"
            ] === true
        );

    }


    // ========================================================
    // WOULD CREATE ILLEGAL DUAL WIELD
    // ========================================================
    //
    // Without DUAL WIELDING, two DIFFERENT weapons cannot
    // occupy the two active main-hand slots.
    //
    // This does NOT block:
    //
    // - one weapon occupying both hands
    // - shields
    // - sidearms
    // - Gigue / Swashbuckling storage
    //
    // ========================================================

    function wouldCreateIllegalDualWield(
        instanceId,
        destinationSide
    ) {

        if (
            hasDualWielding()
        ) {

            return false;

        }


        if (
            !instanceId ||
            !destinationSide
        ) {

            return false;

        }


        const instance =
            getItem(
                instanceId
            );


        const definition =
            getDefinition(
                instance
            );


        // The item being placed must itself be a weapon.

        if (
            !definition ||
            definition.shield ===
                true
        ) {

            return false;

        }


        const oppositeSide =
            destinationSide ===
                "left"
                    ? "right"
                    : "left";


        const oppositeId =
            getGear()[
                handKey(
                    oppositeSide
                )
            ];


        // Empty opposite hand is fine.

        if (
            !oppositeId
        ) {

            return false;

        }


        // Same instance in both hands is NOT dual wielding.

        if (
            oppositeId ===
            instanceId
        ) {

            return false;

        }


        const oppositeInstance =
            getItem(
                oppositeId
            );


        const oppositeDefinition =
            getDefinition(
                oppositeInstance
            );


        // A shield in the opposite hand is fine.

        if (
            !oppositeDefinition ||
            oppositeDefinition.shield ===
                true
        ) {

            return false;

        }


        // Two different weapons would now occupy the active hands.

        return true;

    }


    // ========================================================
    // HAS LUNGE
    // ========================================================

    function hasLunge() {

        return Boolean(
            state &&
            state.builder &&
            state.builder.skills &&
            state.builder.skills.lunge ===
                true
        );

    }


    // ========================================================
    // ITEM CAN THRUST
    // ========================================================

        function itemCanThrust(
        instance
    ) {

        const definition =
            getDefinition(
                instance
            );


        const hasNaturalThrust =
            Boolean(
                definition &&
                definition.strikes &&
                Object.prototype.hasOwnProperty.call(
                    definition.strikes,
                    "Thrust"
                )
            );


        const hasTopSpike =
            itemHasModification(
                instance,
                "top-spike"
            );


        return (
            hasNaturalThrust ||
            hasTopSpike
        );

    }


    // ========================================================
    // RENDER REACH WITH SKILL REMINDERS
    // ========================================================
    //
    // The normal Reach remains unchanged.
    //
    // Skill bonuses such as LUNGE are displayed separately
    // because they only apply in specific circumstances.
    // ========================================================

    function renderReachField(
        field,
        instance
    ) {

        if (
            !field
        ) {

            return;

        }


        const normalReach =
            getDisplayedReach(
                instance
            );


        field.textContent =
            "";


        const normalSpan =
            document.createElement(
                "span"
            );


        if (
            itemHasModification(
                instance,
                "center-grip"
            )
        ) {

            markModifiedElement(
                normalSpan
            );

        }


        // ----------------------------------------------------
        // HAFT BLOCK MINIMUM REACH REMINDER
        // ----------------------------------------------------

        if (
            hasHaftBlock() &&
            isTwoHandedNonSword(
                instance
            )
        ) {

            normalSpan.textContent =
                "";


            const modifier =
                document.createElement(
                    "span"
                );


            modifier.className =
                "haft-block-reminder";
                            modifier.textContent =
                "(2)";


            normalSpan.appendChild(
                modifier
            );


            const reachText =
                document.createElement(
                    "span"
                );


            reachText.textContent =
                String(
                    normalReach
                );


            normalSpan.appendChild(
                reachText
            );

        }

        else {

            normalSpan.textContent =
                normalReach;

        }


        field.appendChild(
            normalSpan
        );


        // ----------------------------------------------------
        // LUNGE
        // ----------------------------------------------------

        if (
            hasLunge() &&
            itemCanThrust(
                instance
            )
        ) {

            const modifier =
                document.createElement(
                    "span"
                );


            modifier.className =
                "skill-reminder";


            modifier.textContent =
                "(+1)";


            field.appendChild(
                modifier
            );

        }

    }


    // ========================================================
    // HAS RABAT
    // ========================================================

    function hasRabat() {

        return Boolean(
            state &&
            state.builder &&
            state.builder.skills &&
            state.builder.skills.rabat ===
                true
        );

    }


    // ========================================================
    // RABAT ELIGIBILITY
    // ========================================================
    //
    // RABAT grants Parry 0 to:
    // - one-handed weapons
    // - that are NOT swords
    // - and do not already have Parry
    //
    // Shields are excluded.
    // ========================================================

    function getsRabatParry(
        instance
    ) {

        if (
            !hasRabat() ||
            !instance
        ) {

            return false;

        }


        const definition =
            getDefinition(
                instance
            ) ||
            {};


        // Shields never qualify.

        if (
            definition.shield ===
            true
        ) {

            return false;

        }


        // Swords never qualify.

        if (
            String(
                definition.type ||
                ""
            ).toLowerCase() ===
                "sword"
        ) {

            return false;

        }


        // Must be a weapon capable of one-handed use.
        //
        // In the equipment data, these are the weapons whose
        // native Hands value is 1. Versatile weapons therefore
        // still qualify.

        if (
            Number(
                definition.hands
            ) !== 1
        ) {

            return false;

        }


        // If it already naturally has Parry, Rabat does not
        // create a duplicate Parry row.

        const naturalDefenses =
            definition.defenses ||
            {};


        if (
            Object.prototype.hasOwnProperty.call(
                naturalDefenses,
                "Parry"
            )
        ) {

            return false;

        }


        return true;

    }


    // ============================================================
    // PART 2 OF 12 — REACH, DAMAGE, VERSATILE & DISPLAY MATH
    // ============================================================


    // ========================================================
    // DYNAMIC REACH
    // ========================================================
    //
    // The item's listed Reach contains its native:
    //
    //     minimum
    //     maximum
    //
    // Character Base Reach is added ONLY to the maximum.
    //
    // Example:
    //
    // Native Longsword: 2-4
    // Character Base Reach: 1
    //
    // Display: 2-5
    //
    // An item with only one listed Reach number uses that
    // number as both native min and native max.
    //
    // Example:
    //
    // Dagger native Reach: 0
    // Character Base Reach: 2
    //
    // Display: 0-2
    //
    // If the final min and max are still equal, only one
    // number is displayed.
    // ========================================================

    function getDisplayedReach(
        instance
    ) {

        const definition =
            getDefinition(
                instance
            );


        if (
            !definition ||
            definition.reach ===
                undefined ||
            definition.reach ===
                null
        ) {

            return "";

        }


        const reach =
            definition.reach;


        let minimum;


        let maximum;


        // ====================================================
        // NORMAL NATIVE REACH
        // ====================================================

        if (
            typeof reach ===
                "object"
        ) {

            minimum =
                Number(
                    reach.min
                );


            maximum =
                Number(
                    reach.max
                );

        }

        else {

            minimum =
                Number(
                    reach
                );


            maximum =
                minimum;

        }


        // ====================================================
        // VALIDATE REACH
        // ====================================================

        if (
            !Number.isFinite(
                minimum
            )
        ) {

            return "";

        }


        if (
            !Number.isFinite(
                maximum
            )
        ) {

            maximum =
                minimum;

        }


        // ====================================================
        // TWO-HANDED REACH MAXIMUM
        // ====================================================
        //
        // Some versatile weapons have a larger maximum Reach
        // specifically while wielded with both hands.
        //
        // Examples:
        //
        // Battle Axe:   1–2 / 4
        // Morning Star: 2–3 / 4
        // Goedendag:    3–4 / 5
        // Spear:        4 / 8
        //
        // If the weapon is currently occupying BOTH hand slots,
        // replace its ordinary maximum with that 2H maximum.
        // ====================================================

        if (
            instance &&
            instance.id &&
            isWieldedWithBothHands(
                instance.id
            )
        ) {

            const twoHandedMaximum =
                Number(
                    definition
                        .twoHandedReachMax
                );


            if (
                Number.isFinite(
                    twoHandedMaximum
                )
            ) {

                maximum =
                    twoHandedMaximum;

            }

        }


        // ====================================================
        // CHARACTER BASE REACH
        // ====================================================
        //
        // Height-derived Reach is added to the weapon's final
        // maximum Reach after determining 1H versus 2H Reach.
        // ====================================================

        maximum +=
            getDerivedBaseReach();


        if (
            itemHasModification(
                instance,
                "center-grip"
            )
        ) {

            maximum +=
                1;

        }


        // ====================================================
        // DISPLAY
        // ====================================================

        if (
            maximum ===
            minimum
        ) {

            return String(
                minimum
            );

        }


        return (
            minimum +
            "–" +
            maximum
        );

    }


    // ========================================================
    // DYNAMIC STRIKE DAMAGE
    // ========================================================
    //
    // Might is appended to every Strike.
    //
    // Might 2:
    //
    //     2d8 + e
    //
    // Might 0:
    //
    //     2d8
    //
    // Negative Might is also supported:
    //
    //     2d8 - 1
    // ========================================================

    function appendMightToDamage(
        damage
    ) {

        const base =
            String(
                damage ??
                ""
            ).trim();


        if (
            !base
        ) {

            return "";

        }


        const might =
            getDerivedMight();


        if (
            might ===
            0
        ) {

            return base;

        }


        if (
            might >
            0
        ) {

            return (
                base +
                " + " +
                might
            );

        }


        return (
            base +
            " - " +
            Math.abs(
                might
            )
        );

    }


    // ========================================================
    // IS INSTANCE WIELDED WITH BOTH HANDS?
    // ========================================================
    //
    // Instance IDs are compared rather than item names.
    //
    // One Longsword occupying both hands:
    //
    //     true
    //
    // Two different Longsword instances:
    //
    //     false
    // ========================================================

    function isWieldedWithBothHands(
        instanceId
    ) {

        if (
            !instanceId
        ) {

            return false;

        }


        const gear =
            getGear();


        return (
            gear.leftHand ===
                instanceId &&
            gear.rightHand ===
                instanceId
        );

    }


    // ========================================================
    // VERSATILE HELPERS
    // ========================================================

    function getVersatileDie(
        instanceId
    ) {

        const instance =
            getItem(
                instanceId
            );


        const definition =
            getDefinition(
                instance
            );


        if (
            !definition ||
            !definition.versatile
        ) {

            return "";

        }


        if (
            !isWieldedWithBothHands(
                instanceId
            )
        ) {

            return "";

        }


        return String(
            definition.versatile
        );

    }


    // ========================================================
    // COMBINE DIE WITH EXISTING EXPRESSION
    // ========================================================
    //
    // Examples:
    //
    // d4 + d6  + d4  -> 2d4 + d6
    // 2d6      + d6  -> 3d6
    // d8       + d4  -> d8 + d4
    //
    // If the same die already appears more than once, all of
    // those matching terms are consolidated.
    // ========================================================

    function combineDieWithExpression(
        expression,
        addedDie
    ) {

        const base =
            String(
                expression ??
                ""
            ).trim();


        const die =
            String(
                addedDie ??
                ""
            )
                .trim()
                .toLowerCase();


        if (
            !base
        ) {

            return die;

        }


        if (
            !die
        ) {

            return base;

        }


        // ----------------------------------------------------
        // GET DIE SIZE
        // ----------------------------------------------------

        const addedMatch =
            die.match(
                /^(\d*)d(\d+)$/
            );


        if (
            !addedMatch
        ) {

            return (
                base +
                " + " +
                die
            );

        }


        const addedCount =
            Number(
                addedMatch[
                    1
                ]
            ) || 1;


        const addedSides =
            Number(
                addedMatch[
                    2
                ]
            );


        // ----------------------------------------------------
        // SPLIT ADDITIVE TERMS
        // ----------------------------------------------------

        const terms =
            base
                .split(
                    /\s*\+\s*/
                )
                .map(
                    function (
                        term
                    ) {

                        return term.trim();

                    }
                );


        let totalMatchingDice =
            addedCount;


        let firstMatchingIndex =
            -1;


        const removeIndexes =
            new Set();


        // ----------------------------------------------------
        // FIND MATCHING DICE
        // ----------------------------------------------------

        terms.forEach(
            function (
                term,
                index
            ) {

                const match =
                    term.match(
                        /^(\d*)d(\d+)$/i
                    );


                if (
                    !match
                ) {

                    return;

                }


                const count =
                    Number(
                        match[
                            1
                        ]
                    ) || 1;


                const sides =
                    Number(
                        match[
                            2
                        ]
                    );


                if (
                    sides !==
                    addedSides
                ) {

                    return;

                }


                totalMatchingDice +=
                    count;


                if (
                    firstMatchingIndex ===
                    -1
                ) {

                    firstMatchingIndex =
                        index;

                }

                else {

                    removeIndexes.add(
                        index
                    );

                }

            }
        );


        // ----------------------------------------------------
        // NO MATCHING DIE EXISTS
        // ----------------------------------------------------

        if (
            firstMatchingIndex ===
            -1
        ) {

            terms.push(
                addedDie
            );


            return terms.join(
                " + "
            );

        }


        // ----------------------------------------------------
        // REPLACE FIRST MATCH WITH COMBINED DIE
        // ----------------------------------------------------

        terms[
            firstMatchingIndex
        ] =
            (
                totalMatchingDice ===
                    1
                        ? ""
                        : totalMatchingDice
            ) +
            "d" +
            addedSides;


        // ----------------------------------------------------
        // REMOVE EXTRA MATCHING TERMS
        // ----------------------------------------------------

        const combinedTerms =
            terms.filter(
                function (
                    term,
                    index
                ) {

                    return (
                        !removeIndexes.has(
                            index
                        )
                    );

                }
            );


        return combinedTerms.join(
            " + "
        );

    }


    // ========================================================
    // APPEND / COMBINE VERSATILE DIE
    // ========================================================

    function appendVersatileDie(
        value,
        instanceId
    ) {

        const base =
            String(
                value ??
                ""
            ).trim();


        const versatile =
            getVersatileDie(
                instanceId
            );


        if (
            !versatile
        ) {

            return base;

        }


        return combineDieWithExpression(
            base,
            versatile
        );

    }


    // ========================================================
    // IS ARM WOUNDED?
    // ========================================================

    function isArmWounded(
        side
    ) {

        const derived =
            state &&
            state.derived
                ? state.derived
                : {};


        if (
            side ===
            "left"
        ) {

            return (
                Number(
                    derived.leftArmWounds
                ) || 0
            ) > 0;

        }


        if (
            side ===
            "right"
        ) {

            return (
                Number(
                    derived.rightArmWounds
                ) || 0
            ) > 0;

        }


        return false;

    }


    // ========================================================
    // GET ARM-INJURY PENALTY FOR WIELDED INSTANCE
    // ========================================================

    function getArmInjuryPenalty(
        instanceId
    ) {

        if (
            !instanceId
        ) {

            return 0;

        }


        const gear =
            getGear();


        const derived =
            state.derived ||
            {};


        const leftPenalty =
            Math.max(
                0,
                Number(
                    derived.leftArmInjuries
                ) || 0
            );


        const rightPenalty =
            Math.max(
                0,
                Number(
                    derived.rightArmInjuries
                ) || 0
            );


        let penalty =
            0;


        // ----------------------------------------------------
        // LEFT ARM
        // ----------------------------------------------------

        if (
            gear.leftHand ===
                instanceId ||
            gear.leftHandBuckler ===
                instanceId
        ) {

            penalty +=
                leftPenalty;

        }


        // ----------------------------------------------------
        // RIGHT ARM
        // ----------------------------------------------------

        if (
            gear.rightHand ===
                instanceId ||
            gear.rightHandBuckler ===
                instanceId
        ) {

            penalty +=
                rightPenalty;

        }


        return penalty;

    }


    // ========================================================
    // APPLY NUMERIC PENALTY TO DISPLAY EXPRESSION
    // ========================================================
    //
    // Examples:
    //
    //     3          - 1 -> 2
    //     0          - 1 -> -1
    //     d8 + 2     - 1 -> d8 + 1
    //     d8 + 1     - 1 -> d8
    //     d8         - 1 -> d8 - 1
    //     d8 - 1     - 1 -> d8 - 2
    //
    // ========================================================

    function applyNumericPenalty(
        value,
        penalty
    ) {

        const amount =
            Math.max(
                0,
                Number(
                    penalty
                ) || 0
            );


        if (
            amount ===
            0
        ) {

            return value;

        }


        const base =
            String(
                value ??
                ""
            ).trim();


        if (
            !base
        ) {

            return "";

        }


        // ----------------------------------------------------
        // PURE NUMBER
        // ----------------------------------------------------

        const numericBase =
            Number(
                base
            );


        if (
            Number.isFinite(
                numericBase
            )
        ) {

            return (
                numericBase -
                amount
            );

        }


        // ----------------------------------------------------
        // EXISTING TRAILING NUMERIC MODIFIER
        // ----------------------------------------------------

        const modifierMatch =
            base.match(
                /^(.*?)([+-])\s*(\d+(?:\.\d+)?)\s*$/
            );


        if (
            modifierMatch
        ) {

            const expression =
                modifierMatch[
                    1
                ].trim();


            const existingModifier =
                Number(
                    modifierMatch[
                        3
                    ]
                ) *
                (
                    modifierMatch[
                        2
                    ] === "-"
                        ? -1
                        : 1
                );


            const finalModifier =
                existingModifier -
                amount;


            if (
                finalModifier ===
                0
            ) {

                return expression;

            }


            if (
                finalModifier >
                0
            ) {

                return (
                    expression +
                    " + " +
                    finalModifier
                );

            }


            return (
                expression +
                " - " +
                Math.abs(
                    finalModifier
                )
            );

        }


        // ----------------------------------------------------
        // NO EXISTING NUMERIC MODIFIER
        // ----------------------------------------------------

        return (
            base +
            " - " +
            amount
        );

    }


    // ========================================================
    // DYNAMIC DEFENSE VALUE
    // ========================================================

    function getDisplayedDefenseValue(
        instanceId,
        defenseName,
        value
    ) {

        let displayedValue =
            value;


        if (
            String(
                defenseName
            ).toLowerCase() ===
                "parry"
        ) {

            displayedValue =
                appendVersatileDie(
                    value,
                    instanceId
                );

        }


        return applyNumericPenalty(
            displayedValue,
            getArmInjuryPenalty(
                instanceId
            )
        );

    }


    // ========================================================
    // DYNAMIC STRIKE VALUE
    // ========================================================
    //
    // Order:
    //
    //     Base damage
    //     + Versatile die, when applicable
    //     + Might
    // ========================================================

    function getDisplayedStrikeValue(
        instanceId,
        damage
    ) {

        const withVersatile =
            appendVersatileDie(
                damage,
                instanceId
            );


        const withMight =
            appendMightToDamage(
                withVersatile
            );


        return applyNumericPenalty(
            withMight,
            getArmInjuryPenalty(
                instanceId
            )
        );

    }


    // ============================================================
    // PART 3 OF 12 — DURABILITY, SHIELD INTEGRITY
    //                & EQUIPMENT / LOCATION ACCESS
    // ============================================================


    // ========================================================
    // GET BUILDER INSTANCES
    // ========================================================
    //
    // Keep this specifically for systems that genuinely need
    // builder-source equipment.
    // ========================================================

    function getBuilderInstances() {

        if (
            typeof KKState.getBuilderInstances ===
                "function"
        ) {

            return (
                KKState.getBuilderInstances(
                    state
                ) ||
                []
            );

        }


        console.error(
            "KKState.getBuilderInstances() is unavailable."
        );


        return [];

    }


    // ========================================================
    // GET ALL GEAR-SHEET INSTANCES
    // ========================================================
    //
    // IMPORTANT:
    //
    // Picked-up items use source: "pickup", so they are not
    // guaranteed to appear in getBuilderInstances().
    //
    // We therefore combine:
    //
    //     1. Builder instances
    //     2. Every instance currently referenced by the
    //        Gear Sheet
    //
    // Duplicate instance IDs are automatically removed.
    // ========================================================

    function getGearSheetInstances() {

        const instancesById =
            new Map();


        // ----------------------------------------------------
        // BUILDER INSTANCES
        // ----------------------------------------------------

        getBuilderInstances()
            .forEach(
                function (
                    instance
                ) {

                    if (
                        instance &&
                        instance.id
                    ) {

                        instancesById.set(
                            instance.id,
                            instance
                        );

                    }

                }
            );


        // ----------------------------------------------------
        // CURRENT GEAR LOCATIONS
        // ----------------------------------------------------

        const gear =
            getGear() ||
            {};


        const locationKeys = [

            "leftHand",
            "rightHand",

            "leftHandBuckler",
            "rightHandBuckler",

            "leftSidearm",
            "rightSidearm",

            "leftGigue",
            "rightGigue",

            "leftBuckler",
            "rightBuckler"

        ];


        locationKeys.forEach(
            function (
                key
            ) {

                const instanceId =
                    gear[
                        key
                    ];


                if (
                    !instanceId ||
                    instancesById.has(
                        instanceId
                    )
                ) {

                    return;

                }


                const instance =
                    getItem(
                        instanceId
                    );


                if (
                    instance &&
                    instance.id
                ) {

                    instancesById.set(
                        instance.id,
                        instance
                    );

                }

            }
        );


        return Array.from(
            instancesById.values()
        );

    }


    // ========================================================
    // GET STARTING DURABILITY / INTEGRITY
    // ========================================================

    function getStartingDurability(
        instance
    ) {

        if (
            !instance
        ) {

            return 0;

        }


        if (
            itemHasModification(
                instance,
                "reinforced"
            ) &&
            !instanceIsShield(
                instance
            )
        ) {

            return 2;

        }


        const definition =
            getDefinition(
                instance
            ) ||
            {};


        const candidates = [

            definition.durability,

            definition.startingDurability,

            definition.starting_durability,

            definition.baseDurability,

            definition.base_durability

        ];


        for (
            const candidate of
            candidates
        ) {

            if (
                candidate ===
                    undefined ||
                candidate ===
                    null ||
                candidate ===
                    ""
            ) {

                continue;

            }


            const value =
                Number(
                    candidate
                );


            if (
                Number.isFinite(
                    value
                )
            ) {

                const reinforcedBonus =
                    itemHasModification(
                        instance,
                        "reinforced"
                    ) &&
                    instanceIsShield(
                        instance
                    )
                        ? 1
                        : 0;


                const centerGripPenalty =
                    itemHasModification(
                        instance,
                        "center-grip"
                    )
                        ? 1
                        : 0;


                return Math.max(
                    0,
                    value +
                        reinforcedBonus -
                        centerGripPenalty
                );

            }

        }


        return 0;

    }


    // ========================================================
    // ITEM HAS CONDITION
    // ========================================================

    function definitionHasDurability(
        instance
    ) {

        if (
            !instance
        ) {

            return false;

        }


        const definition =
            getDefinition(
                instance
            ) ||
            {};


        return (
            definition.durability !==
                undefined ||
            definition.startingDurability !==
                undefined ||
            definition.starting_durability !==
                undefined ||
            definition.baseDurability !==
                undefined ||
            definition.base_durability !==
                undefined
        );

    }


    // ========================================================
    // INSTANCE IS SHIELD
    // ========================================================

    function instanceIsShield(
        instance
    ) {

        if (
            !instance
        ) {

            return false;

        }


        const definition =
            getDefinition(
                instance
            ) ||
            {};


        return Boolean(
            definition.shield ===
                true ||
            instance.shield ===
                true
        );

    }


        function itemUsesIntegrity(
        instance
    ) {

        if (
            !instance ||
            instance.itemId ===
                "buckler"
        ) {

            return false;

        }


        return Boolean(
            instanceIsShield(
                instance
            ) ||
            itemHasModification(
                instance,
                "reinforced"
            )
        );

    }


    // ========================================================
    // ENSURE ORDINARY DURABILITY
    // ========================================================

    function ensureInstanceDurability(
        instance
    ) {

        if (
            !instance
        ) {

            return 0;

        }


        // ----------------------------------------------------
        // SHIELDS USE INTEGRITY
        // ----------------------------------------------------

        if (
            instanceIsShield(
                instance
            )
        ) {

            return ensureShieldIntegrity(
                instance
            );

        }


        if (
            !definitionHasDurability(
                instance
            )
        ) {

            return 0;

        }


        const maximum =
            getStartingDurability(
                instance
            );


        let current =
            Number(
                instance.durability
            );


        // ----------------------------------------------------
        // NEW ITEM
        // ----------------------------------------------------

        if (
            !Number.isFinite(
                current
            )
        ) {

            current =
                maximum;

        }


        current =
            Math.max(
                0,
                Math.min(
                    maximum,
                    current
                )
            );


        instance.durability =
            current;


        return current;

    }


    // ========================================================
    // ENSURE SHIELD INTEGRITY
    // ========================================================
    //
    // Shields use Integrity instead of Durability.
    //
    // null / undefined / "" means Integrity has never been
    // initialized and should start at the Shield's maximum.
    //
    // Existing numeric values, INCLUDING 0, are preserved.
    // ========================================================

    function ensureShieldIntegrity(
        instance
    ) {

        if (
            !instance ||
            !itemUsesIntegrity(
                instance
            )
        ) {

            return 0;

        }


        const maximum =
            getStartingDurability(
                instance
            );


        // ====================================================
        // DOES THIS SHIELD ALREADY HAVE REAL INTEGRITY?
        // ====================================================

        const hasValidIntegrity =
            (
                instance.integrity !==
                    null &&
                instance.integrity !==
                    undefined &&
                instance.integrity !==
                    "" &&
                Number.isFinite(
                    Number(
                        instance.integrity
                    )
                )
            );


        let current;


        // ====================================================
        // EXISTING INTEGRITY
        // ====================================================
        //
        // A genuine 0 must remain 0.
        // ====================================================

        if (
            hasValidIntegrity
        ) {

            current =
                Number(
                    instance.integrity
                );

        }


        // ====================================================
        // NEW / UNINITIALIZED SHIELD
        // ====================================================

        else {

            const hasLegacyDurability =
                (
                    instance.durability !==
                        null &&
                    instance.durability !==
                        undefined &&
                    instance.durability !==
                        "" &&
                    Number.isFinite(
                        Number(
                            instance.durability
                        )
                    ) &&
                    Number(
                        instance.durability
                    ) > 0
                );


            // ------------------------------------------------
            // MIGRATE OLD SHIELD DURABILITY
            // ------------------------------------------------

            if (
                hasLegacyDurability
            ) {

                current =
                    Number(
                        instance.durability
                    );

            }


            // ------------------------------------------------
            // BRAND-NEW SHIELD
            // ------------------------------------------------

            else {

                current =
                    maximum;

            }

        }


        // ====================================================
        // CLAMP TO LEGAL RANGE
        // ====================================================

        current =
            Math.max(
                0,
                Math.min(
                    maximum,
                    current
                )
            );


        instance.integrity =
            current;


        return current;

    }


    // ========================================================
    // GET SHIELD INTEGRITY
    // ========================================================

    function getShieldIntegrity(
        instanceId
    ) {

        const instance =
            getItem(
                instanceId
            );


        if (
            !instance ||
            !itemUsesIntegrity(
                instance
            )
        ) {

            return 0;

        }


        return ensureShieldIntegrity(
            instance
        );

    }


    // ========================================================
    // GET SHIELD MAXIMUM INTEGRITY
    // ========================================================

    function getShieldMaximumIntegrity(
        instanceId
    ) {

        const instance =
            getItem(
                instanceId
            );


        if (
            !instance ||
            !itemUsesIntegrity(
                instance
            )
        ) {

            return 0;

        }


        return getStartingDurability(
            instance
        );

    }


    // ========================================================
    // CHANGE SHIELD INTEGRITY
    // ========================================================

    function changeShieldIntegrity(
        instanceId,
        amount
    ) {

        const instance =
            getItem(
                instanceId
            );


        if (
            !instance ||
            !itemUsesIntegrity(
                instance
            )
        ) {

            return false;

        }


        const maximum =
            getStartingDurability(
                instance
            );


        const current =
            ensureShieldIntegrity(
                instance
            );


        const next =
            Math.max(
                0,
                Math.min(
                    maximum,
                    current +
                        Number(
                            amount ||
                            0
                        )
                )
            );


        if (
            next ===
            current
        ) {

            return false;

        }


        instance.integrity =
            next;


        return true;

    }


    // ========================================================
    // CHANGE ORDINARY DURABILITY
    // ========================================================

    function changeDurability(
        instanceId,
        amount
    ) {

        const instance =
            getItem(
                instanceId
            );


        if (
            !instance
        ) {

            return false;

        }


                if (
            instanceIsShield(
                instance
            )
        ) {

            return changeShieldIntegrity(
                instanceId,
                amount
            );

        }


        if (
            !definitionHasDurability(
                instance
            )
        ) {

            return false;

        }


        const maximum =
            getStartingDurability(
                instance
            );


        const current =
            ensureInstanceDurability(
                instance
            );


        const next =
            Math.max(
                0,
                Math.min(
                    maximum,
                    current +
                        Number(
                            amount ||
                            0
                        )
                )
            );


        if (
            next ===
            current
        ) {

            return false;

        }


        instance.durability =
            next;


        return true;

    }


    // ========================================================
    // ENSURE ALL VISIBLE EQUIPMENT CONDITION VALUES
    // ========================================================
    //
    // This deliberately uses getGearSheetInstances(), NOT
    // getBuilderInstances(), so picked-up equipment is included.
    // ========================================================

    function ensureAllDurabilityValues() {

        const instances =
            getGearSheetInstances();


        instances.forEach(
            function (instance) {

                if (
                    !instance
                ) {

                    return;

                }


                if (
                    itemUsesIntegrity(
                        instance
                    )
                ) {

                    ensureShieldIntegrity(
                        instance
                    );

                }

                else {

                    ensureInstanceDurability(
                        instance
                    );

                }

            }
        );

    }


    // ========================================================
    // ITEM HAS DURABILITY / INTEGRITY
    // ========================================================

        function itemHasDurability(
        instance
    ) {

        if (
            !instance ||
            instance.itemId ===
                "buckler"
        ) {

            return false;

        }


        return (
            definitionHasDurability(
                instance
            ) ||
            itemHasModification(
                instance,
                "reinforced"
            )
        );

    }


    // ========================================================
    // LOCATION KEYS
    // ========================================================

    function handKey(
        side
    ) {

        return (
            side ===
            "left"
                ? "leftHand"
                : "rightHand"
        );

    }


    function handBucklerKey(
        side
    ) {

        return (
            side ===
            "left"
                ? "leftHandBuckler"
                : "rightHandBuckler"
        );

    }


    function sidearmKey(
        side
    ) {

        return (
            side ===
            "left"
                ? "leftSidearm"
                : "rightSidearm"
        );

    }


    function gigueKey(
        side
    ) {

        return (
            side ===
            "left"
                ? "leftGigue"
                : "rightGigue"
        );

    }


    function bucklerKey(
        side
    ) {

        return (
            side ===
            "left"
                ? "leftBuckler"
                : "rightBuckler"
        );

    }


    // ========================================================
    // GET OPPOSITE SIDE
    // ========================================================

    function oppositeSide(
        side
    ) {

        return (
            side ===
            "left"
                ? "right"
                : "left"
        );

    }


    // ========================================================
    // HAND FREE
    // ========================================================

    function isHandFree(
    side
) {

    // ----------------------------------------------------
    // WOUNDED ARM CANNOT BE USED
    // ----------------------------------------------------

    if (
        isArmWounded(
            side
        )
    ) {

        return false;

    }


    const gear =
        getGear();


    return Boolean(

        !gear[
            handKey(
                side
            )
        ] &&

        !gear[
            handBucklerKey(
                side
            )
        ]

    );

}


    // ========================================================
    // SIDEARM SLOT FREE
    // ========================================================

    function isSidearmSlotFree(
        side
    ) {

        return !getGear()[
            sidearmKey(
                side
            )
        ];

    }


    // ========================================================
    // BUCKLER SLOT FREE
    // ========================================================

    function isBucklerSlotFree(
        side
    ) {

        return !getGear()[
            bucklerKey(
                side
            )
        ];

    }


    // ========================================================
    // GIGUE SLOT FREE
    // ========================================================

    function isGigueSlotFree(
        side
    ) {

        return !getGear()[
            gigueKey(
                side
            )
        ];

    }


    // ========================================================
    // GET SIDEARM ITEM ID
    // ========================================================

    function getSidearmItemId(
        side
    ) {

        return (
            getGear()[
                sidearmKey(
                    side
                )
            ] ||
            null
        );

    }


    // ========================================================
    // GET BUCKLER INSTANCE ID
    // ========================================================

    function getBucklerInstanceId(
        side
    ) {

        return (
            getGear()[
                bucklerKey(
                    side
                )
            ] ||
            null
        );

    }


    // ========================================================
    // GET GIGUE SHIELD ID
    // ========================================================

    function getGigueShieldId(
        side = null
    ) {

        const gear =
            getGear();


        if (
            side ===
            "left"
        ) {

            return (
                gear.leftGigue ||
                null
            );

        }


        if (
            side ===
            "right"
        ) {

            return (
                gear.rightGigue ||
                null
            );

        }


        return (
            gear.leftGigue ||
            gear.rightGigue ||
            null
        );

    }


    // ========================================================
    // IS WIELDED WITH BOTH HANDS
    // ========================================================

    function isWieldedWithBothHands(
        instanceId
    ) {

        if (
            !instanceId
        ) {

            return false;

        }


        const gear =
            getGear();


        return (

            gear.leftHand ===
                instanceId &&

            gear.rightHand ===
                instanceId

        );

    }


    // ========================================================
    // GET DISPLAYED ITEM NAME
    // ========================================================

    function getDisplayedItemName(
        instance
    ) {

        if (
            !instance
        ) {

            return "";

        }


        const definition =
            getDefinition(
                instance
            ) ||
            {};


        let name =
            definition.name ||
            instance.name ||
            instance.itemId ||
            "";


        const inherentlyTwoHanded =
            Number(
                definition.hands
            ) ===
            2;


        const currentlyUsingTwoHands =
            isWieldedWithBothHands(
                instance.id
            );


                    if (
            Object.keys(state.builder.modifications || {})
                .some(function (key) {
                    return itemHasModification(instance, key);
                })
        ) {

            name += "*";

        }


        if (
            inherentlyTwoHanded ||
            currentlyUsingTwoHands
        ) {

            name +=
                " (2H)";

        }


        return name;

    }


    // ========================================================
    // CLEAR STALE LOCATION REFERENCES
    // ========================================================

    function cleanStaleLocations() {

        const gear =
            getGear();


        const keys = [

            "leftHand",
            "rightHand",

            "leftHandBuckler",
            "rightHandBuckler",

            "leftSidearm",
            "rightSidearm",

            "leftGigue",
            "rightGigue",

            "leftBuckler",
            "rightBuckler"

        ];


        let changed =
            false;


        keys.forEach(
            function (key) {

                const instanceId =
                    gear[key];


                if (
                    instanceId &&
                    !getItem(
                        instanceId
                    )
                ) {

                    gear[key] =
                        null;


                    changed =
                        true;

                }

            }
        );


        return changed;

    }


    // ============================================================
    // PART 4 OF 12 — SHIELD SIDE RULES, PLACEMENT
    //                & GIGUE / TWO-HANDED COMPATIBILITY
    // ============================================================


    // ========================================================
    // SIDE HAS GIGUE SHIELD
    // ========================================================

    function sideHasGigueShield(
        side
    ) {

        const instanceId =
            getGear()[
                gigueKey(
                    side
                )
            ];


        return Boolean(
            instanceId &&
            isShield(
                instanceId
            )
        );

    }


    // ========================================================
    // ANY GIGUE SHIELD ACTIVE
    // ========================================================

    function hasAnyGigueShield() {

        return Boolean(

            sideHasGigueShield(
                "left"
            ) ||

            sideHasGigueShield(
                "right"
            )

        );

    }


    // ========================================================
    // GET ACTIVE GIGUE SIDE
    // ========================================================

    function getActiveGigueSide() {

        if (
            sideHasGigueShield(
                "left"
            )
        ) {

            return "left";

        }


        if (
            sideHasGigueShield(
                "right"
            )
        ) {

            return "right";

        }


        return null;

    }


    // ========================================================
    // SIDE HAS SHIELD
    // ========================================================
    //
    // One side may contain only ONE Shield total.
    //
    // Shield locations counted:
    //
    //     main hand
    //     legacy hand-Buckler
    //     Gigue
    //     Swashbuckling/Buckler storage
    //
    // The ignored instance lets a Shield move between legal
    // locations on its own side without conflicting with itself.
    // ========================================================

    function sideHasShield(
        side,
        ignoredInstanceId = null
    ) {

        const gear =
            getGear();


        const ids = [

            gear[
                handKey(
                    side
                )
            ],

            gear[
                handBucklerKey(
                    side
                )
            ],

            gear[
                gigueKey(
                    side
                )
            ],

            gear[
                bucklerKey(
                    side
                )
            ]

        ];


        return ids.some(
            function (
                instanceId
            ) {

                if (
                    !instanceId ||
                    instanceId ===
                        ignoredInstanceId
                ) {

                    return false;

                }


                return isShield(
                    instanceId
                );

            }
        );

    }


    // ========================================================
    // SIDE HAS OTHER SHIELD
    // ========================================================

    function sideHasOtherShield(
        side,
        instanceId
    ) {

        return sideHasShield(
            side,
            instanceId
        );

    }


    // ========================================================
    // COUNT OWNED SHIELDS
    // ========================================================
    //
    // IMPORTANT:
    //
    // This must include pickup-source Shields as well as
    // builder-source Shields.
    // ========================================================

    function countOwnedShields() {

        return getGearSheetInstances()
            .filter(
                function (
                    instance
                ) {

                    return Boolean(
                        instance &&
                        instanceIsShield(
                            instance
                        )
                    );

                }
            )
            .length;

    }


    // ========================================================
    // CAN OWN ANOTHER SHIELD
    // ========================================================

    function canOwnAnotherShield() {

        return (
            countOwnedShields() <
            2
        );

    }


    // ========================================================
    // ENFORCE TWO-SHIELD OWNERSHIP LIMIT
    // ========================================================
    //
    // This is primarily a repair rule for malformed/older state.
    //
    // Normal purchases and pickups should be rejected before a
    // third Shield is created.
    // ========================================================

    function enforceShieldOwnershipLimit() {

        const shields =
            getGearSheetInstances()
                .filter(
                    function (
                        instance
                    ) {

                        return Boolean(
                            instance &&
                            instanceIsShield(
                                instance
                            )
                        );

                    }
                );


        if (
            shields.length <=
            2
        ) {

            return false;

        }


        let changed =
            false;


        shields
            .slice(
                2
            )
            .forEach(
                function (
                    instance
                ) {

                    if (
                        !instance ||
                        !instance.id
                    ) {

                        return;

                    }


                    clearInstanceFromLocations(
                        instance.id
                    );


                    KKState
                        .removeOwnedEquipmentInstance(
                            state,
                            instance.id
                        );


                    changed =
                        true;

                }
            );


        return changed;

    }


    // ========================================================
    // CAN SHIELD USE SIDE
    // ========================================================

    function canShieldUseSide(
        instanceId,
        side
    ) {

        if (
            !instanceId
        ) {

            return false;

        }


        if (
            !isShield(
                instanceId
            )
        ) {

            return true;

        }


        return !sideHasOtherShield(
            side,
            instanceId
        );

    }


    // ========================================================
    // CAN ITEM OCCUPY MAIN HAND
    // ========================================================
    //
    // GIGUE RULE:
    //
    // If a Shield is Gigued on a side, that side's main slot
    // may only be occupied as part of a weapon being wielded
    // with BOTH hands.
    //
    // Therefore:
    //
    //     Gigue + one-handed weapon on same side = NO
    //
    //     Gigue + another Shield on same side    = NO
    //
    //     Gigue + weapon occupying both hands    = YES
    //
    // `asTwoHanded` allows us to test the intended final state
    // before both hand locations have actually been written.
    // ========================================================

    function canItemOccupyMainHand(
        instanceId,
        side,
        asTwoHanded = false
    ) {

        if (
            !instanceId
        ) {

            return false;

        }


        const instance =
            getItem(
                instanceId
            );


        if (
            !instance
        ) {

            return false;

        }


                // ----------------------------------------------------
        // SHIELD SIDE RULE
        // ----------------------------------------------------

        if (
            isShield(
                instanceId
            ) &&
            !canShieldUseSide(
                instanceId,
                side
            )
        ) {

            return false;

        }


        // ----------------------------------------------------
        // GIGUE SIDE RULE
        // ----------------------------------------------------

        if (
            sideHasGigueShield(
                side
            )
        ) {

            // ------------------------------------------------
            // ANOTHER SHIELD MAY NEVER SHARE THE SIDE
            // ------------------------------------------------

            if (
                isShield(
                    instanceId
                )
            ) {

                return false;

            }


            // ------------------------------------------------
            // NON-SHIELD MUST BE USING BOTH HANDS
            // ------------------------------------------------

            if (
                !asTwoHanded &&
                !isWieldedWithBothHands(
                    instanceId
                )
            ) {

                return false;

            }

        }


        return true;

    }


    // ========================================================
    // CAN PLACE ITEM IN ONE HAND
    // ========================================================

    function canPlaceInHand(
        instanceId,
        side
    ) {

        if (
            !instanceId
        ) {

            return false;

        }


        const gear =
            getGear();


        const currentMainId =
            gear[
                handKey(
                    side
                )
            ];


        const currentBucklerId =
            gear[
                handBucklerKey(
                    side
                )
            ];


        // ----------------------------------------------------
        // ANOTHER MAIN ITEM IS ALREADY THERE
        // ----------------------------------------------------

        if (
            currentMainId &&
            currentMainId !==
                instanceId
        ) {

            return false;

        }


        // ----------------------------------------------------
        // LEGACY BUCKLER OCCUPIES HAND
        // ----------------------------------------------------

        if (
            currentBucklerId &&
            currentBucklerId !==
                instanceId
        ) {

            return false;

        }


        return canItemOccupyMainHand(
            instanceId,
            side,
            false
        );

    }


        // ========================================================
    // CAN ITEM OCCUPY BOTH HANDS
    // ========================================================
    //
    // Gigue does NOT consume a main-hand slot when a weapon
    // genuinely occupies BOTH main-hand locations.
    //
    // Therefore these are legal:
    //
    //     true 2H weapon + Gigue
    //     versatile weapon in (2H) state + Gigue
    //
    // A real weapon / legacy hand Buckler occupying either
    // hand still blocks the placement.
    // ========================================================

    function canPlaceInBothHands(
        instanceId
    ) {

        if (!instanceId) {
            return false;
        }

// ====================================================
// ARM WOUNDS
// ====================================================

if (
    isArmWounded(
        "left"
    ) ||
    isArmWounded(
        "right"
    )
) {

    return false;

}


        const instance =
            getItem(
                instanceId
            );


        if (!instance) {
            return false;
        }


        // ====================================================
        // SHIELDS NEVER OCCUPY BOTH MAIN HANDS
        // ====================================================

        if (
            isShield(
                instanceId
            )
        ) {
            return false;
        }


        const gear =
            getGear();


        // ====================================================
        // LEFT MAIN HAND
        // ====================================================

        if (
            gear.leftHand &&
            gear.leftHand !==
                instanceId
        ) {
            return false;
        }


        // ====================================================
        // RIGHT MAIN HAND
        // ====================================================

        if (
            gear.rightHand &&
            gear.rightHand !==
                instanceId
        ) {
            return false;
        }


        // ====================================================
        // LEGACY HAND-BUCKLER OCCUPANTS
        // ====================================================

        if (
            gear.leftHandBuckler &&
            gear.leftHandBuckler !==
                instanceId
        ) {
            return false;
        }


        if (
            gear.rightHandBuckler &&
            gear.rightHandBuckler !==
                instanceId
        ) {
            return false;
        }


        // ====================================================
        // IMPORTANT: DO NOT REJECT GIGUE HERE
        // ====================================================
        //
        // We deliberately do NOT call:
        //
        //     canPlaceInHand()
        //     getLegalSingleHandSides()
        //
        // because those represent ONE-HANDED occupancy.
        //
        // A Gigued shield may coexist with this item precisely
        // because this is a genuine BOTH-HANDS state.
        // ====================================================


        return true;
    }


    // ========================================================
    // CLEAR INSTANCE FROM ALL LOCATIONS
    // ========================================================

    function clearInstanceFromLocations(
        instanceId
    ) {

        if (
            !instanceId
        ) {

            return false;

        }


        const gear =
            getGear();


        const keys = [

            "leftHand",
            "rightHand",

            "leftHandBuckler",
            "rightHandBuckler",

            "leftSidearm",
            "rightSidearm",

            "leftGigue",
            "rightGigue",

            "leftBuckler",
            "rightBuckler"

        ];


        let changed =
            false;


        keys.forEach(
            function (
                key
            ) {

                if (
                    gear[
                        key
                    ] ===
                    instanceId
                ) {

                    gear[
                        key
                    ] =
                        null;


                    changed =
                        true;

                }

            }
        );


        return changed;

    }


    // ========================================================
    // PLACE ONE-HANDED ITEM
    // ========================================================

    function placeOneHandedItem(
        instanceId,
        preferredSide = null
    ) {

        if (
            !instanceId
        ) {

            return false;

        }


        const instance =
            getItem(
                instanceId
            );


        if (
            !instance
        ) {

            return false;

        }


        // ----------------------------------------------------
        // SHIELDS
        // ----------------------------------------------------
        //
        // When originally placed without a requested side,
        // Shields prefer LEFT.
        //
        // When a side IS explicitly requested — such as Pickup
        // — that side is attempted first.
        //
        // A Shield cannot use a side already containing another
        // wielded, Gigued, or stowed Shield.
        // ----------------------------------------------------

        if (
            isShield(
                instanceId
            )
        ) {

            const shieldSides =
                preferredSide
                    ? [
                        preferredSide,
                        oppositeSide(
                            preferredSide
                        )
                    ]
                    : [
                        "left",
                        "right"
                    ];


            for (
                const side of
                shieldSides
            ) {

                if (
                    sideHasOtherShield(
                        side,
                        instanceId
                    )
                ) {

                    continue;

                }


                if (
                    !isHandFree(
                        side
                    )
                ) {

                    continue;

                }


                if (
                    !canPlaceInHand(
                        instanceId,
                        side
                    )
                ) {

                    continue;

                }


                clearInstanceFromLocations(
                    instanceId
                );


                getGear()[
                    handKey(
                        side
                    )
                ] =
                    instanceId;


                return true;

            }


            return false;

        }


        // ----------------------------------------------------
        // ORDINARY ONE-HANDED ITEM
        // ----------------------------------------------------

        const sides =
            preferredSide
                ? [
                    preferredSide,
                    oppositeSide(
                        preferredSide
                                            )
                ]
                : [
                    "right",
                    "left"
                ];


        for (
            const side of
            sides
        ) {

            if (
    !isHandFree(
        side
    )
) {

    continue;

}


// ----------------------------------------------------
// DUAL WIELDING
// ----------------------------------------------------
//
// Without DUAL WIELDING, an ordinary weapon cannot
// be placed into one active hand while a different
// weapon already occupies the opposite active hand.
//

if (
    wouldCreateIllegalDualWield(
        instanceId,
        side
    )
) {

    continue;

}


if (
    !canPlaceInHand(
        instanceId,
        side
    )
) {

    continue;

}


            clearInstanceFromLocations(
                instanceId
            );


            getGear()[
                handKey(
                    side
                )
            ] =
                instanceId;


            return true;

        }


        return false;

    }


    // ========================================================
    // PLACE TWO-HANDED ITEM
    // ========================================================

    function placeTwoHandedItem(
        instanceId
    ) {

        if (
            !instanceId
        ) {

            return false;

        }


        if (
            !canPlaceInBothHands(
                instanceId
            )
        ) {

            return false;

        }


        clearInstanceFromLocations(
            instanceId
        );


        const gear =
            getGear();


        gear.leftHand =
            instanceId;


        gear.rightHand =
            instanceId;


        return true;

    }


    // ========================================================
    // GET LEGAL ONE-HAND DESTINATIONS
    // ========================================================

    function getLegalSingleHandSides(
        instanceId
    ) {

        if (
            !instanceId
        ) {

            return [];

        }


        const gear =
            getGear();


        const legalSides =
            [];


        [
            "left",
            "right"
        ].forEach(
            function (
                side
            ) {

                // ------------------------------------------------
                // GIGUE SIDE CANNOT HOLD IT ONE-HANDED
                // ------------------------------------------------

                if (
                    sideHasGigueShield(
                        side
                    )
                ) {

                    return;

                }


                const mainId =
                    gear[
                        handKey(
                            side
                        )
                    ];


                const bucklerId =
                    gear[
                        handBucklerKey(
                            side
                        )
                    ];


                // ------------------------------------------------
                // CURRENT TWO-HAND WEAPON DOES NOT BLOCK ITSELF
                // ------------------------------------------------

                if (
                    mainId &&
                    mainId !==
                        instanceId
                ) {

                    return;

                }


                if (
                    bucklerId &&
                    bucklerId !==
                        instanceId
                ) {

                    return;

                }


                if (
                    !canItemOccupyMainHand(
                        instanceId,
                        side,
                        false
                    )
                ) {

                    return;

                }


                legalSides.push(
                    side
                );

            }
        );


        return legalSides;

    }


    // ========================================================
    // RETURN TWO-HAND-USED ITEM TO ONE HAND
    // ========================================================

    function moveFromBothHandsToOne(
        instanceId,
        preferredSide = null
    ) {

        if (
            !instanceId ||
            !isWieldedWithBothHands(
                instanceId
            )
        ) {

            return false;

        }


        const instance =
            getItem(
                instanceId
            );


        const definition =
            getDefinition(
                instance
            ) ||
            {};


        // ----------------------------------------------------
        // TRUE 2H WEAPONS CANNOT BECOME ONE-HANDED
        // ----------------------------------------------------

        if (
            Number(
                definition.hands
            ) ===
            2
        ) {

            return false;

        }


        let legalSides =
            getLegalSingleHandSides(
                instanceId
            );


        if (
            preferredSide &&
            legalSides.includes(
                preferredSide
            )
        ) {

            legalSides = [

                preferredSide,

                ...legalSides.filter(
                    function (
                        side
                    ) {

                        return (
                            side !==
                            preferredSide
                        );

                    }
                )

            ];

        }


        if (
            legalSides.length ===
            0
        ) {

            return false;

        }


        const destination =
            legalSides[
                0
            ];


        const gear =
            getGear();


        gear.leftHand =
            null;


        gear.rightHand =
            null;


        gear[
            handKey(
                destination
            )
        ] =
            instanceId;


        return true;

    }


        // ========================================================
    // MOVE ELIGIBLE WEAPON INTO BOTH HANDS
    // ========================================================

    function moveIntoBothHands(
        instanceId
    ) {

        if (!instanceId) {
            return false;
        }


        const instance =
            getItem(
                instanceId
            );


        if (!instance) {
            return false;
        }


        const definition =
            getDefinition(
                instance
            ) || {};


        // ====================================================
        // NEVER SHIELDS
        // ====================================================

        if (
            isShield(
                instanceId
            )
        ) {
            return false;
        }


        // ====================================================
        // NEVER SIDEARMS
        // ====================================================
        //
        // Daggers, Shortswords, Falchions, etc. remain 1H.
        // ====================================================

        if (
            isSidearm(
                instanceId
            )
        ) {
            return false;
        }


        // ====================================================
        // TRUE 2H WEAPONS
        // ====================================================
        //
        // These are already legitimate two-handed equipment.
        // ====================================================

        if (
            Number(
                definition.hands
            ) === 2
        ) {

            return placeTwoHandedItem(
                instanceId
            );
        }


        // ====================================================
        // VERSATILE / OPTIONAL 2H WEAPONS
        // ========================================================
        //
        // At present these are the non-Sidearm 1H weapons that
        // your system permits to enter the (2H) state.
        // ====================================================

        if (
            Number(
                definition.hands
            ) !== 1
        ) {
            return false;
        }


        return placeTwoHandedItem(
            instanceId
        );
    }


    // ========================================================
    // REPAIR SHIELD SIDE CONFLICTS
    // ========================================================
    //
    // One side may have ONE Shield.
    //
    // Priority when repairing malformed state:
    //
    //     1. Gigue
    //     2. Swashbuckling storage
    //     3. legacy hand Buckler
    //     4. main hand
    //
    // A conflicting Shield is removed from that LOCATION only.
    // Ownership is not removed here.
    // ========================================================

    function repairShieldSideConflicts() {

        const gear =
            getGear();


        let changed =
            false;
                    [
            "left",
            "right"
        ].forEach(
            function (
                side
            ) {

                const keys = [

                    gigueKey(
                        side
                    ),

                    bucklerKey(
                        side
                    ),

                    handBucklerKey(
                        side
                    ),

                    handKey(
                        side
                    )

                ];


                let keptShieldId =
                    null;


                keys.forEach(
                    function (
                        key
                    ) {

                        const instanceId =
                            gear[
                                key
                            ];


                        if (
                            !instanceId ||
                            !isShield(
                                instanceId
                            )
                        ) {

                            return;

                        }


                        if (
                            !keptShieldId
                        ) {

                            keptShieldId =
                                instanceId;

                            return;

                        }


                        // ----------------------------------------
                        // DUPLICATE REFERENCE TO SAME SHIELD
                        // ----------------------------------------

                        if (
                            instanceId ===
                            keptShieldId
                        ) {

                            gear[
                                key
                            ] =
                                null;


                            changed =
                                true;


                            return;

                        }


                        // ----------------------------------------
                        // DIFFERENT SHIELD ON SAME SIDE
                        // ----------------------------------------

                        gear[
                            key
                        ] =
                            null;


                        changed =
                            true;

                    }
                );

            }
        );


        return changed;

    }


    // ========================================================
    // REPAIR GIGUE MAIN-HAND RULE
    // ========================================================
    //
    // A main-hand occupant on the Gigue side is legal only if
    // the SAME weapon occupies both main-hand locations.
    // ========================================================

    function repairGigueHandConflicts() {

        const gear =
            getGear();


        let changed =
            false;


        [
            "left",
            "right"
        ].forEach(
            function (
                side
            ) {

                if (
                    !sideHasGigueShield(
                        side
                    )
                ) {

                    return;

                }


                const instanceId =
                    gear[
                        handKey(
                            side
                        )
                    ];


                if (
                    !instanceId
                ) {

                    return;

                }


                if (
                    isWieldedWithBothHands(
                        instanceId
                    )
                ) {

                    return;

                }


                gear[
                    handKey(
                        side
                    )
                ] =
                    null;


                changed =
                    true;

            }
        );


        return changed;

    }


    // ============================================================
    // PART 5 OF 12 — SWASHBUCKLING & GIGUE INTERACTIONS
    // ============================================================


    // ========================================================
    // FIND EQUIPPED SIDEARM
    // ========================================================

    function findEquippedSidearm(
        preferredSide
    ) {

        const gear =
            getGear();


        const preferredId =
            gear[
                handKey(
                    preferredSide
                )
            ];


        if (
            preferredId &&
            isSidearm(
                preferredId
            )
        ) {

            return {
                instanceId:
                    preferredId,
                side:
                    preferredSide
            };

        }


        const alternateSide =
            otherSide(
                preferredSide
            );


        const alternateId =
            gear[
                handKey(
                    alternateSide
                )
            ];


        if (
            alternateId &&
            isSidearm(
                alternateId
            )
        ) {

            return {
                instanceId:
                    alternateId,
                side:
                    alternateSide
            };

        }


        return null;

    }


    // ========================================================
    // FIND EQUIPPED BUCKLER ON EXACT SIDE
    // ========================================================

    function findEquippedBuckler(
        side
    ) {

        const gear =
            getGear();


        const instanceId =
            gear[
                handKey(
                    side
                )
            ];


        if (
            instanceId &&
            isBuckler(
                instanceId
            )
        ) {

            return {
                instanceId:
                    instanceId,
                side:
                    side
            };

        }


        return null;

    }


        // ========================================================
    // CAN STOW EQUIPPED BUCKLER IN SWASHBUCKLING?
    // ========================================================

    function canStowBucklerWithSidearm(
    side
) {

    const gear =
        getGear();


    const handId =
        gear[
            handKey(
                side
            )
        ];


    const sidearmId =
        gear[
            sidearmKey(
                side
            )
        ];


    const swashId =
        gear[
            bucklerKey(
                side
            )
        ];


    console.log(
        "SWASH TEST:",
        side,
        {
            swashbuckling:
                hasSwashbuckling(),

            handId:
                handId,

            handIsBuckler:
                Boolean(
                    handId &&
                    isBuckler(
                        handId
                    )
                ),

            sidearmId:
                sidearmId,

            sidearmIsSidearm:
                Boolean(
                    sidearmId &&
                    isSidearm(
                        sidearmId
                    )
                ),

            swashId:
                swashId,

            otherShield:
                handId
                    ? sideHasOtherShield(
                        side,
                        handId
                    )
                    : false
        }
    );


    if (
        !hasSwashbuckling()
    ) {
        return false;
    }


    if (
        swashId
    ) {
        return false;
    }


    if (
        !handId ||
        !isBuckler(
            handId
        )
    ) {
        return false;
    }


    if (
        !sidearmId ||
        !isSidearm(
            sidearmId
        )
    ) {
        return false;
    }


    if (
        sideHasOtherShield(
            side,
            handId
        )
    ) {
        return false;
    }


    return true;
}


    // ========================================================
    // STOW EQUIPPED BUCKLER IN SWASHBUCKLING
    // ========================================================

    function stowBucklerWithSidearm(
        side
    ) {

        if (
            !canStowBucklerWithSidearm(
                side
            )
        ) {
            return false;
        }


        const gear =
            getGear();


        const hand =
            handKey(
                side
            );


        const swash =
            bucklerKey(
                side
            );


        const bucklerId =
            gear[
                hand
            ];


        if (
            !bucklerId ||
            !isBuckler(
                bucklerId
            )
        ) {
            return false;
        }


        // Move ONLY the Buckler.
        // The Sidearm remains in its Sidearm slot.

                gear[
            hand
        ] =
            null;


        gear[
            swash
        ] =
            bucklerId;


        return true;
    }


    // ========================================================
    // DRAW STOWED BUCKLER
    // ========================================================

    function equipStowedBucklerAlone(
        side
    ) {

        if (
            !hasSwashbuckling()
        ) {
            return false;
        }


        const gear =
            getGear();


        const hand =
            handKey(
                side
            );


        const swash =
            bucklerKey(
                side
            );


        const bucklerId =
            gear[
                swash
            ];


        if (
            !bucklerId ||
            !isBuckler(
                bucklerId
            )
        ) {
            return false;
        }


        // The main hand must actually be empty.
        if (
            gear[
                hand
            ]
        ) {
            return false;
        }


        // A Gigued Shield on this same side
        // prevents ordinary one-handed occupancy.
        if (
            sideHasGigueShield(
                side
            )
        ) {
            return false;
        }


        // No other Shield may occupy this side.
        if (
            sideHasOtherShield(
                side,
                bucklerId
            )
        ) {
            return false;
        }


        gear[
            swash
        ] =
            null;


        gear[
            hand
        ] =
            bucklerId;


        return true;
    }


    // ========================================================
    // CAN DRAW PAIRED SIDEARM + BUCKLER?
    // ========================================================
    //
    // The Sidearm is stowed on `side`.
    // The Buckler is paired with that Sidearm.
    //
    // When the Sidearm is drawn:
    //
    //     Sidearm -> its own-side hand
    //     Buckler -> opposite hand
    //
    // This does NOT permanently transfer the Buckler's assigned
    // side. It is simply the temporary wielding arrangement
    // required to hold both objects simultaneously.
    //
    // If both hands cannot accommodate them, the Sidearm may
    // NOT be drawn.
    // ========================================================

    function canDrawPairedSidearm(
        side
    ) {

        if (
            !hasSwashbuckling()
        ) {

            return false;

        }


        const gear =
            getGear();


        const sidearmId =
            gear[
                sidearmKey(
                    side
                )
            ];


        const bucklerId =
            gear[
                bucklerKey(
                    side
                )
            ];


        if (
            !sidearmId ||
            !isSidearm(
                sidearmId
            ) ||
            !bucklerId ||
            !isBuckler(
                bucklerId
            )
        ) {

            return false;

        }


        const weaponSide =
            side;


        const shieldHandSide =
            otherSide(
                side
            );


        // ----------------------------------------------------
        // SIDEARM HAND MUST BE LEGAL
        // ----------------------------------------------------

        if (
            !isHandFree(
                weaponSide
            )
        ) {

            return false;

        }


        if (
            !canItemOccupyMainHand(
                sidearmId,
                weaponSide,
                false
            )
        ) {

            return false;

        }


        // ----------------------------------------------------
        // BUCKLER'S TEMPORARY HAND MUST BE FREE
        // ----------------------------------------------------

        if (
            !isHandFree(
                shieldHandSide
            )
        ) {

            return false;

        }


        // ----------------------------------------------------
        // GIGUE ON THE TEMPORARY BUCKLER HAND BLOCKS IT
        // ----------------------------------------------------

        if (
            sideHasGigueShield(
                shieldHandSide
            )
        ) {

            return false;

        }


        // ----------------------------------------------------
        // NO OTHER SHIELD MAY OCCUPY THAT TEMPORARY HAND SIDE
        // ----------------------------------------------------

        if (
            sideHasOtherShield(
                shieldHandSide,
                bucklerId
            )
        ) {

            return false;

        }


        return true;

    }


    // ========================================================
    // DRAW PAIRED SIDEARM + BUCKLER
    // ========================================================

    function drawPairedSidearm(
        side
    ) {

        if (
            !canDrawPairedSidearm(
                side
            )
        ) {

            return false;

        }


        const gear =
            getGear();


        const sidearmId =
            gear[
                sidearmKey(
                    side
                )
            ];


        const bucklerId =
            gear[
                bucklerKey(
                    side
                )
            ];


        const weaponSide =
            side;


        const shieldHandSide =
            otherSide(
                side
            );


        // ----------------------------------------------------
        // CLEAR STOWED LOCATIONS
        // ----------------------------------------------------

        gear[
            sidearmKey(
                side
            )
        ] =
            null;


        gear[
            bucklerKey(
                side
            )
        ] =
            null;


        // ----------------------------------------------------
        // EQUIP BOTH
        // ----------------------------------------------------

        gear[
            handKey(
                weaponSide
            )
        ] =
            sidearmId;


        gear[
            handKey(
                shieldHandSide
            )
        ] =
            bucklerId;


        return true;

    }


    // ========================================================
    // GIGUE SLOT ELIGIBILITY
    // ========================================================
    //
    // RULES:
    //
    // - Only one Gigue field may be occupied at once.
    // - Only a Shield may enter a Gigue field.
    // - A Shield may only be Gigued from that SAME side.
    // - A Shield may not transfer sides through Gigue.
    // - No other Shield may already exist on that side.
    // - Clicking an occupied Gigue draws its Shield back into
    //   the SAME-side hand.
    // ========================================================

    function canInteractWithGigueSlot(
        side
    ) {

        if (
            !hasGigueStrap()
        ) {

            return false;

        }


        const gear =
            getGear();


        const storedHere =
            gear[
                gigueKey(
                    side
                )
            ];


        const other =
            otherSide(
                side
            );


        const storedElsewhere =
            gear[
                gigueKey(
                    other
                )
            ];


        // ----------------------------------------------------
        // DRAW CURRENT GIGUE SHIELD
        // ----------------------------------------------------

        if (
            storedHere &&
            isShield(
                storedHere
            )
        ) {

            if (!itemHasModification(storedHere, "gigue-strap")) {

                return false;

            }

            if (
                !isHandFree(
                    side
                )
            ) {

                return false;

            }


            if (
                sideHasOtherShield(
                    side,
                    storedHere
                )
            ) {

                return false;

            }


            return true;

        }


        // ----------------------------------------------------
        // OTHER GIGUE SLOT ALREADY OCCUPIED
        // ----------------------------------------------------

        if (
            storedElsewhere &&
            isShield(
                storedElsewhere
            )
        ) {

            return false;

        }


        // ----------------------------------------------------
        // STOW SAME-SIDE EQUIPPED SHIELD
        // ----------------------------------------------------

        const handId =
            gear[
                handKey(
                    side
                )
            ];


        if (
            !handId ||
            !isShield(
                handId
            )
        ) {

            return false;
                    }


        if (!itemHasModification(handId, "gigue-strap")) {

            return false;

        }


        if (
            sideHasOtherShield(
                side,
                handId
            )
        ) {

            return false;

        }


        return true;

    }


    // ========================================================
    // STOW SHIELD IN GIGUE
    // ========================================================

    function stowGigueShield(
        instanceId,
        side
    ) {

        if (
            !instanceId ||
            !isShield(
                instanceId
            )
        ) {

            return false;

        }


        if (
            !hasGigueStrap()
        ) {

            return false;

        }


        if (!itemHasModification(instanceId, "gigue-strap")) {

            return false;

        }


        const gear =
            getGear();


        // ----------------------------------------------------
        // SHIELD MUST CURRENTLY BE WIELDED ON THIS EXACT SIDE
        // ----------------------------------------------------

        if (
            gear[
                handKey(
                    side
                )
            ] !==
            instanceId
        ) {

            return false;

        }


        // ----------------------------------------------------
        // OTHER GIGUE SLOT MUST BE EMPTY
        // ----------------------------------------------------

        const other =
            otherSide(
                side
            );


        if (
            gear[
                gigueKey(
                    other
                )
            ]
        ) {

            return false;

        }


        // ----------------------------------------------------
        // THIS GIGUE SLOT MUST BE EMPTY
        // ----------------------------------------------------

        if (
            gear[
                gigueKey(
                    side
                )
            ]
        ) {

            return false;

        }


        // ----------------------------------------------------
        // NO SECOND SHIELD ON THIS SIDE
        // ----------------------------------------------------

        if (
            sideHasOtherShield(
                side,
                instanceId
            )
        ) {

            return false;

        }


        // ----------------------------------------------------
        // MOVE — NEVER TRANSFER SIDES
        // ----------------------------------------------------

        gear[
            handKey(
                side
            )
        ] =
            null;


        gear[
            gigueKey(
                side
            )
        ] =
            instanceId;


        return true;

    }


    // ========================================================
    // GIGUE SLOT CLICK
    // ========================================================

    function handleGigueSlotClick(
        side
    ) {

        if (
            !hasGigueStrap()
        ) {

            return false;

        }


        const gear =
            getGear();


        const slotKey =
            gigueKey(
                side
            );


        const storedId =
            gear[
                slotKey
            ];


        // ====================================================
        // GIGUE -> SAME-SIDE HAND
        // ====================================================

        if (
            storedId &&
            isShield(
                storedId
            )
        ) {

            if (
                !isHandFree(
                    side
                )
            ) {

                return false;

            }


            if (
                sideHasOtherShield(
                    side,
                    storedId
                )
            ) {

                return false;

            }


            gear[
                slotKey
            ] =
                null;


            gear[
                handKey(
                    side
                )
            ] =
                storedId;


            saveAndRender();


            return true;

        }


        // ====================================================
        // SAME-SIDE HAND -> GIGUE
        // ====================================================

        const handId =
            gear[
                handKey(
                    side
                )
            ];


        if (
            !handId ||
            !isShield(
                handId
            )
        ) {

            return false;

        }


        if (
            !stowGigueShield(
                handId,
                side
            )
        ) {

            return false;

        }


        saveAndRender();


        return true;

    }


    // ============================================================
    // PART 6 OF 12 — PICKUP ELIGIBILITY, HAND CYCLING
    //                & SIDEARM DRAWING
    // ============================================================


    // ========================================================
    // GET PICKUP CANDIDATES
    // ========================================================

    function getPickupCandidates(
        side
    ) {

        const candidates =
            [];


        Object.keys(
            equipmentData
        ).forEach(
            function (
                itemId
            ) {

                const definition =
                    equipmentData[
                        itemId
                    ];


                if (
                    !definition ||
                    !definition.name
                ) {

                    return;

                }


                // ================================================
                // SHIELDS
                // ================================================

                if (
                    definition.shield ===
                    true
                ) {

                    // --------------------------------------------
                    // MAXIMUM TWO SHIELDS OWNED
                    // --------------------------------------------

                    if (
                        !canOwnAnotherShield()
                    ) {

                        return;

                    }


                    // --------------------------------------------
                    // ONE SHIELD PER SIDE
                    // --------------------------------------------

                    if (
                        sideHasShield(
                            side
                        )
                    ) {

                        return;

                    }


                    // --------------------------------------------
                    // GIGUE ON THIS SIDE ALREADY COUNTS AS SHIELD
                    // --------------------------------------------

                    if (
                        sideHasGigueShield(
                            side
                        )
                    ) {

                        return;

                    }


                    // --------------------------------------------
                    // HAND MUST ACTUALLY BE FREE
                    // --------------------------------------------

                    if (
                        !isHandFree(
                            side
                        )
                    ) {

                        return;

                    }


                    candidates.push(
                        itemId
                    );


                    return;

                }


                // ================================================
                // TRUE TWO-HANDED EQUIPMENT
                // ================================================
                //
                // A Gigue does NOT prevent a true 2H weapon from
                // being wielded.
                //
                // We use the same final-state validator used by
                // actual placement rather than duplicating the
                // occupancy rules here.
                // ================================================

                if (
    Number(
        definition.hands
    ) ===
    2
) {

    // --------------------------------------------
    // BOTH ARMS ARE REQUIRED
    // --------------------------------------------

    if (
        isArmWounded(
            "left"
        ) ||
        isArmWounded(
            "right"
        )
    ) {

        return;

    }


    /*
       We do not yet have an instance ID, so we
       cannot call canPlaceInBothHands() directly.

       The only existing occupants that prevent a
       newly purchased 2H item are actual main-hand
       occupants / legacy hand Bucklers.

       Gigue Shields deliberately do NOT count as
       main-hand occupants.
    */

    const gear =
        getGear();


    if (
        gear.leftHand ||
        gear.rightHand ||
        gear.leftHandBuckler ||
        gear.rightHandBuckler
    ) {

        return;

    }


    candidates.push(
        itemId
    );


    return;

}


                // ================================================
                // ORDINARY ONE-HANDED EQUIPMENT
                // ================================================

                if (
                    sideHasGigueShield(
                        side
                                            )
                ) {

                    return;

                }


                if (
    !isHandFree(
        side
    )
) {

    return;

}


// --------------------------------------------
// DUAL WIELDING
// --------------------------------------------
//
// At this point there is not yet an instance ID,
// so check the opposite active hand directly.
//

if (
    !hasDualWielding() &&
    definition.shield !== true
) {

    const oppositeSide =
        side === "left"
            ? "right"
            : "left";


    const oppositeId =
        getGear()[
            handKey(
                oppositeSide
            )
        ];


    if (
        oppositeId
    ) {

        const oppositeInstance =
            getItem(
                oppositeId
            );


        const oppositeDefinition =
            getDefinition(
                oppositeInstance
            );


        if (
            oppositeDefinition &&
            oppositeDefinition.shield !== true
        ) {

            return;

        }

    }

}


candidates.push(
    itemId
);



            }
        );


        return candidates;

    }


    // ========================================================
    // GET HAND INSTANCE
    // ========================================================

    function getHandInstanceId(
        side
    ) {

        const gear =
            getGear();


        return (

            gear[
                handKey(
                    side
                )
            ] ||

            gear[
                handBucklerKey(
                    side
                )
            ] ||

            null

        );

    }


    // ========================================================
    // TRUE TWO-HANDED CHECK
    // ========================================================

    function isTrueTwoHandedWeapon(
        instanceId
    ) {

        const instance =
            getItem(
                instanceId
            );


        if (
            !instance
        ) {

            return false;

        }


        const definition =
            getDefinition(
                instance
            ) ||
            {};


        return (
            Number(
                definition.hands
            ) ===
            2
        );

    }


    // ========================================================
    // MOVE SINGLE-HAND WEAPON TO OTHER HAND
    // ========================================================

    function moveOneHandedWeaponToSide(
        instanceId,
        destinationSide
    ) {

        if (
            !instanceId ||
            !destinationSide
        ) {

            return false;

        }


        // ----------------------------------------------------
        // TRUE 2H EQUIPMENT CANNOT BECOME 1H
        // ----------------------------------------------------

        if (
            isTrueTwoHandedWeapon(
                instanceId
            )
        ) {

            return false;

        }


        // ----------------------------------------------------
        // SHIELDS DO NOT USE WEAPON HAND CYCLING
        // ----------------------------------------------------

        if (
            isShield(
                instanceId
            )
        ) {

            return false;

        }


        // ----------------------------------------------------
// DUAL WIELDING
// ----------------------------------------------------

if (
    wouldCreateIllegalDualWield(
        instanceId,
        destinationSide
    )
) {

    return false;

}


// ----------------------------------------------------
// ARM WOUND BLOCKS DESTINATION
// ----------------------------------------------------

if (
    isArmWounded(
        destinationSide
    )
) {

    return false;

}


        // ----------------------------------------------------
        // GIGUE BLOCKS 1H OCCUPANCY
        // ----------------------------------------------------

        if (
            sideHasGigueShield(
                destinationSide
            )
        ) {

            return false;

        }


        const gear =
            getGear();


        const destinationMain =
            gear[
                handKey(
                    destinationSide
                )
            ];


        const destinationBuckler =
            gear[
                handBucklerKey(
                    destinationSide
                )
            ];


        if (
            destinationMain &&
            destinationMain !==
                instanceId
        ) {

            return false;

        }


        if (
            destinationBuckler &&
            destinationBuckler !==
                instanceId
        ) {

            return false;

        }


        if (
            !canItemOccupyMainHand(
                instanceId,
                destinationSide,
                false
            )
        ) {

            return false;

        }


        clearInstanceFromLocations(
            instanceId
        );


        gear[
            handKey(
                destinationSide
            )
        ] =
            instanceId;


        return true;

    }


    // ========================================================
    // GET SINGLE-HAND SIDE
    // ========================================================

    function getSingleHandSide(
        instanceId
    ) {

        const gear =
            getGear();


        const left =
            gear.leftHand ===
            instanceId;


        const right =
            gear.rightHand ===
            instanceId;


        if (
            left &&
            !right
        ) {

            return "left";

        }


        if (
            right &&
            !left
        ) {

            return "right";

        }


        return null;

    }


    // ========================================================
    // COLLAPSE TWO-HAND USE TO ONE HAND
    // ========================================================
    //
    // A versatile/ordinary weapon being held with two hands
    // can return to one hand.
    //
    // If one side has an active Gigue, that side is illegal for
    // one-handed use, so the weapon falls back to the other side.
    //
    // A TRUE (2H) weapon cannot collapse.
    // ========================================================

    function collapseTwoHandedWeapon(
        instanceId,
        clickedSide
    ) {

        if (
            !instanceId ||
            !isWieldedWithBothHands(
                instanceId
            )
        ) {

            return false;

        }


        if (
            isTrueTwoHandedWeapon(
                instanceId
            )
        ) {

            return false;

        }


        const legalSides =
            getLegalSingleHandSides(
                instanceId
            );


        if (
            legalSides.length ===
            0
        ) {

            return false;

        }


        let destination =
            null;


        // ----------------------------------------------------
        // PREFER CLICKED SIDE
        // ----------------------------------------------------

        if (
            clickedSide &&
            legalSides.includes(
                clickedSide
            )
        ) {

            destination =
                clickedSide;

        }


        // ----------------------------------------------------
        // OTHERWISE TRY OPPOSITE SIDE
        // ----------------------------------------------------

        if (
            !destination &&
            clickedSide
        ) {

            const opposite =
                oppositeSide(
                    clickedSide
                );


            if (
                legalSides.includes(
                    opposite
                )
            ) {

                destination =
                    opposite;

            }

        }


        // ----------------------------------------------------
        // FINAL FALLBACK
        // ----------------------------------------------------

        if (
            !destination
        ) {

            destination =
                legalSides[
                    0
                ];

        }

                return moveFromBothHandsToOne(
            instanceId,
            destination
        );

    }


        // ========================================================
    // MOVE SHIELD TO OTHER HAND
    // ========================================================
    //
    // Clicking a wielded Shield / Buckler switches it to the
    // opposite hand when that side can legally accept it.
    //
    // IMPORTANT:
    //
    // - Does NOT automatically Gigue.
    // - Does NOT automatically Swashbuckle.
    // - Does NOT cross into a side that already has a Shield.
    // ========================================================

    function moveShieldToOtherHand(
        instanceId,
        currentSide
    ) {

        if (
            !instanceId ||
            !currentSide ||
            !isShield(
                instanceId
            )
        ) {

            return false;
        }


        const destinationSide =
            otherSide(
                currentSide
            );


        // ====================================================
        // DESTINATION MAY NOT ALREADY CONTAIN A SHIELD
        // ====================================================

        if (
            sideHasOtherShield(
                destinationSide,
                instanceId
            )
        ) {

            return false;
        }


        // ====================================================
        // DESTINATION HAND MUST BE FREE
        // ====================================================

        if (
            !isHandFree(
                destinationSide
            )
        ) {

            return false;
        }


        // ====================================================
        // GIGUE OCCUPIES THAT SIDE FOR ORDINARY 1H USE
        // ====================================================

        if (
            sideHasGigueShield(
                destinationSide
            )
        ) {

            return false;
        }


        const gear =
            getGear();


        // ====================================================
        // REMOVE SHIELD FROM ITS CURRENT LOCATION
        // ====================================================

        clearInstanceFromLocations(
            instanceId
        );


        // ====================================================
        // BUCKLER
        // ====================================================
        //
        // Bucklers use the dedicated hand-Buckler location.
        // ====================================================

        if (
            isBuckler(
                instanceId
            )
        ) {

            gear[
                handKey(
                    destinationSide
                )
            ] =
                instanceId;

        }


        // ====================================================
        // ORDINARY SHIELD
        // ====================================================

        else {

            gear[
                handKey(
                    destinationSide
                )
            ] =
                instanceId;

        }


        return true;
    }


    // ========================================================
    // HANDLE MAIN-HAND CLICK
    // ========================================================
    //
    // Non-Shield weapon cycle:
    //
    //     one hand
    //        ↓
    //     two hands
    //        ↓
    //     one hand
    //
    // If two-handed use is impossible, clicking instead attempts
    // to move the weapon to the opposite hand.
    //
    // Shields are deliberately excluded. Their movement is
    // handled by Gigue / Swashbuckling.
    // ========================================================

    function handleHandSlotClick(
        side
    ) {

        const instanceId =
            getHandInstanceId(
                side
            );


        if (
            !instanceId
        ) {

            return false;

        }


        const instance =
            getItem(
                instanceId
            );


        if (
            !instance
        ) {

            return false;

        }


        // ================================================
        // SHIELD / BUCKLER
        // ================================================
        //
        // Clicking an equipped Shield changes hands.
        //
        // Gigue and Swashbuckling are NOT entered here.
        // Their own fields must be clicked explicitly.
        // ================================================

        if (
            isShield(
                instanceId
            )
        ) {

            if (
                !moveShieldToOtherHand(
                    instanceId,
                    side
                )
            ) {

                return false;
            }


            saveAndRender();

            return true;
        }


        // ================================================
        // TRUE 2H WEAPON
        // ================================================

        if (
            isTrueTwoHandedWeapon(
                instanceId
            )
        ) {

            return false;

        }


        // ================================================
        // CURRENTLY USING BOTH HANDS
        // ================================================

        if (
            isWieldedWithBothHands(
                instanceId
            )
        ) {

            if (
                collapseTwoHandedWeapon(
                    instanceId,
                    side
                )
            ) {

                saveAndRender();


                return true;

            }


            return false;

        }


        // ================================================
        // CURRENTLY USING ONE HAND
        // ================================================

        const currentSide =
            getSingleHandSide(
                instanceId
            );


        if (
            !currentSide
        ) {

            return false;

        }


        // ------------------------------------------------
        // FIRST TRY TWO-HANDED USE
        // ------------------------------------------------

        if (
            moveIntoBothHands(
                instanceId
            )
        ) {

            saveAndRender();


            return true;

        }


        // ------------------------------------------------
        // OTHERWISE TRY OPPOSITE HAND
        // ------------------------------------------------

        const destination =
            oppositeSide(
                currentSide
            );


        if (
            moveOneHandedWeaponToSide(
                instanceId,
                destination
            )
        ) {

            saveAndRender();


            return true;

        }


        return false;

    }


        // ========================================================
    // CAN INTERACT WITH SIDEARM SLOT
    // ========================================================

    function canInteractWithSidearmSlot(
        side
    ) {

        const gear =
            getGear();


        const storedId =
            gear[
                sidearmKey(
                    side
                )
            ];


        // ====================================================
        // OCCUPIED -> CAN IT BE DRAWN?
        // ====================================================

        if (
            storedId &&
            isSidearm(
                storedId
            )
        ) {

            const bucklerId =
                getBucklerInstanceId(
                    side
                );


            // -----------------------------------------------
            // PAIRED SIDEARM + BUCKLER
            // -----------------------------------------------

            if (
                bucklerId &&
                isBuckler(
                    bucklerId
                )
            ) {

                return canDrawPairedSidearm(
                    side
                );
            }


            // -----------------------------------------------
            // ORDINARY SIDEARM
            // -----------------------------------------------

            if (
                !isHandFree(
                    side
                )
            ) {
                return false;
            }


            if (
                sideHasGigueShield(
                    side
                )
            ) {
                return false;
            }


            return canItemOccupyMainHand(
                storedId,
                side,
                false
            );
        }


        // ====================================================
        // EMPTY -> IS THERE AN EQUIPPED SIDEARM TO STOW?
        // ====================================================

        return Boolean(
            findEquippedSidearmForStorage(
                side
            )
        );
    }


    // ========================================================
    // DRAW SIDEARM
    // ========================================================

    function drawSidearm(
        side
    ) {

        const gear =
            getGear();


        const sidearmId =
            getSidearmItemId(
                side
            );


        if (
            !sidearmId
        ) {

            return false;

        }


        const bucklerId =
            getBucklerInstanceId(
                side
            );


        // ================================================
        // SIDEARM + STOWED BUCKLER
        // ================================================

        if (
            bucklerId &&
            isBuckler(
                bucklerId
            )
        ) {

            /*
               Part 5 performs the entire atomic operation.

               If BOTH pieces cannot be drawn, neither moves.
            */

            return drawPairedSidearm(
                side
            );

        }


        // ================================================
        // ORDINARY SIDEARM
        // ================================================

                if (
            !canInteractWithSidearmSlot(
                side
            )
        ) {

            return false;

        }


        gear[
            sidearmKey(
                side
            )
        ] =
            null;


        gear[
            handKey(
                side
            )
        ] =
            sidearmId;


        return true;

    }


    // ========================================================
    // FIND EQUIPPED SIDEARM FOR STORAGE
    // ========================================================

    function findEquippedSidearmForStorage(
        preferredSide
    ) {

        const gear =
            getGear();


        const preferredId =
            gear[
                handKey(
                    preferredSide
                )
            ];


        if (
            preferredId &&
            isSidearm(
                preferredId
            )
        ) {

            return {
                instanceId:
                    preferredId,

                side:
                    preferredSide
            };
        }


        const opposite =
            oppositeSide(
                preferredSide
            );


        const oppositeId =
            gear[
                handKey(
                    opposite
                )
            ];


        if (
            oppositeId &&
            isSidearm(
                oppositeId
            )
        ) {

            return {
                instanceId:
                    oppositeId,

                side:
                    opposite
            };
        }


        return null;
    }


    // ========================================================
    // STOW EQUIPPED SIDEARM
    // ========================================================

    function stowEquippedSidearm(
        storageSide
    ) {

        const gear =
            getGear();


        // Storage slot must actually be empty.

        if (
            gear[
                sidearmKey(
                    storageSide
                )
            ]
        ) {
            return false;
        }


        const equipped =
            findEquippedSidearmForStorage(
                storageSide
            );


        if (!equipped) {
            return false;
        }


        // A Shield already belonging to this side prevents
        // another shield interaction, but does NOT prevent a
        // normal Sidearm from being stored here.

        clearInstanceFromLocations(
            equipped.instanceId
        );


        gear[
            sidearmKey(
                storageSide
            )
        ] =
            equipped.instanceId;


        return true;
    }

    // ========================================================
    // HANDLE SIDEARM CLICK
    // ========================================================

    function handleSidearmSlotClick(
        side
    ) {

        const gear =
            getGear();


        const storedId =
            gear[
                sidearmKey(
                    side
                )
            ];


        // ====================================================
        // OCCUPIED SIDEARM FIELD -> DRAW
        // ====================================================

        if (
            storedId &&
            isSidearm(
                storedId
            )
        ) {

            if (
                !canInteractWithSidearmSlot(
                    side
                )
            ) {
                return false;
            }


            if (
                !drawSidearm(
                    side
                )
            ) {
                return false;
            }


            saveAndRender();

            return true;
        }


        // ====================================================
        // EMPTY SIDEARM FIELD -> STOW
        // ====================================================

        if (
            stowEquippedSidearm(
                side
            )
        ) {

            saveAndRender();

            return true;
        }


        return false;
    }


    // ============================================================
    // PART 7 OF 12 — BUCKLER INTERACTION & PICKUP UI
    // ============================================================


    // ========================================================
    // BUCKLER COLUMN ELIGIBILITY
    // ========================================================
    //
    // EMPTY FIELD:
    //
    // - SWASHBUCKLING required
    // - Sidearm stowed on this side
    // - Buckler equipped on this same side
    //
    // OCCUPIED FIELD:
    //
    // - Clicking the FIELD draws the Buckler alone
    // - Clicking the NAME removes the Buckler
    //
    // The name-click removal itself is bound later.
    // ========================================================

    function canInteractWithBucklerColumn(
        side
    ) {

        if (
            !hasSwashbuckling()
        ) {

            return false;

        }


        const gear =
            getGear();


        const storedBucklerId =
            gear[
                bucklerKey(
                    side
                )
            ];


        // ====================================================
        // OCCUPIED FIELD — CAN DRAW BUCKLER ALONE?
        // ====================================================

        if (
            storedBucklerId &&
            isBuckler(
                storedBucklerId
            )
        ) {

            return Boolean(

                isHandFree(
                    side
                ) &&

                !sideHasGigueShield(
                    side
                ) &&

                !sideHasOtherShield(
                    side,
                    storedBucklerId
                )

            );

        }


        // ====================================================
        // EMPTY FIELD — CAN STOW EQUIPPED BUCKLER?
        // ====================================================

        return canStowBucklerWithSidearm(
            side
        );

    }


    // ========================================================
    // BUCKLER COLUMN CLICK
    // ========================================================

    function handleBucklerColumnClick(
        side
    ) {

        if (
            !hasSwashbuckling()
        ) {

            return false;

        }


        const gear =
            getGear();


        const slotKey =
            bucklerKey(
                side
            );


        const storedBucklerId =
            gear[
                slotKey
            ];


        // ====================================================
        // OCCUPIED FIELD
        // DRAW BUCKLER ALONE
        // ====================================================

        if (
            storedBucklerId &&
            isBuckler(
                storedBucklerId
            )
        ) {

            if (
                !equipStowedBucklerAlone(
                    side
                )
            ) {

                return false;

            }


            saveAndRender();


            return true;

        }


        // ====================================================
        // EMPTY FIELD
        // STOW EQUIPPED BUCKLER WITH SAME-SIDE SIDEARM
        // ====================================================

        if (
            !stowBucklerWithSidearm(
                side
            )
        ) {

            return false;

        }


        saveAndRender();


        return true;

    }


    // ========================================================
    // PICKUP BUTTON AVAILABILITY
    // ========================================================

    function pickupButtonIsAvailable(
        side
    ) {

        return (
            getPickupCandidates(
                side
            ).length >
            0
        );

    }


    // ========================================================
    // POPULATE PICKUP SELECT
    // ========================================================

    function populatePickupSelect(
        side,
        selectElement
    ) {

        if (
            !selectElement
        ) {

            return;

        }


        const candidates =
            getPickupCandidates(
                side
            );


        selectElement.innerHTML =
            "";


        // ----------------------------------------------------
        // PLACEHOLDER
        // ----------------------------------------------------

        const placeholder =
            document.createElement(
                "option"
            );


        placeholder.value =
            "";


        placeholder.textContent =
            "Choose Item";


        placeholder.selected =
            true;


        placeholder.disabled =
            true;


        selectElement.appendChild(
            placeholder
        );


        // ----------------------------------------------------
        // ITEMS
        // ----------------------------------------------------

        candidates
            .slice()
            .sort(
                function (
                    a,
                                        b
                ) {

                    return String(
                        equipmentData[
                            a
                        ].name
                    ).localeCompare(
                        String(
                            equipmentData[
                                b
                            ].name
                        )
                    );

                }
            )
            .forEach(
                function (
                    itemId
                ) {

                    const definition =
                        equipmentData[
                            itemId
                        ];


                    if (
                        !definition
                    ) {

                        return;

                    }


                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        itemId;


                    option.textContent =
                        definition.name;


                    selectElement.appendChild(
                        option
                    );

                }
            );

    }


    // ========================================================
    // OPEN PICKUP SELECT
    // ========================================================

    function openPickupSelect(
        side
    ) {

        if (
            !pickupButtonIsAvailable(
                side
            )
        ) {

            return false;

        }


        const selectElement =
            side ===
            "left"
                ? leftPickupSelect
                : rightPickupSelect;


        const otherSelect =
            side ===
            "left"
                ? rightPickupSelect
                : leftPickupSelect;


        if (
            !selectElement
        ) {

            return false;

        }


        // ----------------------------------------------------
        // CLOSE OTHER SIDE
        // ----------------------------------------------------

        if (
            otherSelect
        ) {

            closePickupSelect(
                otherSelect
            );

        }


        // ----------------------------------------------------
        // REBUILD OPTIONS
        // ----------------------------------------------------

        populatePickupSelect(
            side,
            selectElement
        );


        selectElement.classList.add(
            "open"
        );


        selectElement.focus();


        return true;

    }


    // ========================================================
    // CLOSE PICKUP SELECT
    // ========================================================

    function closePickupSelect(
        selectElement
    ) {

        if (
            !selectElement
        ) {

            return;

        }


        selectElement.classList.remove(
            "open"
        );


        selectElement.value =
            "";

    }


    // ========================================================
    // CREATE FREE PICKUP INSTANCE
    // ========================================================
    //
    // IMPORTANT:
    //
    // This is the ONLY createPickupInstance() that should exist
    // anywhere in gear-sheet.js.
    //
    // It uses the same state API already used by your working
    // equipment system:
    //
    //     KKState.createEquipmentInstance(...)
    //
    // ========================================================

    function createPickupInstance(
        itemId
    ) {

        const definition =
            equipmentData[
                itemId
            ];


        if (
            !definition
        ) {

            console.error(
                "Pickup failed: unknown equipment item:",
                itemId
            );


            return null;

        }


        // ----------------------------------------------------
        // SHIELD OWNERSHIP LIMIT
        // ----------------------------------------------------

        if (
            definition.shield ===
                true &&
            !canOwnAnotherShield()
        ) {

            console.warn(
                "Pickup blocked: maximum of two Shields."
            );


            return null;

        }


        // ----------------------------------------------------
        // VERIFY STATE API
        // ----------------------------------------------------

        if (
            typeof KKState
                .createEquipmentInstance !==
            "function"
        ) {

            console.error(
                "Pickup failed: KKState.createEquipmentInstance() is unavailable."
            );


            return null;

        }


        // ----------------------------------------------------
        // CREATE
        // ----------------------------------------------------

        const instance =
            KKState
                .createEquipmentInstance(
                    state,
                    {

                        itemId:
                            itemId,

                        name:
                            definition.name,

                        source:
                            "pickup",

                        purchaseCost:
                            0,

                        hands:
                            Number(
                                definition.hands
                            ) || 1,

                        sidearm:
                            definition.sidearm ===
                            true,

                        shield:
                            definition.shield ===
                            true

                    }
                );


        if (
            !instance ||
            !instance.id
        ) {

            console.error(
                "Pickup failed: no equipment instance was returned for:",
                itemId
            );


            return null;

        }


        // ----------------------------------------------------
        // INITIAL CONDITION
        // ----------------------------------------------------

        if (
            instanceIsShield(
                instance
            )
        ) {

            ensureShieldIntegrity(
                instance
            );

        }

        else {

            ensureInstanceDurability(
                instance
            );

        }


        return instance;

    }


    // ========================================================
    // REMOVE FAILED PICKUP INSTANCE
    // ========================================================

    function removeFailedPickupInstance(
        instanceId
    ) {

        if (
            !instanceId
        ) {

            return;

        }


        clearInstanceFromLocations(
            instanceId
        );


        if (
            typeof KKState
                .removeOwnedEquipmentInstance ===
            "function"
        ) {

            KKState
                .removeOwnedEquipmentInstance(
                    state,
                    instanceId
                );

        }

    }


    // ========================================================
    // PLACE PICKED-UP ITEM
    // ========================================================

    function placePickedUpItem(
        side,
        itemId
    ) {

        const definition =
            equipmentData[
                itemId
            ];


        if (
            !definition
        ) {

            return false;

        }


        // ----------------------------------------------------
        // REVALIDATE AGAINST CURRENT STATE
        // ----------------------------------------------------

        const candidates =
            getPickupCandidates(
                side
            );


        if (
            !candidates.includes(
                itemId
            )
        ) {

            return false;

        }


        // ----------------------------------------------------
        // CREATE INSTANCE
        // ----------------------------------------------------

        const instance =
            createPickupInstance(
                itemId
            );


        if (
            !instance ||
            !instance.id
        ) {

            return false;

        }


        const instanceId =
            instance.id;


        let placed =
            false;


        // ====================================================
        // TRUE TWO-HANDED ITEM
        // ====================================================

        if (
            Number(
                definition.hands
            ) ===
            2
        ) {

            placed =
                placeTwoHandedItem(
                    instanceId
                );

        }


        // ====================================================
        // ONE-HANDED ITEM
        // ====================================================

        else {

            /*
               This includes Shields.

               placeOneHandedItem() is now the central authority
               for:

                   - preferred pickup side
                   - Gigue restrictions
                   - Shield side restrictions
                   - free-hand requirements
            */

            placed =
                placeOneHandedItem(
                    instanceId,
                    side
                );

        }


        // ----------------------------------------------------
        // PLACEMENT FAILED
        // ----------------------------------------------------

        if (
            !placed
        ) {
                        console.warn(
                "Pickup created but could not be placed:",
                definition.name
            );


            removeFailedPickupInstance(
                instanceId
            );


            return false;

        }


        return true;

    }


    // ========================================================
    // HANDLE PICKUP SELECTION
    // ========================================================

    function handlePickupSelection(
        side,
        selectElement
    ) {

        if (
            !selectElement
        ) {

            return false;

        }


        const itemId =
            selectElement.value;


        if (
            !itemId
        ) {

            return false;

        }


        const changed =
            placePickedUpItem(
                side,
                itemId
            );


        closePickupSelect(
            selectElement
        );


        if (
            changed
        ) {

            saveAndRender();


            return true;

        }


        render();


        return false;

    }


    // ========================================================
    // RENDER PICKUP BUTTON
    // ========================================================

    function renderPickupButton(
        side,
        button,
        selectElement
    ) {

        if (
            !button
        ) {

            return;

        }


        const available =
            pickupButtonIsAvailable(
                side
            );


        /*
           Keep the actual button enabled.

           The visual "disabled" class and aria-disabled state
           determine whether our click handler opens it.

           This avoids browser-level disabling interfering with
           the custom Pickup UI.
        */

        button.disabled =
            false;


        button.classList.toggle(
            "disabled",
            !available
        );


        button.setAttribute(
            "aria-disabled",
            available
                ? "false"
                : "true"
        );


        if (
            !available
        ) {

            closePickupSelect(
                selectElement
            );

        }

    }


    // ============================================================
    // PART 8 OF 12 — BUILDER RECONCILIATION & RULE REPAIR
    // ============================================================


    // ========================================================
    // BUILDER ITEM DEFAULT PLACEMENT
    // ========================================================
    //
    // This function is ONLY for builder-source equipment that
    // exists in character state but has not yet been assigned
    // a legal Gear Sheet location.
    //
    // Pickup items are placed directly by Part 7 and do not
    // pass through this function.
    // ========================================================

    function placeBuilderItem(
        instanceId
    ) {

        const instance =
            getItem(
                instanceId
            );


        if (
            !instance
        ) {

            return false;

        }


        const definition =
            getDefinition(
                instance
            );


        if (
            !definition
        ) {

            return false;

        }


        // ----------------------------------------------------
        // INITIAL CONDITION
        // ----------------------------------------------------

        if (
            instanceIsShield(
                instance
            )
        ) {

            ensureShieldIntegrity(
                instance
            );

        }

        else {

            ensureInstanceDurability(
                instance
            );

        }


        // ====================================================
        // SIDEARMS
        // ====================================================
        //
        // Builder Sidearms prefer dedicated storage:
        //
        //     right Sidearm
        //     left Sidearm
        //     main hand fallback
        // ====================================================

        if (
            definition.sidearm ===
            true
        ) {

            // ------------------------------------------------
            // RIGHT SIDEARM
            // ------------------------------------------------

            if (
                isSidearmSlotFree(
                    "right"
                )
            ) {

                clearInstanceFromLocations(
                    instanceId
                );


                getGear().rightSidearm =
                    instanceId;


                return true;

            }


            // ------------------------------------------------
            // LEFT SIDEARM
            // ------------------------------------------------

            if (
                isSidearmSlotFree(
                    "left"
                )
            ) {

                clearInstanceFromLocations(
                    instanceId
                );


                getGear().leftSidearm =
                    instanceId;


                return true;

            }


            // ------------------------------------------------
            // FALL BACK TO MAIN HAND
            // ------------------------------------------------

            return placeOneHandedItem(
                instanceId
            );

        }


        // ====================================================
        // TRUE TWO-HANDED ITEM
        // ====================================================

        if (
            Number(
                definition.hands
            ) ===
            2
        ) {

            return placeTwoHandedItem(
                instanceId
            );

        }


        // ====================================================
        // SHIELD
        // ====================================================
        //
        // Shields default LEFT when originally purchased.
        //
        // Part 4's placeOneHandedItem() already implements:
        //
        //     left first
        //     right fallback
        //     one Shield per side
        //     Gigue restrictions
        //
        // ====================================================

        if (
            instanceIsShield(
                instance
            )
        ) {

            return placeOneHandedItem(
                instanceId
            );

        }


        // ====================================================
        // ORDINARY ONE-HANDED ITEM
        // ====================================================

        return placeOneHandedItem(
            instanceId
        );

    }


    // ========================================================
    // INSTANCE IS ALREADY ON GEAR SHEET
    // ========================================================

    function instanceHasGearLocation(
        instanceId
    ) {

        if (
            !instanceId
        ) {

            return false;

        }


        const gear =
            getGear();


        return [

            gear.leftHand,
            gear.rightHand,

            gear.leftHandBuckler,
            gear.rightHandBuckler,

            gear.leftSidearm,
            gear.rightSidearm,

            gear.leftGigue,
            gear.rightGigue,

            gear.leftBuckler,
            gear.rightBuckler

        ].includes(
            instanceId
        );

    }


    // ========================================================
    // ENSURE BUILDER ITEMS ARE PLACED
    // ========================================================
    //
    // Order matters:
    //
    // 1. Remove stale location references.
    // 2. Initialize condition values.
    // 3. Place genuinely unplaced builder items.
    // 4. Repair Shield-side conflicts.
    // 5. Repair illegal Gigue/main-hand conflicts.
    // 6. Enforce the two-Shield ownership limit.
    //
    // We DO NOT reposition pickup items here.
    // ========================================================

    function ensureBuilderItemsPlaced() {

        let changed =
            false;


        // ====================================================
        // 1. CLEAN STALE LOCATION REFERENCES
        // ====================================================

        if (
            cleanStaleLocations()
        ) {

            changed =
                true;

        }


        // ====================================================
        // 2. INITIALIZE ALL CURRENT CONDITION VALUES
        // ====================================================
        //
        // This includes pickup items already on the sheet.
        // ====================================================

        getGearSheetInstances()
            .forEach(
                function (
                    instance
                ) {

                    if (
                        !instance
                    ) {

                        return;

                    }


                    if (
                        instanceIsShield(
                            instance
                        )
                    ) {

                        const before =
                            instance.integrity;


                        ensureShieldIntegrity(
                            instance
                        );


                        if (
                            before !==
                            instance.integrity
                        ) {

                            changed =
                                true;

                        }

                    }

                    else {

                        const before =
                            instance.durability;


                        ensureInstanceDurability(
                            instance
                        );

                                                if (
                            before !==
                            instance.durability
                        ) {

                            changed =
                                true;

                        }

                    }

                }
            );


        // ====================================================
        // 3. PLACE UNPLACED BUILDER ITEMS
        // ====================================================

        const builderInstances =
            getBuilderInstances();


        builderInstances.forEach(
            function (
                instance
            ) {

                if (
                    !instance ||
                    !instance.id
                ) {

                    return;

                }


                const instanceId =
                    instance.id;


                // --------------------------------------------
                // ALREADY SOMEWHERE
                // --------------------------------------------

                if (
                    instanceHasGearLocation(
                        instanceId
                    )
                ) {

                    return;

                }


                // --------------------------------------------
                // PLACE ACCORDING TO CURRENT RULES
                // --------------------------------------------

                if (
                    placeBuilderItem(
                        instanceId
                    )
                ) {

                    changed =
                        true;

                }

            }
        );


        // ====================================================
        // 4. REPAIR ONE-SHIELD-PER-SIDE CONFLICTS
        // ====================================================

        if (
            repairShieldSideConflicts()
        ) {

            changed =
                true;

        }


        // ====================================================
        // 5. REPAIR GIGUE / MAIN-HAND CONFLICTS
        // ====================================================
        //
        // A Gigue-side hand may contain a weapon only when
        // that exact weapon occupies BOTH hand slots.
        // ====================================================

        if (
            repairGigueHandConflicts()
        ) {

            changed =
                true;

        }


        // ====================================================
        // 6. ENFORCE MAXIMUM TWO OWNED SHIELDS
        // ====================================================

        if (
            enforceShieldOwnershipLimit()
        ) {

            changed =
                true;

        }


        return changed;

    }


    // ============================================================
    // PART 9 OF 12 — ITEM REMOVAL, COLUMNS & DYNAMIC STATS
    // ============================================================


    // ========================================================
    // REMOVE / REFUND ITEM
    // ========================================================

    function removeItem(
        instanceId
    ) {

        const instance =
            getItem(
                instanceId
            );


        if (
            !instance
        ) {

            return false;

        }


        clearInstanceFromLocations(
            instanceId
        );


        handCycleDirections.delete(
            instanceId
        );


        if (
            typeof KKState
                .removeOwnedEquipmentInstance ===
            "function"
        ) {

            KKState
                .removeOwnedEquipmentInstance(
                    state,
                    instanceId
                );

        }


        saveAndRender();


        return true;

    }


    // ========================================================
    // GET COLUMN INSTANCE ID
    // ========================================================

    function getColumnInstanceId(
        columnKey
    ) {

        const gear =
            getGear();


        switch (
            columnKey
        ) {

            case "leftHand":

                return (
                    gear.leftHand ||
                    null
                );


            case "rightHand":

                return (
                    gear.rightHand ||
                    null
                );


            case "leftSidearm":

                return (
                    gear.leftSidearm ||
                    null
                );


            case "rightSidearm":

                return (
                    gear.rightSidearm ||
                    null
                );


            case "leftBuckler":

                return (
                    gear.leftBuckler ||
                    null
                );


            case "rightBuckler":

                return (
                    gear.rightBuckler ||
                    null
                );


            case "gigueShield":

                return (
                    gear.leftGigue ||
                    gear.rightGigue ||
                    null
                );


            default:

                return null;

        }

    }


    // ========================================================
    // COLUMN CHILD HELPER
    // ========================================================

    function findColumnChild(
        column,
        selectors
    ) {

        if (
            !column
        ) {

            return null;

        }


        for (
            const selector of
            selectors
        ) {

            const element =
                column.querySelector(
                    selector
                );


            if (
                element
            ) {

                return element;

            }

        }


        return null;

    }


    // ========================================================
    // SET TEXT
    // ========================================================

    function setText(
        element,
        value
    ) {

        if (
            !element
        ) {

            return;

        }


        const text =
            value ===
                null ||
            value ===
                undefined
                ? ""
                : String(
                    value
                );


        if (
            element instanceof
                HTMLInputElement ||
            element instanceof
                HTMLTextAreaElement
        ) {

            element.value =
                text;


            return;

        }


        element.textContent =
            text;

    }


    // ========================================================
    // CLEAR COLUMN
    // ========================================================

    function clearColumn(
        column
    ) {

        if (
            !column
        ) {

            return;

        }


        column.classList.add(
            "empty"
        );


        column.classList.remove(
            "eligible"
        );


        // ----------------------------------------------------
        // FIXED FIELDS
        // ----------------------------------------------------

        const fields = [

            findColumnChild(
                column,
                [
                    ".column-name",
                    "[data-field='name']"
                ]
            ),

            findColumnChild(
                column,
                [
                    ".column-reach",
                    "[data-field='reach']"
                ]
            ),

            findColumnChild(
                column,
                [
                    ".column-weight",
                    "[data-field='weight']"
                ]
            ),

            findColumnChild(
                column,
                [
                    ".block-value",
                    "[data-field='block']"
                ]
            ),

            findColumnChild(
                column,
                [
                    ".durability-value",
                    ".integrity-value",
                    "[data-field='durability']",
                    "[data-field='integrity']"
                ]
            )

        ];


        fields.forEach(
            function (
                field
            ) {

                if (
                    !field
                ) {

                    return;

                }


                /*
                   Integrity/Durability fields can contain a
                   +/- control, so clear the whole contents.
                */

                field.innerHTML =
                    "";

            }
        );


        // ----------------------------------------------------
        // DYNAMIC ROWS
        // ----------------------------------------------------

        column
            .querySelectorAll(
                ".dynamic-row"
            )
            .forEach(
                function (
                    row
                ) {

                    row.remove();

                }
            );

    }


    // ========================================================
    // NORMALIZE STAT COLLECTION
    // ========================================================

    function normalizeStatCollection(
        value
    ) {

                if (
            !value
        ) {

            return [];

        }


        if (
            Array.isArray(
                value
            )
        ) {

            return value
                .map(
                    function (
                        entry
                    ) {

                        if (
                            typeof entry ===
                            "string"
                        ) {

                            return {

                                name:
                                    entry,

                                value:
                                    ""

                            };

                        }


                        if (
                            entry &&
                            typeof entry ===
                                "object"
                        ) {

                            return {

                                name:
                                    entry.name ||
                                    entry.label ||
                                    "",

                                value:
                                    entry.value ??
                                    entry.amount ??
                                    ""

                            };

                        }


                        return null;

                    }
                )
                .filter(
                    Boolean
                );

        }


        if (
            typeof value ===
            "object"
        ) {

            return Object
                .entries(
                    value
                )
                .map(
                    function (
                        [
                            name,
                            statValue
                        ]
                    ) {

                        return {

                            name:
                                name,

                            value:
                                statValue

                        };

                    }
                );

        }


        return [];

    }


// ========================================================
// HAS SWORD & BOARD
// ========================================================

function hasSwordAndBoard() {

    return hasSkill(
        "sword-and-board"
    );

}


// ========================================================
// GET SWORD & BOARD PAIR
// ========================================================
//
// Requires:
//
//     one actively wielded sword
//     one actively wielded shield
//
// They must be DIFFERENT instances.
//
// Returns the sword, shield, and combined:
//     Sword Parry + Shield Block
//
// The combined value is only a reminder. It does not
// alter either actual defense.
// ========================================================

function getSwordAndBoardPair() {

    if (
        !hasSwordAndBoard()
    ) {

        return null;

    }


    const gear =
        getGear() || {};


    const activeIds = [

        gear.leftHand ||
            gear.leftHandBuckler ||
            null,

        gear.rightHand ||
            gear.rightHandBuckler ||
            null

    ];


    let sword =
        null;

    let shield =
        null;


    activeIds.forEach(
        function (
            instanceId
        ) {

            if (
                !instanceId
            ) {

                return;

            }


            const instance =
                getItem(
                    instanceId
                );


            const definition =
                getDefinition(
                    instance
                ) || {};


            if (
                definition.shield ===
                true
            ) {

                shield =
                    instance;

                return;

            }


            if (
                String(
                    definition.type ||
                    ""
                ).toLowerCase() ===
                "sword"
            ) {

                sword =
                    instance;

            }

        }
    );


    if (
        !sword ||
        !shield
    ) {

        return null;

    }


    // ----------------------------------------------------
    // FIND CURRENT SWORD PARRY
    // ----------------------------------------------------

    const swordDefinition =
        getDefinition(
            sword
        ) || {};


    const swordDefenses =
        normalizeStatCollection(
            swordDefinition.defenses
        );


    const parryStat =
        swordDefenses.find(
            function (
                stat
            ) {

                return (
                    String(
                        stat.name || ""
                    )
                    .trim()
                    .toLowerCase() ===
                    "parry"
                );

            }
        );


    if (
        !parryStat
    ) {

        return null;

    }


    const parry =
        Number(
            getDisplayedDefenseValue(
                sword.id,
                "Parry",
                parryStat.value
            )
        );


    const block =
        Number(
            getDisplayedDefenseValue(
                shield.id,
                "Block",
                getShieldBlock(
                    shield
                )
            )
        );


    if (
        !Number.isFinite(
            parry
        ) ||
        !Number.isFinite(
            block
        )
    ) {

        return null;

    }


    return {

        swordId:
            sword.id,

        shieldId:
            shield.id,

        combined:
            parry + block

    };

}


// ========================================================
// GET SWORD & BOARD REMINDER
// ========================================================

function getSwordAndBoardReminder(
    instance,
    defenseName
) {

    if (
        !instance ||
        !instance.id
    ) {

        return null;

    }


    const pair =
        getSwordAndBoardPair();


    if (
        !pair
    ) {

        return null;

    }


    const normalizedName =
        String(
            defenseName || ""
        )
        .trim()
        .toLowerCase();


    if (
        instance.id ===
            pair.swordId &&
        normalizedName ===
            "parry"
    ) {

        return pair.combined;

    }


    if (
        instance.id ===
            pair.shieldId &&
        normalizedName ===
            "block"
    ) {

        return pair.combined;

    }


    return null;

}


// ========================================================
// HAS HAFT BLOCK
// ========================================================

function hasHaftBlock() {

    return hasSkill(
        "haft-block"
    );

}


// ========================================================
// IS TWO-HANDED NON-SWORD
// ========================================================

function isTwoHandedNonSword(
    instance
) {

    if (
        !instance
    ) {

        return false;

    }


    const definition =
        getDefinition(
            instance
        ) || {};


    // Swords never qualify.

    if (
        String(
            definition.type || ""
        ).toLowerCase() ===
        "sword"
    ) {

        return false;

    }


    // True 2H weapon.

    if (
        Number(
            definition.hands
        ) === 2
    ) {

        return true;

    }


    // Versatile 1H weapon only qualifies while
    // actually occupying both hands.

    if (
        !definition.versatile
    ) {

        return false;

    }


    return isWieldedWithBothHands(
        instance.id
    );

}


// ========================================================
// GET HAFT BLOCK
// ========================================================

function getsHaftBlock(
    instance
) {

    if (
        !hasHaftBlock() ||
                !isTwoHandedNonSword(
            instance
        )
    ) {

        return false;

    }


    const definition =
        getDefinition(
            instance
        ) || {};


    // Do not create a second Block if the weapon
    // already possesses one naturally.

    const defenses =
        normalizeStatCollection(
            definition.defenses
        );


    const alreadyHasBlock =
        defenses.some(
            function (
                stat
            ) {

                return (
                    String(
                        stat.name || ""
                    )
                    .trim()
                    .toLowerCase() ===
                    "block"
                );

            }
        );


    return !alreadyHasBlock;

}



    // ========================================================
    // GET CURRENT STAT GROUPS
    // ========================================================
    //
    // Order:
    //
    //     Defenses
    //     Integrity / Durability
    //     Strikes
    //     Tools
    //
    // Shields:
    //
    //     Integrity
    //
    // Everything else:
    //
    //     Durability
    //
    // ========================================================

    function getDisplayedStatGroups(
        instance
    ) {

        if (
            !instance
        ) {

            return [];

        }


        const definition =
            getDefinition(
                instance
            ) ||
            {};


        const instanceId =
            instance.id;

            const armInjuryPenalty =
    getArmInjuryPenalty(
        instanceId
    );


const armInjuryAffected =
    armInjuryPenalty >
    0;


        // ====================================================
        // DEFENSES
        // ====================================================

        let defenses =
    normalizeStatCollection(
        definition.defenses
    )
    .map(
        function (
            stat
        ) {

            return {

                name:
                    stat.name,

                value:
                    getDisplayedDefenseValue(
                        instanceId,
                        stat.name,
                        stat.value
                    ),

                injuryAffected:
                    armInjuryAffected,

                swordAndBoardReminder:
                    getSwordAndBoardReminder(
                        instance,
                        stat.name
                    )

            };

        }
    );


    // ====================================================
    // RABAT
    // ====================================================

    if (
        getsRabatParry(
            instance
        )
    ) {

        defenses.push(
            {
                name: "Parry",

                value:
                    getDisplayedDefenseValue(
                        instanceId,
                        "Parry",
                        0
                    ),

                                injuryAffected:
                    armInjuryAffected,

                skillAdded:
                    true
            }
        );

    }


    // ========================================================
    // HAS SHIELD BASH
    // ========================================================

    function hasShieldBash() {

        return hasSkill(
            "shield-bash"
        );

    }


    // ====================================================
    // HAFT BLOCK
    // ====================================================

    if (
        getsHaftBlock(
            instance
        )
    ) {

        const definition =
            getDefinition(
                instance
            ) || {};


                const blockValue =
            Number(
                getEffectiveItemWeight(
                    instance
                )
            ) || 0;


        defenses.push(
            {
                name:
                    "Block",

                value:
                    getDisplayedDefenseValue(
                        instanceId,
                        "Block",
                        blockValue
                    ),

                                injuryAffected:
                    armInjuryAffected,

                skillAdded:
                    true
            }
        );

    }


    // ========================================================
    // SHIELD IS ACTIVELY WIELDED
    // ========================================================
    //
    // Shield Bash works only while the shield is actually
    // being wielded.
    //
    // It does NOT work while stored in:
    // - Gigue
    // - Swashbuckling
    // ========================================================

    function shieldCanBash(
        instance
    ) {

        if (
            !hasShieldBash() ||
            !instance ||
            !instance.id
        ) {

            return false;

        }


        const definition =
            getDefinition(
                instance
            ) || {};


        if (
            definition.shield !== true
        ) {

            return false;

        }


        const gear =
            getGear();


        return Boolean(

            gear.leftHand ===
                instance.id ||

            gear.rightHand ===
                instance.id ||

            gear.leftHandBuckler ===
                instance.id ||

            gear.rightHandBuckler ===
                instance.id

        );

    }


        // ====================================================
        // CONDITION
        // ====================================================

        let condition =
            [];


        // ----------------------------------------------------
        // SHIELD = INTEGRITY
        // ----------------------------------------------------

        if (
            itemUsesIntegrity(
                instance
            ) &&
            itemHasDurability(
                instance
            )
        ) {

            const integrity =
                ensureShieldIntegrity(
                    instance
                );


            condition = [

                {

                    name:
                        "Integrity",

                    value:
                        integrity,

                    editable:
                        true,

                    conditionType:
                        "integrity",

                    modified:
                        itemHasModification(instance, "reinforced") ||
                        itemHasModification(instance, "center-grip")

                }

            ];

        }


        // ----------------------------------------------------
        // NON-SHIELD = DURABILITY
        // ----------------------------------------------------

        else if (
            itemHasDurability(
                instance
            )
        ) {

            const durability =
                ensureInstanceDurability(
                    instance
                );


            condition = [

                {

                    name:
                        "Durability",

                    value:
                        durability,

                    editable:
                        true,

                    conditionType:
                        "durability"

                }

            ];

        }


        // ====================================================
        // STRIKES
        // ====================================================

        let strikes =
            normalizeStatCollection(
                definition.strikes
            )
            .map(
                function (
                    stat
                ) {

                    return {

                        name:
                            itemHasModification(instance, "spiked") &&
                            String(stat.name).toLowerCase() === "bash"
                                ? "Punch"
                                : stat.name,

                        value:
                            getDisplayedStrikeValue(
                                instanceId,
                                stat.value
                            ),

                        injuryAffected:
                            armInjuryAffected,

                        halfSwordingReminder:
                            getsHalfSwordingReminder(
                                instance,
                                stat.name
                            ),

                        modified:
                            itemHasModification(instance, "spiked") &&
                            String(stat.name).toLowerCase() === "bash"

                    };

                }
            );


        // ====================================================
        // TOP SPIKE
        // ====================================================

        if (itemHasModification(instance, "top-spike")) {

            const bash = normalizeStatCollection(definition.strikes)
                .find(function (stat) {
                    return String(stat.name || "").toLowerCase() === "bash";
                });


            if (bash) {

                strikes.push({
                    name: "Thrust",
                    value: getDisplayedStrikeValue(instanceId, bash.value),
                    injuryAffected: armInjuryAffected,
                    modified: true
                });

            }

        }


        // ====================================================
        // MORDSCHLAG
        // ====================================================

        if (
            hasMordschlag() &&
            isTwoHandedSword(
                instance
            )
        ) {

                        const definition =
                getDefinition(
                    instance
                ) ||
                {};


            const mordschlagDie =
                Number(
                    definition.hands
                ) === 2
                    ? "d10"
                    : String(
                        definition.versatile ||
                        ""
                    );


            if (
                mordschlagDie
            ) {

                strikes.push(
                    {
                        name:
                            "Bash",

                        value:
                            applyNumericPenalty(
                                appendMightToDamage(
                                    mordschlagDie
                                ),
                                getArmInjuryPenalty(
                                    instanceId
                                )
                            ),

                        injuryAffected:
                            armInjuryAffected,

                        skillAdded:
                            true
                    }
                );

            }

    }


    // ====================================================
    // SHIELD BASH
    // ====================================================
    //
    // Base damage:
    //     d4 + Shield Weight
    //
    // getDisplayedStrikeValue() then applies Might and
    // any applicable arm-injury penalty normally.
    // ====================================================

    if (
        shieldCanBash(
            instance
        )
    ) {


        let bashDamage =
            "d4";


        strikes.push(
            {
                name:
                    "Bash",

                value:
                    getDisplayedStrikeValue(
                        instanceId,
                        bashDamage
                    ),

                                injuryAffected:
                    armInjuryAffected,

                skillAdded:
                    true
            }
        );

    }


    // ========================================================
    // HAS HALF-SWORDING
    // ========================================================

    function hasHalfSwording() {

        return hasSkill(
            "half-swording"
        );

    }


    // ========================================================
    // GET HALF-SWORDING REMINDER
    // ========================================================

    function getsHalfSwordingReminder(
        instance,
        strikeName
    ) {

        if (
            !hasHalfSwording() ||
            !instance ||
            String(
                strikeName || ""
            ).toLowerCase() !== "thrust"
        ) {

            return false;

        }


        const definition =
            getDefinition(
                instance
            ) || {};


        // Must be a sword.

        if (
            String(
                definition.type || ""
            ).toLowerCase() !== "sword"
        ) {

            return false;

        }


        // Naturally two-handed swords always qualify.

        if (
            Number(
                definition.hands
            ) === 2
        ) {

            return true;

        }


        // Versatile / one-handed swords qualify only while
        // actually occupying both hand slots.

        return isWieldedWithBothHands(
            instance.id
        );

    }


    // ========================================================
    // HAS MORDSCHLAG
    // ========================================================

    function hasMordschlag() {

        return hasSkill(
            "mordschlag"
        );

    }


    // ========================================================
    // IS TWO-HANDED SWORD
    // ========================================================
    //
    // True 2H swords always qualify.
    //
    // Versatile 1H swords qualify only while actually
    // occupying both hand slots.
    // ========================================================

    function isTwoHandedSword(
        instance
    ) {

        if (
            !instance
        ) {

            return false;

        }


        const definition =
            getDefinition(
                instance
            ) || {};


        if (
            String(
                definition.type || ""
            ).toLowerCase() !==
            "sword"
        ) {

            return false;

        }


        if (
            Number(
                definition.hands
            ) === 2
        ) {

            return true;

        }


        if (
            !definition.versatile
        ) {

            return false;

        }


        return isWieldedWithBothHands(
            instance.id
        );

    }


    // ========================================================
    // GET HIGHEST STRIKE DIE
    // ========================================================
    //
    // Examples:
    //
    //     d8 + d10  -> d10
    //     2d6       -> d6
    //     d12       -> d12
    //
    // Number of dice does not matter. We want the single
    // largest die size.
    // ========================================================

    function getHighestStrikeDie(
        instance
    ) {

        if (
            !instance
        ) {

            return "";

        }


        const definition =
            getDefinition(
                instance
            ) || {};


        const strikes =
            definition.strikes ||
            {};


        let highestSides =
            0;


        Object.values(
            strikes
        ).forEach(
            function (
                damage
            ) {

                const text =
                    String(
                        damage || ""
                    );


                const diePattern =
                    /(?:\d+)?d(\d+)/gi;


                let match;


                while (
                    (
                        match =
                            diePattern.exec(
                                text
                            )
                    ) !== null
                ) {

                    const sides =
                        Number(
                            match[1]
                        ) || 0;


                    if (
                        sides >
                        highestSides
                    ) {

                        highestSides =
                            sides;

                    }

                }

            }
        );


        return highestSides > 0
            ? "d" + highestSides
            : "";

    }


        // ====================================================
        // TOOLS
        // ====================================================

        const tools =
            normalizeStatCollection(
                definition.tools
            )
            .map(
                function (
                    stat
                ) {

                    return {

                        name:
                            stat.name,

                        value:
                            applyNumericPenalty(
                                stat.value,
                                armInjuryPenalty
                            ),

                        injuryAffected:
                            armInjuryAffected

                    };

                }
            );


        // ====================================================
        // RETURN GROUPS
        // ====================================================

        const displayedGroups = [

            {

                className:
                    "defense",

                values:
                    defenses

            },

            {

                className:
                    itemUsesIntegrity(
                        instance
                    )
                        ? "integrity"
                        : "durability",

                values:
                    condition

            },

            {

                className:
                    "strike",

                values:
                    strikes

            },

            {

                className:
                    "tool",

                values:
                    tools

            }

        ];


        // Reinforced weapons place their new Integrity row
        // after every ordinary value. Weight remains in its
        // permanent field at the bottom of the column.

        if (
            itemHasModification(instance, "reinforced") &&
            !instanceIsShield(instance)
        ) {

            const conditionGroup = displayedGroups.splice(1, 1)[0];
            displayedGroups.push(conditionGroup);

        }


        return displayedGroups;

    }


    // ========================================================
    // CHANGE DISPLAYED CONDITION
    // ========================================================

    function changeDisplayedCondition(
        instance,
        stat,
        amount
    ) {

        if (
            !instance ||
            !stat
        ) {

            return false;

        }


        if (
            stat.conditionType ===
            "integrity"
        ) {

            return changeShieldIntegrity(
                instance.id,
                amount
            );

        }


        return changeDurability(
            instance.id,
            amount
        );

    }


    // ========================================================
    // RENDER STAT ROWS
    // ========================================================

    function renderStatRows(
        column,
        instance
    ) {

        if (
            !column ||
            !instance
        ) {

            return;

        }


        // ----------------------------------------------------
        // REMOVE OLD DYNAMIC ROWS FIRST
        // ----------------------------------------------------

        column
            .querySelectorAll(
                ".dynamic-row"
            )
            .forEach(
                function (
                    row
                ) {
                                        row.remove();

                }
            );


        const groups =
            getDisplayedStatGroups(
                instance
            );


        let rowIndex =
            0;


        groups.forEach(
            function (
                group
            ) {

                group
                    .values
                    .slice()
                    .sort(
                        function (
                            a,
                            b
                        ) {

                            return String(
                                a.name
                            ).localeCompare(
                                String(
                                    b.name
                                )
                            );

                        }
                    )
                    .forEach(
                        function (
                            stat
                        ) {

                            // ========================================
                            // ROW
                            // ========================================

                            const row =
                                document.createElement(
                                    "div"
                                );


                            row.className =
                                "dynamic-row " +
                                group.className;


                            row.dataset.row =
                                String(
                                    rowIndex
                                );


                            // ========================================
                            // NAME
                            // ========================================

                            const name =
                                document.createElement(
                                    "span"
                                );


                            name.className =
                                "dynamic-name";


                            name.textContent =
                                stat.name;


                             if (
                                stat.modified === true &&
                                stat.conditionType !==
                                    "integrity"
                            ) {

                                markModifiedElement(
                                    name
                                );

                            }


                             if (
                                stat.skillAdded ===
                                true
                            ) {

                                name.style.setProperty(
                                    "color",
                                    "#9ecfff",
                                    "important"
                                );

                            }


                            // ========================================
                            // VALUE
                            // ========================================

                            let value;


                            // ========================================
                            // EDITABLE CONDITION
                            // ========================================

                            if (
                                stat.editable ===
                                true
                            ) {

                                value =
                                    document.createElement(
                                        "div"
                                    );


                                value.className =
                                    "dynamic-value durability-control";


                                 if (
                                    stat.modified === true &&
                                    stat.conditionType !==
                                        "integrity"
                                ) {

                                    markModifiedElement(
                                        value
                                    );

                                }


                                if (
                                    stat.conditionType ===
                                    "integrity"
                                ) {

                                    value.classList.add(
                                        "integrity-control"
                                    );

                                }


                                // ------------------------------------
                                // MINUS
                                // ------------------------------------

                                const minusButton =
                                    document.createElement(
                                        "button"
                                    );


                                minusButton.type =
                                    "button";


                                minusButton.className =
                                    "durability-button durability-minus";


                                minusButton.textContent =
                                    "−";


                                // ------------------------------------
                                // NUMBER
                                // ------------------------------------

                                                                const display =
                                    document.createElement(
                                        "span"
                                    );


                                display.className =
                                    "durability-number";


                                if (
                                    stat.conditionType ===
                                    "integrity"
                                ) {

                                    display.classList.add(
                                        "integrity-number"
                                    );

                                }


                                display.textContent =
                                    String(
                                        stat.value
                                    );


                                if (
                                    stat.modified === true &&
                                    stat.conditionType ===
                                        "integrity"
                                ) {

                                    display.style.setProperty(
                                        "color",
                                        "#9eff97",
                                        "important"
                                    );

                                }


                                 if (
                                    stat.modified === true &&
                                    stat.conditionType ===
                                        "integrity"
                                ) {

                                    markModifiedElement(
                                        display
                                    );

                                }


                                // ------------------------------------
                                // PLUS
                                // ------------------------------------

                                const plusButton =
                                    document.createElement(
                                        "button"
                                    );


                                plusButton.type =
                                    "button";


                                plusButton.className =
                                    "durability-button durability-plus";


                                plusButton.textContent =
                                    "+";


                                // ------------------------------------
                                // DON'T TRIGGER PARENT SLOT
                                // ------------------------------------

                                value.onclick =
                                    function (
                                        event
                                    ) {

                                        event.stopPropagation();

                                    };


                                minusButton.onclick =
                                    function (
                                        event
                                    ) {

                                        event.preventDefault();
                                        event.stopPropagation();


                                        if (
                                            changeDisplayedCondition(
                                                instance,
                                                stat,
                                                -1
                                            )
                                        ) {

                                            saveAndRender();

                                        }

                                    };


                                plusButton.onclick =
                                    function (
                                        event
                                    ) {

                                        event.preventDefault();
                                        event.stopPropagation();


                                        if (
                                            changeDisplayedCondition(
                                                instance,
                                                stat,
                                                1
                                            )
                                        ) {

                                            saveAndRender();

                                        }

                                    };


                                value.appendChild(
                                    minusButton
                                );


                                value.appendChild(
                                    display
                                );


                                value.appendChild(
                                    plusButton
                                );

                            }


                            // ========================================
                            // ORDINARY VALUE
                            // ========================================

                            else {

                                value =
                                    document.createElement(
                                        "span"
                                    );


                                value.className =
                                    "dynamic-value";


                                if (
                                    stat.injuryAffected ===
                                    true
                                ) {

                                    value.classList.add(
                                        "injury-affected"
                                    );

                                }


                                value.textContent =
                                    "";


                                const normalValue =
                                    document.createElement(
                                        "span"
                                    );


                                normalValue.style.whiteSpace =
                                    "nowrap";


                                normalValue.style.flex =
                                    "none";


                                normalValue.textContent =
                                    stat.value ===
                                        null ||
                                    stat.value ===
                                        undefined
                                        ? ""
                                        : String(
                                            stat.value
                                        );


                                value.appendChild(
                                    normalValue
                                );


                                if (stat.modified === true) {

                                    markModifiedElement(value);

                                }


                                                                if (
                                    stat.skillAdded ===
                                    true
                                ) {

                                    value.style.setProperty(
                                        "color",
                                        "#9ecfff",
                                        "important"
                                    );

                                }


                                // ====================================================
                                // SWORD & BOARD REMINDER
                                // ====================================================

                                if (
                                    stat.swordAndBoardReminder !==
                                        null &&
                                    stat.swordAndBoardReminder !==
                                        undefined
                                ) {

                                    const reminder =
                                        document.createElement(
                                            "span"
                                        );


                                    reminder.className =
                                        "sword-and-board-reminder";


                                    reminder.textContent =
                                        "(" +
                                        stat.swordAndBoardReminder +
                                        " A)";


                                    value.appendChild(
                                        reminder
                                    );

                                }


                                // ====================================================
                                // HALF-SWORDING REMINDER
                                // ====================================================

                                if (
                                    stat.halfSwordingReminder ===
                                    true
                                ) {

                                    value.classList.add(
                                        "half-swording-value"
                                    );


                                    const reminder =
                                        document.createElement(
                                            "span"
                                        );


                                    reminder.className =
                                        "half-swording-reminder";


                                    reminder.textContent =
                                        "(+ d8)";


                                    value.appendChild(
                                        reminder
                                    );

                                }

                            }


                            // ========================================
                            // APPEND
                            // ========================================

                            row.appendChild(
                                name
                            );


                            row.appendChild(
                                value
                            );


                            column.appendChild(
                                row
                            );


                            rowIndex +=
                                1;

                        }
                    );

            }
        );

    }


    // ============================================================
    // PART 10 OF 12 — EQUIPMENT RENDERING, SHIELD INTEGRITY
    //                  & GIGUE / SWASHBUCKLING DISPLAYS
    // ============================================================


    // ========================================================
    // SET ELEMENT TEXT
    // ========================================================

    function setElementText(
        element,
        value
    ) {

        if (
            !element
        ) {

            return;

        }


        const text =
            value === undefined ||
            value === null
                ? ""
                : String(
                    value
                );


        if (
            element instanceof
                HTMLInputElement ||
            element instanceof
                HTMLTextAreaElement
        ) {

            element.value =
                text;
                            return;

        }


        element.textContent =
    "";


const parts =
    text.split(
        "*"
    );


parts.forEach(
    function (
        part,
        index
    ) {

        if (
            index >
            0
        ) {

            const asterisk =
                document.createElement(
                    "span"
                );


            asterisk.textContent =
                "*";


            markModifiedElement(
                asterisk
            );


            element.appendChild(
                asterisk
            );

        }


        element.appendChild(
            document.createTextNode(
                part
            )
        );

    }
);

    }


    // ========================================================
    // GET COLUMN FIELD
    // ========================================================

    function getColumnField(
        column,
        fieldName
    ) {

        if (
            !column ||
            !fieldName
        ) {
            return null;
        }


        // ----------------------------------------------------
        // DATA-FIELD MARKUP
        // ----------------------------------------------------

        const dataField =
            column.querySelector(
                '[data-field="' +
                fieldName +
                '"]'
            );


        if (dataField) {
            return dataField;
        }


        // ----------------------------------------------------
        // ACTUAL GEAR-SHEET.HTML MARKUP
        // ----------------------------------------------------

        const selectors = {

            name:
                ".column-name",

            reach:
                ".column-reach",

            weight:
                ".column-weight",

            block:
                ".block-value",

            integrity:
                ".durability-value",

            durability:
                ".durability-value",

            "fixed-stat":
                ".column-fixed-stat"

        };


        const selector =
            selectors[fieldName];


        if (!selector) {
            return null;
        }


        return column.querySelector(
            selector
        );
    }


    // ========================================================
    // GET FIRST MATCHING COLUMN FIELD
    // ========================================================

    function getFirstColumnField(
        column,
        fieldNames
    ) {

        if (
            !column ||
            !Array.isArray(
                fieldNames
            )
        ) {

            return null;

        }


        for (
            const fieldName of
            fieldNames
        ) {

            const field =
                getColumnField(
                    column,
                    fieldName
                );


            if (
                field
            ) {

                return field;

            }

        }


        return null;

    }


    // ========================================================
    // GET SHIELD BLOCK
    // ========================================================

    function getShieldBlock(
        instance
    ) {

        if (
            !instance
        ) {

            return "";

        }


        const definition =
            getDefinition(
                instance
            ) ||
            {};


        // ----------------------------------------------------
        // DIRECT BLOCK PROPERTY
        // ----------------------------------------------------

        if (
            definition.block !==
                undefined &&
            definition.block !==
                null
        ) {

            return definition.block;

        }


        // ----------------------------------------------------
        // DEFENSE COLLECTION FALLBACK
        // ----------------------------------------------------

        const defenses =
            normalizeStatCollection(
                definition.defenses
            );


        const block =
            defenses.find(
                function (
                    stat
                ) {

                    return (
                        String(
                            stat.name ||
                            ""
                        )
                        .trim()
                        .toLowerCase() ===
                        "block"
                    );

                }
            );


        return block
            ? block.value
            : "";

    }


    // ========================================================
    // GET SHIELD REACH
    // ========================================================

    function getShieldReach(
        instance
    ) {

        if (
            !instance
        ) {

            return "";

        }


        const definition =
            getDefinition(
                instance
            ) ||
            {};


        return (
            definition.reach ??
            ""
        );

    }


    // ========================================================
    // GET EFFECTIVE ITEM WEIGHT
    // ========================================================

    function getEffectiveItemWeight(
        instance
    ) {

        if (!instance) {

            return "";

        }


        const definition =
            getDefinition(
                instance
            ) ||
                {};


        const baseWeight =
            Number(
                definition.weight
            );


        if (
            !Number.isFinite(
                baseWeight
            )
        ) {

            return "";

        }


        const reinforcedBonus =
            itemHasModification(
                instance,
                "reinforced"
            )
                ? 1
                : 0;


        return (
            baseWeight +
            reinforcedBonus
        );

    }


    // ========================================================
    // GET SHIELD WEIGHT
    // ========================================================

    function getShieldWeight(
        instance
    ) {

        return getEffectiveItemWeight(
            instance
        );

    }


    // ========================================================
    // CREATE CONDITION CONTROL
    // ========================================================
    //
    // Used by the fixed condition fields in the center columns.
    //
    // Shields:
    //
    //     Integrity
    //
    // Other equipment:
    //
    //     Durability
    // ========================================================

    function createConditionControl(
        instanceId,
        currentValue,
        type
    ) {

        const control =
            document.createElement(
                "div"
            );


        control.className =
            "durability-control";


        if (
            type ===
            "integrity"
        ) {

            control.classList.add(
                "integrity-control"
            );

        }


        // ====================================================
        // MINUS
        // ====================================================

        const minus =
            document.createElement(
                "button"
            );


        minus.type =
            "button";


        minus.className =
            "durability-button durability-minus";


        minus.textContent =
            "−";


        // ====================================================
        // NUMBER
        // ====================================================

        const number =
            document.createElement(
                "span"
            );


        number.className =
            "durability-number";


        if (
            type ===
            "integrity"
        ) {

            number.classList.add(
                "integrity-number"
            );

        }


        number.textContent =
            String(
                currentValue
            );


        // ====================================================
        // PLUS
        // ====================================================

        const plus =
            document.createElement(
                "button"
            );


        plus.type =
            "button";


        plus.className =
            "durability-button durability-plus";


        plus.textContent =
            "+";


        // ====================================================
        // PREVENT COLUMN CLICK
        // ====================================================

        control.onclick =
            function (
                event
            ) {

                event.stopPropagation();

            };


        // ====================================================
        // DECREASE
        // ====================================================

        minus.onclick =
            function (
                event
            ) {

                event.preventDefault();
                event.stopPropagation();


                let changed =
                    false;


                if (
                    type ===
                    "integrity"
                ) {

                    changed =
                        changeShieldIntegrity(
                            instanceId,
                            -1
                        );

                }

                else {

                    changed =
                        changeDurability(
                            instanceId,
                            -1
                        );

                }


                if (
                    changed
                ) {

                    saveAndRender();

                }

            };


        // ====================================================
        // INCREASE
        // ====================================================

        plus.onclick =
            function (
                event
            ) {

                event.preventDefault();
                event.stopPropagation();


                let changed =
                    false;


                if (
                    type ===
                    "integrity"
                ) {

                    changed =
                        changeShieldIntegrity(
                            instanceId,
                            1
                        );

                }

                else {

                    changed =
                        changeDurability(
                                                        instanceId,
                            1
                        );

                }


                if (
                    changed
                ) {

                    saveAndRender();

                }

            };


        control.appendChild(
            minus
        );


        control.appendChild(
            number
        );


        control.appendChild(
            plus
        );


        return control;

    }


    // ========================================================
    // RENDER CONDITION FIELD
    // ========================================================

    function renderConditionField(
        field,
        instance
    ) {

        if (
            !field
        ) {

            return;

        }


        field.innerHTML =
            "";


        if (
            !instance ||
            !itemHasDurability(
                instance
            )
        ) {

            return;

        }


        // ====================================================
        // SHIELD — INTEGRITY
        // ====================================================

        if (
            itemUsesIntegrity(
                instance
            )
        ) {

            field.dataset.field =
                "integrity";


            const integrity =
                ensureShieldIntegrity(
                    instance
                );


            const control = createConditionControl(
                instance.id,
                integrity,
                "integrity"
            );


            if (
                itemHasModification(
                    instance,
                    "reinforced"
                ) ||
                itemHasModification(
                    instance,
                    "center-grip"
                )
            ) {

                const integrityNumber =
                    control.querySelector(
                        ".integrity-number, .durability-number"
                    );


                if (
                    integrityNumber
                ) {

                    integrityNumber.style.setProperty(
                        "color",
                        "#9eff97",
                        "important"
                    );

                }

            }


            field.appendChild(control);


            return;

        }


        // ====================================================
        // ORDINARY EQUIPMENT — DURABILITY
        // ====================================================

        field.dataset.field =
            "durability";


        const durability =
            ensureInstanceDurability(
                instance
            );


        field.appendChild(
            createConditionControl(
                instance.id,
                durability,
                "durability"
            )
        );

    }


    // ========================================================
    // RENDER SHIELD INTEGRITY FIELD
    // ========================================================

    function renderShieldIntegrityField(
        field,
        instanceId
    ) {

        if (
            !field
        ) {

            return;

        }


        field.innerHTML =
            "";


        if (
            !instanceId
        ) {

            return;

        }


        const instance =
            getItem(
                instanceId
            );


        if (
            !instance ||
            !instanceIsShield(
                instance
            )
        ) {

            return;

        }


        field.dataset.field =
            "integrity";


        const integrity =
            ensureShieldIntegrity(
                instance
            );


                const control =
            createConditionControl(
                instanceId,
                integrity,
                "integrity"
            );


        if (
            itemHasModification(
                instance,
                "reinforced"
            ) ||
            itemHasModification(
                instance,
                "center-grip"
            )
        ) {

            const integrityNumber =
                control.querySelector(
                    ".integrity-number, .durability-number"
                );


            if (
                integrityNumber
            ) {

                integrityNumber.style.setProperty(
                    "color",
                    "#9eff97",
                    "important"
                );

            }

        }


        field.appendChild(
            control
        );

    }


    // ========================================================
    // RENDER STANDARD ITEM COLUMN
    // ========================================================

    function renderItemColumn(
        column,
        instanceId
    ) {

        if (!column) {
            return;
        }


        // ====================================================
        // EMPTY
        // ====================================================

        if (!instanceId) {

            clearColumn(
                column
            );

            return;
        }


        const instance =
            getItem(
                instanceId
            );


        if (!instance) {

            clearColumn(
                column
            );

            return;
        }


        const definition =
            getDefinition(
                instance
            ) || {};


        column.classList.remove(
            "empty"
        );


        // ====================================================
        // NAME
        // ====================================================

        const nameField =
            getColumnField(
                column,
                "name"
            );


        let displayName =
            getDisplayedItemName(
                instance
            );


        /*
           Keep the 2H marker on its own line in the detail
           column when appropriate.
        */

        const showTwoHandedMarker =
    displayName.endsWith(
        " (2H)"
    );


if (
    showTwoHandedMarker
) {

    displayName =
        displayName.slice(
            0,
            -5
        );

}


setElementText(
    nameField,
    displayName
);


if (
    showTwoHandedMarker &&
    nameField
) {

    const twoHandedMarker =
        document.createElement(
            "span"
        );


    twoHandedMarker.className =
        "two-handed-name-marker";


    twoHandedMarker.textContent =
        "(2H)";


    nameField.appendChild(
        twoHandedMarker
    );

}


        // ====================================================
        // REACH
        // ====================================================

        renderReachField(
            getColumnField(
                column,
                "reach"
            ),
            instance
        );


        // ====================================================
        // WEIGHT
        // ====================================================

                const displayedWeightField =
            getColumnField(
                column,
                "weight"
            );


        setElementText(
            displayedWeightField,
            getEffectiveItemWeight(
                instance
            )
        );


        if (
            displayedWeightField
        ) {

            displayedWeightField
                .classList
                .remove(
                    "modified-value"
                );

            displayedWeightField.style.color =
                "";


            if (
                itemHasModification(
                    instance,
                    "reinforced"
                )
            ) {

                markModifiedElement(
                    displayedWeightField
                );

            }

        }


        // ====================================================
        // REMOVE THE HTML PLACEHOLDER STAT ROWS
        // ====================================================
        //
        // The HTML contains blank dynamic rows so the original
        // layout has the correct structure.
        //
        // renderStatRows() will recreate exactly the rows needed
        // for the current item.
        // ====================================================

        column
            .querySelectorAll(
                ".dynamic-row"
            )
            .forEach(
                function (row) {

                    row.remove();

                }
            );


        // ====================================================
        // RENDER CURRENT ITEM STATS
        // ====================================================
        //
        // IMPORTANT:
        //
        // Do this unconditionally.
        //
        // The real HTML does NOT have a "dynamic-stats" class
        // or data-dynamic-stats attribute.
        // ====================================================

        renderStatRows(
            column,
            instance
        );
    }


    // ========================================================
    // RENDER GIGUE SHIELD DETAIL COLUMN
    // ========================================================

    function renderGigueShieldColumn() {

        const column =
            columnElements
                .gigueShield;


        if (
            !column
        ) {

            return;

        }


        const instanceId =
            getGigueShieldId();


        const instance =
            getItem(
                instanceId
            );


        // ====================================================
        // EMPTY
        // ====================================================

        if (
            !instance ||
            !instanceIsShield(
                instance
            )
        ) {

            clearColumn(
                column
            );

            return;

        }


        column.classList.remove(
            "empty"
        );


        column.classList.remove(
            "eligible"
        );


        // ====================================================
        // FIELDS
        // ====================================================

        const nameField =
            getColumnField(
                column,
                "name"
            );


        const reachField =
            getColumnField(
                column,
                "reach"
            );


        const blockField =
            getColumnField(
                column,
                "block"
            );


        const integrityField =
            getColumnField(
                column,
                "integrity"
            );


        const weightField =
            getColumnField(
                column,
                "weight"
            );


        // ====================================================
        // NAME
        // ====================================================

        setElementText(
            nameField,
            getDisplayedItemName(
                instance
            )
        );


        // ====================================================
        // REACH
        // ====================================================

        setElementText(
            reachField,
            ""
        );

            // ====================================================
    // BLOCK
    // ====================================================

    if (blockField) {

        blockField.innerHTML = "";

        const normalBlock = document.createElement("span");
        normalBlock.textContent = getShieldBlock(instance);
        blockField.appendChild(normalBlock);


        if (
            itemHasModification(
                instance,
                "gigue-strap"
            )
        ) {

            const reminder =
                document.createElement(
                    "span"
                );


            reminder.textContent =
                "(D)";


            reminder.style.marginLeft =
                "8px";


            reminder.style.whiteSpace =
                "nowrap";


            markModifiedElement(
                reminder
            );


            blockField.appendChild(
                reminder
            );

        }

    }


    // ====================================================
    // INTEGRITY
    // ====================================================

    renderShieldIntegrityField(
        integrityField,
        instanceId
    );


    // ====================================================
    // WEIGHT
    // ====================================================

    setElementText(
        weightField,
        getShieldWeight(
            instance
        )
    );


    if (
        weightField
    ) {

        weightField
            .classList
            .remove(
                "modified-value"
            );

        weightField.style.color =
            "";


        if (
            itemHasModification(
                instance,
                "reinforced"
            )
        ) {

            markModifiedElement(
                weightField
            );

        }

    }


    // ====================================================
    // DELETE / REFUND
    // ====================================================

    if (
        nameField
    ) {

        nameField.onclick =
            function (
                event
            ) {

                event.stopPropagation();


                removeItem(
                    instanceId
                );

            };

    }

}


    // ========================================================
    // RENDER ALL EQUIPMENT COLUMNS
    // ========================================================

    function renderEquipmentColumns() {

        const gear =
            getGear();


        // ====================================================
        // MAIN HANDS
        // ====================================================

        renderItemColumn(
            columnElements.leftHand,
            gear.leftHand
        );


        renderItemColumn(
            columnElements.rightHand,
            gear.rightHand
        );


        // ====================================================
        // SIDEARMS
        // ====================================================

        renderItemColumn(
            columnElements.leftSidearm,
            gear.leftSidearm
        );


        renderItemColumn(
            columnElements.rightSidearm,
            gear.rightSidearm
        );


        // ====================================================
        // SWASHBUCKLING
        // ====================================================

        renderBucklerColumn(
            columnElements.leftBuckler,
            gear.leftBuckler,
            "left"
        );

        renderBucklerColumn(
            columnElements.rightBuckler,
            gear.rightBuckler,
            "right"
        );


        // ====================================================
        // GIGUE
        // ====================================================

        const gigueShieldId =
            getGigueShieldId();


        renderGigueShieldColumn(
            columnElements.gigueShield,
            gigueShieldId
        );

    }


    // ============================================================
    // PART 11 OF 12 — MAIN RENDERING, CENTER LOCATIONS & ARMOR
    // ============================================================


    // ========================================================
    // GET WORN ARMOR
    // ========================================================
    //
    // Armor is selected directly by the Builder and stored as:
    //
    //     state.builder.armor
    //
    // Valid values:
    //
    //     light
    //     medium
    //     heavy
    //
    // Armor is NOT a normal inventory instance.
    // ========================================================

    function getWornArmorInstance() {

        const armorId =
            String(
                state?.builder?.armor ||
                ""
            )
            .trim()
            .toLowerCase();


        const armorData = {

            light: {
                id: "light",
                name: "Light",
                armor: 5,
                durability: "Slash 5",
                padding: 3,
                mobilityPenalty: 0,
                stealthPenalty: 0,
                fatigue: 1,
                weight: 2
            },

            medium: {
                id: "medium",
                name: "Medium",
                armor: 7,
                durability: "Thrust 8",
                padding: 2,
                mobilityPenalty: -1,
                stealthPenalty: -2,
                fatigue: 2,
                weight: 4
            },

            heavy: {
                id: "heavy",
                name: "Heavy",
                armor: 10,
                durability: "Bash 10",
                padding: 1,
                mobilityPenalty: -3,
                stealthPenalty: -4,
                fatigue: 3,
                weight: 5
            }

        };


        const armor = armorData[armorId]
            ? { ...armorData[armorId] }
            : null;


        if (armor && armorHasModification("cushioned")) {

            armor.padding += 1;
            armor.fatigue += 1;
            armor.modified = true;

        }


        return armor;

    }


    // ========================================================
    // ADD TO CURRENT FATIGUE
    // ========================================================

    function addToCurrentFatigue(
        amount
    ) {

        const numericAmount =
            Number(
                amount
            );


        if (
            !Number.isFinite(
                numericAmount
            ) ||
            numericAmount <= 0
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


        const currentFatigue =
            Math.max(
                0,
                Number(
                    currentState
                        .derived
                        .currentFatigue
                ) || 0
            );


        currentState
            .derived
            .currentFatigue =
                currentFatigue +
                numericAmount;


        KKState.save(
            currentState
        );

    }


    // ========================================================
    // GET ARMOR DISPLAY NAME
    // ========================================================

    function getArmorDisplayName(
        instance
    ) {

        if (
            !instance
        ) {

            return "";

        }


        const definition =
            getDefinition(
                instance
            ) ||
            {};


        return (

            definition.name ||

            instance.name ||

            instance.itemId ||

            ""

        );

    }


    // ========================================================
    // GET ARMOR PADDING
    // ========================================================

    function getArmorPadding(
        instance
    ) {

        if (
            !instance
        ) {

            return "";

        }


        const definition =
            getDefinition(
                instance
            ) ||
            {};


        // ====================================================
        // DIRECT PROPERTY
        // ====================================================

        if (
            definition.padding !==
                undefined &&
            definition.padding !==
                null
        ) {

            return definition.padding;

        }


        // ====================================================
        // DEFENSE / STAT COLLECTION FALLBACK
        // ====================================================

        const collections = [

            definition.defenses,

            definition.stats

        ];


        for (
            const collection of
            collections
        ) {

            const stats =
                normalizeStatCollection(
                    collection
                );


            const padding =
                stats.find(
                    function (
                        stat
                    ) {

                        return (
                            String(
                                stat.name ||
                                ""
                            )
                            .trim()
                            .toLowerCase() ===
                            "padding"
                        );

                    }
                );


            if (
                padding
            ) {

                return (
                    padding.value ??
                    ""
                );

            }

        }


        return "";

    }


    // ========================================================
    // GET ARMOR ELEMENTS
    // ========================================================

    function getArmorElements() {

        return {

            // ------------------------------------------------
            // WHOLE ARMOR AREA
            // ------------------------------------------------

            area:

                document.getElementById(
                    "armorArea"
                ) ||

                document.querySelector(
                    ".armor-area"
                ),


            // ------------------------------------------------
            // INDIVIDUAL FULL SECTIONS
            // ------------------------------------------------

            nameSection:

                document.getElementById(
                    "armorNameSection"
                ) ||

                document.querySelector(
                    ".armor-name-section"
                ) ||

                document.querySelector(
                    '[data-armor-section="name"]'
                ),


            durabilitySection:

                document.getElementById(
                    "armorDurabilitySection"
                ) ||

                document.querySelector(

                                        ".armor-durability-section"
                ) ||

                document.querySelector(
                    '[data-armor-section="durability"]'
                ),


            paddingSection:

                document.getElementById(
                    "armorPaddingSection"
                ) ||

                document.querySelector(
                    ".armor-padding-section"
                ) ||

                document.querySelector(
                    '[data-armor-section="padding"]'
                ),


            // ------------------------------------------------
            // TEXT / VALUE FIELDS
            // ------------------------------------------------

            name:

                document.getElementById(
                    "armorName"
                ) ||

                document.querySelector(
                    '[data-armor-field="name"]'
                ),


            durability:

                document.getElementById(
                    "armorDurability"
                ) ||

                document.querySelector(
                    '[data-armor-field="durability"]'
                ),


            padding:

                document.getElementById(
                    "armorPadding"
                ) ||

                document.querySelector(
                    '[data-armor-field="padding"]'
                )

        };

    }


    // ========================================================
    // SET ARMOR BLACKOUT
    // ========================================================
    //
    // When no armor is worn:
    //
    //     Armor      = black
    //     Durability = black
    //     Padding    = black
    //
    // We mark BOTH:
    //
    //     - the whole armor wrapper
    //     - each full section
    //     - each actual text field
    //
    // This gives the CSS enough information to blackout the
    // complete printed area rather than only the textbox.
    // ========================================================

    function setArmorBlackout(
        blackout
    ) {

        const armor =
            getArmorElements();


        const shouldBlackout =
            Boolean(
                blackout
            );


        // ====================================================
        // WHOLE WRAPPER
        // ====================================================

        if (
            armor.area
        ) {

            armor.area.classList.toggle(
                "empty",
                shouldBlackout
            );


            armor.area.classList.toggle(
                "armor-blackout",
                shouldBlackout
            );

        }


        // ====================================================
        // FULL SECTIONS
        // ====================================================

        [

            armor.nameSection,

            armor.durabilitySection,

            armor.paddingSection

        ].forEach(
            function (
                section
            ) {

                if (
                    !section
                ) {

                    return;

                }


                section.classList.toggle(
                    "armor-blackout",
                    shouldBlackout
                );


                section.classList.toggle(
                    "armor-empty",
                    shouldBlackout
                );

            }
        );


        // ====================================================
        // ACTUAL FIELDS
        // ====================================================

        [

            armor.name,

            armor.durability,

            armor.padding

        ].forEach(
            function (
                field
            ) {

                if (
                    !field
                ) {

                    return;

                }


                field.classList.toggle(
                    "armor-empty",
                    shouldBlackout
                );

            }
        );

    }


    // ========================================================
    // RENDER ARMOR DURABILITY
    // ========================================================

    function renderArmorDurability(
        field,
        instance
    ) {

        if (
            !field
        ) {

            return;

        }


        field.innerHTML =
            "";


        if (
            !instance
        ) {

            return;

        }


        const durability =
            ensureInstanceDurability(
                instance
            );


        field.appendChild(
            createConditionControl(
                instance.id,
                durability,
                "durability"
            )
        );

    }


    // ========================================================
    // RENDER ARMOR
    // ========================================================

    function renderArmor() {

        const elements =
            getArmorElements();


        const armor =
            getWornArmorInstance();


        // ====================================================
        // NO ARMOR
        // ====================================================

        if (
            !armor
        ) {

            setElementText(
                elements.name,
                ""
            );


            setElementText(
                elements.durability,
                ""
            );


            setElementText(
                elements.padding,
                ""
            );


            setArmorBlackout(
                true
            );


            return;
        }


        // ====================================================
        // ARMOR WORN
        // ====================================================

        setArmorBlackout(
            false
        );


        // ----------------------------------------------------
        // ARMOR
        //
        // Despite the historical HTML ID "armorName",
        // this field displays the Armor STAT, not its name.
        // ----------------------------------------------------

        setElementText(
            elements.name,
            armor.armor
        );


        // ----------------------------------------------------
        // DURABILITY
        // ----------------------------------------------------

        setElementText(
            elements.durability,
            armor.durability
        );


        // ----------------------------------------------------
        // PADDING
        //
        // Displayed Armor Padding =
        //
        // Main Sheet Base Padding
        // +
        // Armor Padding
        // ----------------------------------------------------

        const basePadding =
            Number(
                state?.derived?.basePadding
            ) || 0;


        const finalPadding =
            basePadding +
            Number(
                armor.padding
            );


        setElementText(
            elements.padding,
            finalPadding
        );


        if (elements.padding) {

            elements.padding.classList.remove("modified-value");
            elements.padding.style.color = "";


            if (armor.modified) {

                markModifiedElement(elements.padding);

            }

        }

    }


    // ========================================================
    // RENDER ONE CENTER LOCATION
    // ========================================================

    function renderLocation(
        element,
        instanceId,
        options = {}
    ) {

        if (
            !element
        ) {

            return;

        }


        const {

            eligible =
                false,

            inactive =
                false,

            text =
                null

        } =
            options;


        // ====================================================
        // STATE CLASSES
        // ====================================================

        element.classList.toggle(
            "eligible",
            Boolean(
                eligible
            )
        );


        element.classList.toggle(
            "inactive",
            Boolean(
                inactive
            )
        );


        element.classList.toggle(
            "occupied",
            Boolean(
                instanceId
            )
        );


        element.classList.toggle(
            "empty",
            !instanceId
        );


        // ====================================================
        // EMPTY
        // ====================================================

        if (
            !instanceId
        ) {

            element.textContent =
                "";


            return;

        }


        // ====================================================
        // OCCUPIED
        // ====================================================

        const instance =
            getItem(
                instanceId
            );


        if (
            !instance
        ) {

            element.textContent =
                "";


            element.classList.remove(
                "occupied"
            );


            element.classList.add(
                "empty"
            );


            return;

        }


        // ====================================================
        // TEXT
        // ====================================================

        if (
    text !==
    null
) {

    setElementText(
        element,
        String(
            text
        )
    );

}

else {

    setElementText(
        element,
        getDisplayedItemName(
            instance
        )
    );

}

    }


    // ========================================================
    // GET SIDEARM DISPLAY TEXT
    // ========================================================

    function getSidearmDisplayText(
        side
    ) {

        const sidearmId =
            getSidearmItemId(
                side
            );


        if (
            !sidearmId
        ) {

            return "";

        }


        const sidearm =
            getItem(
                sidearmId
            );


        if (
            !sidearm
        ) {

            return "";

        }


        let text =
            getDisplayedItemName(
                sidearm
            );


        // ====================================================
        // PAIRED BUCKLER
        // ====================================================

        const bucklerId =
            getBucklerInstanceId(
                side
            );


        if (
            bucklerId &&
            isBuckler(
                bucklerId
            )
        ) {

            const buckler =
                getItem(
                    bucklerId
                );


            if (
                buckler
            ) {

                text +=
                    " + " +
                    getDisplayedItemName(
                        buckler
                    );

            }

        }


        return text;

    }


    // ========================================================
    // RENDER HANDS
    // ========================================================
    //
    // Occupied hand fields are highlighted only when clicking
    // that field can actually perform an interaction.
    //
    // TRUE 2H:
    //     occupies both arms, but neither arm is clickable.
    //
    // SHIELD / BUCKLER:
    //     clickable when it can legally switch hands.
    //
    // ORDINARY / VERSATILE WEAPON:
    //     clickable for its normal hand cycle.
    // ========================================================

    function renderHandLocations() {

        const gear =
            getGear();


        const leftWounded =
            isArmWounded(
                "left"
            );


        const rightWounded =
            isArmWounded(
                "right"
            );


        locationElements
            .leftHand
            .classList
            .toggle(
                "arm-wounded",
                leftWounded
            );


        locationElements
            .rightHand
            .classList
            .toggle(
                "arm-wounded",
                rightWounded
            );


        // ====================================================
        // LEFT HAND
        // ====================================================

        const leftId =
            gear.leftHand ||
            gear.leftHandBuckler ||
            null;


        let leftEligible =
            false;


        if (
            !leftWounded &&
            leftId &&
            !isTrueTwoHandedWeapon(
                leftId
            )
        ) {

            leftEligible =
                true;

        }


        renderLocation(
            locationElements.leftHand,
            leftId,
            {
                eligible:
                    leftEligible
            }
        );


        // ====================================================
        // RIGHT HAND
        // ====================================================

        const rightId =
            gear.rightHand ||
            gear.rightHandBuckler ||
            null;


        let rightEligible =
            false;


        if (
            !rightWounded &&
            rightId &&
            !isTrueTwoHandedWeapon(
                rightId
            )
        ) {

            rightEligible =
                true;

        }


        renderLocation(
            locationElements.rightHand,
            rightId,
            {
                eligible:
                    rightEligible
            }
        );

    }


    // ========================================================
    // RENDER SIDEARMS
    // ========================================================
    //
    // A Sidearm field is eligible in BOTH directions:
    //
    // EMPTY:
    //     An equipped Sidearm can be stowed here.
    //
    // OCCUPIED:
    //     The stored Sidearm can be drawn.
    //
    // ========================================================

    function renderSidearmLocations() {

        const gear =
            getGear();


        // ====================================================
        // LEFT
        // ====================================================

        renderLocation(
            locationElements.leftSidearm,
            gear.leftSidearm,
            {

                eligible:
                    Boolean(
                        canInteractWithSidearmSlot(
                            "left"
                        )
                    ),

                text:
                    gear.leftSidearm
                        ? getSidearmDisplayText(
                            "left"
                        )
                        : null

            }
        );


        // ====================================================
        // RIGHT
        // ====================================================

        renderLocation(
            locationElements.rightSidearm,
            gear.rightSidearm,
            {

                eligible:
                    Boolean(
                        canInteractWithSidearmSlot(
                            "right"
                        )
                    ),

                text:
                    gear.rightSidearm
                        ? getSidearmDisplayText(
                            "right"
                        )
                        : null

            }
        );

    }


    // ========================================================
    // RENDER GIGUE LOCATIONS
    // ========================================================

    function renderGigueLocations() {

        const gear =
            getGear();


        const leftOccupied =
            Boolean(
                gear.leftGigue
            );


        const rightOccupied =
            Boolean(
                gear.rightGigue
            );


        // ====================================================
        // LEFT
        // ====================================================

        renderLocation(
            locationElements.leftGigue,
            gear.leftGigue,
            {

                eligible:

                    canInteractWithGigueSlot(
                        "left"
                    ),

                inactive:

                    Boolean(

                        rightOccupied &&

                        !leftOccupied

                    )

            }
        );


        // ====================================================
        // RIGHT
        // ====================================================

        renderLocation(
            locationElements.rightGigue,
            gear.rightGigue,
            {

                eligible:

                    canInteractWithGigueSlot(
                        "right"
                    ),

                inactive:

                    Boolean(

                        leftOccupied &&

                        !rightOccupied

                    )

            }
        );

    }


    // ========================================================
    // RENDER SWASHBUCKLING / BUCKLER COLUMN
    // ========================================================
    //
    // This ORIGINAL detail column is also the interactive
    // Swashbuckling field.
    //
    // EMPTY + ELIGIBLE:
    //     highlight and click to Swash.
    //
    // OCCUPIED + ELIGIBLE:
    //     highlight and click to Unswash.
    // ========================================================

    function renderBucklerColumn(
        column,
        instanceId,
        side
    ) {

        if (
            !column
        ) {
            return;
        }


        const eligible =
            canInteractWithBucklerColumn(
                side
            );


        // ====================================================
        // EMPTY SWASH FIELD
        // ====================================================

        if (
            !instanceId
        ) {

            clearColumn(
                column
            );


            // clearColumn() removes eligibility,
            // so restore the correct interactive state here.

            column.classList.toggle(
                "eligible",
                eligible
            );


            column.classList.toggle(
                "inactive",
                !hasSwashbuckling()
            );


            return;
        }


        // ====================================================
        // OCCUPIED SWASH FIELD
        // ====================================================

        const instance =
            getItem(
                instanceId
            );


        if (
            !instance ||
            !instanceIsShield(
                instance
            )
        ) {

            clearColumn(
                column
            );


            column.classList.remove(
                "eligible"
            );


            return;
        }


        column.classList.remove(
            "empty"
        );


        column.classList.add(
            "occupied"
        );


        column.classList.toggle(
            "eligible",

                        eligible
        );


        column.classList.toggle(
            "inactive",
            !hasSwashbuckling()
        );


        // ====================================================
        // NAME
        // ====================================================

        setElementText(
            getColumnField(
                column,
                "name"
            ),
            getDisplayedItemName(
                instance
            )
        );


        // ====================================================
        // REACH
        // ====================================================

        setElementText(
            getColumnField(
                column,
                "reach"
            ),
            getDisplayedReach(
                instance
            )
        );


        // ====================================================
        // BLOCK
        // ====================================================

        const definition =
            getDefinition(
                instance
            ) ||
            {};


        const blockField =
            column.querySelector(
                ".column-fixed-stat, .block-value"
            );


        if (
            blockField
        ) {

            let blockValue =
                "";


            const defenses =
                Array.isArray(
                    definition.defenses
                )
                    ? definition.defenses
                    : [];


            const blockDefense =
                defenses.find(
                    function (
                        defense
                    ) {

                        return (
                            defense &&
                            String(
                                defense.name ||
                                ""
                            ).toLowerCase() ===
                                "block"
                        );
                    }
                );


            if (
                blockDefense
            ) {

                blockValue =
                    blockDefense.value ??
                    "";
            }


            setElementText(
                blockField,
                blockValue
            );
        }
    }


    // ========================================================
    // RENDER SWASHBUCKLING CENTER LOCATIONS
    // ========================================================
    //
    // The original detail columns now handle the actual
    // Swash / Unswash interaction and eligibility.
    //
    // There are no separate center Buckler slots anymore.
    // ========================================================

    function renderBucklerLocations() {

        // Intentionally empty.
        //
        // Swashbuckling is rendered by:
        //
        //     renderBucklerColumn()
        //
        // inside renderEquipmentColumns().

    }


    // ========================================================
    // RENDER CENTER LOCATIONS
    // ========================================================

    function renderCenterLocations() {

        renderHandLocations();

        renderSidearmLocations();

        renderGigueLocations();

        renderBucklerLocations();

    }


    // ========================================================
    // REPAIR ARM-WOUND HAND CONFLICTS
    // ========================================================

    function repairArmWoundConflicts() {

        const gear =
            getGear();


        let changed =
            false;


        // ====================================================
        // LEFT ARM WOUND
        // ====================================================

        if (
            isArmWounded(
                "left"
            )
        ) {

            const leftMainId =
                gear.leftHand;


            if (
                leftMainId
            ) {

                gear.leftHand =
                    null;


                // If the same item was occupying BOTH hands,
                // remove it from the right hand too.

                if (
                    gear.rightHand ===
                        leftMainId
                ) {

                    gear.rightHand =
                        null;

                }


                changed =
                    true;

            }


            if (
                gear.leftHandBuckler
            ) {

                gear.leftHandBuckler =
                    null;

                changed =
                    true;

            }

        }


        // ====================================================
        // RIGHT ARM WOUND
        // ====================================================

        if (
            isArmWounded(
                "right"
            )
        ) {

            const rightMainId =
                gear.rightHand;


            if (
                rightMainId
            ) {

                gear.rightHand =
                    null;


                // If the same item was occupying BOTH hands,
                // remove it from the left hand too.

                if (
                    gear.leftHand ===
                        rightMainId
                ) {

                    gear.leftHand =
                        null;

                }


                changed =
                    true;

            }


            if (
                gear.rightHandBuckler
            ) {

                gear.rightHandBuckler =
                    null;

                changed =
                    true;

            }

        }


        return changed;

    }


    // ========================================================
    // NORMALIZE STATE BEFORE RENDER
    // ========================================================
    //
    // Part 8 is now the central reconciliation authority.
    //
    // Do not duplicate its Shield/Gigue/builder placement
    // repairs here.
    // ========================================================

    function normalizeGearBeforeRender() {

        let changed =
            false;


        // ====================================================
        // BUILDER PLACEMENT + RULE REPAIR
        // ====================================================

        if (
            ensureBuilderItemsPlaced()
        ) {

            changed =
                true;

        }


        if (
            repairArmWoundConflicts()
        ) {

            changed =
                true;

        }


        // ====================================================
        // CONDITION VALUES
        // ====================================================

        /*
           Keep this as a final safety pass because it also
           initializes condition values for pickup equipment.
        */

        ensureAllDurabilityValues();


        return changed;

    }


    // ========================================================
    // MAIN RENDER
    // ========================================================

    function render() {

        // ====================================================
        // NORMALIZE
        // ====================================================

        const repaired =
            normalizeGearBeforeRender();


        if (
            repaired
        ) {

            saveState();

        }


        // ====================================================
        // CENTER AREA
        // ====================================================

        renderCenterLocations();


        // ====================================================
        // DETAIL COLUMNS
        // ====================================================

        renderEquipmentColumns();


        // ====================================================
        // ARMOR
        // ====================================================

        renderArmor();


        // ====================================================
        // HEAD TRAUMA TINT
        // ====================================================

        const headInjuries =
            Number(
                state?.derived?.headInjuries
            ) || 0;


        const headWounds =
         Number(
                state?.derived?.headWounds
         ) || 0;


        const headInjuryTintDismissed =
            state?.derived?.headInjuryTintDismissed ===
            true;


        gearSheetElement.classList.toggle(
            "head-trauma-tint",

         headWounds > 0 ||

         (
               headInjuries > 0 &&
                !headInjuryTintDismissed
         )
        );

        
        // ====================================================
        // PICKUP CONTROLS
        // ====================================================

        if (
            typeof refreshPickupControls ===
            "function"
        ) {

            refreshPickupControls();

        }


        // ====================================================
        // TEXT FIT
        // ====================================================

        if (
            typeof scheduleGearTextFit ===
            "function"
        ) {

            scheduleGearTextFit();

        }

    }


    // ============================================================
    // PART 12 OF 12 — EVENT WIRING, RESPONSIVE SCALING
    //                 & TEXT FITTING
    // ============================================================


    // ========================================================
    // TEXT FIT SETTINGS
    // ========================================================

    const GEAR_TEXT_MAX_SIZE =
        30;

    const GEAR_TEXT_MIN_SIZE =
        8;


    // ========================================================
    // REFRESH PICKUP CONTROLS
    // ========================================================

    function refreshPickupControls() {

        renderPickupButton(
            "left",
            leftPickupButton,
            leftPickupSelect
        );


        renderPickupButton(
            "right",
            rightPickupButton,
            rightPickupSelect
        );

    }


    // ========================================================
    // BIND PICKUP CONTROL
    // ========================================================

    function bindPickupControl(
        side,
        button,
        select
    ) {

        if (
            !button ||
            !select
        ) {

            return;

        }


        if (
            button.dataset.gearBound ===
            "true"
        ) {

            return;

        }


        button.dataset.gearBound =
            "true";


        select.dataset.gearBound =
            "true";


        // ====================================================
        // PICKUP BUTTON
        // ====================================================

        button.addEventListener(
            "click",
            function (
                event
            ) {

                event.preventDefault();
                event.stopPropagation();

                                if (
                    button.classList.contains(
                        "disabled"
                    )
                ) {

                    return;

                }


                openPickupSelect(
                    side
                );

            }
        );


        // ====================================================
        // PICKUP SELECTION
        // ====================================================

        select.addEventListener(
            "change",
            function (
                event
            ) {

                event.stopPropagation();


                handlePickupSelection(
                    side,
                    select
                );

            }
        );


        // ====================================================
        // PREVENT DOCUMENT CLICK FROM CLOSING SELECT
        // ====================================================

        select.addEventListener(
            "click",
            function (
                event
            ) {

                event.stopPropagation();

            }
        );

    }


    // ========================================================
    // BIND GENERIC LOCATION
    // ========================================================

    function bindLocationElement(
        element,
        handler
    ) {

        if (
            !element ||
            typeof handler !==
            "function"
        ) {

            return;

        }


        if (
            element.dataset.gearBound ===
            "true"
        ) {

            return;

        }


        element.dataset.gearBound =
            "true";


        element.addEventListener(
            "click",
            function (
                event
            ) {

                event.preventDefault();
                event.stopPropagation();


                handler(
                    event
                );

            }
        );

    }


    // ========================================================
    // BIND CENTER INTERACTIONS
    // ========================================================

    function bindCenterInteractions() {

        console.log(
            "CENTER ELEMENT CHECK:",
            {
                leftHand:
                    locationElements.leftHand,

                rightHand:
                    locationElements.rightHand,

                leftSidearm:
                    locationElements.leftSidearm,

                rightSidearm:
                    locationElements.rightSidearm,

                leftGigue:
                    locationElements.leftGigue,

                rightGigue:
                    locationElements.rightGigue,

                leftBuckler:
                    locationElements.leftBuckler,

                rightBuckler:
                    locationElements.rightBuckler
            }
        );


        // ====================================================
        // LEFT HAND
        // ====================================================

        bindLocationElement(
            locationElements.leftHand,
            function () {

                handleHandSlotClick(
                    "left"
                );

            }
        );


        // ====================================================
        // RIGHT HAND
        // ====================================================

        bindLocationElement(
            locationElements.rightHand,
            function () {

                handleHandSlotClick(
                    "right"
                );

            }
        );


        // ====================================================
        // LEFT SIDEARM
        // ====================================================

        bindLocationElement(
            locationElements.leftSidearm,
            function () {

                handleSidearmSlotClick(
                    "left"
                );

            }
        );


        // ====================================================
        // RIGHT SIDEARM
        // ====================================================

        bindLocationElement(
            locationElements.rightSidearm,
            function () {

                handleSidearmSlotClick(
                    "right"
                );

            }
        );


        // ====================================================
        // LEFT GIGUE
        // ====================================================

        bindLocationElement(
            locationElements.leftGigue,
            function () {

                handleGigueSlotClick(
                    "left"
                );

            }
        );


        // ====================================================
        // RIGHT GIGUE
        // ====================================================

        bindLocationElement(
            locationElements.rightGigue,
            function () {

                handleGigueSlotClick(
                    "right"
                );

            }
        );


        // ====================================================
        // LEFT SWASHBUCKLING / BUCKLER
        // ====================================================

        bindLocationElement(
            locationElements.leftBuckler,
            function () {

                handleBucklerColumnClick(
                    "left"
                );

            }
        );


        // ====================================================
        // RIGHT SWASHBUCKLING / BUCKLER
        // ====================================================

        bindLocationElement(
            locationElements.rightBuckler,
            function () {

                handleBucklerColumnClick(
                    "right"
                );

            }
        );

    }


    // ========================================================
    // BIND DETAIL COLUMN NAME REMOVAL
    // ========================================================
    //
    // General rule:
    //
    // Clicking an item's NAME removes it.
    //
    // For Swashbuckling/Buckler columns:
    //
    //     name click  -> remove Buckler
    //     field click -> stow/draw Buckler
    //
    // ========================================================

    function bindRemovableColumnName(
        column,
        getInstanceId
    ) {

        if (
            !column ||
            typeof getInstanceId !==
            "function"
        ) {

            return;

        }


        const nameField =
            column.querySelector(
                ".column-name, [data-field='name']"
            );


        if (
            !nameField ||
            nameField.dataset.removeBound ===
            "true"
        ) {

            return;

        }


        nameField.dataset.removeBound =
            "true";


        nameField.addEventListener(
            "click",
            function (
                event
            ) {

                const instanceId =
                    getInstanceId();


                if (
                    !instanceId
                ) {

                    return;

                }


                event.preventDefault();
                event.stopPropagation();


                removeItem(
                    instanceId
                );

            }
        );

    }


    // ========================================================
    // BIND SWASHBUCKLING DETAIL COLUMN
    // ========================================================

    function bindBucklerColumn(
        side,
        column
    ) {

        if (
            !column
        ) {

            return;

        }


        // ====================================================
        // NAME = REMOVE
        // ====================================================

        bindRemovableColumnName(
            column,
            function () {

                return getBucklerInstanceId(
                    side
                );

            }
        );


        // ====================================================
        // REST OF COLUMN = STOW / DRAW
        // ====================================================

        if (
            column.dataset.bucklerFieldBound ===
            "true"
        ) {

            return;

        }


        column.dataset.bucklerFieldBound =
            "true";


        column.addEventListener(
            "click",
            function (
                event
            ) {

                // ------------------------------------------------
                // NAME CLICK WAS ALREADY HANDLED ABOVE
                // ------------------------------------------------

                const nameField =
                    column.querySelector(
                        ".column-name, [data-field='name']"
                    );


                if (
                    nameField &&
                    (
                        event.target ===
                            nameField ||

                        nameField.contains(
                            event.target
                        )
                    )
                ) {

                    return;

                }


                // ------------------------------------------------
                // CONDITION BUTTONS MUST NOT DRAW/STOW
                // ------------------------------------------------

                if (
                    event.target.closest(
                        ".durability-control"
                    )
                ) {

                    return;

                }


                event.preventDefault();
                event.stopPropagation();


                handleBucklerColumnClick(
                    side
                );

            }
        );

    }


    // ========================================================
    // BIND STANDARD DETAIL COLUMN NAME REMOVAL
    // ========================================================

    function bindStandardColumnRemoval() {

        const gear =
            getGear();


        // ====================================================
        // MAIN HANDS
        // ====================================================

        bindRemovableColumnName(
            columnElements.leftHand,
            function () {

                return (
                    getGear().leftHand ||
                    null

                                    );

            }
        );


        bindRemovableColumnName(
            columnElements.rightHand,
            function () {

                return (
                    getGear().rightHand ||
                    null
                );

            }
        );


        // ====================================================
        // SIDEARMS
        // ====================================================

        bindRemovableColumnName(
            columnElements.leftSidearm,
            function () {

                return (
                    getGear().leftSidearm ||
                    null
                );

            }
        );


        bindRemovableColumnName(
            columnElements.rightSidearm,
            function () {

                return (
                    getGear().rightSidearm ||
                    null
                );

            }
        );


        // ====================================================
        // GIGUE DETAIL COLUMN
        // ====================================================

        bindRemovableColumnName(
            columnElements.gigueShield,
            function () {

                return getGigueShieldId();

            }
        );

    }


    // ========================================================
    // CLOSE PICKUP MENUS WHEN CLICKING ELSEWHERE
    // ========================================================

    function bindOutsidePickupClose() {

        if (
            document.documentElement.dataset
                .gearPickupCloseBound ===
            "true"
        ) {

            return;

        }


        document.documentElement.dataset
            .gearPickupCloseBound =
            "true";


        document.addEventListener(
            "click",
            function (
                event
            ) {

                // =================================================
                // LEFT
                // =================================================

                if (
                    leftPickupSelect &&

                    !leftPickupSelect.contains(
                        event.target
                    ) &&

                    (
                        !leftPickupButton ||

                        !leftPickupButton.contains(
                            event.target
                        )
                    )
                ) {

                    closePickupSelect(
                        leftPickupSelect
                    );

                }


                // =================================================
                // RIGHT
                // =================================================

                if (
                    rightPickupSelect &&

                    !rightPickupSelect.contains(
                        event.target
                    ) &&

                    (
                        !rightPickupButton ||

                        !rightPickupButton.contains(
                            event.target
                        )
                    )
                ) {

                    closePickupSelect(
                        rightPickupSelect
                    );

                }

            }
        );

    }


    // ========================================================
    // RESPONSIVE SHEET SCALE
    // ========================================================
    //
    // The Gear Sheet keeps its original design dimensions
    // internally and the whole sheet scales down as one unit.
    //
    // It never scales ABOVE 100%.
    // ========================================================

        function resizeGearSheet() {

        if (
            !sheetWrapper ||
            !gearSheetElement
        ) {

            return;

        }


        const availableWidth =
            document.documentElement
                .clientWidth ||
            window.innerWidth;


        if (
            !availableWidth
        ) {

            return;

        }


        const scale =
            availableWidth /
            DESIGN_WIDTH;


        gearSheetElement.style.transformOrigin =
            "top left";


        gearSheetElement.style.transform =
            "scale(" +
            scale +
            ")";


        sheetWrapper.style.width =
            (
                DESIGN_WIDTH *
                scale
            ) +
            "px";


        sheetWrapper.style.height =
            (
                DESIGN_HEIGHT *
                scale
            ) +
            "px";


        sheetWrapper.dataset.gearScale =
            String(
                scale
            );

    }


    // ========================================================
    // GET TEXT FROM ELEMENT
    // ========================================================

    function getGearElementText(
        element
    ) {

        if (
            !element
        ) {

            return "";

        }


        if (
            element instanceof
                HTMLInputElement ||

            element instanceof
                HTMLTextAreaElement ||

            element instanceof
                HTMLSelectElement
        ) {

            return String(
                element.value ||
                ""
            ).trim();

        }


        return String(
            element.textContent ||
            ""
        ).trim();

    }


    // ========================================================
    // MEASURE WHETHER TEXT FITS
    // ========================================================

    function textFitsElement(
        element,
        fontSize
    ) {

        if (
            !element ||
            element.clientWidth <=
                0 ||
            element.clientHeight <=
                0
        ) {

            return true;

        }


        const text =
            getGearElementText(
                element
            );


        if (
            !text
        ) {

            return true;

        }


        const style =
            window.getComputedStyle(
                element
            );


        const availableWidth =
            Math.max(
                1,
                element.clientWidth -
                parseFloat(
                    style.paddingLeft ||
                    0
                ) -
                parseFloat(
                    style.paddingRight ||
                    0
                ) -
                2
            );


        const availableHeight =
            Math.max(
                1,
                element.clientHeight -
                parseFloat(
                    style.paddingTop ||
                    0
                ) -
                parseFloat(
                    style.paddingBottom ||
                    0
                ) -
                2
            );


        const probe =
            document.createElement(
                "span"
            );


        probe.textContent =
            text;


        probe.style.position =
            "fixed";


        probe.style.visibility =
            "hidden";


        probe.style.pointerEvents =
            "none";


        probe.style.left =
            "-100000px";


        probe.style.top =
            "-100000px";


        probe.style.fontFamily =
            style.fontFamily;


        probe.style.fontWeight =
            style.fontWeight;


        probe.style.fontStyle =
            style.fontStyle;


        probe.style.letterSpacing =
            style.letterSpacing;


        probe.style.fontSize =
            fontSize +
            "px";


        probe.style.lineHeight =
            style.lineHeight ===
            "normal"
                ? "1.1"
                : style.lineHeight;


        // ====================================================
        // CURRENT GEAR FIELDS ARE SINGLE-LINE
        // ====================================================

        probe.style.whiteSpace =
            "nowrap";


        document.body.appendChild(
            probe
        );


        const rect =
            probe.getBoundingClientRect();


        const fits =
            (
                rect.width <=
                    availableWidth &&

                rect.height <=
                    availableHeight
            );


        probe.remove();

                return fits;

    }


    // ========================================================
    // FIT ONE ELEMENT
    // ========================================================

    function fitGearTextElement(
        element
    ) {

        if (
            !element ||
            element.clientWidth <=
                0 ||
            element.clientHeight <=
                0
        ) {

            return;

        }


        // ====================================================
        // ALWAYS RESET TO 30 FIRST
        // ====================================================

        let size =
            GEAR_TEXT_MAX_SIZE;


        element.style.fontSize =
            size +
            "px";


        // ====================================================
        // SHRINK UNTIL IT FITS
        // ====================================================

        while (
            size >
                GEAR_TEXT_MIN_SIZE &&

            !textFitsElement(
                element,
                size
            )
        ) {

            size -=
                1;


            element.style.fontSize =
                size +
                "px";

        }

    }


    // ========================================================
    // FIT ALL GEAR SHEET TEXT
    // ========================================================

    function fitAllGearSheetText() {

        if (
            !gearSheetElement
        ) {

            return;

        }


        // ====================================================
        // ORDINARY TEXT ELEMENTS
        // ====================================================

        const selectors = [

            ".location-slot",

            ".column-name",

            ".column-reach",

            ".column-weight",

            ".column-fixed-stat",

            ".dynamic-name",

            ".dynamic-value",

            ".block-value",

            "[data-field='name']",

            "[data-field='reach']",

            "[data-field='weight']",

            "[data-field='block']",

            ".pickup-button"

        ];


        gearSheetElement
            .querySelectorAll(
                selectors.join(
                    ", "
                )
            )
            .forEach(
                function (
                    element
                ) {

                    // --------------------------------------------
                    // NEVER FIT A WHOLE +/- CONDITION CONTROL
                    // --------------------------------------------

                    if (
                        element.querySelector?.(
                            ".durability-control"
                        )
                    ) {

                        return;

                    }


                    fitGearTextElement(
                        element
                    );

                }
            );


        // ====================================================
        // CONDITION NUMBERS
        // ====================================================

        gearSheetElement
            .querySelectorAll(
                ".durability-number, .integrity-number"
            )
            .forEach(
                function (
                    element
                ) {

                    fitGearTextElement(
                        element
                    );

                }
            );


        // ====================================================
        // CONDITION +/- BUTTONS
        // ====================================================
        //
        // They also start at 30 and shrink if their actual
        // button boxes require it.
        // ====================================================

        gearSheetElement
            .querySelectorAll(
                ".durability-button"
            )
            .forEach(
                function (
                    element
                ) {

                    fitGearTextElement(
                        element
                    );

                }
            );

    }


    // ========================================================
    // SCHEDULE TEXT FIT AFTER DOM LAYOUT
    // ========================================================

    let textFitFrame =
        null;


    function scheduleGearTextFit() {

        if (
            textFitFrame !==
            null
        ) {

            cancelAnimationFrame(
                textFitFrame
            );

        }


        // ====================================================
        // TWO FRAMES
        // ====================================================
        //
        // The first lets rendering happen.
        // The second measures the completed layout.
        // ====================================================

        textFitFrame =
            requestAnimationFrame(
                function () {

                    textFitFrame =
                        requestAnimationFrame(
                            function () {

                                textFitFrame =
                                    null;


                                fitAllGearSheetText();

                            }
                        );

                }
            );

    }


    // ========================================================
    // WINDOW RESIZE
    // ========================================================

    let resizeFrame =
        null;


    function handleGearWindowResize() {

        if (
            resizeFrame !==
            null
        ) {

            cancelAnimationFrame(
                resizeFrame
            );

        }


        resizeFrame =
            requestAnimationFrame(
                function () {

                    resizeFrame =
                        null;


                    resizeGearSheet();


                    scheduleGearTextFit();

                }
            );

    }


    // ========================================================
    // BIND ALL EVENTS
    // ========================================================

    function bindGearEvents() {

        // ====================================================
        // PICKUP
        // ====================================================

        bindPickupControl(
            "left",
            leftPickupButton,
            leftPickupSelect
        );


        bindPickupControl(
            "right",
            rightPickupButton,
            rightPickupSelect
        );


        // ====================================================
        // CENTER LOCATIONS
        // ====================================================

        bindCenterInteractions();


        // ====================================================
        // SWASHBUCKLING DETAIL COLUMNS
        // ====================================================

        bindBucklerColumn(
            "left",
            columnElements.leftBuckler
        );


        bindBucklerColumn(
            "right",
            columnElements.rightBuckler
        );


        // ====================================================
        // OTHER DETAIL COLUMN NAME REMOVAL
        // ====================================================

        bindStandardColumnRemoval();


        // ====================================================
        // PICKUP MENU CLOSING
        // ====================================================

        bindOutsidePickupClose();


        // ====================================================
        // RESPONSIVE RESIZE
        // ====================================================

        window.addEventListener(
            "resize",
            handleGearWindowResize
        );

    }


    // ========================================================
    // SHARED STATE CHANGE
    // ========================================================
    //
    // Builder, Character Sheet, or another page may change
    // the shared Knights & Knaves state while this Gear Sheet
    // is already open.
    //
    // Reload the state and redraw instead of requiring a
    // browser refresh.
    // ========================================================

    function handleSharedStateChange() {

        // ====================================================
        // RELOAD THE NEWEST SAVED STATE
        // ====================================================

        state =
            KKState.load();


        // ====================================================
        // RECONCILE BUILDER EQUIPMENT
        // ====================================================

        ensureBuilderItemsPlaced();


        // ====================================================
        // CONDITION VALUES
        // ====================================================

        ensureAllDurabilityValues();


        // ====================================================
        // REDRAW
        // ====================================================

        render();


        resizeGearSheet();

        scheduleGearTextFit();

    }


    // ========================================================
    // EQUIPMENT WEIGHT -> FATIGUE
    // ========================================================

    gearSheetElement.addEventListener(
        "click",
        function (
            event
        ) {

            const weightField =
                event.target.closest(
                    ".column-weight"
                );


            if (
                !weightField ||
                !gearSheetElement.contains(
                    weightField
                )
            ) {

                return;

            }


            const weight =
                Number(
                    weightField.textContent
                );


            if (
                !Number.isFinite(
                    weight
                ) ||
                weight <= 0
            ) {

                return;

            }


            event.preventDefault();
            event.stopPropagation();


            addToCurrentFatigue(
                weight
            );

        }
    );


    // ========================================================
    // LISTEN FOR SHARED STATE CHANGES
    // ========================================================
    //
    // Custom event:
    //     Changes made inside THIS window.
    //
    // Storage event:
    //     Changes made by Builder / other sheets running in
    //     another page, frame, or browser tab.
    // ========================================================

    window.addEventListener(
        "knights-knaves-state-changed",
        handleSharedStateChange
    );


    window.addEventListener(
        "storage",
        function (event) {

            // Only react to the Knights & Knaves save data.

            if (
                event.key !==
                KKState.STORAGE_KEY
            ) {
                return;
            }


            handleSharedStateChange();

        }
    );


    // ========================================================
    // REFRESH WHEN GEAR SHEET BECOMES ACTIVE
    // ========================================================
    //
    // This is a fallback for browsers/page arrangements where
    // the storage event is not delivered while the Gear Sheet
    // is hidden.
    // ========================================================

    window.addEventListener(
        "focus",
        function () {

            handleSharedStateChange();

        }
    );


    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.visibilityState ===
                "visible"
            ) {

                handleSharedStateChange();

            }

        }
    );


    // ========================================================
    // INITIALIZE
    // ========================================================

    function initializeGearSheet() {

        // ====================================================
        // BUILDER EQUIPMENT + RULE REPAIR
        // ====================================================

        ensureBuilderItemsPlaced();


        // ====================================================
        // CONDITION VALUES
        // ====================================================

        ensureAllDurabilityValues();


        // ====================================================
        // EVENTS
        // ====================================================

        bindGearEvents();


        // ====================================================
        // INITIAL DISPLAY
        // ====================================================

        render();


        // ====================================================
        // RESPONSIVE SIZE
        // ====================================================

        resizeGearSheet();


        // ====================================================
        // FINAL TEXT FIT
        // ====================================================

        scheduleGearTextFit();

    }


    // ========================================================
    // START
    // ========================================================

    initializeGearSheet();

});

