const menuBtn = document.getElementById("toggle-drawer")
const drawer = document.getElementById('drawer-content')
const drawerClose = document.getElementById('close-drawer')

menuBtn.addEventListener("click", () => {
    drawer.classList.toggle('translate-x-0')
})
drawerClose.addEventListener("click", () => {
    drawer.classList.remove('translate-x-0')
});

let tabsContainer = document.querySelector(".tabs");

let tabTogglers = tabsContainer.querySelectorAll("a");

tabTogglers.forEach(function(toggler) {
    toggler.addEventListener("click", function(e) {
        e.preventDefault();

        let tabName = this.getAttribute("href");

        let tabContents = document.querySelectorAll(".tab-contents");

        toggler.classList.remove("border-primary");


        for (const tabContent of tabContents) {
            for (let i = 0; i < tabContents.length; i++) {
                tabTogglers[i].classList.remove("border-primary", "text-primary");
                tabTogglers[i].classList.add("border-transparent");
                tabTogglers[i].classList.add("text-secondary");
                tabContent.classList.remove("hidden");
                if ("#" + tabContent.id === tabName) {
                    continue;
                }
                tabContent.classList.add("hidden");

            }
        }


        e.target.classList.add("border-primary", "text-primary");
        e.target.classList.remove("border-transparent");
    });
});

document.getElementById("default-tab").click();