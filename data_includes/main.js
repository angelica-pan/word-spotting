PennController.ResetPrefix(null);                       // Initiates PennController
var showProgressBar = false;                            // Don't show progress bar

// Test items/fillers (4 of each).
//Sequence("consent", "instructions", randomize("practice"), "post-practice", shuffle(randomize("test_items"), randomize("test_fillers")), "exit", "send", "confirmation")

// Full list of items/fillers.
//Sequence("consent", "instructions", randomize("practice"), "post-practice", shuffle(randomize("items"), randomize("fillers")), "exit", "send", "confirmation")

Sequence("sound_check", "instructions")

customButton = text  => 
    newButton(text)
        .center()
        .css({"background-color":"cornflowerblue"})
        .print()
        .wait()
        
// sound check
newTrial("sound_check",
    defaultText
        .center()
    ,
    // sound check pt. 1: participant hears looping tones
    newText("<p> Please check that your headphones or computer speakers are working by pressing the play button below.</p>")
        .print()
    ,
    newAudio("test_tone_audio", "sound_check_tone.wav")
        .center()
        .cssContainer({"height" : "75px"})
        .print()
        .wait()
    ,
    getAudio("test_tone_audio")
        .play("loop")
    ,
    newText("<p> If you cannot hear the audio, please adjust your headphones or speakers until the sound file is audible. </p>")
        .print()
    ,
    customButton("If you can hear the audio, click here to continue")
    ,
    clear()
    ,
    // sound check pt. 2: participant hears and types a sentence
    newText("<p> As an additional sound check, please listen to the following audio file, and then type the sentence that you've just heard into the text box. </p>")
        .print()
    ,
    newAudio("test_sentence_audio", "sound_check_sentence.wav")
        .center()
        .cssContainer({"height" : "75px"})
        .print()
    ,
    newTextInput("test_sentence", "")
        .size(400, 25)
        .cssContainer({"height" : "50px"})
        .center()
        .print()
    ,
    newText("incorrect", "Try again...")
        .css({"color": "red"})
    ,
    newText("correct", "That's right!")
        .css({"color": "green"})
    ,
    newButton("validate", "Validate")
        .center()
        .css({"background-color":"cornflowerblue"})
        .print()
        .wait(
            getTextInput("test_sentence")
                // regular expression that the [text input box] should match
                .test.text(/It was my niece who first taught me how to play video games/i)
                    // if [text input] doesn't match, print [incorrect] error message
                    .failure(getText("incorrect").print())
                    // if [text input] matches, print [correct] error message
                    .success(
                        getText("incorrect")
                            .remove()
                        ,
                        getText("correct")
                            .print()
                    )
            )
    ,
    getButton("validate")
        .remove()
    ,
    customButton("Click here to continue")
)

// Consent form
newTrial("consent",
    newHtml("consent_form", "UC-intro.html")
        .settings.cssContainer({"width": "720px"})
        .checkboxWarning("You must consent before continuing.")
        .print()
    ,
    newButton("Click here to continue")
        .center()
        .css({"background-color":"cornflowerblue"})
        .print()
        .wait(
            getHtml("consent_form").test.complete()
            .failure(getHtml("consent_form").warn() )
        )
)


// Instructions 
newTrial("instructions",
    newHtml("instructions", "UC-instructions.html")
        .settings.cssContainer({"width": "720px"})
        .print()
    ,
    customButton("Click here to continue")
)

// Post-practice items
newTrial("post-practice",
    newText("done", "That was it for the practice items!")
        .center()
        .bold()
        .css({"width": "300px"})
    ,
    newText("continue", "Press the spacebar to start the experiment.")
        .center()
        .italic()
        .css({"width": "300px"})
    ,
    newCanvas(300, 300)
        .add(0, 150, getText("done"))
        .add(0, 200, getText("continue"))
        .print()
    ,
    newKey(" ")
        .wait()
)

// Exit form 
newTrial("exit",
    newHtml("exit_form", "UC-exit.html")
        .log()
        .settings.cssContainer({"width": "720px"})
        .inputWarning("Please enter your name and create a unique identifier.")
        .print()
    ,
    newButton("Click here to finish the experiment.")
        .css({"background-color":"cornflowerblue", "font-size": "150%", "font-weight": "bold"})
        .size(500,50)
        .center()
        .print()
        .wait(
            getHtml("exit_form").test.complete()
            .failure(getHtml("exit_form").warn() )
        )
)

// End of experiment confirmation
newTrial("confirmation",
    newText("Thank you for participating! You may now exit the window.")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
)

    

// Trial item template (https://www.pcibex.net/forums/topic/mixing-fillers-and-items/#post-5200)
customTrial = label => variable => newTrial( label ,
    defaultText
        .center()
    ,
    // Display target word 
    newText("listen_for", "Listen for:")
        .css({"width": "300px"})
        .italic()
    ,
    newText("target_word", variable.target)
        .css({"font-size": "200%", "width": "300px"})        
    ,
    newText("next", "Press the spacebar to continue.")
        .css({"width": "300px"})
        .italic()
    ,
    newCanvas(300, 300)
        .add(0, 100, getText("listen_for"))
        .add(0, 150, getText("target_word"))
        .add(0, 225, getText("next"))
        .print()
    ,
    newKey(" ")
        .wait()
    ,
    clear()
    ,
    // Play audio stimulus and record reaction time
    newImage("fixation_cross", "fixation_cross.png")
        .size(300, 300)
    ,
    newCanvas(300, 300)
        .add(0, 25, getImage("fixation_cross"))
        .print()
    ,
    newKey("reaction_time", " ")          
        // logs all SPACEBAR presses (https://www.pcibex.net/forums/topic/cant-get-results-properly-recorded/)    
        .log("all")                         
    ,
    newAudio("stimulus", variable.stimulus)
        .play()
        .wait() 
    ,
	clear()
    ,
    // Comprehension question (https://www.pcibex.net/forums/topic/conditional-trials/)
    (variable.question?[newText("question", variable.question)
        .cssContainer({"width": "600px", "font-size": "150%", "height": "50px"})
    ,
    newText("answer_1", variable.answer_1)
        .cssContainer({"width": "300px"})
    ,
    newText("answer_2", variable.answer_2)
        .cssContainer({"width": "300px"})
    ,
    newCanvas(600, 300)
        .add(0, 150, getText("question"))
        .add(0, 200, getText("answer_1"))
        .add(300, 200, getText("answer_2"))
        .print()
    ,
    newKey("FJ")
        .wait()
        .log()
    ]:null)
)
.log("group",       variable.group)
.log("item",        variable.item)
.log("condition",   variable.condition)
.log("target",      variable.target)
.log("correct",    	variable.correct)

// Practice items
Template("practice.csv", customTrial("practice"))

// Experimental items
Template("test_items.csv", customTrial("test_items"))
Template("items.csv", customTrial("items"))

// Filler items
Template("test_fillers.csv", customTrial("test_fillers"))
Template("fillers.csv", customTrial("fillers"))

// Send results
PennController.SendResults("send");
