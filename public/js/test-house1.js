const leftelem = document.querySelector("#left");
const rightelem = document.querySelector("#right");

function addTab(tableau1, tableau2) {
    // Vérifier si les tableaux ont la même longueur
    if (tableau1.length !== tableau2.length) {
      throw new Error("Tables are not the same length.");
    }
  
    var resultat = [];
  
    // Parcourir les éléments des tableaux et les additionner
    for (var i = 0; i < tableau1.length; i++) {
      resultat.push(tableau1[i] + tableau2[i]);
    }
  
    return resultat;
  }

window.onload =  () => {
    var tab=[0,0,0,0,0,0];
    var titres=["You prefer", "You prefer", "You choose", "With whom would you go on an adventure?", "On a trip you are more"];
    var reps_left=["The mountain","Chocolate Frogs","The Elder Wand","Hermione","Visit"];
    var reps_right=["The sea","Bertie Bott's Every Flavour Beans","Cloak of Invisibility","Ron & Harry","Adventure"];
    var images_rep_left = ["../assets/montagne.jpg","../assets/choco.jpg","../assets/baguette.jpg","../assets/hermione.jpg","../assets/visite.jpg"];
    var images_rep_right = ["../assets/mer.jpg","../assets/dragees.jpg","../assets/cape.gif","../assets/ron.jpg","../assets/aventure.jpg"];
    var nb_question = 1;
    var titre = document.querySelector("#questions");
    var reps_left_elem = document.querySelector("#prop1");
    var reps_right_elem = document.querySelector("#prop2");
    var image_left = document.querySelector("#left");
    var image_right = document.querySelector("#right");
    image_right.style.backgroundImage = `url(${images_rep_right[nb_question-1]})`;
    image_left.style.backgroundImage = `url(${images_rep_left[nb_question-1]})`;
    reps_left_elem.textContent = reps_left[nb_question-1];
    reps_right_elem.textContent = reps_right[nb_question-1];
    titre.textContent = titres[nb_question-1];
    leftelem.addEventListener("click", () => {
        switch (nb_question) {
            case 1:
                tab = addTab(tab, [1,1,2,0,1,1]);
            case 2:
                tab = addTab(tab, [0,1,1,1,1,2]);
            case 3:
                tab = addTab(tab, [2,1,2,1,2,1]);
            case 4:
                tab = addTab(tab, [1,2,1,1,0,1]);
            case 5:
                tab = addTab(tab, [0,1,1,1,1,2]);    
        }
        nb_question++;
        titre.textContent = titres[nb_question-1];
        reps_left_elem.textContent = reps_left[nb_question-1];
        reps_right_elem.textContent = reps_right[nb_question-1];
        image_right.style.backgroundImage = `url(${images_rep_right[nb_question-1]})`;
        image_left.style.backgroundImage = `url(${images_rep_left[nb_question-1]})`;
        if (nb_question==6){
            form =document.createElement("form");
            form.method = "POST";
            form.action = "/test_house1";
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = "tab";
            input.value = tab;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        }
    });
    
    rightelem.addEventListener("click", () => {
      // Recherchez le formulaire à l'intérieur de l'élément cliqué
      switch (nb_question) {
        case 1:
            tab = addTab(tab, [1,1,0,2,1,1]);
        case 2:
            tab = addTab(tab, [2,1,1,1,1,0]);
        case 3:
            tab = addTab(tab, [1,2,2,1,1,2]);
        case 4:
            tab = addTab(tab, [2,1,2,1,2,1]);
        case 5:
            tab = addTab(tab, [2,1,1,1,1,0]);    
    }
    nb_question++;
    titre.textContent = titres[nb_question-1];
    reps_left_elem.textContent = reps_left[nb_question-1];
    reps_right_elem.textContent = reps_right[nb_question-1];
    image_right.style.backgroundImage = `url(${images_rep_right[nb_question-1]})`;
    image_left.style.backgroundImage = `url(${images_rep_left[nb_question-1]})`;
    if (nb_question==6){
        form =document.createElement("form");
        form.method = "POST";
        form.action = "/test_house1";
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "tab";
        input.value = tab;
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
    }
    });
    
    
}

