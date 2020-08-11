//
// 20SE1_WordSpotting (auditory monitoring task)
//

// Experiment sequence:
// 1. Consent form 
// 2. Linguistic background form
// 3. Sound check
// 4. Welcome screen and experiment instructions
// 5. Practice trials
// 6. Post-practice screen
// 7. Experimental trials
// 8. Exit form
// 9. Send results
// 10. End of experiment confirmation

// Experimental trial format:
// A. Target word (participant presses Spacebar to continue)
// B. Audio stimulus
// C. Reaction (participant presses Spacebar to indicate target word)
// D. Comprehension question (participant presses F or J to answer comprehension question)
// E. Feedback (participant sees feedback and presses Spacebar to continue)

// Sections 4 and 5 only display when the source CSV has non-empty [question] and [feedback] values
// CSV must have the following column(s): [target], [stimulus]
// CSV should have the following column(s): [question], [F_answer], [J_answer], [feedback] 
// CSV should have the following column(s) for logging: [group], [condition], [item], [contains_target], [answer]

// Angelica Pan, June 2020

////////////////////////////////////////////////////////////////////////////////

PennController.ResetPrefix(null);                       // Initiates PennController
PennController.DebugOff()								// Comment out this line to remove debug window
var showProgressBar = false;                            // Don't show progress bar

////////////////////////////////////////////////////////////////////////////////


// Custom button: create button with blue background
customButton = text  => 
    newButton(text)
        .center()
        .css({"background-color":"lightblue"})
        .print()
        .wait()
        

// Test sequence
// Sequence("consent", "background", "sound_check", "welcome", "practice", "post-practice", "counter", rshuffle("test_sc", "test_rep", "test_fillers"), "exit", "send", "confirmation")

// Experiment sequence
Sequence("consent", "background", "sound_check", "welcome", "practice", "post-practice", "counter", rshuffle("sc", "rep", "fillers"), "exit", "send", "confirmation")

SetCounter("counter", "inc", 1);

////////////////////////////////////////////////////////////////////////////////

// 1. Consent form
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

// 2. Linguistic background form
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

// 3. Sound check
newTrial("sound_check",
    defaultText
        .css({"width": "720px"})
        .center()
    ,
    // Pt. 1: participant hears looping tones
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
    // Pt. 2: participant hears and transcribes a word
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
                // Regular expression that the [text input box] should match (the [i] flag ignores case)
                // If [text input] doesn't match, print [incorrect] error message
                // If [text input] matches, remove any previous [incorrect] error message and move on.
                .test.text(/california/i) 
                    .failure(getText("incorrect").print())
                    .success(getText("incorrect").remove())
            )
    ,
    getButton("validate")
        .remove()
    ,
    customButton("Click here to continue")
)

// 4. Welcome screen and experiment instructions 
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


// 6. Post-practice screen
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

// 8. Exit form 
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

// 9. Send results
PennController.SendResults("send");

// 10. End of experiment confirmation
newTrial("confirmation",
    newText("Thank you for participating! You may now exit the window.")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
)

// 5. and 8. Trial items
customTrial = label => variable => newTrial( label ,
    defaultText
        .center()
    ,
	// A. Target word is displayed (participant presses Spacebar to continue)
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
	// B. Audio stimulus plays
    newImage("fixation_cross", "fixation_cross.png")
        .size(300,300)
    ,
    newCanvas(300, 310)
        .add(0, 10, getImage("fixation_cross"))
        .print()
    ,
	// C. Reaction (participant presses Spacebar to indicate target word)
    newKey("spacebar_press", " ")             
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
	// D. Comprehension question (participant presses F or J to answer comprehension question)
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
	// E. Feedback (participant sees feedback and presses Spacebar to continue)
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

