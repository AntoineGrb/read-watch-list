// import Sortable from './node_modules/sortablejs/modular/sortable.complete.esm.js';

//#region VARIABLES
    //Barre ajout tâche
    const inputAdd = document.querySelector("#input__add");
    const btnAdd = document.querySelector("#btn__add");
    const modal = document.querySelector("#my-modal");
    const themes = document.querySelectorAll(".theme");

    //Liste
    const list = document.querySelector(".list__content");
    const listTitle = document.querySelector(".list__title > h2");

    //Déclaration des items
    class Item {
        constructor(id, name, theme, checked) {
            this.id = id;
            this.name = name;
            this.theme = theme;
            this.checked = checked;
        }
    };

    //Valeurs par défaut 
    let btnListActive = "On the list";
    let btnFilterActive = "All";

//#endregion

//#region CHARGEMENT DES DONNEES FROM LOCAL STORAGE
    let items = window.localStorage.getItem("items");
    if (items === null) {
        items = [];
    }
    else {
        items = JSON.parse(items);
        updateList();
    }
//#endregion

//#region CREER UN NOUVEL ITEM 
    //Fonction : Créer le nouvel objet item
    async function addItem(items, itemTheme, animate) {
        //Déterminer l'id à partir de ids existants dans le tableau
        let idMax = 0;
        for (let i=0 ; i < items.length ; i++) {
            if (items[i].id > idMax) {
                idMax = items[i].id
            }
        }
        const itemId = idMax + 1;
        const itemName = inputAdd.value;
        //Si pas de thème sélectionné alors on ouvre la fenêtre modale de sélection et on attend sa résolution
        if (itemTheme === "All") {
            itemTheme = await openModal();
        }
        //Créer l'item dans le tableau items
        let item = new Item(itemId,itemName,itemTheme,false); 
        items.push(item);
        console.log("items :" , items);

        //Créer l'item HTML sur le DOM
        const itemHTML = createItemHTML(item, false, animate);
        list.insertAdjacentHTML("beforeend" , itemHTML);
        inputAdd.value = "";
    };

    //Fonction : créer l'objet item au DOM
    function createItemHTML(item, checked, animate) {
        let themeIcon;
        let themeClass;
        let checkClass = checked === true ? "check" : "";

        //Déterminer la class et l'icône de l'item en fonction du thème
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

        //Déclencher l'animation de création (uniquement à la création et non à la regénération de la liste avec un filtre)
        let animateFadeInUp;
        if (animate) {
            animateFadeInUp = "animate__fadeInUp";
        }
        else animateFadeInUp = "";
          
        //Création du bloc HTML
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
        if (isModalOpen === true) { return }; //Pas d'ajout pendant ouverture de la fenêtre modale

        if (inputAdd.value === "" && btnListActive === "On the list") {
            alert("Vous devez saisir quelque chose pour valider !")
            return
        }
        else if (inputAdd.value === "" && btnListActive === "Completed") { //Pas d'ajout pour la liste des items complétés
            return
        }
        const activeTheme = `${btnFilterActive}`;
        addItem(items, activeTheme, true);

        //Enregistrer dans le local Storage
        window.localStorage.setItem("items" , JSON.stringify(items));
        console.log(JSON.stringify(items));
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

            //Enregistrer dans le local Storage
            window.localStorage.setItem("items" , JSON.stringify(items));
            console.log(JSON.stringify(items))
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
        }
        else if (e.target.tagName === "I") {
            removeItem(elementId); //Clic sur une corbeille
        }

        //Mettre à jour le localStorage
        window.localStorage.setItem("items" , JSON.stringify(items));
        console.log(JSON.stringify(items));
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

        //Sélectionner les items en fonction de leur complétude
        if (btnListActive === "On the list") {
            filteredItems = filteredItems.filter(item => item.checked === false);
        } else if (btnListActive === "Completed") {
            filteredItems = filteredItems.filter(item => item.checked === true);
        }
        
        //Sélection,er les items en fonction du thème (si all on prend tout)
        if (btnFilterActive !== "All") {
            filteredItems = filteredItems.filter(item => item.theme === btnFilterActive);
        }

        //Regénérer la liste filtrée
        list.innerHTML = "";
        filteredItems.forEach(item => {
            const itemHTML = createItemHTML(item, item.checked, false);
            list.insertAdjacentHTML("beforeend", itemHTML);
        });
    }
    
    //Gestion des deux boutons List
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

            //Désactiver la barre de tâche pour la liste des items complétés
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
