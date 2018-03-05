function checkAnswer() {
    switch (questions[arrayIndex].type) {
        case 'text':
            if (questions[arrayIndex].answer.toString().trim().toLowerCase() == $('#answerInput').val().trim().toLowerCase()) {
                totalCorrect++;
                questions[arrayIndex].correct = "1";
	            $('#correctAnswer').removeClass('is-invalid').addClass('is-valid');
                $("#question" + arrayIndex).removeClass('incorrect').addClass('answerCorrect');
            } else {
	            $('#correctAnswer').removeClass('is-valid').addClass('is-invalid');
                $("#question" + arrayIndex).addClass('incorrect');
            }
	        questions[arrayIndex].input = $('#answerInput').val();
	        break;
        case 'list':
        case 'fill':
        case 'image':
            var inputArray = $('#answerInput').val().split(",").map(item => item.trim());
            var answerArray = questions[arrayIndex].answer.split(",").map(item => item.trim());
            var answerArrayCount = answerArray.length;
            var correctArray = new Array(answerArrayCount);
            /*for(j in answerArray){
                if(answerArray[j].includes("(")){
                    var optionalArray = answerArray[j].replace(")","").split("(").map(item => item.trim());
                    var optionalArrayIndex = j;
                    break;
                }
            }*/
            if(answerArrayCount == inputArray.length){
                for(i in inputArray){
                    var inputEntry = inputArray[i].toString().trim().toLowerCase();

                    if(answerArray.indexOf(inputEntry) > -1){
                        correctArray[answerArray.indexOf(inputEntry)] = 1;
                    } else if(typeof optionalArray != "undefined" && optionalArray.indexOf(inputEntry) > -1 ){
                        correctArray[optionalArrayIndex] = 1;
                    } else {
                        break;
                    }
                    if(answerArrayCount == correctArray.reduce((accumulator, currentValue) => accumulator + currentValue)){
                        totalCorrect++;
                        questions[arrayIndex].correct = "1";
                        $('#correctAnswer').removeClass('is-invalid').addClass('is-valid');
                        $("#question" + arrayIndex).removeClass('incorrect').addClass('answerCorrect');
                        break;
                    }
                }
            }
            if(questions[arrayIndex].correct != "1") {
	            $('#correctAnswer').removeClass('is-valid').addClass('is-invalid');
                $("#question" + arrayIndex).addClass('incorrect');
            }

            questions[arrayIndex].input = $('#answerInput').val();
            break;
        case 'multiple':
            if (questions[arrayIndex].answer.trim() == $('input[name=answerSelector]:checked').val()){
                totalCorrect++;
                questions[arrayIndex].correct = "1";
	            $('#correctAnswer').removeClass('is-invalid').addClass('is-valid');
                $("#question" + arrayIndex).removeClass('incorrect').addClass('answerCorrect');
            } else {
	            $('#correctAnswer').removeClass('is-valid').addClass('is-invalid');
                $("#question" + arrayIndex).addClass('incorrect');
            }
            questions[arrayIndex].input = $('input[name=answerSelector]:checked').val();
            break;
        case 'either':
            var answerArray = questions[arrayIndex].answer.split(",");
            if(answerArray.indexOf($('#answerInput').val().toLowerCase()) > -1){
                correctAnswers++;
                questions[arrayIndex].correct = "1";
	            $('#correctAnswer').removeClass('is-invalid').addClass('is-valid');
                $("#question" + arrayIndex).removeClass('incorrect').addClass('answerCorrect');
            } else {
	            $('#correctAnswer').removeClass('is-valid').addClass('is-invalid');
                $("#question" + arrayIndex).addClass('incorrect');
            }
            questions[arrayIndex].input = $('#answerInput').val();
            break;
    }

	$('#correctAnswerLabel').text('Correct Answer to Previous Question:');
    $('#correctAnswer').val(questions[arrayIndex].answer);
    $('#correctCount').text(totalCorrect + "/" + totalQuestions);

    if (totalCorrect == totalQuestions) {
        alert("Congratulations! You got them all right!");
        location.reload();
    } else {
	    getNextQuestion();
    }
}

