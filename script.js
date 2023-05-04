import Sortable from './node_modules/sortablejs/modular/sortable.complete.esm.js';

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
        let idMax = 0;
        for (let i=0 ; i < items.length ; i++) {
            if (items[i].id > idMax) {
                idMax = items[i].id
            }
        }
        const itemId = idMax + 1;
        const itemName = inputAdd.value;
        if (itemTheme === "All") {
            itemTheme = await openModal();
        }
        console.log(itemTheme);
        let item = new Item(itemId,itemName,itemTheme,false); 
        items.push(item);
        console.log("items :" , items);

        //Appel à la fonction pour créer l'objet HTML
        const itemHTML = createItemHTML(item, false, animate);
        list.insertAdjacentHTML("beforeend" , itemHTML);
        inputAdd.value = "";
    };

    //Fonction : Ajouter l'objet item au DOM
    function createItemHTML(item, checked, animate) {
        let themeIcon;
        let themeClass;
        let checkClass = checked === true ? "check" : "";
        //Les class et icones en fonction du thème
        switch (item.theme) {
            case "Books" : 
                themeIcon = "fas fa-book-open";
                themeClass = "theme--books";
            break
            case "Films" :
                themeIcon = "fas fa-film";
                themeClass = "theme--films";
            break
            case "TV shows" :
                themeIcon = "fas fa-tv" ;
                themeClass = "theme--tv";
            break
            default : 
            themeIcon = "fas fa-book-open";
            themeClass = "theme--books";
        };
        //L'animation déclenchée ou non selon le clic
        let animateFadeInUp;
        if (animate) {
            animateFadeInUp = "animate__fadeInUp";
        }
        else animateFadeInUp = "";
            
        return `<div class="item animate__animated ${animateFadeInUp}" id="item${item.id}">
            <div class="item__check">
                <input type="checkbox" ${item.checked ? 'checked' : ''}>
            </div>
            <div class="item__content">
                <div class="item__content__name">
                    <p class="${checkClass}"> ${item.name} </p>
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
        if (isModalOpen === true) { return };
        console.log("btnListActive" , btnListActive)
        if (inputAdd.value === "" && btnListActive === "On the list") {
            alert("Vous devez saisir quelque chose pour valider !")
            return
        }
        else if (inputAdd.value === "" && btnListActive === "Completed") {
            return
        }
        const activeTheme = `${btnFilterActive}`;
        addItem(items, activeTheme, true);
    });

    //Event : presser Entrée
    document.addEventListener("keyup" , (e) => {
        e.preventDefault();
        if (isModalOpen === true) { return }
        if (e.key === "Enter") {
            console.log("btnListActive" , btnListActive)
            if (inputAdd.value === "" && btnListActive === "On the list") {
                alert("Vous devez saisir quelque chose pour valider !")
                return
            }
            else if (inputAdd.value === "" && btnListActive === "Completed") {
                return
            }
            const activeTheme = `${btnFilterActive}`;
            addItem(items,activeTheme, true);
        }
    })
//#endregion

//#region METTRE A JOUR UN ITEM
    //Fonction : checker un item
    function checkItem(id) {
        //Maj l'objet JS dans le tableau items
        let index = items.findIndex(item => item.id === id);
        let itemChecked = items[index];
        itemChecked.checked = itemChecked.checked === false ? true : false;

        //Maj le DOM
        const itemHTMLChecked = document.querySelector(`#item${id}`);
        itemHTMLChecked.classList.remove("animate__fadeInUp");
        itemHTMLChecked.classList.add("animate__fadeOut");
        const itemHTMLName = itemHTMLChecked.querySelector(".item__content p")
        itemHTMLName.classList.toggle("check");
        itemHTMLChecked.addEventListener("animationend" , () => {
            updateList();
        });
    }

    //Fonction : supprimer un item
    function removeItem(id) {
        //Maj le tableau items
        let index = items.findIndex(item => item.id === id);
        items.splice(index, 1);
        console.log(items);
        
        //Maj le DOM
        const itemHTMLRemove = document.querySelector(`#item${id}`);
        itemHTMLRemove.classList.remove("animate__fadeInUp");
        itemHTMLRemove.classList.remove("animate__fadeOut");
        itemHTMLRemove.classList.add("animate__fadeOutLeft");
        itemHTMLRemove.addEventListener("animationend" , () => { //Attendre la fin de l'animation pour suppr
            itemHTMLRemove.remove();
        });
    }

    //Event : cliquer sur un item
    list.addEventListener("click" , (e) => {
        let elementId = e.target.parentNode.parentNode.getAttribute("id");
        elementId = parseInt(elementId.substr(4))
        if (e.target.tagName === "INPUT") { //Clic sur une checkbox
            checkItem(elementId);
            console.log(items);
        }
        else if (e.target.tagName === "I") {
            removeItem(elementId); //Clic sur une corbeille
            console.log(items);
        }
    });
