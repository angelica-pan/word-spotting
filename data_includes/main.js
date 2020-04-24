PennController.ResetPrefix(null);                       // Initiates PennController
var showProgressBar = false;                            // Don't show progress bar

Sequence("experiment")

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

AddTable( "mytable" ,
    "group,target,stimulus,question,left,right\n"+
    "A,1,SC_Clash_NoShift_1.wav,question_1,the dollar store,the construction store\n"+
    "A,2,SC_Clash_NoShift_1.wav,question_2,answer_3,answer_4"
);

// Trial 
PennController.Template("input.csv",
    variable => PennController("experiment",
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
    )
    .log("group",       variable.group)
    .log("item",        variable.item)
    .log("condition",   variable.cond2)
    .log("target",      variable.target)
    .log("stimulus",    variable.stimulus)

);

// code for comprehension questions (to be added in)
newTrial(
        clear()
        ,
        newText("question", variable.question)
            .settings.cssContainer({border: "solid 1px purple", "width": "600px", "font-size": "150%", "height": "50px"})
            .center()
        ,
        newText("left", variable.left)
            .settings.cssContainer({border: "solid 1px black", "width": "300px"})
            .center()
        ,
        newText("right", variable.right)
            .settings.cssContainer({border: "solid 1px red", "width": "300px"})
            .center()
        ,
        newCanvas(600, 300)
            .add(0, 100, getText("question"))
            .add(0, 150, getText("left"))
            .add(300, 150, getText("right"))
            .print()
        ,
        newKey("FJ")
            .wait()
            .log()
)
