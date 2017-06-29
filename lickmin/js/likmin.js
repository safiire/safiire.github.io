
////
//  This class represents Likmin :)
function Likmin(filename){
    // Create Likmin's div, preload images...
    this.likmin = $j('<div/>', {id: 'likmin', width: 210, height: 160});
    this.likmin.css('background-image', 'url('+filename+')');
    this.set_frame(1);
    $j('#screen').append(this.likmin);
    this.velocity = {x:0,y:0};
    this.likmin.click(this.clicked.bind(this));
    this.likmin.fadeIn(1000, function(){
        this.update_position(); 
        //  Make Likmin blink
        this.blink();
        this.likmin.addClass('idle-right');
    }.bind(this));
}


////
//  Set animation frame #
Likmin.prototype.set_frame = function(frame_number){
    this.current_frame = frame_number;
    var y = 160 * frame_number;
    this.likmin.css('background-position', '0px '+y+'px');
    return({x:0,y:y});
}


////
//  Make him blink
Likmin.prototype.blink = function(){
    console.log('blink');
    this.set_frame(0);
    setTimeout(function(){
        this.set_frame(1);
        setTimeout(this.blink.bind(this), 8000);
    }.bind(this), 900);
}


////
//  Likmin has been clicked
Likmin.prototype.clicked = function(){
    this.set_frame(!this.current_frame);
    console.log(this);
}


////
//  Update Likmin's position
Likmin.prototype.update_position = function(){
    this.position = this.likmin.offset();
}


////
//  Change Likmin's velocity
Likmin.prototype.set_velocity = function(vx,vy){
    this.velocity = {x:vx,y:vy};
}


////
//  Move Likmin
Likmin.prototype.move = function(x,y){
    this.update_position();
    if(this.position.left > x){
        this.likmin.removeClass('idle-left');
        this.likmin.addClass('idle-right');
    }else{
        this.likmin.removeClass('idle-right');
        this.likmin.addClass('idle-left');
    }
    this.likmin.css({left: x, top: y});
}

