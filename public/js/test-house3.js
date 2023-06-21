const r1 = document.querySelector("#answer1");
const r2 = document.querySelector("#answer2");
const r3 = document.querySelector("#answer3");
const r4 = document.querySelector("#answer4");

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
    var titres=["Your partner suggests a series night, but your friends suggest a party.","Your classmate cheats on their exams, stealing the first place from you, and the teacher interrogates you."];
    var reps_1=["You stick with your partner","You confess to the teacher, he shouldn't have cheated to beat you"]
    var reps_2=["You go to the party with your friends","You give your classmate the chance to confess"];
    var reps_3=["You bring your partner to the party","You don't say anything, you don't want to be a snitch"];
    var reps_4=["","You calculate that it doesn't harm your house, so you reclaim your first place"];
    var nb_question = 1;
    var titre = document.querySelector("#questions");
    var reps_1_e = document.querySelector("#answer1_l");
    var reps_2_e = document.querySelector("#answer2_l");
    var reps_3_e = document.querySelector("#answer3_l");
    var reps_4_e = document.querySelector("#answer4_l");
    var rep_4_e   = document.querySelector("#answer4");
    var e = document.querySelector("#answer4_b");
    reps_1_e.textContent = reps_1[nb_question-1] 
    reps_2_e.textContent = reps_2[nb_question-1];
    reps_3_e.textContent = reps_3[nb_question-1];
    reps_4_e.textContent = reps_4[nb_question-1];
    if (nb_question==1){
        rep_4_e.style.display = "none";
    }
    titre.innerHTML = titres[nb_question-1] + "<br>" + "What do you do?";
    r1.addEventListener("click", () => {
        switch (nb_question) {
            case 1:
                tab = addTab(tab, [0,1,0,1,0,1]); //[2,1,1,1,1,0][0,1,1,1,1,2]
            case 2:
                tab = addTab(tab, [0,0,1,0,1,1]); //[1,0,0,1,1,0][2,1,1,1,1,0][0,1,1,1,1,2]
        }
        nb_question++;
        titre.textContent = titres[nb_question-1];
        reps_1_e.textContent = reps_1[nb_question-1];
        reps_2_e.textContent = reps_2[nb_question-1];
        reps_3_e.textContent = reps_3[nb_question-1];
        reps_4_e.textContent = reps_4[nb_question-1];
        if (nb_question==3){
            form =document.createElement("form");
            form.method = "POST";
            form.action = "/test_house3";
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
                tab = addTab(tab, [2,1,1,1,1,0]); //[0,1,1,1,1,2]
            case 2:
                tab = addTab(tab, [1,0,0,1,1,0]); //[2,1,1,1,1,0][0,1,1,1,1,2]
        }
        nb_question++;
        titre.textContent = titres[nb_question-1];
        reps_1_e.textContent = reps_1[nb_question-1];
        reps_2_e.textContent = reps_2[nb_question-1];
        reps_3_e.textContent = reps_3[nb_question-1];
        reps_4_e.textContent = reps_4[nb_question-1];
        if (nb_question==3){
            form =document.createElement("form");
            form.method = "POST";
            form.action = "/test_house3";
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = "tab";
            input.value = tab;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        }
    });
    r3.addEventListener("click", () => {
        switch (nb_question) {
            case 1:
                tab = addTab(tab, [0,1,1,1,1,2]); //[2,1,1,1,1,0]
            case 2:
                tab = addTab(tab, [2,1,1,1,1,0]); //[1,0,0,1,1,0][0,1,1,1,1,2]
        }
        nb_question++;
        titre.textContent = titres[nb_question-1];
        reps_1_e.textContent = reps_1[nb_question-1];
        reps_2_e.textContent = reps_2[nb_question-1];
        reps_3_e.textContent = reps_3[nb_question-1];
        reps_4_e.textContent = reps_4[nb_question-1];
        if (nb_question==3){
            form =document.createElement("form");
            form.method = "POST";
            form.action = "/test_house3";
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = "tab";
            input.value = tab;
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        }
    });
    r4.addEventListener("click", () => {
        switch (nb_question) {
            case 1:
                tab = addTab(tab, [0,0,0,0,0,0]); //[2,1,1,1,1,0][0,1,1,1,1,2]
            case 2:
                tab = addTab(tab, [0,1,1,1,1,2]); //[1,0,0,1,1,0][2,1,1,1,1,0][0,1,1,1,1,2]
        }
        nb_question++;
        titre.textContent = titres[nb_question-1];
        reps_1_e.textContent = reps_1[nb_question-1];
        reps_2_e.textContent = reps_2[nb_question-1];
        reps_3_e.textContent = reps_3[nb_question-1];
        reps_4_e.textContent = reps_4[nb_question-1];
        if (nb_question==3){
            form =document.createElement("form");
            form.method = "POST";
            form.action = "/test_house3";
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

