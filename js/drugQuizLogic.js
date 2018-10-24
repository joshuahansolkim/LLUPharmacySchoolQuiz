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
    getQuestion();
    printDrugList();
}

function setupPagination() {
	$('.removeable').remove();
    for(num in drugSubset){
        var questionNum = parseInt(num) + 1;
        $('.questionNav').last().after('<li class="page-item questionNav"><button class="page-link removeable" type="button" onclick="getQuestion('+ num +')" id="question'+num+'">' + questionNum + '</button></li>');
    }
}

function getQuestion () {
    /* Bug fix for arrayindex not getting set correctly on app start. */
    if(arrayIndex > 0){
        if($('#question'+arrayIndex).attr('class').includes('answerCorrect')){
            arrayIndex++;
            getQuestion();
        }
    }
    /* Change pagination to show which question is active. */
    $(".page-link").parent().removeClass('active');
    $('#question'+arrayIndex).parent().addClass('active');
    
    /* Get drug for question */
    var drug = drugSubset[arrayIndex];
    
    /* Determine what the drug data type that should be asked for and populate other fields. */
    $('.userInput').attr('disabled', true);
    if($('#tradeRadio').prop('checked')){
        $('#tradeInput').attr('value', '').attr('disabled', false).focus();
    } else {
        $('#tradeInput').attr('value', drug.tradeName);
    }
    if($('#genericRadio').prop('checked')){
        $('#genericInput').attr('value', '').attr('disabled', false).focus();
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
    if($('#scheduleRadio').prop('checked')){
        $('#scheduleInput').attr('value', '').attr('disabled', false).focus();
    } else {
        $('#scheduleInput').attr('value', drug.schedule);
    }
    
    /* This modifies the Info box below the question depending on whether previous questions have been answered */
    var questionType = $(".questionSelector").val();
    if("input" in drugSubset[arrayIndex]){
        $('#correctAnswerLabel').text('Previously Entered Answer:');
        switch (questionType) {
        case 'genericRadio':
            $('#correctAnswer').val(drugSubset[arrayIndex].genericName);
            break;
        case 'tradeRadio':
            $('#correctAnswer').val(drugSubset[arrayIndex].tradeName);
            break;
        case 'scheduleRadio':
            $('#correctAnswer').val(drugSubset[arrayIndex].schedule);
            break;
        }
	    
    } else if(arrayIndex > 0 && "input" in drugSubset[arrayIndex - 1]){
	    $('#correctAnswerLabel').text('Correct Answer to Previous Question:');
        switch(questionType) {
            case 'genericRadio':
                $('#correctAnswer').val(drugSubset[arrayIndex-1].genericName);
                break;
            case 'tradeRadio':
                $('#correctAnswer').val(drugSubset[arrayIndex-1].tradeName);
                break;
            case 'scheduleRadio':
                $('#correctAnswer').val(drugSubset[arrayIndex-1].schedule);
                break;
        }
    } else {
	    $('#correctAnswerLabel').text('Continue Quiz:');
	    $('#correctAnswer').val('Press "Check Answer" or "Enter" key to submit your answer.');
    }   
}

function getQuestion(index){
    arrayIndex = index;
    getQuestion();
}

function getNextQuestion() {
    if(arrayIndex < drugSubset.length - 1){
	    arrayIndex++;
	    getQuestion();
    } else {
        //alert("You have reached the end of the quiz.");
        getFirstIncorrectQuestion()
    }
}

function getFirstQuestion() {
    arrayIndex = 0;
    getQuestion();
}

function getFirstIncorrectQuestion(){
    var firstIncorrect = $('.incorrect').first().attr('id');
    arrayIndex = parseInt(firstIncorrect.replace("question",""));
    getQuestion();
}

function randomizeQuestions() {
    var arrayIndex = 0;
	drugSubset.sort(function(a, b){return 0.5 - Math.random()});
	setupPagination();
    getFirstQuestion();
}

function checkAnswer(){
    var questionType = $('input[name="questionSelector"]:checked').val();
    switch (questionType) {
        case 'genericRadio':
            if(drugSubset[arrayIndex].genericName.toLowerCase() == $('#genericInput').val().toLowerCase()){
                if(drugSubset[arrayIndex].correct != "1"){
                    totalCorrect++;
                }
                drugSubset[arrayIndex].correct = "1";
	            $('#correctAnswer').removeClass('is-invalid').addClass('is-valid');
                $("#question" + arrayIndex).removeClass('incorrect').addClass('answerCorrect');
            } else {
                $("#question" + arrayIndex).addClass('incorrect');
                console.log("incorrect");
            }
            $("#genericInput").val('');
            drugSubset[arrayIndex].input = $('#genericInput').val();
            break;
        case 'tradeRadio':
            if(drugSubset[arrayIndex].tradeName.toLowerCase() == $('#tradeInput').val().toLowerCase()){
                if(drugSubset[arrayIndex].correct != "1"){
                    totalCorrect++;
                }
                drugSubset[arrayIndex].correct = "1";
                $("#question" + arrayIndex).removeClass('incorrect').addClass('answerCorrect');
            } else {
                $("#question" + arrayIndex).addClass('incorrect');
                console.log("incorrect");
            }
            $("#tradeInput").val('');
            drugSubset[arrayIndex].input = $('#tradeInput').val();
            break;
        case 'scheduleRadio':
            if(drugSubset[arrayIndex].schedule.toLowerCase() == $('#scheduleInput').val().toLowerCase()){
                if(drugSubset[arrayIndex].correct != "1"){
                    totalCorrect++;
                }
                drugSubset[arrayIndex].correct = "1";
                $("#question" + arrayIndex).removeClass('incorrect').addClass('answerCorrect');
            } else {
                $("#question" + arrayIndex).addClass('incorrect');
                console.log("incorrect");
            }
            $("#scheduleInput").val('');
            drugSubset[arrayIndex].input = $('#scheduleInput').val();
            break;
    }
    
    $('#correctCount').text(totalCorrect + "/" + totalDrugs);
    if(totalCorrect == totalDrugs) {
        alert("Congratulations! You got them all right!");
        location.reload();
    } else {
        getNextQuestion();
    }
}

function getCorrectAnswer(){
    $('#correctAnswerLabel').text('Correct Answer:');
    var questionType = $('input[name="questionSelector"]:checked').val();
    switch (questionType) {
        case 'genericRadio':
            $('#correctAnswer').val(drugSubset[arrayIndex].genericName);
            $('#genericInput').focus();
            break;
        case 'tradeRadio':
            $('#correctAnswer').val(drugSubset[arrayIndex].tradeName);
            $('#tradeInput').focus();
            break;
        case 'scheduleRadio':
            $('#correctAnswer').val(drugSubset[arrayIndex].schedule);
            $('#scheduleInput').focus();
            break;
    }
}

function getPreviousQuestion() {
    if(arrayIndex > 0){
	    arrayIndex--;
	    getQuestion();
    } else {
        alert("You have reached the beginning of the quiz.")
    }
}

function printDrugList() {
    $('.drugListData').remove();
    for(d = 0; d < drugSubset.length; d++){
        $('tbody').append('<tr class="drugListData"><td>' + drugSubset[d].tradeName +  '</td><td>' + drugSubset[d].genericName + '</td><td>' + drugSubset[d].indication + '</td><td>' + drugSubset[d].moa + '</td><td>' + drugSubset[d].nonrx + '</td><td>' + drugSubset[d].rx + '</td><td>' + drugSubset[d].exclusions + '</td></tr>');
    }
}

function resetScore() {
    totalDrugs = drugSubset.length;
    totalCorrect = 0;
    $('#correctCount').text("0/" + totalDrugs);
    randomizeQuestions();
}