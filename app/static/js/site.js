(function () {
    "use strict";

    var header = document.getElementById("site-header");
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");

    /* Header background once scrolled past the top */
    var scrollTicking = false;
    function updateHeader() {
        header.classList.toggle("scrolled", window.scrollY > 8);
        scrollTicking = false;
    }
    window.addEventListener(
        "scroll",
        function () {
            if (!scrollTicking) {
                scrollTicking = true;
                requestAnimationFrame(updateHeader);
            }
        },
        { passive: true }
    );
    updateHeader();

    /* Mobile navigation */
    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            var open = header.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
        nav.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                header.classList.remove("nav-open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* Scroll-reveal animations */
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var revealNodes = document.querySelectorAll(".reveal");
    if (!reduceMotion && "IntersectionObserver" in window && revealNodes.length) {
        var revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
        );
        revealNodes.forEach(function (node) {
            revealObserver.observe(node);
        });
    } else {
        revealNodes.forEach(function (node) {
            node.classList.add("is-visible");
        });
    }

    /* Scroll-spy: highlight the nav link for the section in view */
    var sectionLinks = document.querySelectorAll(".nav-link[data-section]");
    if (sectionLinks.length && "IntersectionObserver" in window) {
        var linkFor = {};
        var sections = [];
        sectionLinks.forEach(function (link) {
            var section = document.getElementById(link.dataset.section);
            if (section) {
                linkFor[section.id] = link;
                sections.push(section);
            }
        });

        var spyObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        sectionLinks.forEach(function (link) {
                            link.classList.remove("active");
                        });
                        linkFor[entry.target.id].classList.add("active");
                    }
                });
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );
        sections.forEach(function (section) {
            spyObserver.observe(section);
        });
    }
})();
