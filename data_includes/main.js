PennController.ResetPrefix(null);                       // Initiates PennController
var showProgressBar = false;                            // Don't show progress bar

// Experimental and filler items are separated so that  all filler items are displayed, but experimental items are displayed by counterbalancing group.
Sequence(randomize("practice"), "post-practice", "test_fillers", "exit", "send", "confirmation")

//Sequence("consent","instructions","practice", shuffle(randomize("items"), randomize("fillers")), "exit", "send", "confirmation")
//Sequence("consent","instructions","practice",  shuffle(randomize("test_items"), randomize("test_fillers")), "exit", "send", "confirmation")

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
        .settings.cssContainer({"width": "600px"})
        .print()
    ,
    newButton("Click here to continue")
        .css({"background-color":"cornflowerblue"})
    	.center()
        .print()
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

