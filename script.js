//Variables & constantes
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
    //Liste
    const list = document.querySelector(".list__content");
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

//#region CREER UN NOUVEL ITEM 
    //Fonction : Créer le nouvel objet item
    function addItem(items, animate) {
        const itemId = items.length;
        const itemName = inputAdd.value;
        const itemTheme = `${btnFilterActive}`;
        if (itemTheme === "All") {
            alert("Sélectionner un thème pour ajouter un item !"); //!Ajouter une fenêtre perso au lieu de l'alerte
            return
        }
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
            alert("Vous devez saisir quelque chose pour valider !") //!Ajouter une fenêtre perso au lieu de l'alerte
            return
        }
        addItem(items,true);
    });
//#endregion

//#region GERER LES FILTRES
    //Les boutons List
    let btnListActive = "On the list";
    console.log(btnListActive);
    let btnList = document.querySelectorAll(".btn__list");
    btnList.forEach(btn => {
        //Clic sur les boutons
        btn.addEventListener("click" , () => {
            btnList.forEach(otherBtnList => {
                if (otherBtnList !== btn) {
                    otherBtnList.classList.remove("active");
                }
            });
            btn.classList.add("active");
            btnListActive = btn.textContent;
            console.log(btnListActive);
        });
    });

    //Mise en forme des boutons Filtres
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
            btnFilterActive = btn.textContent;
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
        });
    }); 
//#endregion

