PennController.ResetPrefix(null);                       // Initiates PennController
var showProgressBar = false;                            // Don't show progress bar

// experimental and filler items have to be separated so that experimental items are displayed by counterbalancing group, but all filler items are displayed
Sequence(shuffle(randomize("items"), randomize("fillers")))

// Instructions 
newTrial("instructions",
    defaultText
        .center()
        .print()
    ,
    newText("<p>Welcome!</p>")
    ,
    newText("<p>Some instructions here.</p>")
        .italic()
    ,
    newText("<p>More instructions here</p>")
        .italic()
    ,
    newText("<p>Press the START button to continue. </p>")
    ,
    newButton("START")
        .print()
        .wait()
)

// experimental items for testing
AddTable( "test_items" ,
    "group,item,cond2,stimulus,target,sentence,question,answer_1,answer_2,correct\n"+
	"A,1,Clash.NoShift,SC_Clash_NoShift_1.wav,target_1_A,question_1_A,WHERE DID THE MEN STOP?,THE DOLLAR STORE,THE CONSTRUCTION SITE,answer_1\n"+
	"B,1,Clash.Shift,SC_Clash_Shift_1.wav,target_1_B,question_1_B,WHERE DID THE MEN STOP?,THE DOLLAR STORE,THE CONSTRUCTION SITE,answer_1\n"+
	"C,1,NoClash.NoShift,SC_NoClash_NoShift_1.wav,target_1_C,question_1_C,WHERE DID THE MEN STOP?,THE DOLLAR STORE,THE CONSTRUCTION SITE,answer_1\n"+
	"D,1,NoClash.Shift,SC_NoClash_Shift_1.wav,target_1_D,question_1_D,WHERE DID THE MEN STOP?,THE DOLLAR STORE,THE CONSTRUCTION SITE,answer_1\n"+
	"B,2,Clash.NoShift,SC_Clash_NoShift_2.wav,target_2_B,question_2_B,Press the F or J key to continue.,,,\n"+
	"C,2,Clash.Shift,SC_Clash_Shift_2.wav,target_2_C,question_2_C,Press the F or J key to continue.,,,\n"+
	"A,2,NoClash.NoShift,SC_NoClash_NoShift_2.wav,target_2_A,question_2_A,Press the F or J key to continue.,,,\n"+
	"D,2,NoClash.Shift,SC_NoClash_Shift_2.wav,target_2_D,question_2_D,Press the F or J key to continue.,,,\n"+
	"C,3,Clash.NoShift,SC_Clash_NoShift_3.wav,target_3_C,question_3_C,WAS THE MEAL EXPENSIVE?,YES,NO,answer_1\n"+
	"D,3,Clash.Shift,SC_Clash_Shift_3.wav,target_3_D,question_3_D,WAS THE MEAL EXPENSIVE?,YES,NO,answer_1\n"+
	"B,3,NoClash.NoShift,SC_NoClash_NoShift_3.wav,target_3_B,question_3_B,WAS THE MEAL EXPENSIVE?,YES,NO,answer_1\n"+
	"A,3,NoClash.Shift,SC_NoClash_Shift_3.wav,target_3_A,3_A,WAS THE MEAL EXPENSIVE?,YES,NO,answer_1\n"+
	"D,4,Clash.NoShift,SC_Clash_NoShift_4.wav,target_4_D,question_4_D,WHAT DID THE DOGS DO?,GROWL,HOWL,answer_2\n"+
	"A,4,Clash.Shift,SC_Clash_Shift_4.wav,target_4_A,question_4_A,WHAT DID THE DOGS DO?,GROWL,HOWL,answer_2\n"+
	"C,4,NoClash.NoShift,SC_NoClash_NoShift_4.wav,target_4_C,question_4_C,WHAT DID THE DOGS DO?,GROWL,HOWL,answer_2\n"+
	"B,4,NoClash.Shift,SC_NoClash_Shift_4.wav,target_4_B,question_4_B,WHAT DID THE DOGS DO?,GROWL,HOWL,answer_2"
);

// filler items for testing
AddTable( "test_fillers" ,
	"item,cond2,stimulus,target,sentence,question,answer_1,answer_2,correct\n+"+
	"1,filler,filler.wav,filler_1,,QUESTION?,YES,NO,answer_1\n+"+
	"2,filler,filler.wav,filler_2,,QUESTION?,YES,NO,answer_1\n+"+
	"3,filler,filler.wav,filler_3,,Press the F or J key to continue.,,,\n+"+
	"4,filler,filler.wav,filler_4,,Press the F or J key to continue.,,,"
);

