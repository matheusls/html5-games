window.onload = () => {
  // selecting the canvas
  var canvas = document.querySelector("#canvas");
  // getting the context
  var context = canvas.getContext("2d");

  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.lineWidth = 5;
  context.strokeStyle = 'blue';
  context.strokeRect(650, 50, 100, 100);

  // star
  // this stars a new path, but does not draws it, it only stores the path in memory
  context.beginPath();

  // code the actual drawing
  context.moveTo(75, 250);
  context.lineTo(150, 50);
  context.lineTo(225, 250);
  context.lineTo(50, 120);
  context.lineTo(250, 120);
  context.lineTo(75, 250);

  // fills the drawn path
  // context.fillStyle = 'white';
  // context.fill();
  // strokes the filled area
  context.lineWidth = 3;
  context.strokeStyle = 'red';
  context.stroke();

  const degreeToRad = (degree) => {
    return degree * Math.PI / 180;
  }

  // circle and arcs
  context.strokeStyle = 'white';
  context.fillStyle = 'blue';
  context.beginPath();

  context.arc(350, 100, 40, degreeToRad(90), degreeToRad(270), false);
  context.fill();
  context.stroke();

  context.arc(450, 100, 40, degreeToRad(90), degreeToRad(270), true);
  context.fill();
  context.stroke();

  context.strokeStyle = 'blue';
  context.fillStyle = 'white';
  context.beginPath();

  context.arc(550, 100, 40, degreeToRad(0), degreeToRad(360));
  context.fill();
  context.stroke();

  // images
  let img = new Image();
  img.src = '../img/ovni.png';
  img.onload = () => {
    let x = 20;

    for (let i = 0; i <= 5; i++) {
      context.drawImage(img, x, 300, 64, 32);
      x += 70;
    }
  }

  let img2 = new Image();
  img2.src = '../img/explosao.png';
  img2.onload = () => {
    context.drawImage(
      img2,
      80, 10, 60, 65,
      20, 360, 60, 65
    );
  }

  // save and restore
  context.fillStyle = 'green';
  context.fillRect(20, 450, 25, 25);
  // saves the last settings
  context.save();

  // change the setting
  context.fillStyle = 'purple';
  context.fillRect(70, 450, 25, 25);

  // goes back to the previous settings
  context.restore();
  context.fillRect(120, 450, 25, 25);
}
