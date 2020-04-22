PennController.ResetPrefix(null); // Initiates PennController

Sequence("experiment")

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

newTrial("experiment",
    defaultText
        .center()
    ,
    newImage("smiley", "smiley.png")
        .size(300, 300)
    ,
    newCanvas(300, 300)
        .add(0, 0, getImage("smiley"))
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
    newText("target_word", "bottle")
        .settings.css({"font-size": "200%"})
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
    newAudio("stimulus", "SC_Clash_NoShift_1.wav")
        .play()
    ,
    newImage("fixation_cross", "fixation_cross.png")
        .size(300, 300)
    ,
    newCanvas(300, 300)
        .add(0, 0, getImage("fixation_cross"))
        .print()
    ,
    newKey("reaction_time", " ")
        .log()
        .wait()
    ,
    getAudio("stimulus")
        .wait("first")
)
