function checkAnswer() {
    var questionNumber = arrayIndex;
    var drug = questions[questionNumber];
    var broadValues = [];
    
    for(fieldname in drug){
        if (fieldname.toLowerCase() !== 'name'){
            var className = fieldname.replace(' ','') + 'Field';
        
            // Get correct answers from json
            var itemAnswerArray = drug[fieldname].split('|').map(item => item.trim().toLowerCase());

            // Get user's input and add them to an array
            var itemInputArray = [];
            $('.' + className).each(function(i, item) {
                itemInputArray.push(item.value.toLowerCase());
            });

            // Compare the json array with the user's input to see if they are the same
            var correctAnswersCount = 0;
            for(question in itemAnswerArray){
                if(itemInputArray.indexOf(itemAnswerArray[question]) > -1){
                    correctAnswersCount++;
                }
            }
            
            // Set the styles according to whether that section was correct or not
            if(correctAnswersCount == itemAnswerArray.length){
                $('.' + className).removeClass('incorrect').addClass('answerCorrect');
            } else {
                $('.' + className).removeClass('answerCorrect').addClass('incorrect');
            }
        }
    }
}

function getQuestion(questionNumber) {
    arrayIndex = questionNumber;
    // Clear all form fields
    $('.formFields').empty();
    $('.formField').remove();
    
    // Update the pagination buttons
    $('.page-link').parent().removeClass('active');
    $('#question'+questionNumber).parent().addClass('active');
    
    // Get the drug for the form
    var drug = questions[questionNumber];
    console.log(drug);
    
    // Show the drug name on the page
    $('.nameField').append('<h2>' + drug.Name + '</h2>');
    
    // Iterate through the fields
    for(fieldname in drug){
        if (fieldname.toLowerCase() !== 'name'){
            // Show an empty input field for each item in the json
            var className = fieldname.replace(' ','').toLowerCase() + 'Field';
            $('.inputFields').append('<div class="form-group formField"><div class="label">' + fieldname + ':</div><div class=' + className + 's formFields"></div></div>');
            
            var itemArray = drug[fieldname].split('|').map(item => item);
            for(question in itemArray){
                $('.' + className + 's').append('<input class="form-control ' + className + '" type="text">');
            }
        }
    }
}
