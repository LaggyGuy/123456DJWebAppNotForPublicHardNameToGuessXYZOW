//Code that I have not written
let buttonenabled = true, scroll = 0;
$(document).on("click", ".darkmode", function(){
	if(!buttonenabled) return;
	buttonenabled = false;
	$(".clip").html($("body >.container")[0].outerHTML); //Copy container to inside clip
	scrollbind($(".clip .container"));
	$(".clip .container").toggleClass("dark").scrollTop(scroll); //Toggle dark mode and set scroll
	$(".clip .darkmode").toggleClass("fa-moon").toggleClass("fa-sun"); //Make changes: change button icon
	$(".clip").addClass("anim"); //Animate the clip
	setTimeout(function(){
		$("body >.container").replaceWith($(".clip").html()) //Replace container with clip html
		scrollbind($("body >.container")); //bind scroll with new container
		$("body >.container").scrollTop(scroll); //Set scroll position
		$(".clip").html("").removeClass("anim"); //Hide clip
		buttonenabled = true;
	}, 1000); //Slightly before animation finishes but when the circle will have covered the screen, gives us 500ms to make the changes we need which is plenty. Slower computers will not see a flash, but elements may not have loaded - if it really is an issue delay line 19 a little
});

const scrollbind = el => el.bind("scroll", function(){
	scroll = $(this).scrollTop();
	if($(".container").length > 1) //No point setting it if there is only 1
		$(".container").scrollTop(scroll); 
		//This will set the scroll position of the container inside the clip so it scrolls while the animation is being carried out
});
scrollbind($(".container"));

sound = "";
lwx = 0;
lwy = 0;

rwx = 0;
rwy = 0;

rws = 0;
lws = 0;
function preload() {
    sound = loadSound("music.mp3");
}

function setup() {
    canvas = createCanvas(600, 500);
    canvas.center();

    video = createCapture(VIDEO);
    video.hide();

    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
}

function draw() {
    image(video, 0, 0, 600, 500);

      circle(rwx, rwy, 20);


    
        fill('#FF0000');
        stroke('#FF0000');

        circle(rwx, rwy, 20);

        if (rws > 0.2) {
            if(rwy > 0 && rwy <= 100){
                document.getElementById("speed").innerHTML = "Speed = 0.5x";
                sound.rate(0.5);
            }else if(rwy > 100 && rwy <= 200){
                document.getElementById("speed").innerHTML = "Speed = 1x";
                sound.rate(1);
            }else if(rwy > 200 && rwy <= 300){
                document.getElementById("speed").innerHTML = "Speed = 1.5x";
                sound.rate(1.5);
            }else if(rwy > 300 && rwy >= 400){
                document.getElementById("speed").innerHTML = "Speed = 2x";
                sound.rate(2);
            }else if(rwy > 400 && rwy >= 500){
                document.getElementById("speed").innerHTML = "Speed = 2.5x";
                sound.rate(2.5);
            }
        }

        lwy_n = Number(lwy);
        lwy_n_d = floor(lwy_n);
        vol = lwy_n_d/500;
        sound.setVolume(vol);
        document.getElementById("volume").innerHTML = "Volume = "+vol;



}

function play() {
    sound.play();
    sound.rate(1);
    sound.setVolume(1);
}

function modelLoaded() {
    console.log("PoseNet is initialized");
}

function gotPoses(results) {
    if (results.length > 0) {
        rws = results[0].pose.keypoints[10].score;
       lws = results[0].pose.keypoints[9].score;
       console.log("Left wrist score - "+lws+" Right wrist score - "+rws);

        console.log(results);
        lwx = results[0].pose.leftWrist.x;
        lwy = results[0].pose.leftWrist.y;
        console.log("Left Wrist X - "+lwx+" Left Wrist Y - "+lwy);

        rwx = results[0].pose.rightWrist.x;
        rwy = results[0].pose.rightWrist.y;
        console.log("Right Wrist X - "+rwx+" Right Wrist Y - "+rwy);
    }
}