const l1 = document.querySelector("#left");
const r1 = document.querySelector("#right");
const l2 = document.querySelector("#left2");
const r2 = document.querySelector("#right2");

function addTab(tableau1, tableau2) {
    // Vérifier si les tableaux ont la même longueur
    if (tableau1.length !== tableau2.length) {
      throw new Error("Les tableaux n'ont pas la même longueur.");
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
    var titres=["Which animal do you bring to Hogwarts?","Which Magic do you prefer?","Which drink to drink at a party?","Who is your favorite teacher?","In a team what is your mindset"];
    var reps_l_1=["A cat","Light \'Lumos\'","Wine","","Focused"]
    var reps_l_2=["A rat","Levitation \'Wingardium Leviosa\'","Butter Beer","","Reactive"];
    var reps_r_1=["A toad","Disarm \'Expeliarmus\'","Whiskey","","Protective"];
    var reps_r_2=["A owl","Lock picking \'Alohomora\'","Pumpkin Juice","","Observer"];
    var images_rep_l_1 = ["../assets/cat.jpg","../assets/lumos.jpg","../assets/wine.jpg","../assets/lupin.jpg",""];
    var images_rep_l_2 = ["../assets/rat.jpg","../assets/wingardiumleviosa.png","../assets/butterbeer.png","../assets/snape.jpg",""];
    var images_rep_r_1 = ["../assets/toad.jpg","../assets/expeliarmus.jpg","../assets/whiskey.jpg","../assets/gonagall.jpg",""];
    var images_rep_r_2 = ["../assets/owl.jpg","../assets/alohomora.jpg","../assets/pumpkinjuice.jpg","../assets/hagrid.jpg",""];
    var nb_question = 1;
    var titre = document.querySelector("#questions");
    var reps_l_1_e = document.querySelector("#prop1");
    var reps_l_2_e = document.querySelector("#prop3");
    var reps_r_1_e = document.querySelector("#prop2");
    var reps_r_2_e = document.querySelector("#prop4");
    var image_l_1 = document.querySelector("#left");
    var image_r_1 = document.querySelector("#right");
    var image_l_2 = document.querySelector("#left2");
    var image_r_2 = document.querySelector("#right2");
    image_r_1.style.backgroundImage = `url(${images_rep_r_1[nb_question-1]})`;
    image_l_1.style.backgroundImage = `url(${images_rep_l_1[nb_question-1]})`;
    image_r_2.style.backgroundImage = `url(${images_rep_r_2[nb_question-1]})`;
    image_l_2.style.backgroundImage = `url(${images_rep_l_2[nb_question-1]})`;
    reps_l_1_e.textContent = reps_l_1[nb_question-1];
    reps_r_1_e.textContent = reps_r_1[nb_question-1];
    reps_l_2_e.textContent = reps_l_2[nb_question-1];
    reps_r_2_e.textContent = reps_r_2[nb_question-1];
    titre.textContent = titres[nb_question-1];
    l1.addEventListener("click", () => {
        switch (nb_question) {
            case 1:
                tab = addTab(tab, [1,2,1,1,0,1]); //[0,0,1,1,2,1][1,0,0,1,1,0][0,1,1,1,1,2]
            case 2:
                tab = addTab(tab, [1,2,1,1,0,1]); //[0,0,0,1,1,0][1,1,2,0,1,1][1,1,2,0,1,1]
            case 3:
                tab = addTab(tab, [0,1,1,1,1,2]); //[1,1,2,0,1,1][0,0,1,0,1,1][1,1,0,2,1,1]
            case 4:
                tab = addTab(tab, [0,1,2,0,1,1]); //[0,1,1,1,1,2][1,2,1,1,0,1][1,0,0,1,1,0]
            case 5:
                tab = addTab(tab, [0,1,0,1,0,1]); //[0,0,1,0,1,1][1,1,1,0,0,0][1,0,0,1,1,0]   
        }
        nb_question++;
        titre.textContent = titres[nb_question-1];
        image_r_1.style.backgroundImage = `url(${images_rep_r_1[nb_question-1]})`;
        image_l_1.style.backgroundImage = `url(${images_rep_l_1[nb_question-1]})`;
        image_r_2.style.backgroundImage = `url(${images_rep_r_2[nb_question-1]})`;
        image_l_2.style.backgroundImage = `url(${images_rep_l_2[nb_question-1]})`;
        reps_l_1_e.textContent = reps_l_1[nb_question-1];
        reps_r_1_e.textContent = reps_r_1[nb_question-1];
        reps_l_2_e.textContent = reps_l_2[nb_question-1];
        reps_r_2_e.textContent = reps_r_2[nb_question-1];
        if (nb_question==6){
            form =document.createElement("form");
            form.method = "POST";
            form.action = "/test_house2";
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = "tab";
            input.value = tab;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        }
    });
    l2.addEventListener("click", () => {
        switch (nb_question) {
            case 1:
                tab = addTab(tab, [0,0,1,1,2,1]); //[1,0,0,1,1,0][0,1,1,1,1,2]
            case 2:
                tab = addTab(tab, [0,0,0,1,1,0]); //[1,1,2,0,1,1][1,1,2,0,1,1]
            case 3:
                tab = addTab(tab, [1,1,2,0,1,1]); //[0,0,1,0,1,1][1,1,0,2,1,1]
            case 4:
                tab = addTab(tab, [0,1,1,1,1,2]); //[1,2,1,1,0,1][1,0,0,1,1,0]
            case 5:
                tab = addTab(tab, [0,0,1,0,1,1]); //[1,1,1,0,0,0][1,0,0,1,1,0]   
        }
        nb_question++;
        titre.textContent = titres[nb_question-1];
        image_r_1.style.backgroundImage = `url(${images_rep_r_1[nb_question-1]})`;
        image_l_1.style.backgroundImage = `url(${images_rep_l_1[nb_question-1]})`;
        image_r_2.style.backgroundImage = `url(${images_rep_r_2[nb_question-1]})`;
        image_l_2.style.backgroundImage = `url(${images_rep_l_2[nb_question-1]})`;
        reps_l_1_e.textContent = reps_l_1[nb_question-1];
        reps_r_1_e.textContent = reps_r_1[nb_question-1];
        reps_l_2_e.textContent = reps_l_2[nb_question-1];
        reps_r_2_e.textContent = reps_r_2[nb_question-1];
        if (nb_question==6){
            form =document.createElement("form");
            form.method = "POST";
            form.action = "/test_house2";
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = "tab";
            input.value = tab;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        }
    });
    r1.addEventListener("click", () => {
        switch (nb_question) {
            case 1:
                tab = addTab(tab, [1,0,0,1,1,0]); //[0,1,1,1,1,2]
            case 2:
                tab = addTab(tab, [1,1,2,0,1,1]); //[1,1,2,0,1,1]
            case 3:
                tab = addTab(tab, [0,0,1,0,1,1]); //[1,1,0,2,1,1]
            case 4:
                tab = addTab(tab, [1,2,1,1,0,1]); //[1,0,0,1,1,0]
            case 5:
                tab = addTab(tab, [1,1,1,0,0,0]); //[1,0,0,1,1,0]   
        }
        nb_question++;
        titre.textContent = titres[nb_question-1];
        image_r_1.style.backgroundImage = `url(${images_rep_r_1[nb_question-1]})`;
        image_l_1.style.backgroundImage = `url(${images_rep_l_1[nb_question-1]})`;
        image_r_2.style.backgroundImage = `url(${images_rep_r_2[nb_question-1]})`;
        image_l_2.style.backgroundImage = `url(${images_rep_l_2[nb_question-1]})`;
        reps_l_1_e.textContent = reps_l_1[nb_question-1];
        reps_r_1_e.textContent = reps_r_1[nb_question-1];
        reps_l_2_e.textContent = reps_l_2[nb_question-1];
        reps_r_2_e.textContent = reps_r_2[nb_question-1];
        if (nb_question==6){
            form =document.createElement("form");
            form.method = "POST";
            form.action = "/test_house2";
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = "tab";
            input.value = tab;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        }
    });
    r2.addEventListener("click", () => {
        switch (nb_question) {
            case 1:
                tab = addTab(tab, [0,1,1,1,1,2]); //
            case 2:
                tab = addTab(tab, [1,1,2,0,1,1]); //
            case 3:
                tab = addTab(tab, [1,1,0,2,1,1]); //
            case 4:
                tab = addTab(tab, [1,0,0,1,1,0]); //
            case 5:
                tab = addTab(tab, [1,0,0,1,1,0]); //
        }
        nb_question++;
        titre.textContent = titres[nb_question-1];
        image_r_1.style.backgroundImage = `url(${images_rep_r_1[nb_question-1]})`;
        image_l_1.style.backgroundImage = `url(${images_rep_l_1[nb_question-1]})`;
        image_r_2.style.backgroundImage = `url(${images_rep_r_2[nb_question-1]})`;
        image_l_2.style.backgroundImage = `url(${images_rep_l_2[nb_question-1]})`;
        reps_l_1_e.textContent = reps_l_1[nb_question-1];
        reps_r_1_e.textContent = reps_r_1[nb_question-1];
        reps_l_2_e.textContent = reps_l_2[nb_question-1];
        reps_r_2_e.textContent = reps_r_2[nb_question-1];
        if (nb_question==6){
            form =document.createElement("form");
            form.method = "POST";
            form.action = "/test_house2";
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

