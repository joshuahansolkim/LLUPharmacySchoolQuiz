function checkAnswer() {
    console.log('checkAnswer');
    switch (questions[arrayIndex].type) {
        case 'text':
        case 'fill':
            var values = [];
            $('.answerInput').each(function(i, item) {
                values.push(item.value);
            });
            var answerString = questions[arrayIndex].answer.toString().trim().toLowerCase().replace(/\s/g,'');
            
            if (answerString == values.toString().toLowerCase()) {
                totalCorrect++;
                questions[arrayIndex].correct = '1';
	            $('#correctAnswer').removeClass('is-invalid').addClass('is-valid');
                $('#question' + arrayIndex).removeClass('incorrect').addClass('answerCorrect');
            } else {
	            $('#correctAnswer').removeClass('is-valid').addClass('is-invalid');
                $('#question' + arrayIndex).addClass('incorrect');
            }
	        questions[arrayIndex].input = values.toString();
	        break;
        case 'list':
        case 'image':
            var inputArray = $('.answerInput').val().split(',').map(item => item.trim());
            var answerArray = questions[arrayIndex].answer.split(',').map(item => item.trim());
            var answerArrayCount = answerArray.length;
            var correctArray = new Array(answerArrayCount);
            if(answerArrayCount == inputArray.length){
                for(i in inputArray){
                    var inputEntry = inputArray[i].toString().trim().toLowerCase();

                    if(answerArray.indexOf(inputEntry) > -1){
                        correctArray[answerArray.indexOf(inputEntry)] = 1;
                    } else if(typeof optionalArray != 'undefined' && optionalArray.indexOf(inputEntry) > -1 ){
                        correctArray[optionalArrayIndex] = 1;
                    } else {
                        break;
                    }
                    if(answerArrayCount == correctArray.reduce((accumulator, currentValue) => accumulator + currentValue)){
                        totalCorrect++;
                        questions[arrayIndex].correct = '1';
                        $('#correctAnswer').removeClass('is-invalid').addClass('is-valid');
                        $('#question' + arrayIndex).removeClass('incorrect').addClass('answerCorrect');
                        break;
                    }
                }
            }
            if(questions[arrayIndex].correct != '1') {
	            $('#correctAnswer').removeClass('is-valid').addClass('is-invalid');
                $('#question' + arrayIndex).addClass('incorrect');
            }

            questions[arrayIndex].input = $('.answerInput').val();
            break;
        case 'multiple':
            if (questions[arrayIndex].answer.trim() == $('input[name=answerSelector]:checked').val()){
                totalCorrect++;
                questions[arrayIndex].correct = '1';
	            $('#correctAnswer').removeClass('is-invalid').addClass('is-valid');
                $('#question' + arrayIndex).removeClass('incorrect').addClass('answerCorrect');
            } else {
	            $('#correctAnswer').removeClass('is-valid').addClass('is-invalid');
                $('#question' + arrayIndex).addClass('incorrect');
            }
            questions[arrayIndex].input = $('input[name=answerSelector]:checked').val();
            break;
        case 'either':
            var answerArray = questions[arrayIndex].answer.split(',');
            if(answerArray.indexOf($('.answerInput').val().toLowerCase()) > -1){
                correctAnswers++;
                questions[arrayIndex].correct = '1';
	            $('#correctAnswer').removeClass('is-invalid').addClass('is-valid');
                $('#question' + arrayIndex).removeClass('incorrect').addClass('answerCorrect');
            } else {
	            $('#correctAnswer').removeClass('is-valid').addClass('is-invalid');
                $('#question' + arrayIndex).addClass('incorrect');
            }
            questions[arrayIndex].input = $('.answerInput').val();
            break;
    }

	$('#correctAnswerLabel').text('Correct Answer to Previous Question:');
    $('#correctAnswer').val(questions[arrayIndex].answer);
    $('#correctCount').text(totalCorrect + '/' + totalQuestions);

    if (totalCorrect == totalQuestions) {
        getFirstQuestion();
    } else {
	    getNextQuestion();
    }
}

function getNewQuestion(questionNumber) {
    console.log('getNewQuestion');
    // TODO: Figure out why this is failing when the app loads. Seems to not like when arrayIndex = 0?
    // TODO: Do I still need this block? I don't remember what it's for.
    /*
    if(questionNumber > 0){
        if($('#question'+questionNumber).attr('class').includes('answerCorrect')){
            questionNumber++;
            getNewQuestion(questionNumber);
        }
    }
    */
    $('.page-link').parent().removeClass('active');
    $('#question' + questionNumber).parent().addClass('active');
    var question = questions[questionNumber];

    //TODO: Change boxes to be inline
    switch (question.type) {
        case 'text':
        case 'list':
        case 'fill':
            var questionString = question.question.replace(/____/g,'<input class="userInput form-control answerInput" type="text" name="answer" autofocus>');
            $('#questionRow').html('<div class="col"><div class="row"><h2 id="question">' + questionNumber + 1 + ': ' + questionString + '</h2></div><div class="row form-group"><label class="sr-only" for="answerInput">Answer</label></div>');
            $('#question').html(questionNumber + 1 + ': ' + questionString);
            $('.answerInput').first().focus();
            break;
        case 'multiple':
            $('#questionRow').html('<div class="col"><div class="row"><h2 id="question"></h2></div><div class="row form-group form-check"><label for="answerInput" class="answers">Answers</label></div></div>');
            $('#question').text(questionNumber + 1 + ': ' + question.question.trim());
            
            var answerChoices = question.choices.split(',');
            for (choice in answerChoices) {
                $('.form-check').last().after('<div class="form-check"><input type="radio" name="answerSelector" class="answers"><label class="form-check-label answerLabel"></label></div>');
                $('.answerLabel').last().text(answerChoices[choice]);
                $('.answers').last().val(answerChoices[choice].trim());
            }
            break;
	    case 'image':
		    $('#questionRow').html('<div class="col"><div class="row"><img id="question" src=""></div><div class="row form-group"><label for="answerInput">Answer</label></br><input class="userInput form-control answerInput" type="text" name="answer"></div></div>');
		    $('#question').attr('src', 'images/' + question.question);
		    break;
    }
    if('input' in questions[questionNumber]){
        $('#correctAnswerLabel').text('Previously Entered Answer:');
	    $('#correctAnswer').val(questions[questionNumber].input);
    } else if(questionNumber > 0 && 'input' in questions[questionNumber - 1]){
	    $('#correctAnswerLabel').text('Correct Answer to Previous Question:');
	    $('#correctAnswer').val(questions[questionNumber-1].answer);
    } else {
	    $('#correctAnswerLabel').text('Continue Quiz:');
	    $('#correctAnswer').val('Press "Check Answer" or "Enter" key to submit your answer.');
    }
}