ion.sound({
    sounds: [
        {
            name: "fail_buzzer",
        },
        {
            name: "bell_ring"
        }
    ],
    path: "audio/",
    preload: true
});


$(function() {
  //Initialize sortable
  $( "#sortable-1" ).sortable({
    //sort only items in incorrect spot
    items: ':not(.match)',
    zIndex: 9999, 
    //set correctly matched items to fixed and unsortable
    start: function(){
        $('.match', this).each(function(){
            var $this = $(this);
            $this.data('pos', $this.index());
        });
    },
    change: function(){
        $sortable = $(this);
        $statics = $('.match', this).detach();
        $helper = $('<li></li>').prependTo(this);
        $statics.each(function(){
            var $this = $(this);
            var target = $this.data('pos');
            $this.insertAfter($('li', $sortable).eq(target));
        });
        $helper.remove();
    }
  });
  //remove selection from button text interfering with sorting action
  $( "#sortable-1" ).disableSelection();

  //initialize timer
  $("#timer").html("<span class='numeral'>20</span>"); 

  $('#startCPRQuiz').click(function() {
    $('.overlay').fadeOut(200);
    $('.overlay-location').css('opacity', '1');
    $(this).fadeOut(200);
    //start timer 
    var count = 20;
    var counter = setInterval(timer, 1000); //1000 will  run it every 1 second
    function timer() {
      var matches = $('.match').length;
      count = count-1;
      if (matches == 4) {
        clearInterval(counter);
        $('#sortable-1').sortable('disable');
        ion.sound.play("bell_ring");
        return;
      } else if (count <= -1)  {
         clearInterval(counter);
         $('#sortable-1').sortable('disable');
         $('#submitAnswers').hide();
         $('#showCorrect').css('display', 'block');
         ion.sound.play("fail_buzzer");
         return;
      } 
      if (count < 10) {
          count = "0" + count.toString();
      } else {
          count = count.toString();
      }
      $("#timer").html("<span class='numeral'>" + count + "</span>"); 
    }
  }); //end start button
  //submit button
  $('.btn-submit-answers').click(function(){
    //check each item for a match
    $('.ui-state-default').each(function() {
      var match = $(this).index();
      var answer = $(this).attr('id');
      var id = answer.slice(4);
      //if match is found, change to match state
      if (match == id) {
        $(this).removeClass('default wrong').addClass('match');
      } else {
        $(this).removeClass('default').addClass('wrong');
      }
    });
      var matches = $('.match').length;
      if (matches < 4) {
        ion.sound.play("fail_buzzer");
      }
  });

//when time runs out, show correct button shows proper order and hides inactive buttons
  $('#showCorrect').click(function(){
    $('#sortable-1').html('<li id="step0" class="answer_block match one-line">(2 + 4) / 9</li><li id="step1" class="answer_block match one-line">((2 - 3) + 7) * 5</li><li id="step2" class="answer_block match one-line">(5 - 2) + (45 / 3)</li><li id="step3" class="answer_block match one-line">(3 * 7)(5 - 2)</li>');
    $('.btn-submit-answers').css({'opacity' : '0'},{'cursor' : 'none'});
    $(this).css('opacity', '0');
  });
 }); //end document ready
