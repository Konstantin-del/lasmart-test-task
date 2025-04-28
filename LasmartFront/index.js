
$( document ).ready(function(){

    
    
    $(".circle").submit(function(event){
        let $form = $(this);
        event.preventDefault();
        let circle = {};

        circle.x = parseInt($form.find('input[name="x"]').val());
        circle.y = parseInt($form.find('input[name="y"]').val());
        circle.radius = parseInt($form.find('input[name="radius"]').val());
        circle.color = $form.find('input[name="color"]').val();

        const jsonString = JSON.stringify(circle);
        console.log(jsonString)
        $.ajax({
            url: "https://localhost:7241/circle",
            type: "POST",
            data: jsonString,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        })
       //location.reload(true);
    });

    
    $(".comment").submit(function(event){
        let commentForm = $(this);
        event.preventDefault();
        //console.log(value)
        let comment = {}
        comment.comment = commentForm.find('input[name="text"]').val();
        comment.colorBackground = commentForm.find('input[name="background"]').val();
        comment.circleId = 1;

        const jsonString = JSON.stringify(comment);

        console.log(jsonString)
    
        $.ajax({
            url: "https://localhost:7241/circle/comment",
            type: "POST",
            data: jsonString,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        })
    });

    $("#btn1").click(function(){
        $(".popup").show();
    });

    $("#btn2").click(function(){
        $(".popup").hide();
    });

    $("#btn3").click(function(){
        $(".popup_comment").hide();
    });

    getCircles().then((res)=>CreateCirclesAndCommits(res));
})

async function getCircles(){
    return await fetch('https://localhost:7241/circle')
        .then(response => response.json());
}

const CreateCirclesAndCommits = (circles) => {
    var stage = new Konva.Stage({
        container: 'container',
        width: window.innerWidth,
        height: window.innerHeight-100,
    });

    const newArr = circles.map( item => {
        
            const group = new Konva.Group({
                x: item.x,
                y: item.y,
                draggable: true,
            });


            const circle = new Konva.Circle({
                x: item.x,
                y: item.y,                  
                radius: item.radius,
                fill: item.color,
                id: item.id,
            });

            let indent = item.y+item.radius+5;

            let commentsReady = []

            if(!jQuery.isEmptyObject(item.comments)){
                commentsReady = item.comments.map(value =>{
                    const text = new Konva.Text({
                        y: indent,  
                        fontFamily: 'Calibri',
                        fontSize: 14,
                        text: value.comment,
                        align: 'center',
                        fill: 'green',
                        padding: 5,
                    })
                    const textWidth = text.width();

                    const centerX = item.x-(textWidth/2);

                    text.x(centerX);

                    const rectHeigth = text.height();

                    const rect = new Konva.Rect({
                        x: centerX,
                        y: indent,
                        width: text.width(),
                        height: rectHeigth,
                        fill: value.colorBackground,
                        stroke: 'black',
                    });

                    indent += rectHeigth+5;

                    return {text, rect}
                })
            }
    
            return {group, circle, commentsReady}
    });

    let layer = new Konva.Layer();

    newArr.forEach(element => {
        element.group.add(element.circle);
        if(element.commentsReady.length>0){
            element.commentsReady.forEach(value => {
                element.group.add(value.rect).add(value.text);
            });
        }
        layer.add(element.group);
        stage.add(layer);
    }); 

    //let value;

    layer.on('click', (event) => {
        const circle = event.target; 
        if (circle instanceof Konva.Circle) { 
            const id = circle.id(); 
            console.log(id)
            value = id;
            $(".popup_comment").show();
        }
    });
}

        

    
// function writeMessage(message) {
//     text.text(message);
// }

// circle.on('mouseover', () => {
//     writeMessage('Mouseover circle');
// });

// circle.on('mousedown', () => {
//     writeMessage('Mousedown circle');
// });

// circle.on('mouseup', () => {
//     writeMessage('');
// });
    

