function checkAnswer() {
    console.log('checkAnswer');
    // Determine correct answer using logic specific to question type
    switch (questions[arrayIndex].type) {
        case 'text':
            // A single answer
        case 'fill':
            // Fill in the blanks
            var values = [];
            $('.answerInput').each(function(i, item) {
                values.push(item.value);
            });
            var answerString = questions[arrayIndex].answer.toString().trim().toLowerCase().replace(/,\s/g,',');
            
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
            // A list of answers (order doesn't matter)
        case 'image':
            // An image with the possibility of a list of answers (order doesn't matter)
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
            // Multiple choice
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
            // I don't know what this is for
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
    
    // Update scoring
	$('#correctAnswerLabel').text('Correct Answer to Previous Question:');
    $('#correctAnswer').val(questions[arrayIndex].answer);
    $('#correctCount').text(totalCorrect + '/' + totalQuestions);

    // Get next question
    if (totalCorrect == totalQuestions) {
        getFirstQuestion();
    } else {
	    getNextQuestion();
    }
}

function getQuestion(questionNumber) {
    console.log('getQuestion');
    arrayIndex = questionNumber;
    // Update pagination
    $('.page-link').parent().removeClass('active');
    $('#correctAnswer').removeClass('is-invalid');
    $('#question' + questionNumber).parent().addClass('active');
    $('#quizForm').addClass('form-inline');
    
    // Get question and determine how to present the question by type
    var question = questions[questionNumber];
    switch (question.type) {
        case 'list':
            // Lists of answers
            /* TODO: Update - This should be similar to text, no inline spaces, but the check answer logic is different because the order doesn't matter */
            
        case 'text':
            // A single answer
            var questionString = question.question;
		    $('#questionRow').html('<div class="col"><div class="row"><h2 id="question">' + eval(questionNumber + 1) + ': ' + questionString + '</h2></div><div class="row form-group"><h3><label for="answerInput">Answer: &nbsp; </label></h3></br><input class="userInput form-control answerInput" type="text" name="answer"></div></div>');
            break;
        case 'fill':
            // Fill in the blanks
            var questionString = question.question.replace(/____/g,'<input class="userInput form-control answerInput" type="text" name="answer" autofocus>');
            $('#questionRow').html('<div class="col"><div class="row"><h2 id="question">' + eval(questionNumber + 1) + ': ' + questionString + '</h2></div><div class="row form-group"><label class="sr-only" for="answerInput">Answer</label></div>');
            $('#question').html(eval(questionNumber + 1) + ': ' + questionString);
            $('.answerInput').first().focus();
            break;
        case 'multiple':
            // Multiple choice
            $('#quizForm').removeClass('form-inline');
            $('#questionRow').html('<div class="col"><div class="row"><h2 id="question"></h2></div><div class="row form-group form-check"><h3><label for="answerInput" class="answers">Answers</label></h3></div></div>');
            $('#question').text(eval(questionNumber + 1) + ': ' + question.question.trim());
            
            var answerChoices = question.choices.split(',');
            answerChoices.sort(function(){return 0.5 - Math.random()});
            
            for (choice in answerChoices) {
                $('.form-check').last().after('<div class="form-check"><input type="radio" name="answerSelector" class="answers"><label class="form-check-label answerLabel"></label></div>');
                $('.answerLabel').last().text(answerChoices[choice]);
                $('.answers').last().val(answerChoices[choice].trim());
            }
            break;
	    case 'image':
            // An image with a single answer box
		    $('#questionRow').html('<div class="col"><div class="row"><img id="question" src=""></div><div class="row form-group"><label for="answerInput">Answer</label></br><input class="userInput form-control answerInput" type="text" name="answer"></div></div>');
		    $('#question').attr('src', 'images/' + question.question);
		    break;
        case 'choose':
            // Choose all that apply
            /* TODO: Update - This will feature checkboxes instead of radio buttons and allow the user to select multiple answers */
            break;
    }
    
    $('#questionRow').data('quiztype', question.type);
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

function showAnswer(){
    var correctAnswer = getCorrectAnswer();
    var answerArray = correctAnswer.split(',').map(item => item.trim());
    var answerInputCount = $('.answerInput').length;
    var questionType = $('#questionRow').data('quiztype');
    switch (questionType) {
        case 'list':
        case 'text':
        case 'fill':
            if(answerArray.length == answerInputCount){
                $('.answerInput').each(function(index){
                    this.value = answerArray[index];
                })
            }else{
                $('.answerInput').first().val(correctAnswer);
            }
            break;
        case 'multiple':
            $('.answers').each(function(index){
                if(this.value == correctAnswer){
                    $(this).prop('checked', true);
                }
            })
            break;
    }
    
}









