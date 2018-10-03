function checkAnswer() {
    console.log('checkAnswer');
    switch (questions[arrayIndex].type) {
        case 'text':
            var values = [];
            $('.answerInput').each(function(i, item) {
                values.push(item.value);
            });
            console.log(values.toString().toLowerCase());
            var answerString = questions[arrayIndex].answer.toString().trim().toLowerCase().replace(/\s/g,'');
            console.log(answerString);
            
            //if (questions[arrayIndex].answer.toString().trim().toLowerCase() == $('.answerInput').val().trim().toLowerCase()) {
            if (answerString == values.toString().toLowerCase()) {
                totalCorrect++;
                questions[arrayIndex].correct = "1";
	            $('#correctAnswer').removeClass('is-invalid').addClass('is-valid');
                $("#question" + arrayIndex).removeClass('incorrect').addClass('answerCorrect');
            } else {
	            $('#correctAnswer').removeClass('is-valid').addClass('is-invalid');
                $("#question" + arrayIndex).addClass('incorrect');
            }
	        questions[arrayIndex].input = values.toString();
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
        getFirstQuestion();
    } else {
	    getNextQuestion();
    }
}

function getNewQuestion() {
    console.log('getNewQuestion');
    // TODO: Figure out why this is failing when the app loads. Seems to not like when arrayIndex = 0?
    if(arrayIndex > 0){
        if($('#question'+arrayIndex).attr('class').includes('answerCorrect')){
            arrayIndex++;
            getNewQuestion();
        }
    }
    $(".page-link").parent().removeClass('active');
    $('#question'+arrayIndex).parent().addClass('active');
    var question = questions[arrayIndex];

    //TODO: Change boxes to be inline
    switch (question.type) {
        case 'text':
        case 'list':
        case 'fill':
            var questionString = question.question.replace(/____/g,"<input class='userInput form-control answerInput' type='text' name='answer' autofocus>");
            $('#questionRow').html("<div class='col'><div class='row'><h2 id='question'>" + arrayIndex + 1 + ": " + questionString + "</h2></div><div class='row form-group'><label class='sr-only' for='answerInput'>Answer</label></div>");
            $("#question").html(arrayIndex + 1 + ": " + questionString);
            $(".answerInput").first().focus();
            break;
        case "multiple":
            $('#questionRow').html("<div class='col'><div class='row'><h2 id='question'></h2></div><div class='row form-group form-check'><label for='answerInput' class='answers'>Answers</label></div></div>");
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

function randomizeQuestions() {
    console.log('randomizeQuestions');
    arrayIndex = 0;
	questions.sort(function(a, b){return 0.5 - Math.random()});
	setupPagination();
    getQuestion(0);
}

function setupPagination() {
    console.log('setupPagination');
	$('.removeable').remove();
    for(num in questions){
        var questionNum = parseInt(num) + 1;
        $('.questionNav').last().after('<li class="page-item questionNav"><button class="page-link removeable" type="button" onclick="getQuestion('+ num +')" id="question'+num+'">' + questionNum + '</button></li>');
        // TODO: Fix total number of questions that shows under Correct Answers.
    }
}

function setupClass() {
    console.log('setupClass');
    var topicFile = document.createElement('script');
    topicFile.setAttribute('src','json/' + pclass.path +'/topics.json');
    document.head.appendChild(topicFile);
}

function setupTopics() {
    console.log('setupTopics');
    for(topic in classTopics){
        var topicFile = document.createElement('script');
        topicFile.setAttribute('src','json/' + pclass.path + '/' + classTopics[topic].path +'.json');
        document.head.appendChild(topicFile);
    }
}

function setupPage() {
    console.log('setupPage');
    questions = eval(classTopics[0].varname);
    totalQuestions = questions.length;
    
    for(topic in classTopics){
        $('.topics').append('<div class="form-check form-check-inline"><label class="form-check-label"><input type="radio" name="topicSelector" value="' + classTopics[topic].varname + '" class="topicSelector" ' + (topic == 0 ? 'checked': '') + '> ' + classTopics[topic].name +'</label></div>');
    }
    
    $('input[name="topicSelector"]:radio').change(function() {
        questions = eval($('input[name="topicSelector"]:checked').val());
        totalQuestions = questions.length;
        randomizeQuestions();
    });
    $('BODY').keypress(function(e) {
        if (e.which == 13) {
            checkAnswer();
        }
    });
    
    randomizeQuestions();
}

function getQuestion(index){
    console.log('getQuestion');
    arrayIndex = index;
    getNewQuestion();
}

function getNextQuestion() {
    console.log('getNextQuestion');
    if(arrayIndex < questions.length - 1){
	    arrayIndex++;
	    getNewQuestion();
    } else {
        //alert("You have reached the end of the quiz.");
        getFirstIncorrectQuestion()
    }
}

function getPreviousQuestion() {
    console.log('getPreviousQuestion');
    if(arrayIndex > 0){
	    arrayIndex--;
	    getNewQuestion();
    } else {
        alert("You have reached the beginning of the quiz.")
    }
}

function getFirstQuestion() {
    console.log('getFirstQuestion');
    arrayIndex = 0;
    getNewQuestion();
}

function getFirstIncorrectQuestion(){
    console.log('getFirstIncorrectQuestion');
    //TODO: Fix issue where last 
    var numIncorrect = $('.incorrect').length;
    console.log(numIncorrect);
    if(numIncorrect > 0){
        var firstIncorrect = $('.incorrect').first().attr('id');
        arrayIndex = parseInt(firstIncorrect.replace("question",""));
        getNewQuestion();
    } else {
        var firstIncorrect = $('.removeable').not('.answerCorrect').first().attr('id');
        console.log(firstIncorrect);
        arrayIndex = parseInt(firstIncorrect.replace("question",""));
        console.log(arrayIndex);
        getNewQuestion();
    }
}

function getCorrectAnswer(){
    console.log('getCorrectAnswer');
    $('#correctAnswerLabel').text('Correct Answer:');
    $('#correctAnswer').val(questions[arrayIndex].answer);
    $('#answerInput').focus();
}

function resetScore() {
    console.log('resetScore');
    totalQuestions = questions.length;
    $('#correctCount').text("0/" + totalQuestions);
    totalCorrect = 0;
    getFirstQuestion();
}