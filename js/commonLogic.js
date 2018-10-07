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

function getTopicsList(topicsArray){
    console.log('getTopicsList');
    var quizTopicsArray = [];
    for(topic in topicsArray){
        if(topicsArray[topic].quizType == quizType){
            quizTopicsArray.push(topicsArray[topic]);
        }
    }
    console.log(quizTopicsArray);
    return quizTopicsArray;
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

function randomizeQuestions() {
    console.log('randomizeQuestions');
    arrayIndex = 0;
	questions.sort(function(a, b){return 0.5 - Math.random()});
	setupPagination();
    getQuestion(0);
}

function getQuestion(index){
    console.log('getQuestion');
    arrayIndex = index;
    getNewQuestion(arrayIndex);
}

function getNextQuestion() {
    console.log('getNextQuestion');
    if(arrayIndex < questions.length - 1){
	    arrayIndex++;
	    getNewQuestion(arrayIndex);
    } else {
        //alert('You have reached the end of the quiz.');
        getFirstIncorrectQuestion()
    }
}

function getPreviousQuestion() {
    console.log('getPreviousQuestion');
    if(arrayIndex > 0){
	    arrayIndex--;
	    getNewQuestion(arrayIndex);
    } else {
        alert('You have reached the beginning of the quiz.')
    }
}

function getFirstQuestion() {
    console.log('getFirstQuestion');
    arrayIndex = 0;
    getNewQuestion(arrayIndex);
}

function getFirstIncorrectQuestion(){
    console.log('getFirstIncorrectQuestion');
    //TODO: Fix issue where last 
    var numIncorrect = $('.incorrect').length;
    if(numIncorrect > 0){
        var firstIncorrect = $('.incorrect').first().attr('id');
        arrayIndex = parseInt(firstIncorrect.replace('question',''));
        getNewQuestion(arrayIndex);
    } else {
        var firstIncorrect = $('.removeable').not('.answerCorrect').first().attr('id');
        arrayIndex = parseInt(firstIncorrect.replace('question',''));
        getNewQuestion(arrayIndex);
    }
}

function getCorrectAnswer(){
    console.log('getCorrectAnswer');
    $('#correctAnswerLabel').text('Correct Answer:');
    $('#correctAnswer').val(questions[arrayIndex].answer);
    $('.answerInput').first().focus();
}

function resetScore() {
    console.log('resetScore');
    totalQuestions = questions.length;
    $('#correctCount').text('0/' + totalQuestions);
    totalCorrect = 0;
    getFirstQuestion();
}