function getNewQuestion() {
    if($('#question'+arrayIndex).attr('class').includes('answerCorrect')){
        arrayIndex++;
        getNewQuestion();
    }
    $(".page-link").parent().removeClass('active');
    $('#question'+arrayIndex).parent().addClass('active');
    var question = questions[arrayIndex];

    switch (question.type) {
        case 'text':
        case 'list':
        case 'fill':
            $('#questionRow').html("<div class='col'><div class='row'><h2 id='question'></h2></div><div class='row form-group'><label for='answerInput'>Answer</label></br><input class='userInput form-control' id='answerInput' type='text' name='answer' autofocus></div></div>");
            $("#question").text(arrayIndex + 1 + ": " + question.question);
            $("#answerInput").focus();
            break;
        case "multiple":
            $('#questionRow').html("<div class='col'><div class='row'><h2 id='question'></h2></div><div class='row form-group form-check'><label for='answerInput' class='answers'>Answer</label></div></div>");
            $("#question").text(arrayIndex + 1 + ": " + question.question.trim());
            
            var answerChoices = question.choices.split(",");
            for (choice in answerChoices) {
                $(".form-check").last().after('<div class="form-check"><input type="radio" name="answerSelector" class="answers"><label class="form-check-label answerLabel"></label></div> ');
                $(".answerLabel").last().text(answerChoices[choice]);
                $(".answers").last().val(answerChoices[choice].trim());
            }
            break;
	    case "image":
		    $('#questionRow').html("<div class='col'><div class='row'><img id='question' src=''></div><div class='row form-group'><label for='answerInput'>Answer</label></br><input class='userInput form-control' id='answerInput' type='text' name='answer'></div></div>");
		    $("#question").attr("src", "images/" + question.question);
		    break;
    }
    if("input" in questions[arrayIndex]){
        $('#correctAnswerLabel').text('Previously Entered Answer:');
	    $('#correctAnswer').val(questions[arrayIndex].input);
    } else if(arrayIndex > 0 && "input" in questions[arrayIndex - 1]){
	    $('#correctAnswerLabel').text('Correct Answer to Previous Question:');
	    $('#correctAnswer').val(questions[arrayIndex-1].answer);
    } else {
	    $('#correctAnswerLabel').text('Continue Quiz:');
	    $('#correctAnswer').val('Press "Check Answer" or "Enter" key to submit your answer.');
    }
}

function getNewQuestionNumber() {
    arrayIndex = Math.floor((Math.random() * questions.length));
    if (questions[arrayIndex].correct == 1) {
        getNewQuestionNumber();
    }
}

function randomizeQuestions() {
    var arrayIndex = 0;
	questions.sort(function(a, b){return 0.5 - Math.random()});
	setupPagination();
	getNewQuestion();
	console.log(questions);
}

function setupPagination() {
	$('.removeable').remove();
    for(num in questions){
        var questionNum = parseInt(num) + 1;
        $('.questionNav').last().after('<li class="page-item questionNav"><button class="page-link removeable" type="button" onclick="getQuestion('+ num +')" id="question'+num+'">' + questionNum + '</button></li>');
    }
}

function getQuestion(index){
    arrayIndex = index;
    getNewQuestion();
}

function getNextQuestion() {
    if(arrayIndex < questions.length - 1){
	    arrayIndex++;
	    getNewQuestion();
    } else {
        //alert("You have reached the end of the quiz.");
        getFirstIncorrectQuestion()
    }
}

function getPreviousQuestion() {
    if(arrayIndex > 0){
	    arrayIndex--;
	    getNewQuestion();
    } else {
        alert("You have reached the beginning of the quiz.")
    }
}

function getFirstQuestion() {
    arrayIndex = 0;
    getNewQuestion();
}

function getFirstIncorrectQuestion(){
    var firstIncorrect = $('.incorrect').first().attr('id');
    arrayIndex = parseInt(firstIncorrect.replace("question",""));
    getNewQuestion();
}

function getCorrectAnswer(){
    $('#correctAnswerLabel').text('Correct Answer:');
    $('#correctAnswer').val(questions[arrayIndex].answer);
}

function resetScore() {
    totalQuestions = questions.length;
    $('#correctCount').text("0/" + totalQuestions);
    totalCorrect = 0;
}