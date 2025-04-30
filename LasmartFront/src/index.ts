import $ from 'jquery';
import Konva from 'konva';
import '@types/kendo-ui';
import { deleteCercle } from './api';

type CircleType = { x : number, y: number, radius: number, color: string, id?: string, comments?: CommentType[] }
type CommentType = { comment: string; colorBackground: string; circleId: number }

$(function(){

    $(".circle").on('submit', async function(e){
        let form = $(this);
        e.preventDefault();
        const circle: CircleType = {
            x: parseInt(form.find('input[name="x"]').val() as string),
            y: parseInt(form.find('input[name="y"]').val() as string),
            radius: parseInt(form.find('input[name="radius"]').val() as string),
            color: form.find('input[name="color"]').val() as string, 
        }
        
        const jsonString: string = JSON.stringify(circle);
        await fetch("https://localhost:7241/circle",{
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                "Content-Type": "application/json; charset=utf-8",
            },
            body: jsonString,
        });
        setTimeout(()=>{
            location.reload();   
        },300)
    });

    $("#btn1").on('click',function(){
        $(".popup").show();
    });

    $("#btn2").on('click',function(){
        $(".popup").hide();
    });

    $("#btn3").on('click',function(){
        $(".popup_comment").hide();
    });

    $("#btn1").kendoButton({
        badge: {
            icon: "trash",           
            themeColor: "warning",
        }
    });

    getCircles().then((res)=>CreateCirclesAndCommits(res));
})

async function getCircles(){
    let response = await fetch('https://localhost:7241/circle')
    return response.json();
}

const CreateCirclesAndCommits = (circles: CircleType[]) => {
    var stage = new Konva.Stage({
        container: 'container',
        width: window.innerWidth,
        height: window.innerHeight-100,
    });

    const newArr = circles.map( (item: CircleType) => {
        
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

            let commentsReady: any = []

            if(item.comments && !jQuery.isEmptyObject(item.comments)){
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
            element.commentsReady.forEach((value: any) => {
                element.group.add(value.rect).add(value.text);
            });
        }
        layer.add(element.group);
        stage.add(layer);
    }); 

    layer.on('click', (event) => {
        const circle = event.target; 
        if (circle instanceof Konva.Circle) { 
            let circleId = parseInt(circle.id()); 
            $(".popup_comment").show();
            sendFormComment(circleId)
        }
    });

    layer.on('dblclick', (event) => {
        let isTrye = confirm('remove cercle?')
        
        const circle = event.target; 
        if (circle instanceof Konva.Circle && isTrye) { 
            let circleId: string = circle.id();
            console.log(circleId);
            deleteCercle(circleId);
            location.reload();
        }

    });
}

function sendFormComment(circleId: number){
    $(".comment").on('submit', async function(e){
        let commentForm = $(this);
        e.preventDefault();
        const item: {comment: string; colorBackground: string; circleId: number } = {
            comment : commentForm.find('input[name="text"]').val() as string,
            colorBackground : commentForm.find('input[name="background"]').val()as string,
            circleId: circleId
        };

        const jsonString = JSON.stringify(item);

        await fetch("https://localhost:7241/circle/comment",{
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                "Content-Type": "application/json; charset=utf-8",
            },
            body: jsonString,
        });

        setTimeout(()=>{
            location.reload();   
        },300);
    });
}



    

