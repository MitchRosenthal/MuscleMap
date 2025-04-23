$(document).ready(function() {
    console.log("script.js loaded successfully.");  // Debugging to ensure script runs

    document.addEventListener("DOMContentLoaded", function () {
        const areas = document.querySelectorAll("area.muscle-area");

        areas.forEach(area => {
        const originalAlt = area.alt;

        area.addEventListener("mouseenter", () => {
            const label = document.createElement("div");
            label.className = "position-absolute text-white bg-dark px-2 py-1 rounded";
            label.id = "hover-label";
            label.style.top = "10px";
            label.style.left = "10px";
            label.style.zIndex = "1000";
            label.innerText = originalAlt;
            document.body.appendChild(label);
        });

        area.addEventListener("mouseleave", () => {
            const label = document.getElementById("hover-label");
            if (label) label.remove();
        });
        });
    });
});