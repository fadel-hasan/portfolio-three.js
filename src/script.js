import './style.css'
import * as T from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as dat from 'dat.gui'

import gsap from 'gsap'

const world = {
    plane: {
        width: 400,
        height: 400,
        widthSegment: 50,
        heightSegment: 50
    },
    color: {
        r: 0, g: 0.15, b: 0.4,
        fun: (r, g, b) => {

            const colors = []
            for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
                colors.push(r, g, b)
            }
            // console.log(planeMesh.geometry)
            planeMesh.geometry.setAttribute('color', new T.BufferAttribute(new Float32Array(colors), 3))
        }
    },
    hover: {
        r: 0.1,
        g: 0.5,
        b: 1
    },
    moving: true
}


const size = {
    width: window.innerWidth,
    height: window.innerHeight
}


const mouse = {
    x: undefined,
    y: undefined
}


//create scene
const scene = new T.Scene()
//create camera
const camera = new T.PerspectiveCamera(75, size.width / size.height, 0.1, 1000)
camera.position.z = 30

//create renderer
const renderer = new T.WebGLRenderer()
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)


const gui = new dat.GUI()
gui.hide()
const raycaster = new T.Raycaster()
// console.log(raycaster)


function generatePlane() {
    planeMesh.geometry.dispose()
    planeMesh.geometry = new T.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegment, world.plane.heightSegment)
    const { array } = planeMesh.geometry.attributes.position
    const randomValue = []
    for (let i = 0; i < array.length; i++) {
        if (i % 3 === 0) {
            const x = array[i]
            const y = array[i + 1]
            const z = array[i + 2]

            array[i] = x + (Math.random() - 0.5) * 3
            array[i + 1] = y + (Math.random() - 0.5) * 3
            array[i + 2] = z + (Math.random() - 0.5) * 3
        }
        randomValue.push(Math.random() * Math.PI * 2)
    }

    console.log(planeMesh.geometry.attributes.position)

    planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array
    planeMesh.geometry.attributes.position.randomValue = randomValue

    // const colors = []

    // for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {

    //     colors.push(0, 0.15, .4)
    // }
    // console.log(planeMesh.geometry)
    // planeMesh.geometry.setAttribute('color', new T.BufferAttribute(new Float32Array(colors), 3))

    world.color.fun(world.color.r, world.color.g, world.color.b)
}

//create plane
const planeGeometry = new T.PlaneGeometry(400, 400, 50, 50)
const planeMaterial = new T.MeshPhongMaterial({
    // color: 0xff0000,
    side: T.DoubleSide,
    flatShading: true,
    vertexColors: true

})
const planeMesh = new T.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)
generatePlane()

//gui
const folder = gui.addFolder('plane')
folder.add(world.plane, 'width', 1, 1000)
    .onChange(generatePlane)


folder.add(world.plane, 'height', 1, 1000)
    .onChange(generatePlane)

folder.add(world.plane, 'widthSegment', 1, 100)
    .onChange(generatePlane)

folder.add(world.plane, 'heightSegment', 1, 100)
    .onChange(generatePlane)

const folder1 = gui.addFolder('color')
folder1.add(world.color, 'r', 0, 1, 0.01).onChange(() => {
    world.color.fun(world.color.r, world.color.g, world.color.b)
});
folder1.add(world.color, 'g', 0, 1, 0.01).onChange(() => {
    world.color.fun(world.color.r, world.color.g, world.color.b)
});
folder1.add(world.color, 'b', 0, 1, 0.01).onChange(() => {
    world.color.fun(world.color.r, world.color.g, world.color.b)
});

const folder2 = gui.addFolder('lighthover')
folder2.add(world.hover, 'r', 0, 1, 0.01)
folder2.add(world.hover, 'g', 0, 1, 0.01)
folder2.add(world.hover, 'b', 0, 1, 0.01)

gui.add(world, 'moving')
gui.add(planeMaterial, 'wireframe')



//create control
const oc = new OrbitControls(camera, renderer.domElement)
oc.rotateSpeed = 0.2
oc.maxZoom = 1000
oc.zoomSpeed = 0.2


// console.log(planeMesh.geometry.attributes.position.array)


// console.log(planeMesh)
// //vertice position randomization
// const { array } = planeMesh.geometry.attributes.position
// const randomValue = []
// for (let i = 0; i < array.length; i++) {
//     if (i % 3 === 0) {
//         const x = array[i]
//         const y = array[i + 1]
//         const z = array[i + 2]

