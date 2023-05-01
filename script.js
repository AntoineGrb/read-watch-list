//#region VARIABLES
    //Boutons de sélection
    const btnListOn = document.querySelector(".btn__list--on");
    const btnListCompleted = document.querySelector(".btn__list--completed");
    const btnListAll = document.querySelector(".btn__filters--all");
    const btnListBooks = document.querySelector(".btn__filters--film");
    const btnListFilm = document.querySelector(".btn__filters--film");
    const btnListTv = document.querySelector(".btn__filters--tvshows");

    //Barre ajout tâche
    const inputAdd = document.querySelector("#input__add");
    const btnAdd = document.querySelector("#btn__add");
    const modal = document.querySelector("#my-modal");
    const themes = document.querySelectorAll(".theme");

    //Liste
    const list = document.querySelector(".list__content");
    const listTitle = document.querySelector(".list__title > h2");

    //Déclaration des items
    let items = [];
    class Item {
        constructor(id, name, theme, checked) {
            this.id = id;
            this.name = name;
            this.theme = theme;
            this.checked = checked;
        }
    };
//#endregion

//#region CREER UN NOUVEL ITEM 
    //Fonction : Créer le nouvel objet item
    async function addItem(items, itemTheme, animate) {
        const itemId = items.length;
        const itemName = inputAdd.value;
        if (itemTheme === "All") {
            itemTheme = await openModal();
        }
        console.log(itemTheme);
        let item = new Item(itemId,itemName,itemTheme,false); 
        items.push(item);
        console.log("items :" , items);

        //Appel à la fonction pour créer l'objet HTML
        const itemHTML = createItemHTML(item, animate);
        list.insertAdjacentHTML("beforeend" , itemHTML);
        inputAdd.value = "";
    };

    //Fonction : Ajouter l'objet item au DOM
    function createItemHTML(item, animate) {
        let themeIcon;
        let themeClass;
        //Les class et icones en fonction du thème
        switch (item.theme) {
            case "Books" : 
                themeIcon = "fas fa-book-open";
                themeClass = "theme--books"
            break
            case "Films" :
                themeIcon = "fas fa-film";
                themeClass = "theme--films"
            break
            case "TV shows" :
                themeIcon = "fas fa-tv" ;
                themeClass = "theme--tv"
            break
            default : themeIcon = "fas fa-book-open";
        };
        //L'animation déclenchée ou non selon le clic
        let animateFadeInUp;
        if (animate) {
            animateFadeInUp = "animate__animated animate__fadeInUp";
        }
        else animateFadeInUp = "";
            
        return `<div class="item ${animateFadeInUp}" id="${item.id}">
            <div class="item__check">
                <input type="checkbox" ${item.checked ? 'checked' : ''}>
            </div>
            <div class="item__content">
                <div class="item__content__name">
                    <p> ${item.name} </p>
                </div>
                <div class="item__content__theme ${themeClass}">
                    <p> <em> <i class="${themeIcon}"></i> ${item.theme} </em> </p>
                </div>
            </div>
            <div class="item__trash">
                <i class="fas fa-trash"></i>
            </div>
        </div>`;
    }
    //Event : cliquer sur le bouton Add
    btnAdd.addEventListener("click" , (e) => {
        e.preventDefault();
        if (inputAdd.value === "") {
            alert("Vous devez saisir quelque chose pour valider !")
            return
        }
        const activeTheme = `${btnFilterActive}`;
        addItem(items,activeTheme, true);
    });

    //Event : presser Entrée
    document.addEventListener("keyup" , (e) => {
        e.preventDefault();
        if (e.key === "Enter") {
            if (inputAdd.value === "") {
                alert("Vous devez saisir quelque chose pour valider !")
                return
            }
            const activeTheme = `${btnFilterActive}`;
            addItem(items,activeTheme, true);
        }
    })
//#endregion

//#region GERER LA FENÊTRE MODALE
//La fenêtre modale apparait lors de l'ajout d'une nouvelle tâche sans sélection d'un filtre préalable
function openModal() {
    return new Promise((resolve) => { //La promise permet d'attendre la sélection pour continuer le code
        modal.style.display = "block";

        themes.forEach(theme => {
            theme.addEventListener("click", (e) => {
                const selectedValue = e.target.value;
                modal.style.display = "none";
                resolve(selectedValue);
            });
        });
    });
}
//#endregion

//#region GERER LES FILTRES
    //Les boutons List
    let btnListActive = "On the list";
    let btnList = document.querySelectorAll(".btn__list");
    btnList.forEach(btn => {
        //Clic sur les boutons
        btn.addEventListener("click" , () => {
            //Activer/désactiver les class active
            btnList.forEach(otherBtnList => {
                if (otherBtnList !== btn) {
                    otherBtnList.classList.remove("active");
                }
            });
            btn.classList.add("active");
            btnListActive = btn.value;
        });
    });

    //Les boutons Filtres
    let btnFilterActive = "All";
    let btnFilters = document.querySelectorAll(".btn__filters");
    btnFilters.forEach(btn => {
        //Clic sur les boutons
        btn.addEventListener("click" , () => {
            //Activer/désactiver les class active
            btnFilters.forEach(otherBtnFilters => {
                if (otherBtnFilters !== btn) {
                    otherBtnFilters.classList.remove("active");
                }
            });
            btn.classList.add("active");

            //Appliquer le filtre sélectionné au DOM
            btnFilterActive = btn.value;
            let itemsFilter = [];
            if (btnFilterActive === "All") { //Si All on sélectionne tous les items
                itemsFilter = items;
            }
            else itemsFilter = items.filter(item => item.theme === btnFilterActive); //Sinon on filtre sur le thème sélectionné
            list.innerHTML = "";
            itemsFilter.forEach(itemFilter => { //On affiche les items filtrés sur le DOM
                const itemHTML = createItemHTML(itemFilter,false);
                list.insertAdjacentHTML("beforeend" , itemHTML);
            });

            //Mettre à jour le titre de la liste
            switch (btnFilterActive) {
                case "Books" : 
                    listTitle.textContent = "To read :";
                break
                case "Films" :
                    listTitle.textContent = "To watch :";
                break
                case "TV shows" :
                    listTitle.textContent = "To watch :";
                break
                default : listTitle.textContent = "To watch & read :";
            };
        });
    }); 
//#endregion