// Experimental item trial 
PennController.Template("test_items",
    variable => PennController("items",
        defaultText
            .center()
        ,
        // Rest screen in between trials (press space to continue)
        newImage("smiley", "smiley.png")
            .size(300, 300)                             // Resize smiley.png to 300x300px
        ,
        newCanvas(300, 300)                             // Every image or text will be displayed in a 300x300px Canvas.
            .add(0, 0, getImage("smiley"))                  // This helps maintain consistent horizontal and vertical spacing.
            .print()
        ,
        newText("<p> Press the spacebar when you are ready to start the trial. </p>")
            .italic()
            .print()
        ,
        newKey(" ")
            .wait()
        ,
        clear()
        ,
        
        // Display target word (press space to continue)
        newText("target_word", variable.target)
            .settings.css({"font-size": "200%"})        // Make target word font larger so that it stands out.
            .print()
        ,
        newCanvas(300, 300)
            .add("center at 50%", "center at 50%", getText("target_word"))
            .print()
        ,
        newText("continue", "<p> Press the spacebar to continue. </p>")
            .italic()
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
            .add(0, 0, getImage("fixation_cross"))
            .print()
        ,
        newKey("reaction_time", " ")                    // Cannot use .log() or .log("first"); see <https://www.pcibex.net/forums/topic/cant-get-results-properly-recorded/>
            .log("all")                                 // Log the reaction time
        ,
        newAudio("stimulus", variable.stimulus)
            .play()
            .wait() 
        ,
    	clear()
        ,
        newText("question", variable.question)
            .settings.cssContainer({border: "solid 1px purple", "width": "600px", "font-size": "150%", "height": "50px"})
            .center()
        ,
        newText("answer_1", variable.answer_1)
            .settings.cssContainer({border: "solid 1px black", "width": "300px"})
            .center()
        ,
        newText("answer_2", variable.answer_2)
            .settings.cssContainer({border: "solid 1px red", "width": "300px"})
            .center()
        ,
        newCanvas(600, 300)
            .add(0, 100, getText("question"))
            .add(0, 150, getText("answer_1"))
            .add(300, 150, getText("answer_2"))
            .print()
        ,
        newKey("FJ")
            .wait()
            .log()
    )
    .log("group",       variable.group)
    .log("item",        variable.item)
    .log("condition",   variable.cond2)
    .log("target",      variable.target)
    .log("correct",    	variable.correct)

);

// Filler item trial 
PennController.Template("test_fillers",
    variable => PennController("fillers",
        defaultText
            .center()
        ,
        // Rest screen in between trials (press space to continue)
        newImage("smiley", "smiley.png")
            .size(300, 300)                             // Resize smiley.png to 300x300px
        ,
        newCanvas(300, 300)                             // Every image or text will be displayed in a 300x300px Canvas.
            .add(0, 0, getImage("smiley"))                  // This helps maintain consistent horizontal and vertical spacing.
            .print()
        ,
        newText("<p> Press the spacebar when you are ready to start the trial. </p>")
            .italic()
            .print()
        ,
        newKey(" ")
            .wait()
        ,
        clear()
        ,
        
        // Display target word (press space to continue)
        newText("target_word", variable.target)
            .settings.css({"font-size": "200%"})        // Make target word font larger so that it stands out.
            .print()
        ,
        newCanvas(300, 300)
            .add("center at 50%", "center at 50%", getText("target_word"))
            .print()
        ,
        newText("continue", "<p> Press the spacebar to continue. </p>")
            .italic()
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
            .add(0, 0, getImage("fixation_cross"))
            .print()
        ,
        newKey("reaction_time", " ")                    // Cannot use .log() or .log("first"); see <https://www.pcibex.net/forums/topic/cant-get-results-properly-recorded/>
            .log("all")                                 // Log the reaction time
        ,
        newAudio("stimulus", variable.stimulus)
            .play()
            .wait() 
    	,
    	clear()
        ,
        newText("question", variable.question)
            .settings.cssContainer({border: "solid 1px purple", "width": "600px", "font-size": "150%", "height": "50px"})
            .center()
        ,
        newText("answer_1", variable.answer_1)
            .settings.cssContainer({border: "solid 1px black", "width": "300px"})
            .center()
        ,
        newText("answer_2", variable.answer_2)
            .settings.cssContainer({border: "solid 1px red", "width": "300px"})
            .center()
        ,
        newCanvas(600, 300)
            .add(0, 100, getText("question"))
            .add(0, 150, getText("answer_1"))
            .add(300, 150, getText("answer_2"))
            .print()
        ,
        newKey("FJ")
            .wait()
            .log()
    )
    .log("group",       variable.group)
    .log("item",        variable.item)
    .log("condition",   variable.cond2)
    .log("target",      variable.target)
    .log("correct",    	variable.correct)

);

// code for comprehension questions (to be added in)
newTrial(
        clear()
        ,
        newText("question", variable.question)
            .settings.cssContainer({border: "solid 1px purple", "width": "600px", "font-size": "150%", "height": "50px"})
            .center()
        ,
        newText("answer_1", variable.answer_1)
            .settings.cssContainer({border: "solid 1px black", "width": "300px"})
            .center()
        ,
        newText("answer_2", variable.answer_2)
            .settings.cssContainer({border: "solid 1px red", "width": "300px"})
            .center()
        ,
        newCanvas(600, 300)
            .add(0, 100, getText("question"))
            .add(0, 150, getText("answer_1"))
            .add(300, 150, getText("answer_2"))
            .print()
        ,
        newKey("FJ")
            .wait()
            .log()
)
