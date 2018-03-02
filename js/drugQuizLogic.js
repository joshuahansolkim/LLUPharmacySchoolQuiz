function checkAnswer(){
    var questionType = $('input[name="questionSelector"]:checked').val();
    switch (questionType) {
        case 'genericRadio':
            if(drugSubset[arrayIndex].genericName.toLowerCase() == $('#genericInput').val().toLowerCase()){
                totalCorrect++;
                answerCorrect[arrayIndex] = "1";
                $('#genericInput').val('');
            } else {
                alert("The correct answer is: " + drugSubset[arrayIndex].genericName);
                $('#genericInput').val('');
            }
            break;
        case 'tradeRadio':
            if(drugSubset[arrayIndex].tradeName.toLowerCase() == $('#tradeInput').val().toLowerCase()){
                totalCorrect++;
                answerCorrect[arrayIndex] = "1";
                $('#tradeInput').val('');
            } else {
                alert("The correct answer is: " + drugSubset[arrayIndex].tradeName);
                $('#tradeInput').val('');
            }
            break;
    }
    
    $('#correctCount').val(totalCorrect + "/" + totalDrugs);
    if(totalCorrect == totalDrugs) {
        alert("Congratulations! You got them all right!");
        location.reload();
    } else {
        getNewQuestion();
    }
}

function getNewQuestion () {
    getNewQuestionNumber();
    var drug = drugSubset[arrayIndex];
    $('.userInput').attr('disabled', true);
    if($('#tradeRadio').prop('checked')){
        $('#tradeInput').attr('value', '').attr('disabled', false);
    } else {
        $('#tradeInput').attr('value', drug.tradeName);
    }
    if($('#genericRadio').prop('checked')){
        $('#genericInput').attr('value', '').attr('disabled', false);
    } else {
        $('#genericInput').attr('value', drug.genericName);
    }
    if($('#indicationRadio').prop('checked')){
        $('#indicationInput').attr('value', '').attr('disabled', false);
    } else {
        $('#indicationInput').attr('value', drug.indication);
    }
    if($('#moaRadio').prop('checked')){
        $('#moaInput').text('').attr('disabled', false);
    } else {
        $('#moaInput').text(drug.moa);
    }
    if($('#nonrxRadio').prop('checked')){
        $('#nonrxInput').text('').attr('disabled', false);
    } else {
        $('#nonrxInput').text(drug.nonrx);
    }
    if($('#rxRadio').prop('checked')){
        $('#rxInput').text('').attr('disabled', false);
    } else {
        $('#rxInput').text(drug.rx);
    }
    if($('#exclusionsRadio').prop('checked')){
        $('#exclusionsInput').text('').attr('disabled', false);
    } else {
        $('#exclusionsInput').text(drug.exclusions);
    }
    
}

function getNewQuestionNumber () {
    arrayIndex = Math.floor((Math.random() * drugSubset.length));
    if (answerCorrect[arrayIndex] == 1){
        getNewQuestionNumber();
    }
    console.log("Question Number: " + arrayIndex);
}

function createOptionList() {
    var drugSubsetList = [];
    for(d = 0; d < drugs.length; d++){
        if(drugSubsetList.indexOf(drugs[d].indication) == -1 && drugs[d].indication.length != 0){
            drugSubsetList.push(drugs[d].indication);
        }
    }
    for(s = 0; s < drugSubsetList.length; s++){
        $('#quizOptions').append($('<option>', {
        value: drugSubsetList[s],
        text: drugSubsetList[s]
        }));
    }
}

function createDrugSubset(subset) {
    if(subset == "all"){
        drugSubset = drugs;
    } else {
        drugSubset = [];
        for(d = 0; d < drugs.length; d++){
            if(drugs[d].indication.toLowerCase() == subset.toLowerCase()){
                drugSubset.push(drugs[d]);
            }
        }
    }
    
    totalCorrect = 0;
    totalDrugs = drugSubset.length;
    getNewQuestion();
    printDrugList();
}

function printDrugList() {
    $('.drugListData').remove();
    for(d = 0; d < drugSubset.length; d++){
        $('tbody').append('<tr class="drugListData"><td>' + drugSubset[d].tradeName +  '</td><td>' + drugSubset[d].genericName + '</td><td>' + drugSubset[d].indication + '</td><td>' + drugSubset[d].moa + '</td><td>' + drugSubset[d].nonrx + '</td><td>' + drugSubset[d].rx + '</td><td>' + drugSubset[d].exclusions + '</td></tr>');
    }
}

function resetScore() {
    $('#correctCount').val("0/" + totalDrugs);
}