//         array[i] = x + (Math.random() - 0.5) * 3
//         array[i + 1] = y + (Math.random() - 0.5) * 3
//         array[i + 2] = z + (Math.random() - 0.5) * 3
//     }
//     randomValue.push(Math.random() - 0.5)
// }

// console.log(planeMesh.geometry.attributes.position)

// planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array
// planeMesh.geometry.attributes.position.randomValue = randomValue

// // console.log(planeMesh.geometry.attributes.position)
// //color attribute addition
// const colors = []
// for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {

//     colors.push(0, 0.15, 0.4)
// }

// console.log(colors)


// planeMesh.geometry.setAttribute('color', new T.BufferAttribute(new Float32Array(colors), 3))



//create light
const frontLight = new T.DirectionalLight(0xffffff, 1)
frontLight.position.set(0, 2, 1)
scene.add(frontLight)

const backLight = new T.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 2, -1)
scene.add(backLight)
// const helper = new T.DirectionalLightHelper( light, 5 );
// scene.add( helper );



let frame = 0
function animate() {
    //callback for animate
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    frame += 0.01
    if (world.moving) {
        const { array, originalPosition, randomValue } = planeMesh.geometry.attributes.position
        for (let i = 0; i < array.length; i += 3) {

            //x axis
            array[i] = originalPosition[i] + Math.cos(frame + randomValue[i]) * 0.01
            //x axis
            array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValue[i + 1]) * 0.01
        }
        planeMesh.geometry.attributes.position.needsUpdate = true
    }
    //setup raycaster
    raycaster.setFromCamera(mouse, camera)

    //update control
    oc.update()
    const intersects = raycaster.intersectObject(planeMesh)
    if (intersects.length > 0) {
        const { color } = intersects[0].object.geometry.attributes
        color.setX(intersects[0].face.a, world.hover.r)
        color.setX(intersects[0].face.b, world.hover.r)
        color.setX(intersects[0].face.c, world.hover.r)
        color.setY(intersects[0].face.a, world.hover.g)
        color.setY(intersects[0].face.b, world.hover.g)
        color.setY(intersects[0].face.c, world.hover.g)
        color.setZ(intersects[0].face.a, world.hover.b)
        color.setZ(intersects[0].face.b, world.hover.b)
        color.setZ(intersects[0].face.c, world.hover.b)
        color.needsUpdate = true
        let initalColor = {
            r: world.color.r,
            g: world.color.g,
            b: world.color.b
        }
        const hoverColor = {
            r: world.hover.r,
            g: world.hover.g,
            b: world.hover.b
        }
        gsap.to(hoverColor, {
            r: initalColor.r,
            g: initalColor.g,
            b: initalColor.b,
            onUpdate: () => {
                color.setX(intersects[0].face.a, hoverColor.r)
                color.setX(intersects[0].face.b, hoverColor.r)
                color.setX(intersects[0].face.c, hoverColor.r)
                color.setY(intersects[0].face.a, hoverColor.g)
                color.setY(intersects[0].face.b, hoverColor.g)
                color.setY(intersects[0].face.c, hoverColor.g)
                color.setZ(intersects[0].face.a, hoverColor.b)
                color.setZ(intersects[0].face.b, hoverColor.b)
                color.setZ(intersects[0].face.c, hoverColor.b)
                color.needsUpdate = true
            }
        })
    }
    // planeMesh.rotation.x+=0.01

}
animate()





//event in program
addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1,
        mouse.y = -(event.clientY / innerHeight) * 2 + 1

})

addEventListener('resize', () => {

    size.width = window.innerWidth
    size.height = window.innerHeight
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()

    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

let num = 0;
addEventListener('keydown', (event) => {
    if (event.key === 'h') {
        gui.hide()
        if (num === 0) {
            window.alert('enter o to open control panel')
            num++;
        }
    }
    else if (event.key === 'o') {
        gui.show()
    }
})

const bt = document.querySelector('#bt')
const div = document.querySelector('.main')

bt.addEventListener('click', () => {
    div.classList.add('animate')
    setTimeout(() => {
        bt.classList.add('hidden');
        div.classList.add('hidden')
    }, 1000)
    gui.show()

})
