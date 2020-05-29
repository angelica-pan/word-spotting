PennController.ResetPrefix(null);                       // Initiates PennController
PennController.DebugOff()
var showProgressBar = false;                            // Don't show progress bar

// Custom button: creates button with blue background
customButton = text  => 
    newButton(text)
        .center()
        .css({"background-color":"lightblue"})
        .print()
        .wait()
        
// Testing sequence (4 sc items, 4 rep items, 4 fillers) 
// Sequence("consent", "background", "sound_check", "welcome", "practice", "post-practice", shuffle(randomize("test_sc"), randomize("test_rep"), randomize("test_fillers")), "exit", "send", "confirmation")

Sequence("exit", "send", "confirmation")

// Actual experimental sequence
//Sequence("consent", "background", "sound_check", "welcome", "practice", "post-practice", "counter", shuffle(randomize("sc"), randomize("rep"), randomize("fillers")), "exit", "send", "confirmation")

SetCounter("counter", "inc", 1);

newTrial("background",
    newHtml("background", "UC-background.html")
        .log()
        .settings.cssContainer({"width": "720px"})
        .radioWarning("Please select a language option.")
        .checkboxWarning("You must consent before continuing.")
        .print()
    ,
        newButton("Click here to continue")
        .center()
        .css({"background-color":"lightblue"})
        .print()
        .wait(
            getHtml("background").test.complete()
            .failure(getHtml("background").warn() )
        )
)


// Consent form
newTrial("consent",
    newHtml("consent_form", "UC-consent.html")
        .settings.cssContainer({"width": "720px"})
        .checkboxWarning("You must consent before continuing.")
        .print()
    ,
    newButton("Click here to continue")
        .center()
        .css({"background-color":"lightblue"})
        .print()
        .wait(
            getHtml("consent_form").test.complete()
            .failure(getHtml("consent_form").warn() )
        )
)

// Sound check
newTrial("sound_check",
    defaultText
        .css({"width": "720px"})
        .center()
    ,
    // Sound check pt. 1: participant hears looping tones
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
    newText("<p> If you cannot hear the audio, please adjust your headphones or speakers. </p>")
        .print()
    ,
    customButton("If you can hear the audio, click here to continue")
    ,
    clear()
    ,
    // Sound check pt. 2: participant hears and transcribes a word
    newText("<p> Please click play to listen to a word, and type what you hear into the text box below. </p>")
        .print()
    ,
    newAudio("test_sentence_audio", "California.wav")
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
    newText("incorrect", "Please try again.")
        .css({"color": "red"})
    ,
    newButton("validate", "Validate")
        .center()
        .css({"background-color":"lightblue"})
        .print()
        .wait(
            getTextInput("test_sentence")
                // Regular expression that the [text input box] should match (the -i flag ignores case)
                .test.text(/california/i) 
                    // If [text input] doesn't match, print [incorrect] error message
                    .failure(getText("incorrect").print())
                    // If [text input] matches, remove any previous [incorrect] error message and move on.
                    .success(
                        getText("incorrect")
                            .remove()
                    )
            )
    ,
    getButton("validate")
        .remove()
    ,
    customButton("Click here to continue")
)

// Instructions 
newTrial("welcome",
    newText("next", "Press the spacebar to continue.")
        .italic()
        .center()
    ,
    newHtml("welcome", "UC-welcome.html")
        .settings.cssContainer({"width": "720px"})
        .print()
    ,
    getText("next")
        .print()
    ,
    newKey(" ")
        .wait()
    ,
    clear()
    ,
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
    newCanvas(300, 190)
        .add(0, 150, getText("done"))
        .print()
    ,
    customButton("Click here to start the experiment")
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
        .css({"background-color":"lightblue", "font-size": "150%", "font-weight": "bold"})
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
        .cssContainer({"width": "300px"})
    ,
    newText("target_word", variable.target)
        .css({"font-size": "200%"})     
        .cssContainer({"width": "300px"})
    ,
    newText("next", "Press the spacebar to continue.")
        .italic()
        .cssContainer({"width": "300px"})
    ,
    newCanvas("t_display", 300, 300)
        .add(0, 100, getText("listen_for"))
        .add(0, 145, getText("target_word"))
        .add(0, 210, getText("next"))
        .log()
        .print()
    ,
    newKey("continue", " ")
        .wait()
        .log()
    ,
    clear()
    ,
    // Play audio stimulus and record reaction time
    newImage("fixation_cross", "fixation_cross.png")
        .size(300,300)
    ,
    newCanvas(300, 310)
        .add(0, 10, getImage("fixation_cross"))
        .print()
    ,
    newKey("spacebar_press", " ")          
        // logs all [spacebar] presses (https://www.pcibex.net/forums/topic/cant-get-results-properly-recorded/)    
        .log("all")                         
    ,
    newAudio("stimulus", variable.stimulus)
        .play()
        .log("play")
        .log("end")
        .wait() 
    ,
	clear()
    ,
    // Conditional comprehension question (https://www.pcibex.net/forums/topic/conditional-trials/)
    (variable.question?[newText("question", variable.question)
        .cssContainer({"width": "600px", "font-size": "150%", "height": "50px"})
    ,
    newText("answer_F", variable.answer_F)
        .before(newText("F)&nbsp;"))
        .cssContainer({"width": "300px"})
    ,
    newText("answer_J", variable.answer_J)
        .before(newText("J)&nbsp;"))
        .cssContainer({"width": "300px"})
    ,
    newText("reminder", "Press the F or J key to select your answer")
        .italic()
        .cssContainer({"width": "600px"})
    ,
    newCanvas("q_display", 600, 300)
        .add(0, 145, getText("question"))
        .add(0, 200, getText("answer_F"))
        .add(300, 200, getText("answer_J"))
        .add(0, 250, getText("reminder"))
        .print()
        .log()
    ,
    newKey("FJ_press", "FJ")
        .wait()
        .log()
    ]:null)
    ,
    clear()
    ,
    // Conditional target word feedback 
    (variable.feedback?[newCanvas(600, 300)
        .add(0, 150, newText(variable.feedback).bold().cssContainer({"width": "600px"}).center())
        .add(0, 210, getText("next").cssContainer({"width": "600px"}))
        .print()
    ,
    newKey(" ")
        .wait()
    ]:null)
)
.log("group",               variable.group)
.log("condition",           variable.condition)
.log("item",                variable.item)
.log("target",              variable.target)
.log("contains_target",     variable.contains_target)
.log("FJ_correct",    	    variable.correct)

// Practice items
Template("practice.csv", customTrial("practice"))

// Experimental items
Template("test_sc_items.csv", customTrial("test_sc"))
Template("test_rep_items.csv", customTrial("test_rep"))
Template("sc_items.csv", customTrial("sc"))
Template("rep_items.csv", customTrial("rep"))

// Filler items
Template("test_fillers.csv", customTrial("test_fillers"))
Template("fillers.csv", customTrial("fillers"))

// Send results
PennController.SendResults("send");
