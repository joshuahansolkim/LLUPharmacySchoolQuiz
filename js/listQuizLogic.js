function checkAnswer() {
    console.log('checkAnswer');
    
    var questionNumber = arrayIndex;
    var question = questions[questionNumber];
    var questionType = getQuestionType();
    
    // Get correct answer
    var correctAnswer = question[questionType].trim().toLowerCase();
    
    // Get user's input
    var userAnswer =  $('.' + generateClassName(questionType)).val().toLowerCase();

    // Set the styles according to whether that section was correct or not
    if(correctAnswer == userAnswer){
        console.log('correct');
        totalCorrect++;
        question.correct = 1;
        $('.' + generateClassName(questionType)).removeClass('incorrect').addClass('answerCorrect');
        $('#question' + arrayIndex).removeClass('incorrect').addClass('answerCorrect');
    } else {
        console.log('incorrect');
        console.log(arrayIndex);
        $('#question' + arrayIndex).addClass('incorrect');
        $('.' + generateClassName(questionType)).removeClass('answerCorrect').addClass('incorrect');
    }
    
    // Update scoring
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
    
    // Clear all form fields
    $('.formFields').empty();
    $('.formField').remove();
    
    // Update the pagination buttons
    $('.page-link').parent().removeClass('active');
    $('#question'+questionNumber).parent().addClass('active');
    
    // Get the question for the form
    var question = questions[questionNumber];
    console.log(question);
    
    setupQuestionTypes(question);
    
    // Iterate through the fields
    for(fieldname in question){
        if(fieldname != 'correct'){
            var className = generateClassName(fieldname);
            // Show an empty input field for each item in the json
            $('.inputFields').append('<div class="form-group formField"><div class="label">' + fieldname + ':</div><div class=' + className + 's formFields"></div></div>');

            $('.' + className + 's').append('<input class="form-control ' + className + '" type="text">');
            $('.' + className + 's').removeClass('incorrect');
        }   
    }
    
    showValues(question);
}

function getQuestionType(){
    console.log('getQuestionType');
    var dataType = $('.questionTypes').attr('data-type');
    return dataType;
}

function setupQuestionTypes(question) {
    console.log('setupQuestionTypes');
    var currentType = getQuestionType();
    $('.typeSelector').closest('.form-check-inline').remove();
    for(fieldname in question){
        if(fieldname != 'correct'){
            if($('#' + fieldname.replace(' ','')).length == 0){
                $('.questionTypes').append('<div class="form-check form-check-inline"><label class="form-check-label"><input type="radio" name="typeSelector" value="' + fieldname + '" class="typeSelector" id="' + fieldname.replace(' ','') + '"' + (currentType == fieldname ? 'checked': '') + '> ' + fieldname +'</label></div>');
            }
        }
    }
    $('input[name="typeSelector"]:radio').change(function() {
        changeQuestionType();
        showValues(question);
    });
}

function showValues(question){
    console.log('showValues');
    var currentType = getQuestionType();
    for(fieldname in question){
        var className = generateClassName(fieldname);
        if(fieldname != 'correct'){ 
            if(currentType != fieldname){
                $('.' + className).val(question[fieldname]).prop( "disabled", true );
            }else if(question.correct == 1){
                $('.' + className).val(question[fieldname])
            }else{
                $('.' + className).val('').prop( "disabled", false ).focus();
            }
        }
    }
}

function changeQuestionType(){
    console.log('changeQuestionType');
    var typeValue = $('input[name="typeSelector"]:checked').val();
    $('.questionTypes').attr('data-type',typeValue);
}
