// import $ from 'jquery';
// import Konva from 'konva';
// import '@types/kendo-ui';
import { deleteCercle } from './api.js';
$(function () {
    $(".circle").on('submit', async function (e) {
        let form = $(this);
        e.preventDefault();
        const circle = {
            x: parseInt(form.find('input[name="x"]').val()),
            y: parseInt(form.find('input[name="y"]').val()),
            radius: parseInt(form.find('input[name="radius"]').val()),
            color: form.find('input[name="color"]').val(),
        };
        const jsonString = JSON.stringify(circle);
        await fetch("https://localhost:7241/circle", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json; charset=utf-8",
            },
            body: jsonString,
        });
        setTimeout(() => {
            location.reload();
        }, 300);
    });
    $("#btn1").on('click', function () {
        $(".popup").show();
    });
    $("#btn2").on('click', function () {
        $(".popup").hide();
    });
    $("#btn3").on('click', function () {
        $(".popup_comment").hide();
    });
    $("#btn1").kendoButton({
        badge: {
            icon: "trash",
            themeColor: "warning",
        }
    });
    getCircles().then((res) => CreateCirclesAndCommits(res));
});
async function getCircles() {
    let response = await fetch('https://localhost:7241/circle');
    return response.json();
}
const CreateCirclesAndCommits = (circles) => {
    var stage = new Konva.Stage({
        container: 'container',
        width: window.innerWidth,
        height: window.innerHeight - 100,
    });
    const newArr = circles.map((item) => {
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
        let indent = item.y + item.radius + 5;
        let commentsReady = [];
        if (item.comments && !jQuery.isEmptyObject(item.comments)) {
            commentsReady = item.comments.map(value => {
                const text = new Konva.Text({
                    y: indent,
                    fontFamily: 'Calibri',
                    fontSize: 14,
                    text: value.comment,
                    align: 'center',
                    fill: 'green',
                    padding: 5,
                });
                const textWidth = text.width();
                const centerX = item.x - (textWidth / 2);
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
                indent += rectHeigth + 5;
                return { text, rect };
            });
        }
        return { group, circle, commentsReady };
    });
    let layer = new Konva.Layer();
    newArr.forEach(element => {
        element.group.add(element.circle);
        if (element.commentsReady.length > 0) {
            element.commentsReady.forEach((value) => {
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
            sendFormComment(circleId);
        }
    });
    layer.on('dblclick', (event) => {
        let isTrye = confirm('remove cercle?');
        const circle = event.target;
        if (circle instanceof Konva.Circle && isTrye) {
            let circleId = circle.id();
            console.log(circleId);
            deleteCercle(circleId);
            location.reload();
        }
    });
};
function sendFormComment(circleId) {
    $(".comment").on('submit', async function (e) {
        let commentForm = $(this);
        e.preventDefault();
        const item = {
            comment: commentForm.find('input[name="text"]').val(),
            colorBackground: commentForm.find('input[name="background"]').val(),
            circleId: circleId
        };
        const jsonString = JSON.stringify(item);
        await fetch("https://localhost:7241/circle/comment", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json; charset=utf-8",
            },
            body: jsonString,
        });
        setTimeout(() => {
            location.reload();
        }, 300);
    });
}
