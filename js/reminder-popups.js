// ============================================================
// KNIGHTS & KNAVES - CLICK REMINDER POPUPS
// ============================================================

(function () {

    "use strict";


    let popup = null;


    function closeReminder() {

        if (
            popup
        ) {

            popup.remove();

            popup = null;

        }

    }


    function showReminder(
        title,
        description
    ) {

        closeReminder();


        popup =
            document.createElement(
                "div"
            );


        popup.className =
            "reminder-popup";


        const heading =
            document.createElement(
                "div"
            );


        heading.className =
            "reminder-popup-title";


        heading.textContent =
            title || "";


        const body =
            document.createElement(
                "div"
            );


        body.className =
            "reminder-popup-body";


        body.textContent =
            description || "";


        popup.appendChild(
            heading
        );


        popup.appendChild(
            body
        );


        popup.addEventListener(
            "click",
            function (
                event
            ) {

                event.stopPropagation();

            }
        );


        document.body.appendChild(
            popup
        );

    }


    document.addEventListener(
        "click",
        function (
            event
        ) {

            if (
                popup &&
                !event.target.closest(
                    ".reminder-popup"
                ) &&
                !event.target.closest(
                    "[data-reminder-trigger]"
                )
            ) {

                closeReminder();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (
            event
        ) {

            if (
                event.key === "Escape"
            ) {

                closeReminder();

            }

        }
    );


    window.KKReminders = {

        show:
            showReminder,

        close:
            closeReminder

    };

})();