//#endregion

//#region GERER LA FENÊTRE MODALE
//La fenêtre modale apparait lors de l'ajout d'une nouvelle tâche sans sélection d'un filtre préalable
let isModalOpen = false;
function openModal() {
    return new Promise((resolve) => { //La promise permet d'attendre la sélection pour continuer le code
        modal.style.display = "flex";
        document.querySelector("main").style.opacity = "0.2";
        document.querySelector("nav").style.opacity = "0.2";
        isModalOpen = true;

        themes.forEach(theme => {
            theme.addEventListener("click", (e) => {
                const selectedValue = e.target.value;
                modal.style.display = "none";
                document.querySelector("main").style.opacity = "1";
                document.querySelector("nav").style.opacity = "1";
                resolve(selectedValue);
                isModalOpen = false;
            });
        });
    });
}
//#endregion

//#region GERER LES FILTRES
    //Fonction : mise à jour de la liste
    function updateList() {
        let filteredItems = items;

        if (btnListActive === "On the list") {
            filteredItems = filteredItems.filter(item => item.checked === false);
        } else if (btnListActive === "Completed") {
            filteredItems = filteredItems.filter(item => item.checked === true);
        }
    
        if (btnFilterActive !== "All") {
            filteredItems = filteredItems.filter(item => item.theme === btnFilterActive);
        }

        list.innerHTML = "";
        filteredItems.forEach(item => {
            const itemHTML = createItemHTML(item, item.checked, false);
            list.insertAdjacentHTML("beforeend", itemHTML);
        });
    }
    
    //Les boutons List
    let btnListActive = "On the list";
    let btnList = document.querySelectorAll(".btn__list");
    btnList.forEach(btn => {
        //Clic sur les boutons
        btn.addEventListener("click" , () => {
            if (isModalOpen === true) { return }
            //Activer/désactiver les class active
            btnList.forEach(otherBtnList => {
                if (otherBtnList !== btn) {
                    otherBtnList.classList.remove("active");
                }
            });
            btn.classList.add("active");

            //Appliquer le filtre sélectionné au DOM
            btnListActive = btn.value;
            console.log("btnListActive" , btnListActive)
            if (btnListActive === "Completed") {
                inputAdd.disabled = true;
                btnAdd.disabled = true;
                btnAdd.classList.add("add__btn--disabled");
            }
            else {
                inputAdd.disabled = false;
                btnAdd.disabled = false;
                btnAdd.classList.remove("add__btn--disabled");
            }
            updateList();
        });
    });

    //Les boutons Filtres
    let btnFilterActive = "All";
    let btnFilters = document.querySelectorAll(".btn__filters");
    btnFilters.forEach(btn => {
        //Clic sur les boutons
        btn.addEventListener("click" , () => {
            if (isModalOpen === true) { return }
            //Activer/désactiver les class active
            btnFilters.forEach(otherBtnFilters => {
                if (otherBtnFilters !== btn) {
                    otherBtnFilters.classList.remove("active");
                }
            });
            btn.classList.add("active");

            //Appliquer le filtre sélectionné au DOM
            btnFilterActive = btn.value;
            updateList();
            //! Pour ALL ajouter un tri par défaut sur le thème alphabetique

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

//#region GERER LE GLISSER DEPOSER
let el = document.querySelector('.list__content');
let sortable = Sortable.create(el, {
    onEnd: function (evt) {
        updateItemsOrder();
    }
});

function updateItemsOrder() {
    // Créez un tableau pour stocker les éléments mis à jour
    let updatedItems = [];

    // Parcourez les éléments dans le DOM
    const itemElements = document.querySelectorAll('.item');
    itemElements.forEach(itemElement => {
        // Récupérez l'ID de l'élément
        const itemId = parseInt(itemElement.id.replace('item', ''));

        // Trouvez l'élément correspondant dans l'objet items
        const item = items.find(i => i.id === itemId);

        // Ajoutez l'élément à la liste des éléments mis à jour
        updatedItems.push(item);
    });

    // Ajoutez les éléments non visibles à la liste des éléments mis à jour
    items.forEach(item => {
        if (!updatedItems.includes(item)) {
            updatedItems.push(item);
        }
    });

    // Remplacez l'objet items par la liste des éléments mis à jour
    items = updatedItems;
    console.log(items);
}
//#endregion
